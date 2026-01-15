"use client";

import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header";
import DashboardSearchBar from "../common/DashboardSearchBar";
import { formatBudget } from "@/utils/currencyUtils";
import { authCookies } from "@/utils/cookies";
import toast from "react-hot-toast";
import {
  getCategoryIcon,
  getCategoryColor,
  getCategoryTextColor,
} from "@/utils/categoryIcons";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<CompletedProject | null>(null);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    setLoading(true);
    try {
      const token = authCookies.getToken();
      if (!token) return;

      // Fetch all applications for the freelancer
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Freelancer applications:", data);

      if (data.success && data.data) {
        // Filter for completed projects (application status = 2 AND submission status = 1)
        const completed = data.data
          .filter((app: any) => app.status === 2 && app.submission_status === 1)
          .map((app: any) => ({
            project_id: app.projects_task_id,
            project_title: app.project_title,
            project_category: app.project_category,
            budget: app.budget,
            currency: app.currency || "INR",
            client_name: `${app.client_first_name || ""} ${
              app.client_last_name || ""
            }`.trim(),
            client_company: app.client_company_name || "N/A",
            submission_id: app.submission_id,
            submitted_files: app.submitted_files,
            additional_notes: app.submission_notes,
            submitted_at: app.submitted_at,
            approved_at: app.submitted_at, // Using submitted_at as proxy for approved_at
          }));

        console.log("Completed projects:", completed);
        setProjects(completed);
      }
    } catch (error) {
      console.error("Error fetching completed projects:", error);
      toast.error("Failed to load completed projects");
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

  const filteredProjects = projects.filter(
    (p) =>
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

      <div className="mt-4">
        <p className="mb-3 text-muted">
          <strong>{filteredProjects.length}</strong> completed projects found
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading completed projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white card-box border-20 text-center py-5">
            <div className="text-muted">
              <i className="bi bi-check-circle fs-1 d-block mb-3"></i>
              <h5>No Completed Projects Yet</h5>
              <p className="mb-0">
                Projects will appear here after clients approve your
                submissions.
              </p>
            </div>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.submission_id}
              className="candidate-profile-card list-layout mb-25 border-0"
            >
              <div className="d-flex flex-column flex-lg-row">
                {/* Mobile/Tablet Header: Icon + Title (Visible < lg) */}
                <div className="d-flex d-lg-none align-items-center mb-3">
                  <div className="cadidate-avatar online position-relative d-block me-3">
                    <div
                      className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 60,
                        height: 60,
                        fontSize: "24px",
                        fontWeight: "bold",
                        backgroundColor: getCategoryColor(
                          project.project_category
                        ),
                        color: getCategoryTextColor(project.project_category),
                      }}
                    >
                      {getCategoryIcon(project.project_category)}
                    </div>
                  </div>
                  <div>
                    <h4 className="candidate-name mb-1">
                      <a
                        onClick={() => handleViewDetails(project)}
                        className="tran3s cursor-pointer"
                      >
                        {project.project_title.length > 30
                          ? `${project.project_title.slice(0, 30)}..`
                          : project.project_title}
                      </a>
                    </h4>
                    <span className="badge bg-success">
                      <i className="bi bi-check-circle me-1"></i>Completed
                    </span>
                  </div>
                </div>

                {/* Desktop Icon (Visible >= lg) */}
                <div className="cadidate-avatar online position-relative d-none d-lg-block me-4">
                  <div
                    className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 80,
                      height: 80,
                      fontSize: "28px",
                      fontWeight: "bold",
                      backgroundColor: getCategoryColor(
                        project.project_category
                      ),
                      color: getCategoryTextColor(project.project_category),
                    }}
                  >
                    {getCategoryIcon(project.project_category)}
                  </div>
                </div>

                <div className="right-side flex-grow-1">
                  <div className="row gx-2 align-items-center mb-2">
                    {/* Desktop Title (Visible >= lg) */}
                    <div className="col-lg-3 d-none d-lg-block">
                      <div className="position-relative">
                        <h4 className="candidate-name mb-1">
                          <a
                            onClick={() => handleViewDetails(project)}
                            className="tran3s cursor-pointer"
                          >
                            {project.project_title.length > 22
                              ? `${project.project_title.slice(0, 22)}..`
                              : project.project_title}
                          </a>
                        </h4>
                        <span
                          className="badge bg-success"
                          style={{ fontSize: "10px" }}
                        >
                          <i className="bi bi-check-circle me-1"></i>Completed
                        </span>
                      </div>
                    </div>

                    {/* Info Columns */}
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="candidate-info">
                        <span>Category</span>
                        <div>{project.project_category}</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="candidate-info">
                        <span>Client</span>
                        <div className="fw-500">{project.client_name}</div>
                        <small className="text-muted">
                          {project.client_company}
                        </small>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-2 mt-md-0">
                      <div className="candidate-info">
                        <span>Budget</span>
                        <div className="fw-bold text-success">
                          {formatBudget(project.budget ?? 0, project.currency)}
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-2 mt-lg-0">
                      <div className="candidate-info">
                        <span>Completed Date</span>
                        <div>
                          <i className="bi bi-calendar-check me-1 text-success"></i>
                          {new Date(project.approved_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="col-12 col-md-8 col-lg-1 mt-3 mt-lg-0">
                      <div className="d-flex justify-content-lg-end align-items-center">
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="profile-btn tran3s cursor-pointer flex-grow-1 flex-lg-grow-0 text-center"
                          style={{
                            whiteSpace: "nowrap",
                            minWidth: "fit-content",
                            backgroundColor: "#31795A",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            fontWeight: "500",
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedProject && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99999 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Completed Project Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">
                    {selectedProject.project_title}
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Category</small>
                      <span>{selectedProject.project_category}</span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block">Budget</small>
                      <strong className="text-success">
                        {formatBudget(
                          selectedProject.budget ?? 0,
                          selectedProject.currency
                        )}
                      </strong>
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
                      <div className="fw-500">
                        {selectedProject.client_name}
                      </div>
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
                  {selectedProject.submitted_files
                    .split(",")
                    .map((link, idx) => (
                      <div
                        key={idx}
                        className="mb-2 p-2 border rounded d-flex align-items-center"
                      >
                        <i className="bi bi-link-45deg fs-5 me-2 text-primary"></i>
                        <a
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-break text-decoration-none"
                        >
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
                    <small>
                      Completed on{" "}
                      {new Date(selectedProject.approved_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjectsArea;
