'use client'; // This component uses state and effects, so it's a client component

import React, { useState, useEffect, useCallback, type FC } from "react";
import EmployJobItem from "./job-item"; 
import PostJobForm from "./PostJobForm";
import { makeGetRequest, makePostRequest } from "@/utils/api";
import type { ProjectSummary } from "@/types/project"; // Import shared type

interface IProps {
  setIsOpenSidebar: (isOpen: boolean) => void;
}

const EmployJobArea: FC<IProps> = ({ setIsOpenSidebar }) => {
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientData = useCallback(async () => {
    if (isPostingJob) return;

    setLoading(true);
    setError(null);
    try {
      const meResponse = await makeGetRequest("/users/me");
      const userId = meResponse.data?.data?.user?.user_id;

      if (!userId) throw new Error("Could not find User ID. Please log in.");
      
      const userProfileResponse = await makePostRequest("/users/get_user_by_id", { user_id: userId });
      const createdProjects = userProfileResponse.data?.projects_created;

      if (createdProjects && createdProjects.length > 0) {
        // Map the raw data to our ProjectSummary type
        const processedData: ProjectSummary[] = createdProjects.map((p: any) => ({
          project_id: p.project_id,
          title: p.title,
          date_created: p.date_created,
          count: 0,
        }));
        setProjects(processedData);
      } else {
        setProjects([]);
      }
    } catch (err: unknown) {
      let message = "Failed to load your jobs.";
      if (err instanceof Error) message = err.message;
      setError(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [isPostingJob]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  // When form submission is successful or canceled, switch view
  const handleReturnToList = () => {
    setIsPostingJob(false);
    // The useEffect dependency on `isPostingJob` will trigger a re-fetch automatically.
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
                    <th scope="col">Title</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Applicants</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={4} className="text-center">Loading...</td></tr>}
                  {error && <tr><td colSpan={4} className="text-center text-danger">{error}</td></tr>}
                  {!loading && !error && projects.length === 0 && (
                    <tr><td colSpan={4} className="text-center">No jobs found. Post one to get started!</td></tr>
                  )}
                  {!loading && !error && projects.map((project) => (
                    // You'll need a simplified EmployJobItem that accepts a ProjectSummary
                    // <EmployJobItem key={project.project_id} project={project} />
                    <tr key={project.project_id}>
                        <td>{project.title}</td>
                        <td>{new Date(project.date_created).toLocaleDateString()}</td>
                        <td>{project.count}</td>
                        <td>...</td>
                    </tr>
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