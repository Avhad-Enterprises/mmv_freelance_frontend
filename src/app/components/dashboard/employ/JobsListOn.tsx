import React from 'react';

interface ProjectSummary {
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
  onViewSubmissions: (project: ProjectSummary) => void;
  getStatusInfo: (status: number) => { text: string; className: string };
}

const JobsList: React.FC<JobsListProps> = ({
  projects,
  loading,
  error,
  onViewSubmissions,
  getStatusInfo,
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-5 bg-light rounded">
        <h4>No Jobs Found</h4>
        <p className="text-muted">You haven't posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white card-box border-20">
      <div className="table-responsive">
        <table className="table job-alert-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="border-0">
            {projects.map((project) => {
              const statusInfo = getStatusInfo(project.status);
              return (
                <tr key={project.project_id}>
                  <td>
                    <div className="job-name fw-500">{project.title}</div>
                  </td>
                  <td>
                    {new Date(project.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>{project.category}</td>
                  <td>₹{project.budget.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onViewSubmissions(project)}
                        title="View submissions for this job"
                      >
                        <i className="bi bi-file-earmark-check me-1"></i>
                        Submissions
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobsList;