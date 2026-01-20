"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AuthenticatedImage from '../../common/AuthenticatedImage';
import { formatBudget } from '@/utils/currencyUtils';

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
  selectedProjectForApplicants: { project_id: string; title: string; budget?: number; bidding_enabled?: boolean; currency?: string } | null;
  onViewProfile: (applicantId: number) => void;
  onToggleSave: (applicantId: number) => void;
  onUpdateApplicantStatus: (projectId: string, applicationId: number, newStatus: Applicant['status'], rejectionReason?: string) => void;
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

  // Modal state for rejection confirmation
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [applicantToReject, setApplicantToReject] = useState<Applicant | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const rejectModalRef = useRef<any>(null);

  // Modal state for bid message
  const [showBidMessageModal, setShowBidMessageModal] = useState(false);
  const [selectedBidMessage, setSelectedBidMessage] = useState<{ name: string; message: string; amount: number } | null>(null);
  const bidMessageModalRef = useRef<any>(null);

  // Initialize Bootstrap modals and fix z-index
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap');
      const approveModalElement = document.getElementById('approveConfirmationModal');
      const rejectModalElement = document.getElementById('rejectConfirmationModal');
      const bidModalElement = document.getElementById('bidMessageModal');

      if (approveModalElement) {
        approveModalRef.current = new bootstrap.Modal(approveModalElement);
      }
      if (rejectModalElement) {
        rejectModalRef.current = new bootstrap.Modal(rejectModalElement);
      }
      if (bidModalElement) {
        bidMessageModalRef.current = new bootstrap.Modal(bidModalElement);
      }

      // Fix for modal backdrop issue
      const style = document.createElement('style');
      style.innerHTML = `
        #approveConfirmationModal.modal.show,
        #rejectConfirmationModal.modal.show,
        #bidMessageModal.modal.show {
          z-index: 99999 !important;
        }
        #approveConfirmationModal ~ .modal-backdrop,
        #rejectConfirmationModal ~ .modal-backdrop,
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

  // Handle reject button click - show modal
  const handleRejectClick = (applicant: Applicant) => {
    setApplicantToReject(applicant);
    setRejectionReason("");
    setShowRejectModal(true);
    rejectModalRef.current?.show();
  };

  // Handle confirm rejection
  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    if (applicantToReject && selectedProjectForApplicants) {
      // Debug logging
      console.log('=== MODAL: Confirm Reject Clicked ===');
      console.log('Applicant:', applicantToReject.first_name, applicantToReject.last_name);
      console.log('Rejection Reason (raw):', rejectionReason);
      console.log('Rejection Reason (trimmed):', rejectionReason.trim());
      console.log('====================================');

      // Pass rejection reason to the update handler
      onUpdateApplicantStatus(
        selectedProjectForApplicants.project_id,
        applicantToReject.applied_projects_id,
        3,
        rejectionReason.trim() // Pass the rejection reason
      );
      rejectModalRef.current?.hide();
      setShowRejectModal(false);
      setApplicantToReject(null);
      setRejectionReason("");
    }
  };

  // Handle cancel rejection
  const handleCancelReject = () => {
    rejectModalRef.current?.hide();
    setShowRejectModal(false);
    setApplicantToReject(null);
    setRejectionReason("");
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
      <style jsx>{`
        .candidate-profile-area .dropdown-menu .dropdown-item {
          transition: background-color .15s ease, color .15s ease;
        }

        .candidate-profile-area .dropdown-menu .dropdown-item:hover,
        .candidate-profile-area .dropdown-menu .dropdown-item:focus {
          background-color: #31795A !important;
          color: #fff !important;
        }

        /* Mobile-First Applicant Card Styles */
        .applicant-card-mobile {
          padding: 20px;
          min-height: auto;
        }

        .applicant-card-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .applicant-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .applicant-name-section {
          flex: 1;
          min-width: 0;
        }

        .applicant-name-section .candidate-name {
          font-size: 16px;
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }

        .applicant-actions-mobile {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .applicant-actions-mobile .save-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Info Grid - 2 columns on mobile, 3 on larger screens */
        .applicant-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .applicant-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .applicant-info-item .info-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .applicant-info-item .info-value {
          font-size: 14px;
          line-height: 1.3;
        }

        .applicant-skills-row {
          padding-top: 4px;
        }

        /* Tablet and Desktop adjustments */
        @media (min-width: 576px) {
          .applicant-card-mobile {
            padding: 24px;
          }

          .applicant-info-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .applicant-name-section .candidate-name {
            font-size: 18px;
          }
        }

        @media (min-width: 992px) {
          .applicant-card-mobile {
            padding: 30px 25px;
          }

          .applicant-header {
            gap: 16px;
          }

          .applicant-info-grid {
            grid-template-columns: repeat(3, 1fr);
            padding: 16px;
          }

          .applicant-info-item .info-label {
            font-size: 12px;
          }

          .applicant-info-item .info-value {
            font-size: 15px;
          }
        }
      `}</style>

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
                <div key={applicant.applied_projects_id} className="candidate-profile-card position-relative list-layout mb-25 applicant-card-mobile">
                  {/* Mobile-First Layout */}
                  <div className="applicant-card-content">
                    {/* Header: Avatar + Name + Actions */}
                    <div className="applicant-header">
                      <div className="cadidate-avatar online position-relative" style={{ flexShrink: 0 }}>
                        <AuthenticatedImage
                          src={applicant.profile_picture || "/images/default-avatar.png"}
                          alt="Candidate"
                          width={60}
                          height={60}
                          className="lazy-img rounded-circle"
                          style={{ objectFit: 'cover' }}
                          unoptimized
                          fallbackSrc="/images/default-avatar.png"
                        />
                      </div>
                      <div className="applicant-name-section">
                        <h4 className="candidate-name mb-0">{applicant.first_name} {applicant.last_name}</h4>
                      </div>
                      <div className="applicant-actions-mobile">
                        <button
                          type="button"
                          className="save-btn text-center rounded-circle tran3s"
                          onClick={() => onToggleSave(applicant.user_id)}
                          title={savedApplicants.includes(applicant.user_id) ? "Unsave" : "Save"}
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
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item" onClick={() => onViewProfile(applicant.user_id)}>
                                <i className="bi bi-person me-2"></i>View Profile
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => onOpenChat(applicant)}>
                                <i className="bi bi-chat-dots me-2"></i>Message
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleViewBidMessage(applicant)}>
                                <i className="bi bi-file-text me-2"></i>View Proposal
                              </button>
                            </li>
                            {applicant.status !== 1 && applicant.status !== 2 && applicant.status !== 3 && (
                              <li>
                                <button className="dropdown-item" onClick={() => handleApproveClick(applicant)} style={{ color: '#31795A', fontWeight: '500' }}>
                                  Approve
                                </button>
                              </li>
                            )}
                            {applicant.status === 0 && (
                              <li>
                                <button className="dropdown-item" onClick={() => handleRejectClick(applicant)} style={{ color: '#dc3545', fontWeight: '500' }}>
                                  Reject
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid: 2x2 on mobile, 4 columns on desktop */}
                    <div className="applicant-info-grid">
                      <div className="applicant-info-item">
                        <span className="info-label">Bid Amount</span>
                        <span className="info-value text-success fw-bold">
                          {selectedProjectForApplicants?.bidding_enabled
                            ? formatBudget(applicant.bid_amount || 0, selectedProjectForApplicants?.currency || 'USD')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="applicant-info-item">
                        <span className="info-label">Application Status</span>
                        <span className={`info-value fw-bold ${status.className}`}>{status.text}</span>
                      </div>
                      <div className="applicant-info-item">
                        <span className="info-label">Applied Date</span>
                        <span className="info-value">{applicant.applied_date ? new Date(applicant.applied_date as string).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Skills Row */}
                    {applicant.skills && applicant.skills.length > 0 && (
                      <div className="applicant-skills-row">
                        <ul className="cadidate-skills style-none d-flex align-items-center flex-wrap" style={{ gap: '6px', marginBottom: 0 }}>
                          {applicant.skills.slice(0, 3).map((skill, i) => (
                            <li key={i} className="text-nowrap">{skill}</li>
                          ))}
                          {applicant.skills.length > 3 && (
                            <li className="more">+{applicant.skills.length - 3}</li>
                          )}
                        </ul>
                      </div>
                    )}
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

        {/* Rejection Confirmation Modal */}
        <div className="modal fade" id="rejectConfirmationModal" tabIndex={-1} aria-labelledby="rejectConfirmationModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="rejectConfirmationModalLabel">Confirm Rejection</h5>
                <button type="button" className="btn-close" onClick={handleCancelReject} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject <strong>{applicantToReject?.first_name} {applicantToReject?.last_name}</strong>'s application?</p>
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    Reason for Rejection <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejecting this application..."
                    required
                  />
                  {!rejectionReason.trim() && (
                    <small className="text-muted">This field is required to proceed with rejection.</small>
                  )}
                </div>
                <p className="text-muted small">The freelancer will be notified of your decision along with the reason provided.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancelReject}
                  style={{
                    borderRadius: '8px',
                    padding: '12px 24px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmReject}
                  disabled={!rejectionReason.trim()}
                  style={{
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '500'
                  }}
                >
                  Yes, Reject
                </button>
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