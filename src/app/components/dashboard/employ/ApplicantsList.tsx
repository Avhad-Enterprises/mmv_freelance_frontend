"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AuthenticatedImage from '../../common/AuthenticatedImage';

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
  bid_amount?: number;
  bid_message?: string;
}

interface ApplicantsListProps {
  applicants: Applicant[];
  applicantsLoading: boolean;
  applicantsError: string | null;
  savedApplicants: number[];
  selectedProjectForApplicants: { project_id: string; title: string; budget?: number } | null;
  onViewProfile: (applicantId: number) => void;
  onToggleSave: (applicantId: number) => void;
  onUpdateApplicantStatus: (projectId: string, applicationId: number, newStatus: Applicant['status']) => void;
  getStatusInfo: (status: Applicant['status'] | number) => { text: string; className: string };
  onOpenChat: (applicant: Applicant) => void;
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
  getStatusInfo,
  onOpenChat
}) => {
  // Modal state for approval confirmation
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [applicantToApprove, setApplicantToApprove] = useState<Applicant | null>(null);
  const approveModalRef = useRef<any>(null);

  // Modal state for bid message
  const [showBidMessageModal, setShowBidMessageModal] = useState(false);
  const [selectedBidMessage, setSelectedBidMessage] = useState<{ name: string; message: string; amount: number } | null>(null);
  const bidMessageModalRef = useRef<any>(null);

  // Initialize Bootstrap modals and fix z-index
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap');
      const approveModalElement = document.getElementById('approveConfirmationModal');
      const bidModalElement = document.getElementById('bidMessageModal');

      if (approveModalElement) {
        approveModalRef.current = new bootstrap.Modal(approveModalElement);
      }
      if (bidModalElement) {
        bidMessageModalRef.current = new bootstrap.Modal(bidModalElement);
      }

      // Fix for modal backdrop issue
      const style = document.createElement('style');
      style.innerHTML = `
        #approveConfirmationModal.modal.show,
        #bidMessageModal.modal.show {
          z-index: 99999 !important;
        }
        #approveConfirmationModal ~ .modal-backdrop,
        #bidMessageModal ~ .modal-backdrop,
        .modal-backdrop.show {
          z-index: 99998 !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        body.modal-open {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  // Handle approve button click - show modal
  const handleApproveClick = (applicant: Applicant) => {
    setApplicantToApprove(applicant);
    setShowApproveModal(true);
    approveModalRef.current?.show();
  };

  // Handle confirm approval
  const handleConfirmApprove = () => {
    if (applicantToApprove && selectedProjectForApplicants) {
      onUpdateApplicantStatus(selectedProjectForApplicants.project_id, applicantToApprove.applied_projects_id, 1);
      approveModalRef.current?.hide();
      setShowApproveModal(false);
      setApplicantToApprove(null);
    }
  };

  // Handle cancel approval
  const handleCancelApprove = () => {
    approveModalRef.current?.hide();
    setShowApproveModal(false);
    setApplicantToApprove(null);
  };

  // Handle view bid message
  const handleViewBidMessage = (applicant: Applicant) => {
    setSelectedBidMessage({
      name: `${applicant.first_name} ${applicant.last_name}`,
      message: applicant.bid_message || 'No proposal message provided.',
      amount: applicant.bid_amount || 0
    });
    setShowBidMessageModal(true);
    bidMessageModalRef.current?.show();
  };

  // Handle close bid message modal
  const handleCloseBidMessage = () => {
    bidMessageModalRef.current?.hide();
    setShowBidMessageModal(false);
    setSelectedBidMessage(null);
  };

  return (
    <>
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
                <div key={applicant.applied_projects_id} className="candidate-profile-card position-relative list-layout mb-25" style={{ minHeight: '160px', padding: '30px 25px' }}>
                  <div className="d-flex align-items-start">
                    <div className="cadidate-avatar online position-relative d-block me-auto ms-auto" style={{ flexShrink: 0 }}>
                      <AuthenticatedImage
                        src={applicant.profile_picture || "/images/default-avatar.png"}
                        alt="Candidate"
                        width={80}
                        height={80}
                        className="lazy-img rounded-circle"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                        fallbackSrc="/images/default-avatar.png"
                      />
                    </div>
                    <div className="right-side" style={{ width: '100%', paddingLeft: '20px' }}>
                      {/* First Row: Name, Bid Amount, Status, Date, Actions */}
                      <div className="row gx-2 align-items-center mb-2">
                        <div className="col-xl-2 col-md-12 mb-xl-0 mb-2">
                          <div className="position-relative">
                            <h4 className="candidate-name mb-0" style={{ fontSize: '16px', lineHeight: '1.4' }}>
                              {applicant.first_name} {applicant.last_name}
                            </h4>
                          </div>
                        </div>

                        <div className="col-xl-2 col-md-3 col-sm-6 mb-xl-0 mb-2">
                          <div className="candidate-info">
                            <span style={{ fontSize: '12px', color: '#666' }}>Bid Amount</span>
                            <div className="fw-bold text-success" style={{ fontSize: '15px', marginTop: '4px' }}>
                              ${applicant.bid_amount?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-2 col-md-3 col-sm-6 mb-xl-0 mb-2">
                          <div className="candidate-info">
                            <span style={{ fontSize: '12px', color: '#666' }}>Application Status</span>
                            <div className={`fw-bold ${status.className}`} style={{ fontSize: '14px', marginTop: '4px' }}>{status.text}</div>
                          </div>
                        </div>

                        <div className="col-xl-2 col-md-3 col-sm-6 mb-xl-0 mb-2">
                          <div className="candidate-info">
                            <span style={{ fontSize: '12px', color: '#666' }}>Applied Date</span>
                            <div style={{ fontSize: '14px', marginTop: '4px' }}>{applicant.applied_date ? new Date(applicant.applied_date as string).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>

                        <div className="col-xl-4 col-md-12">
                          <div className="d-flex justify-content-lg-end align-items-center flex-wrap gap-2">
                            <button
                              type="button"
                              className="save-btn text-center rounded-circle tran3s"
                              onClick={() => onToggleSave(applicant.user_id)}
                              title={savedApplicants.includes(applicant.user_id) ? "Unsave" : "Save"}
                              style={{ width: '36px', height: '36px' }}
                            >
                              <i className={`bi ${savedApplicants.includes(applicant.user_id) ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                            </button>

                            <div className="dropdown">
                              <button
                                className="btn btn-sm dropdown-toggle profile-btn tran3s"
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
                                    <i className="bi bi-person me-2"></i>View Profile
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleViewBidMessage(applicant)}
                                  >
                                    <i className="bi bi-file-text me-2"></i>View Proposal
                                  </button>
                                </li>
                                {applicant.status !== 1 && applicant.status !== 3 && (
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => handleApproveClick(applicant)}
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

                      {/* Second Row: Skills */}
                      <div className="row">
                        <div className="col-12">
                          <ul className="cadidate-skills style-none d-flex align-items-center flex-wrap" style={{ gap: '6px' }}>
                            {applicant.skills && applicant.skills.slice(0, 3).map((skill, i) => (
                              <li key={i} className="text-nowrap">{skill}</li>
                            ))}
                            {applicant.skills && applicant.skills.length > 3 && (
                              <li className="more">+{applicant.skills.length - 3}</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Approval Confirmation Modal */}
        <div className="modal fade" id="approveConfirmationModal" tabIndex={-1} aria-labelledby="approveConfirmationModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="approveConfirmationModalLabel">Confirm Approval</h5>
                <button type="button" className="btn-close" onClick={handleCancelApprove} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve <strong>{applicantToApprove?.first_name} {applicantToApprove?.last_name}</strong> for this project?</p>
                <p className="text-muted">This action will assign the freelancer to your project and update their status to "Approved".</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelApprove}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleConfirmApprove}>Yes, Approve</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Message Modal */}
        <div className="modal fade" id="bidMessageModal" tabIndex={-1} aria-labelledby="bidMessageModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <div>
                  <h5 className="modal-title mb-1" id="bidMessageModalLabel">
                    Proposal from {selectedBidMessage?.name}
                  </h5>
                  <div className="text-success fw-bold">
                    Bid Amount: ${selectedBidMessage?.amount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={handleCloseBidMessage} aria-label="Close"></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="p-3" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedBidMessage?.message || 'No proposal message provided.'}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseBidMessage}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantsList;