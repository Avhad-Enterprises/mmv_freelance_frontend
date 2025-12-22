'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IJobType } from '@/types/job-data-type';
import DashboardHeader from './dashboard-header-minus';
import ApplyLoginModal from '@/app/components/common/popup/apply-login-modal';
import { makeGetRequest, makePostRequest, makeDeleteRequest } from '@/utils/api';
import toast from 'react-hot-toast';
import { authCookies } from "@/utils/cookies";
import BiddingModal from './bidding-modal';
import { InsufficientCreditsModal, ConfirmApplyModal } from '@/app/components/credits';
import { creditsService } from '@/services/credits.service';
import { CreditBalance } from '@/types/credits';
import { db, auth } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { signInWithCustomToken } from 'firebase/auth';

// Helper function to format seconds into a more readable string
const formatDuration = (seconds: number | undefined): string => {
  if (seconds === undefined) return 'N/A';
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min${remainingSeconds > 0 ? ` ${remainingSeconds} sec` : ''}`;
};

interface DashboardJobDetailsAreaProps {
  job: IJobType;
  onBack: () => void;
}

const DashboardJobDetailsArea = ({ job, onBack }: DashboardJobDetailsAreaProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const applyLoginModalRef = useRef<any>(null);

  // State for Apply Button
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<number | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);

  // Credit state
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [showConfirmApplyModal, setShowConfirmApplyModal] = useState(false);
  const [checkingCredits, setCheckingCredits] = useState(false);

  // Message state
  const [isMessaging, setIsMessaging] = useState(false);

  useEffect(() => {
    // Scroll to top when job details page loads
    window.scrollTo(0, 0);

    const token = authCookies.getToken();
    setIsLoggedIn(!!token);

    const initialize = async () => {
      if (token) {
        await fetchUserIdAndInitialState();
      }
    };
    initialize();

    // Initialize Bootstrap Modal for programmatic control
    if (typeof window !== 'undefined') {
      const bootstrap = require('bootstrap');
      const modalElement = document.getElementById('applyLoginModal');
      if (modalElement) {
        applyLoginModalRef.current = new bootstrap.Modal(modalElement);
      }
    }
  }, [job]);

  const fetchUserIdAndInitialState = async () => {
    try {
      const response = await makeGetRequest('api/v1/users/me');
      const userData = response.data?.data;
      if (userData?.user?.user_id) {
        setUserId(userData.user.user_id);
        setUserRole(userData.userType);
        checkInitialJobStatus(userData.user.user_id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const checkInitialJobStatus = async (currentUserId: number) => {
    if (!job.projects_task_id) return;
    try {
      // Check saved status
      const savedRes = await makeGetRequest(`api/v1/saved/my-saved-projects`);
      const savedProjectIds = savedRes.data.data.map((p: any) => p.projects_task_id);
      if (savedProjectIds.includes(job.projects_task_id)) {
        setIsSaved(true);
      }

      // Check if already applied to this specific project using the correct API
      const appliedRes = await makeGetRequest(`api/v1/applications/my-applications`);

      if (appliedRes.data?.success && appliedRes.data?.data) {
        // Find if user has applied to THIS specific project
        const applicationForThisProject = appliedRes.data.data.find(
          (app: any) => app.projects_task_id === job.projects_task_id
        );

        if (applicationForThisProject) {
          setIsApplied(true);
          setApplicationId(applicationForThisProject.applied_projects_id);
          setApplicationStatus(applicationForThisProject.status); // Store application status
        } else {
          setIsApplied(false);
          setApplicationId(null);
          setApplicationStatus(null);
        }
      } else {
        setIsApplied(false);
        setApplicationId(null);
      }

    } catch (error: any) {
      console.error("Error checking initial job status:", error);
      // If there's an error fetching applications, assume not applied
      setIsApplied(false);
      setApplicationId(null);
    }
  };

  const handleApplyClick = async () => {
    if (!isLoggedIn) {
      applyLoginModalRef.current?.show();
      return;
    }

    if (userRole === 'CLIENT') {
      toast.error('Only freelancers can apply.');
      return;
    }

    if (isApplied && applicationId) {
      handleWithdrawApplication();
    } else {
      // Check credits before allowing application
      setCheckingCredits(true);
      try {
        const balance = await creditsService.getBalance();
        setCreditBalance(balance);

        if (balance.credits_balance < 1) {
          // Not enough credits - show modal
          setShowInsufficientCreditsModal(true);
          return;
        }

        // Has credits - show confirmation modal first
        setShowConfirmApplyModal(true);
      } catch (error: any) {
        console.error("Error checking credits:", error);
        // If credit check fails, try to proceed anyway (backend will reject if no credits)
        if (job.bidding_enabled) {
          setShowBiddingModal(true);
        } else {
          handleApplySubmit();
        }
      } finally {
        setCheckingCredits(false);
      }
    }
  };

  const handleBidSubmit = async (bidAmount: number, bidMessage: string) => {
    if (!userId) {
      toast.error('Could not verify user. Please refresh and try again.');
      return;
    }

    setIsApplying(true);
    try {
      const payload = {
        projects_task_id: job.projects_task_id,
        description: "",
        bid_amount: bidAmount,
        bid_message: bidMessage
      };

      const response = await makePostRequest('api/v1/applications/projects/apply', payload);

      if (response.data?.success) {
        toast.success('Bid submitted successfully!');
        setIsApplied(true);
        setApplicationId(response.data.data?.applied_projects_id || null);
        setShowBiddingModal(false);
      } else {
        toast.error(response.data?.message || 'Failed to submit bid.');
      }
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while submitting your bid.';
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplySubmit = async () => {
    if (!userId) {
      toast.error('Could not verify user. Please refresh and try again.');
      return;
    }

    setIsApplying(true);
    try {
      const payload = {
        projects_task_id: job.projects_task_id,
        description: "" // Sending blank description for non-bidding projects
      };

      const response = await makePostRequest('api/v1/applications/projects/apply', payload);

      if (response.data?.success) {
        toast.success('Application submitted successfully!');
        setIsApplied(true);
        setApplicationId(response.data.data?.applied_projects_id || null);
      } else {
        toast.error(response.data?.message || 'Failed to submit application.');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while applying.';
      toast.error(errorMessage);
    } finally {
      setIsApplying(false);
    }
  };

  const handleWithdrawApplication = async () => {
    if (!applicationId) {
      toast.error('Application ID not found.');
      return;
    }

    // Check if application is already approved (status = 1)
    if (applicationStatus === 1) {
      toast.error('Cannot withdraw from an approved project. Please contact support if you have concerns.');
      return;
    }

    // Confirm withdrawal
    if (!confirm('Are you sure you want to withdraw your application?')) {
      return;
    }

    setIsApplying(true);
    try {
      const response = await makeDeleteRequest(`api/v1/applications/withdraw/${applicationId}`, {});

      if (response.data?.message || response.status === 200) {
        toast.success('Application withdrawn successfully!');
        setIsApplied(false);
        setApplicationId(null);
      } else {
        toast.error('Failed to withdraw application.');
      }
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast.error(error.response?.data?.message || 'An error occurred while withdrawing.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJobClick = async () => {
    if (!isLoggedIn) {
      applyLoginModalRef.current?.show();
      return;
    }

    if (!userId || job.projects_task_id === undefined) {
      toast.error('Unable to get user or job information');
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        // Unsave the job
        await makeDeleteRequest('api/v1/saved/unsave-project', {
          projects_task_id: job.projects_task_id,
        });
        toast.success('Job unsaved!');
        setIsSaved(false);
      } else {
        // Save the job
        await makePostRequest('api/v1/saved/save-project', {
          projects_task_id: job.projects_task_id,
        });
        toast.success('Job saved!');
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error('Error updating save status:', error);
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    applyLoginModalRef.current?.hide();
    setIsLoggedIn(true);
    fetchUserIdAndInitialState();
  };

  const handleMessageClient = async () => {
    if (!isLoggedIn) {
      applyLoginModalRef.current?.show();
      return;
    }

    const clientUserId = job.client_user_id;
    if (!clientUserId || !userId) {
      toast.error('Unable to get client information');
      return;
    }

    setIsMessaging(true);

    // Check if chat is allowed (freelancer must have applied to this client's project)
    try {
      const permissionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/check-can-chat/${clientUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${authCookies.getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (permissionResponse.ok) {
        const permissionData = await permissionResponse.json();
        if (!permissionData.canChat) {
          toast.error('You must apply to this project first before messaging the client.');
          setIsMessaging(false);
          return;
        }
      }
    } catch (permErr) {
      console.error('Error checking chat permission:', permErr);
    }

    try {
      // Ensure Firebase authentication
      if (!auth.currentUser) {
        const authToken = authCookies.getToken();
        if (!authToken) {
          toast.error('Authentication required. Please sign in again.');
          setIsMessaging(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/firebase-token`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get Firebase authentication token');
        }

        const data = await response.json();
        if (data.success && data.data?.customToken) {
          await signInWithCustomToken(auth, data.data.customToken);
        } else {
          throw new Error('Invalid Firebase token response');
        }
      }

      // Create or get conversation
      const currentUserId = String(userId);
      const otherId = String(clientUserId);
      const participants = [currentUserId, otherId].sort();
      const conversationId = participants.join('_');

      const convRef = ref(db, `conversations/${conversationId}`);
      const convSnap = await get(convRef);

      if (!convSnap.exists()) {
        // Build participant details
        const participantDetails: any = {};
        participantDetails[currentUserId] = {
          firstName: 'Freelancer',
          email: '',
          profilePicture: null
        };
        participantDetails[otherId] = {
          firstName: job.client_first_name || job.client_company_name || 'Client',
          email: '',
          profilePicture: job.client_profile_picture || null
        };

        await set(convRef, {
          participants,
          participantRoles: {
            [currentUserId]: 'freelancer',
            [otherId]: 'client',
          },
          participantDetails,
          lastMessage: '',
          lastSenderId: '',
          updatedAt: Date.now(),
          createdAt: Date.now(),
        });
        toast.success('Chat started! Redirecting...');
      } else {
        toast.success('Opening chat...');
      }

      // Navigate to chat
      router.push(`/dashboard/freelancer-dashboard/chat?conversationId=${conversationId}`);
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      toast.error(`Failed to start chat: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <>
      <div className="dashboard-body" style={{ backgroundColor: '#f0f5f3', minHeight: '100vh' }}>
        <div className="position-relative">
          <DashboardHeader />

          <section className="job-details pt-50 pb-50">
            <div className="container-fluid">
              <div className="row">
                {/* Left Side: Details - Green Background */}
                <div className="col-xxl-9 col-xl-8">
                  <div className="details-post-data me-xxl-5 pe-xxl-4">

                    <button onClick={onBack} className="btn-two mb-20">
                      &larr; Back to Jobs
                    </button>

                    <div className="post-date">
                      Posted on: {job.created_at?.slice(0, 10)}
                    </div>
                    <h3 className="post-title">{job.project_title}</h3>

                    <div className="post-block border-style mt-50 lg-mt-30">
                      <div className="d-flex align-items-center">
                        <div className="block-numb text-center fw-500 text-white rounded-circle me-2">1</div>
                        <h4 className="block-title">Project Description</h4>
                      </div>
                      <p className="mt-25 mb-20">{job.project_description}</p>
                      {job.additional_notes && <p><strong>Additional Notes:</strong> {job.additional_notes}</p>}
                    </div>

                    <div className="post-block border-style mt-50 lg-mt-30">
                      <div className="d-flex align-items-center">
                        <div className="block-numb text-center fw-500 text-white rounded-circle me-2">2</div>
                        <h4 className="block-title">Project Specifications</h4>
                      </div>
                      <ul className="list-type-two style-none mt-25 mb-15">
                        <li><strong>Project Type:</strong> {job.projects_type} </li>
                        <li><strong>Project Format:</strong> {job.project_format}</li>
                        <li><strong>Audio / Voiceover:</strong> {job.audio_voiceover} </li>
                        <li><strong>Video Length:</strong> {formatDuration(job.video_length)} </li>
                        <li><strong>Preferred Video Style:</strong> {job.preferred_video_style}</li>
                        {job.audio_description && <li><strong>Audio Details:</strong> {job.audio_description}</li>}
                      </ul>
                    </div>

                    <div className="post-block border-style mt-40 lg-mt-30">
                      <div className="d-flex align-items-center">
                        <div className="block-numb text-center fw-500 text-white rounded-circle me-2">3</div>
                        <h4 className="block-title">Required Skills</h4>
                      </div>
                      <ul className="list-type-two style-none mt-25 mb-15">
                        {job.skills_required?.map((skill, idx) => (
                          <li key={idx}>{skill}</li>
                        ))}
                      </ul>
                    </div>

                    {job.reference_links && job.reference_links.length > 0 && (
                      <div className="post-block border-style mt-40 lg-mt-30">
                        <div className="d-flex align-items-center">
                          <div className="block-numb text-center fw-500 text-white rounded-circle me-2">4</div>
                          <h4 className="block-title">Reference Links</h4>
                        </div>
                        <ul className="list-type-two style-none mt-25 mb-15">
                          {job.reference_links.map((link, i) => (
                            <li key={i}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Metadata - White Island */}
                <div className="col-xxl-3 col-xl-4">
                  <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mt-50 bg-white rounded-3 p-4" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div className="text-center mb-3">
                      <div className="text-md text-dark text-center mt-15 mb-10 text-capitalize fw-500">
                        {job.project_title}
                      </div>
                      <div className="text-sm text-muted mb-3">
                        Posted by: <span className="fw-500 text-dark">
                          {job.client_first_name && job.client_last_name
                            ? `${job.client_first_name} ${job.client_last_name}`
                            : job.client_company_name
                              ? job.client_company_name
                              : 'Anonymous Client'
                          }
                        </span>
                      </div>
                      {job.client_company_name && (
                        <div className="text-xs text-muted">
                          Company: {job.client_company_name}
                        </div>
                      )}
                    </div>
                    <div className="border-top mt-40 pt-40">
                      <ul className="job-meta-data row style-none">
                        <li className="col-6">
                          <span>Budget</span>
                          <div>{job.currency ? `${job.currency} ${job.budget?.toLocaleString()}` : `$${job.budget?.toLocaleString()}`}</div>
                        </li>
                        <li className="col-6">
                          <span>Deadline</span>
                          <div>{job.deadline?.slice(0, 10)}</div>
                        </li>
                        <li className="col-6">
                          <span>Duration</span>
                          <div>{formatDuration(job.video_length)}</div>
                        </li>
                        <li className="col-6">
                          <span>Posted</span>
                          <div>{job.created_at?.slice(0, 10)}</div>
                        </li>
                      </ul>
                      <div className="job-tags d-flex flex-wrap pt-15">
                        {job.skills_required?.map((tag, idx) => (
                          <a key={idx} href="#">{tag}</a>
                        ))}
                      </div>

                      {/* Message Client Button - Only show if applied */}
                      {isApplied && job.client_user_id && (
                        <button
                          className="btn-one w-100 mt-25 d-flex align-items-center justify-content-center"
                          onClick={handleMessageClient}
                          disabled={isMessaging || userRole === 'CLIENT'}
                        >
                          {isMessaging ? (
                            'Starting Chat...'
                          ) : (
                            <>
                              <i className="bi bi-chat-dots me-2"></i>
                              Message Client
                            </>
                          )}
                        </button>
                      )}

                      <button
                        className="btn-one w-100 mt-15"
                        onClick={handleApplyClick}
                        disabled={isApplying || checkingCredits || userRole === 'CLIENT'}
                      >
                        {isApplying ? (isApplied ? 'Withdrawing...' : 'Applying...') : isApplied ? <>✅ Applied<br />Click To Withdraw</> : 'Apply Now'}
                      </button>

                      <button
                        className="btn-outline w-100 mt-15 d-flex align-items-center justify-content-center"
                        onClick={handleSaveJobClick}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          'Saving...'
                        ) : (
                          <>
                            <i className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart"} me-2`}></i>
                            {isSaved ? 'Saved' : 'Save Job'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ApplyLoginModal onLoginSuccess={handleLoginSuccess} />

      {showBiddingModal && (
        <BiddingModal
          originalBudget={job.budget || 0}
          currency="USD"
          onSubmit={handleBidSubmit}
          onCancel={() => setShowBiddingModal(false)}
          isSubmitting={isApplying}
        />
      )}

      {/* Insufficient Credits Modal */}
      <InsufficientCreditsModal
        isOpen={showInsufficientCreditsModal}
        onClose={() => setShowInsufficientCreditsModal(false)}
        requiredCredits={1}
        currentBalance={creditBalance?.credits_balance || 0}
        onBuyCredits={() => {
          setShowInsufficientCreditsModal(false);
          // Navigate to credits page
          window.location.href = '/dashboard/freelancer-dashboard/credits';
        }}
      />

      {/* Confirm Apply Modal */}
      <ConfirmApplyModal
        isOpen={showConfirmApplyModal}
        onClose={() => setShowConfirmApplyModal(false)}
        onConfirm={() => {
          setShowConfirmApplyModal(false);
          if (job.bidding_enabled) {
            setShowBiddingModal(true);
          } else {
            handleApplySubmit();
          }
        }}
        projectTitle={job.project_title || 'this project'}
        currentBalance={creditBalance?.credits_balance || 0}
        isVideoEditor={userRole === 'VIDEO_EDITOR'}
      />
    </>
  );
};

export default DashboardJobDetailsArea;