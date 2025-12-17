"use client";
import React from "react";

export interface ProjectSummary {
  project_id: string;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  status: number;
}

interface JobsListProps {
  projects: ProjectSummary[];
  loading: boolean;
  error: string | null;
  onViewApplicants: (project: ProjectSummary) => void;
  getStatusInfo: (status: number) => { text: string; className: string };
}

const JobsList: React.FC<JobsListProps> = ({
  projects,
  loading,
  error,
  onViewApplicants,
  getStatusInfo
}) => {
  return (
    <div className="bg-white card-box border-20">
      <div className="table-responsive">
        <table className="table job-alert-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Date Created</th>
              <th>Status</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center">Loading...</td></tr>}
            {error && <tr><td colSpan={6} className="text-center text-danger">{error}</td></tr>}
            {!loading && projects.length === 0 && <tr><td colSpan={6} className="text-center">No jobs found. Post one to get started!</td></tr>}

            {projects.map((project) => (
              <tr key={project.project_id} className="align-middle">
                <td>{project.title}</td>
                <td>{project.category}</td>
                <td>${project.budget}</td>
                <td>{new Date(project.date_created).toLocaleDateString()}</td>
                <td>
                  <span className={`fw-bold ${getStatusInfo(project.status).className}`}>
                    {getStatusInfo(project.status).text}
                  </span>
                </td>
                <td className="text-end">
                  <button
                    className="btn"
                    onClick={() => onViewApplicants(project)}
                    style={{
                      backgroundColor: '#31795A',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    View Applications
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsList;