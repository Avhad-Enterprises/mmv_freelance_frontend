"use client";
import React, { useState, useMemo } from "react";
import { formatBudget } from "@/utils/currencyUtils";
import DashboardSearchBar from "../common/DashboardSearchBar";

export interface ProjectSummary {
  project_id: string;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  currency?: string;
  status: number; // Project Task Status: 0=Pending, 1=In Progress, 2=Completed
  bidding_enabled?: boolean;
  application_count: number;
}

interface JobsListProps {
  projects: ProjectSummary[];
  loading: boolean;
  error: string | null;
  onViewApplicants: (project: ProjectSummary) => void;
  onCloseJob: (project: ProjectSummary) => void;
  onEditJob: (project: ProjectSummary) => void;
  getStatusInfo: (status: number) => { text: string; className: string };
}

const JobsList: React.FC<JobsListProps> = ({
  projects,
  loading,
  error,
  onViewApplicants,
  onCloseJob,
  onEditJob,
  getStatusInfo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  // Filter projects based on search query and status
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply status filter
    if (statusFilter !== null) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.budget.toString().includes(query)
      );
    }

    return filtered;
  }, [projects, searchQuery, statusFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const statusOptions = [
    { value: null, label: 'All', count: projects.length },
    { value: 0, label: 'Awaiting Assignment', count: projects.filter(p => p.status === 0).length },
    { value: 1, label: 'In Progress', count: projects.filter(p => p.status === 1).length },
    { value: 2, label: 'Completed', count: projects.filter(p => p.status === 2).length },
    { value: 3, label: 'Closed', count: projects.filter(p => p.status === 3).length },
  ];

  return (
    <>
      <DashboardSearchBar
        placeholder="Search projects by title, category, or budget..."
        onSearch={handleSearch}
      />

      {/* Status Filter Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {statusOptions.map((option) => (
          <button
            key={option.value ?? 'all'}
            onClick={() => setStatusFilter(option.value)}
            style={{
              padding: '8px 16px',
              border: `2px solid ${statusFilter === option.value ? '#31795A' : '#E8ECF2'}`,
              borderRadius: '8px',
              backgroundColor: statusFilter === option.value ? '#31795A' : '#fff',
              color: statusFilter === option.value ? '#fff' : '#244034',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: statusFilter === option.value ? '0 2px 4px rgba(49, 121, 90, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== option.value) {
                e.currentTarget.style.borderColor = '#31795A';
                e.currentTarget.style.color = '#31795A';
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== option.value) {
                e.currentTarget.style.borderColor = '#E8ECF2';
                e.currentTarget.style.color = '#244034';
              }
            }}
          >
            {option.label}
            <span style={{
              backgroundColor: statusFilter === option.value ? 'rgba(255, 255, 255, 0.2)' : '#f8f9fa',
              color: statusFilter === option.value ? '#fff' : '#6c757d',
              padding: '2px 6px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {option.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white card-box border-20">
        <div className="table-responsive">
          <table className="table job-alert-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Date Created</th>
                <th>Project Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="text-center">Loading...</td></tr>}
              {error && <tr><td colSpan={6} className="text-center text-danger">{error}</td></tr>}
              {!loading && projects.length === 0 && <tr><td colSpan={6} className="text-center">No projects found. Post one to get started!</td></tr>}
              {!loading && projects.length > 0 && filteredProjects.length === 0 && <tr><td colSpan={6} className="text-center">No projects match your search and filter criteria.</td></tr>}

              {filteredProjects.map((project) => (
                <tr key={project.project_id} className="align-middle">
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>{formatBudget(project.budget, project.currency)}</td>
                  <td>{new Date(project.date_created).toLocaleDateString()}</td>
                  <td>
                    <span className={`fw-bold ${getStatusInfo(project.status).className}`}>
                      {getStatusInfo(project.status).text}
                    </span>
                  </td>
                  <td className="text-end">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        className="btn"
                        onClick={() => onViewApplicants(project)}
                        style={{
                          backgroundColor: '#31795A',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          minWidth: '130px',
                          textAlign: 'center'
                        }}
                      >
                        View Applications
                      </button>

                      {/* Allow editing for pending projects (status 0) */}
                      {project.status === 0 && (
                        <>
                          <button
                            className="btn"
                            onClick={() => onEditJob(project)}
                            title="Edit Project"
                            style={{
                              backgroundColor: '#31795A',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              minWidth: '130px',
                              textAlign: 'center'
                            }}
                          >
                            Edit Project
                          </button>

                          <button
                            className="btn"
                            onClick={() => onCloseJob(project)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              minWidth: '130px',
                              textAlign: 'center'
                            }}
                          >
                            Close Project
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default JobsList;