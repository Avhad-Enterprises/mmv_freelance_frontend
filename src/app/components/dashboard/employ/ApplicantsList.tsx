"use client";
import React from "react";
import Image from "next/image";

// Interface defining the props for this component
interface Applicant {
  applied_projects_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  status: 0 | 1 | 2 | 3;
  bio: string | null;
  skills?: string[];
  applied_date?: string;
}

interface ApplicantsListProps {
  applicants: Applicant[];
  applicantsLoading: boolean;
  applicantsError: string | null;
  savedApplicants: number[];
  selectedProjectForApplicants: { project_id: string; title: string } | null;
  onViewProfile: (applicantId: number) => void;
  onToggleSave: (applicantId: number) => void;
  onUpdateApplicantStatus: (projectId: string, applicationId: number, newStatus: Applicant['status']) => void;
  getStatusInfo: (status: Applicant['status'] | number) => { text: string; className: string };
}

const ApplicantsList: React.FC<ApplicantsListProps> = ({
  applicants,
  applicantsLoading,
  applicantsError,
  savedApplicants,
  selectedProjectForApplicants,
  onViewProfile,
  onToggleSave,
  onUpdateApplicantStatus,
  getStatusInfo
}) => {
  return (
    <div className="candidate-profile-area">
      <div className="accordion-box list-style show">
        {applicantsLoading && (
          <div className="text-center p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading applicants...</p>
          </div>
        )}
        {applicantsError && (
          <div className="alert alert-danger text-center p-5" role="alert">
            {applicantsError}
          </div>
        )}

        {!applicantsLoading && !applicantsError && applicants.length === 0 && (
          <div className="text-center p-5">
            <h4>No applicants found</h4>
            <p>This job hasn't received any applications yet.</p>
          </div>
        )}

        {!applicantsLoading && !applicantsError && applicants.length > 0 && (
          applicants.map(applicant => {
            const status = getStatusInfo(applicant.status);
            return (
              <div key={applicant.applied_projects_id} className="candidate-profile-card position-relative list-layout mb-4" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <div className="d-flex align-items-center">
                  <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
                    <Image
                      src={applicant.profile_picture || "/images/default-avatar.png"}
                      alt="Candidate"
                      width={80}
                      height={80}
                      className="lazy-img rounded-circle"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="right-side">
                    <div className="row gx-1 align-items-center">
                      <div className="col-xl-3">
                        <div className="position-relative">
                          <h4 className="candidate-name mb-0">
                            {applicant.first_name} {applicant.last_name}
                          </h4>

                          <ul className="cadidate-skills style-none d-flex align-items-center">
                            {applicant.skills && applicant.skills.slice(0, 3).map((skill, i) => (
                              <li key={i} className="text-nowrap">{skill}</li>
                            ))}
                            {applicant.skills && applicant.skills.length > 3 && (
                              <li className="more">+{applicant.skills.length - 3}</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Application Status</span>
                          <div className={`fw-bold ${status.className}`}>{status.text}</div>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Applied Date</span>
                          <div>{applicant.applied_date ? new Date(applicant.applied_date as string).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-4">
                        <div className="d-flex justify-content-lg-end align-items-center">
                          <button
                            type="button"
                            className="save-btn text-center rounded-circle tran3s"
                            onClick={() => onToggleSave(applicant.user_id)}
                            title={savedApplicants.includes(applicant.user_id) ? "Unsave" : "Save"}
                          >
                            <i className={`bi ${savedApplicants.includes(applicant.user_id) ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                          </button>

                          <div className="dropdown ms-2">
                            <button
                              className="btn dropdown-toggle profile-btn tran3s"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Actions
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => onViewProfile(applicant.user_id)}
                                >
                                  View Profile
                                </button>
                              </li>
                              {applicant.status !== 1 && (
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => selectedProjectForApplicants && onUpdateApplicantStatus(selectedProjectForApplicants.project_id, applicant.applied_projects_id, 1)}
                                    style={{ color: '#31795A', fontWeight: '500' }}
                                  >
                                    Approve
                                  </button>
                                </li>
                              )}
                              {applicant.status !== 3 && applicant.status !== 2 && (
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => selectedProjectForApplicants && onUpdateApplicantStatus(selectedProjectForApplicants.project_id, applicant.applied_projects_id, 3)}
                                    style={{ color: '#dc3545', fontWeight: '500' }}
                                  >
                                    Reject
                                  </button>
                                </li>
                              )}
                              {applicant.status === 1 && (
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => selectedProjectForApplicants && onUpdateApplicantStatus(selectedProjectForApplicants.project_id, applicant.applied_projects_id, 2)}
                                    style={{ color: '#0dcaf0', fontWeight: '500' }}
                                  >
                                    Mark as Completed
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;