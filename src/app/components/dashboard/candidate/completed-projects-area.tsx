'use client';

import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header";
import DashboardSearchBar from "../common/DashboardSearchBar";
import { formatBudget } from "@/utils/currencyUtils";
import { authCookies } from "@/utils/cookies";
import toast from 'react-hot-toast';

interface CompletedProject {
  project_id: number;
  project_title: string;
  project_category: string;
  budget: number;
  currency: string;
  client_name: string;
  client_company: string;
  submission_id: number;
  submitted_files: string;
  additional_notes?: string;
  submitted_at: string;
  approved_at: string;
}

const CompletedProjectsArea = () => {
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    setLoading(true);
    try {
      const token = authCookies.getToken();
      if (!token) return;

      // Fetch all applications for the freelancer
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Freelancer applications:', data);

      if (data.success && data.data) {
        // Filter for completed projects (application status = 2 AND submission status = 1)
        const completed = data.data
          .filter((app: any) => app.status === 2 && app.submission_status === 1)
          .map((app: any) => ({
            project_id: app.projects_task_id,
            project_title: app.project_title,
            project_category: app.project_category,
            budget: app.budget,
            currency: app.currency || 'INR',
            client_name: `${app.client_first_name || ''} ${app.client_last_name || ''}`.trim(),
            client_company: app.client_company_name || 'N/A',
            submission_id: app.submission_id,
            submitted_files: app.submitted_files,
            additional_notes: app.submission_notes,
            submitted_at: app.submitted_at,
            approved_at: app.submitted_at, // Using submitted_at as proxy for approved_at
          }));

        console.log('Completed projects:', completed);
        setProjects(completed);
      }
    } catch (error) {
      console.error('Error fetching completed projects:', error);
      toast.error('Failed to load completed projects');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (project: CompletedProject) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const filteredProjects = projects.filter(p =>
    p.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.project_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <table className="table job-alert-table" style={{ minWidth: '900px' }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '25%' }}>Project Title</th>
                <th scope="col" style={{ width: '15%' }}>Category</th>
                <th scope="col" style={{ width: '20%' }}>Client</th>
                <th scope="col" style={{ width: '12%' }}>Budget</th>
                <th scope="col" style={{ width: '15%' }}>Completed Date</th>
                <th scope="col" style={{ width: '13%', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="text-muted">
                      <i className="bi bi-check-circle fs-1 d-block mb-3"></i>
                      <h5>No Completed Projects Yet</h5>
                      <p className="mb-0">
                        Projects will appear here after clients approve your submissions.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr key={project.submission_id} className="align-middle">
                    <td>
                      <div className="job-name fw-500" style={{ 
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        {project.project_title}
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'normal' }}>{project.project_category}</td>
                    <td>
                      <div style={{ whiteSpace: 'normal' }}>
                        <div className="fw-500">{project.client_name}</div>
                        <small className="text-muted">{project.client_company}</small>
                      </div>
                    </td>
                    <td><strong>{formatBudget(project.budget ?? 0, project.currency)}</strong></td>
                    <td>
                      <span className="text-muted">
                        {new Date(project.approved_at).toLocaleDateString('en-IN', {
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
                <h5 className="modal-title">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Completed Project Details
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">{selectedProject.project_title}</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Category</small>
                      <span>{selectedProject.project_category}</span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Budget</small>
                      <strong className="text-success">{formatBudget(selectedProject.budget ?? 0, selectedProject.currency)}</strong>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-person-circle me-2"></i>
                    Client Information
                  </h6>
                  <div className="p-3 border rounded">
                    <div className="mb-2">
                      <small className="text-muted">Name:</small>
                      <div className="fw-500">{selectedProject.client_name}</div>
                    </div>
                    <div>
                      <small className="text-muted">Company:</small>
                      <div>{selectedProject.client_company}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-file-earmark-check me-2"></i>
                    Your Submission
                  </h6>
                  {selectedProject.submitted_files.split(',').map((link, idx) => (
                    <div key={idx} className="mb-2 p-2 border rounded d-flex align-items-center">
                      <i className="bi bi-link-45deg fs-5 me-2 text-primary"></i>
                      <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="text-break text-decoration-none">
                        {link.trim()}
                      </a>
                    </div>
                  ))}
                </div>

                {selectedProject.additional_notes && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">Additional Notes</h6>
                    <div className="p-3 bg-light rounded">
                      {selectedProject.additional_notes}
                    </div>
                  </div>
                )}

                <div className="alert alert-success mb-0">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>Project Approved!</strong>
                  <div className="mt-1">
                    <small>Completed on {new Date(selectedProject.approved_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</small>
                  </div>
                </div>
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
