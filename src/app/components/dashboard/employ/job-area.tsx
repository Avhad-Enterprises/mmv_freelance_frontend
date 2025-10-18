'use client';

import React, { useState, useEffect, useCallback, Fragment, type FC } from "react";
import PostJobForm from "./PostJobForm";
import { makeGetRequest, makePutRequest, makePatchRequest } from "@/utils/api";
import toast from "react-hot-toast";

export interface ProjectSummary {
  project_id: string;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  status: number; // 0: Pending, 1: Approved, 2: Completed
}

export interface Applicant {
  applied_projects_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  status: 0 | 1 | 2 | 3; // 0: Pending, 1: Approved, 2: Completed, 3: Rejected
  bio: string | null;
}

interface ApplicantsState {
  [projectId: string]: {
    loading: boolean;
    error: string | null;
    data: Applicant[];
  };
}

interface IProps {
  setIsOpenSidebar: (isOpen: boolean) => void;
}

const EmployJobArea: FC<IProps> = ({ setIsOpenSidebar }) => {
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [applicantsByProject, setApplicantsByProject] = useState<ApplicantsState>({});

  // Fetch projects
  const fetchClientData = useCallback(async () => {
    if (isPostingJob) return;

    setLoading(true);
    setError(null);
    try {
      const meResponse = await makeGetRequest("users/me");
      const clientId = meResponse.data?.data?.profile?.client_id;
      if (!clientId) throw new Error("Could not find Client ID. Please log in.");

      const projectsResponse = await makeGetRequest(`projects-tasks/client/${clientId}`);
      const createdProjects = projectsResponse.data?.data || [];

      const processedData: ProjectSummary[] = createdProjects.map((p: any) => ({
        project_id: p.projects_task_id,
        title: p.project_title,
        date_created: p.created_at,
        category: p.project_category,
        budget: p.budget,
        status: p.status,
      }));

      setProjects(processedData);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to load your jobs.";
      setError(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [isPostingJob]);

  useEffect(() => { fetchClientData(); }, [fetchClientData]);

  const handleReturnToList = () => {
    setIsPostingJob(false);
    fetchClientData();
  };

  // Fetch applicants for a project
  const handleViewApplicantsClick = async (projectId: string) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
      return;
    }
    setExpandedProjectId(projectId);

    if (applicantsByProject[projectId]?.data?.length > 0) return;

    setApplicantsByProject(prev => ({
      ...prev,
      [projectId]: { loading: true, error: null, data: [] },
    }));

    try {
      const response = await makeGetRequest(`applications/projects/${projectId}/applications`);
      const applicantsData: Applicant[] = response.data?.data || [];
      setApplicantsByProject(prev => ({
        ...prev,
        [projectId]: { loading: false, error: null, data: applicantsData },
      }));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to load applicants.";
      setApplicantsByProject(prev => ({
        ...prev,
        [projectId]: { loading: false, error: message, data: [] },
      }));
    }
  };

  // Update a specific applicant AND project status
  const handleUpdateApplicantStatus = async (
  projectId: string,
  applicationId: number,
  newStatus: Applicant['status']
) => {
  const currentApplicants = applicantsByProject[projectId]?.data || [];
  const applicantIndex = currentApplicants.findIndex(a => a.applied_projects_id === applicationId);
  if (applicantIndex === -1) return;

  const originalApplicants = JSON.parse(JSON.stringify(currentApplicants));
  const updatedApplicants = [...originalApplicants];
  updatedApplicants[applicantIndex].status = newStatus;

  setApplicantsByProject(prev => ({
    ...prev,
    [projectId]: { ...prev[projectId], data: updatedApplicants },
  }));

  // Determine new project status based on applicant
  let newProjectStatus = 0;
  if (newStatus === 2) newProjectStatus = 2; // Completed
  else if (newStatus === 1) newProjectStatus = 1; // Approved / Assigned
  else if (newStatus === 3) newProjectStatus = 0; // Rejected doesn't affect project directly

  const originalProjects = JSON.parse(JSON.stringify(projects));
  const updatedProjects = projects.map(p =>
    p.project_id === projectId ? { ...p, status: newProjectStatus } : p
  );
  setProjects(updatedProjects);

  try {
    // 1️⃣ Update applicant status using PATCH /projects-tasks/:id/status
    await makePatchRequest(`projects-tasks/${applicationId}/status`, {
      status: newStatus,
      user_id: Number(applicationId)
    });

    // 2️⃣ Update project status using PUT /projects-tasks/:id
    await makePutRequest(`projects-tasks/${projectId}`, {
      status: newProjectStatus
    });

    toast.success("✅ Applicant and project updated successfully!");
  } catch (err) {
    console.error("Failed to update applicant/project:", err);
    setApplicantsByProject(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], data: originalApplicants },
    }));
    setProjects(originalProjects);
    toast.error("❌ Failed to update applicant/project. Please try again.");
  }
};


  const getStatusInfo = (status: Applicant['status'] | number) => {
    switch (status) {
      case 0: return { text: "Pending", className: "text-warning" };
      case 1: return { text: "Approved", className: "text-success" };
      case 2: return { text: "Completed", className: "text-info" };
      case 3: return { text: "Rejected", className: "text-danger" };
      default: return { text: "Unknown", className: "text-secondary" };
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">{isPostingJob ? "Post a New Job" : "My Jobs"}</h2>
          {!isPostingJob && (
            <button className="dash-btn-two tran3s" onClick={() => setIsPostingJob(true)}>
              Post a Job
            </button>
          )}
        </div>

        {isPostingJob ? (
          <PostJobForm onBackToList={handleReturnToList} />
        ) : (
          <div className="bg-white card-box border-20">
            <div className="table-responsive">
              <table className="table job-alert-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Date Created</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={5} className="text-center">Loading...</td></tr>}
                  {error && <tr><td colSpan={5} className="text-center text-danger">{error}</td></tr>}
                  {!loading && projects.length === 0 && <tr><td colSpan={5} className="text-center">No jobs found. Post one to get started!</td></tr>}

                  {projects.map((project) => (
                    <Fragment key={project.project_id}>
                      <tr className="align-middle">
                        <td>{project.title}</td>
                        <td>{project.category}</td>
                        <td>${project.budget}</td>
                        <td>{new Date(project.date_created).toLocaleDateString()}</td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2 align-items-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewApplicantsClick(project.project_id)}
                            >
                              {expandedProjectId === project.project_id ? "Hide Applicants" : "View Applicants"}
                            </button>
                          </div>
                          <span className={`fw-bold ms-3 ${getStatusInfo(project.status).className}`}>
                            {getStatusInfo(project.status).text}
                          </span>
                        </td>
                      </tr>

                      {expandedProjectId === project.project_id && (
                        <tr>
                          <td colSpan={5} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f8f9fa' }}>
                            <div className="applicants-container py-3">
                              <h5>Applicants for: {project.title}</h5>
                              {applicantsByProject[project.project_id]?.loading && <p>Loading applicants...</p>}
                              {applicantsByProject[project.project_id]?.error && <p className="text-danger">{applicantsByProject[project.project_id].error}</p>}

                              {!applicantsByProject[project.project_id]?.loading &&
                              !applicantsByProject[project.project_id]?.error && (
                                applicantsByProject[project.project_id]?.data.length > 0 ? (
                                  <ul className="list-group list-group-flush">
                                    {applicantsByProject[project.project_id].data.map(applicant => {
                                      const status = getStatusInfo(applicant.status);
                                      return (
                                        <li key={applicant.applied_projects_id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                          <div className="d-flex align-items-center gap-3">
                                            <img
                                              src={applicant.profile_picture || 'https://via.placeholder.com/50'}
                                              alt={`${applicant.first_name} profile`}
                                              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                            <div>
                                              <strong>{applicant.first_name} {applicant.last_name}</strong>
                                              <div className="text-muted small">{applicant.email}</div>
                                            </div>
                                          </div>
                                          <div className="d-flex align-items-center gap-3">
                                            <span className={`fw-bold ${status.className}`}>{status.text}</span>
                                            <div className="dropdown">
                                              <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                Actions
                                              </button>
                                              <ul className="dropdown-menu">
                                                {applicant.status !== 1 && <li><button className="dropdown-item" onClick={() => handleUpdateApplicantStatus(project.project_id, applicant.applied_projects_id, 1)}>Approve</button></li>}
                                                {applicant.status !== 3 && applicant.status !== 2 && <li><button className="dropdown-item" onClick={() => handleUpdateApplicantStatus(project.project_id, applicant.applied_projects_id, 3)}>Reject</button></li>}
                                                {applicant.status === 1 && <li><button className="dropdown-item" onClick={() => handleUpdateApplicantStatus(project.project_id, applicant.applied_projects_id, 2)}>Mark as Completed</button></li>}
                                              </ul>
                                            </div>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <p>No applicants for this job yet.</p>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployJobArea;
