'use client';

import React, { useState, useEffect } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import DashboardSearchBar from "../common/DashboardSearchBar";
import { authCookies } from "@/utils/cookies";
import toast from 'react-hot-toast';

interface ProjectSummary {
  project_id: number;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  status: number;
}

interface Submission {
  submission_id: number;
  projects_task_id: number;
  user_id: number;
  submitted_files: string;
  additional_notes?: string;
  status: 0 | 1 | 2;
  created_at: string;
  freelancer_name?: string;
  freelancer_email?: string;
  freelancer_profile_picture?: string;
  updated_at?: string;
}

const CompletedProjectsArea = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectSummary | null>(null);
  const [approvedSubmission, setApprovedSubmission] = useState<Submission | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Fetch Completed Projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = authCookies.getToken();
        if (!token) return;

        // Use the base projects-tasks endpoint which returns all projects for the authenticated user
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
            console.log('All client projects:', data.data);

            // Filter for Completed projects (status === 2)
            const completedProjects = (data.data || [])
                .filter((task: any) => {
                    console.log(`Project "${task.project_title}" has status: ${task.status}`);
                    return task.status === 2;
                })
                .map((task: any) => ({
                    project_id: task.projects_task_id,
                    title: task.project_title,
                    date_created: task.created_at,
                    category: task.project_category,
                    budget: task.budget,
                    status: task.status
                }));

            console.log('Filtered completed projects:', completedProjects);
            setProjects(completedProjects);
        } else {
            throw new Error(data.message || 'Failed to fetch projects');
        }
      } catch (err: any) {
        console.error('Error fetching completed projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch Approved Submission for a Project
  const handleViewDetails = async (project: ProjectSummary) => {
    setSelectedProject(project);
    setShowModal(true);
    setLoadingSubmission(true);
    setApprovedSubmission(null);

    try {
        const token = authCookies.getToken();
        if (!token) throw new Error("Authentication required");

        console.log('Fetching submissions for project:', project.project_id);

        // Correct endpoint: /:projectId/submissions
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${project.project_id}/submissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();
        console.log('Submissions API response:', result);

        if (result.success && result.data) {
            // Find the approved submission (status === 1)
            const approved = result.data.find((sub: Submission) => sub.status === 1);
            console.log('Found approved submission:', approved);

            if (approved) {
                setApprovedSubmission(approved);
            } else {
                console.warn('No completed submission found in data:', result.data);
                toast.error("No completed submission found for this project.");
            }
        } else {
            console.error('API returned unsuccessful response:', result);
        }
    } catch (error) {
        console.error("Error fetching submission details:", error);
        toast.error("Failed to load submission details.");
    } finally {
        setLoadingSubmission(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setApprovedSubmission(null);
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="main-title mb-0">Completed Projects</h2>
        </div>

        <DashboardSearchBar 
            placeholder="Search completed projects..." 
            onSearch={setSearchQuery}
        />
      </div>

      <div className="bg-white card-box border-20 mt-4">
        <div className="table-responsive">
            <table className="table job-alert-table" style={{ minWidth: '800px' }}>
                <thead>
                    <tr>
                        <th scope="col" style={{ width: '25%' }}>Project Title</th>
                        <th scope="col" style={{ width: '20%' }}>Category</th>
                        <th scope="col" style={{ width: '15%' }}>Budget</th>
                        <th scope="col" style={{ width: '20%' }}>Completion Date</th>
                        <th scope="col" style={{ width: '20%', textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>
                <tbody className="border-0">
                    {loading ? (
                        <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
                    ) : projects.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-5">
                                <div className="text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                    <h5>No Completed Projects Yet</h5>
                                    <p className="mb-0">
                                        Projects will appear here after you approve freelancer submissions.<br/>
                                        Go to <strong>Ongoing Projects</strong> → <strong>View Submissions</strong> → <strong>Approve</strong>
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        projects
                            .filter(p => 
                                p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.category.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(project => (
                                <tr key={project.project_id} className="align-middle">
                                    <td>
                                        <div className="job-name fw-500" style={{ 
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word'
                                        }}>
                                            {project.title}
                                        </div>
                                    </td>
                                    <td style={{ whiteSpace: 'normal' }}>{project.category}</td>
                                    <td><strong>₹{project.budget?.toLocaleString() ?? 0}</strong></td>
                                    <td>
                                        <span className="text-muted">
                                            {new Date(project.date_created).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button 
                                            className="btn btn-sm btn-success text-white"
                                            onClick={() => handleViewDetails(project)}
                                            style={{ minWidth: '110px' }}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedProject && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Completed Project Details</h5>
                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-4">
                            <h6><strong>Project:</strong> {selectedProject.title}</h6>
                            <p className="text-muted mb-0">{selectedProject.category} | Budget: ₹{selectedProject.budget}</p>
                        </div>

                        {loadingSubmission ? (
                            <div className="text-center py-4"><div className="spinner-border text-primary" role="status"></div></div>
                        ) : approvedSubmission ? (
                            <>
                                <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
                                    <img 
                                        src={approvedSubmission.freelancer_profile_picture || '/assets/images/avatar_01.jpg'} 
                                        alt="Freelancer" 
                                        className="rounded-circle me-3"
                                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h6 className="mb-0">Completed by: {approvedSubmission.freelancer_name}</h6>
                                        <small className="text-muted">{approvedSubmission.freelancer_email}</small>
                                    </div>
                                    <div className="ms-auto">
                                        <span className="badge bg-success">Completed on {new Date(approvedSubmission.updated_at || approvedSubmission.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Submission Files/Links</h6>
                                    {approvedSubmission.submitted_files.split(',').map((link, idx) => (
                                        <div key={idx} className="mb-2 p-2 border rounded d-flex align-items-center">
                                            <i className="bi bi-link-45deg fs-5 me-2 text-primary"></i>
                                            <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-break text-decoration-none">
                                                {link.trim()}
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                {approvedSubmission.additional_notes && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-2">Additional Notes</h6>
                                        <div className="p-3 bg-light rounded">
                                            {approvedSubmission.additional_notes}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-warning">No completed submission details found.</div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjectsArea;
