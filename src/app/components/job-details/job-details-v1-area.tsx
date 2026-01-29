'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IJobType } from '@/types/job-data-type';
import ApplyLoginModal from '@/app/components/common/popup/apply-login-modal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { authCookies } from '@/utils/cookies';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = authCookies.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const formatDuration = (seconds: number | undefined): string => {
  if (seconds === undefined) return 'N/A';
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min${remainingSeconds > 0 ? ` ${remainingSeconds} sec` : ''}`;
};

const JobDetailsV1Area = ({ job }: { job: IJobType }) => {
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
  const [isCheckingApplication, setIsCheckingApplication] = useState(true);

  // Ref to prevent duplicate useEffect runs
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization in development mode
    if (hasInitialized.current) {
      return;
    }

    const token = authCookies.getToken();
    setIsLoggedIn(!!token);

    // Reset states when job changes
    setIsApplied(false);
    setApplicationId(null);
    setIsCheckingApplication(true);
    hasInitialized.current = false; // Reset initialization flag for new job

    const initialize = async () => {
      if (token) {
        await fetchUserIdAndInitialState();
      } else {
        setIsCheckingApplication(false);
      }
    };
    initialize();

    hasInitialized.current = true;

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
      const response = await api.get('api/v1/users/me');
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
    if (!job || job.projects_task_id === undefined) {
      setIsCheckingApplication(false);
      return;
    }

    try {
      setIsCheckingApplication(true);

      // Check if job is saved
      const savedRes = await api.get(`api/v1/saved/my-saved-projects`);
      const savedProjects = savedRes.data?.data || [];
      const isJobSaved = savedProjects.some(
        (savedJob: any) => savedJob.projects_task_id === job.projects_task_id
      );
      setIsSaved(isJobSaved);

      // Check if already applied to this specific project
      const appliedRes = await api.get(`api/v1/applications/my-applications/project/${job.projects_task_id}`);

      if (appliedRes.data?.success && appliedRes.data?.data) {
        let application = null;

        // Handle both single object and array responses
        if (Array.isArray(appliedRes.data.data)) {
          application = appliedRes.data.data.length > 0 ? appliedRes.data.data[0] : null;
        } else {
          application = appliedRes.data.data;
        }

        if (application && application.applied_projects_id && application.projects_task_id === job.projects_task_id) {
          setIsApplied(true);
          setApplicationId(application.applied_projects_id);
          setApplicationStatus(application.status); // Store application status
        } else {
          setIsApplied(false);
          setApplicationId(null);
          setApplicationStatus(null);
        }
      } else {
        setIsApplied(false);
        setApplicationId(null);
        setApplicationStatus(null);
      }

    } catch (error: any) {
      // If 404 or no application found, user hasn't applied
      if (error.response?.status === 404) {
        setIsApplied(false);
        setApplicationId(null);
      } else {
        console.error("Error checking initial job status:", error);
        // For other errors, assume not applied to be safe
        setIsApplied(false);
        setApplicationId(null);
      }
    } finally {
      setIsCheckingApplication(false);
    }
  };

  const handleApplyClick = () => {
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
      handleApplySubmit();
    }
  };

  const handleApplySubmit = async () => {
    if (!userId) {
      toast.error('Could not verify user. Please refresh and try again.');
      return;
    }

    if (isApplying) {
      return;
    }

    setIsApplying(true);
    try {
      const response = await api.post('api/v1/applications/projects/apply', {
        projects_task_id: job.projects_task_id,
        description: "" // Sending blank description as per requirement
      });

      if (response.data?.success) {
        if (response.data.alreadyApplied) {
          toast.success('You have already applied to this project.');
          setIsApplied(true);
          setApplicationId(response.data.data?.applied_projects_id || null);
        } else {
          toast.success('Application submitted successfully!');
          setIsApplied(true);
          setApplicationId(response.data.data?.applied_projects_id || null);
        }
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

    // Check if application is already approved (status = 1) or completed (status = 2)
    if (applicationStatus === 1) {
      toast.error('Cannot withdraw from an ongoing project. Please contact support if you have concerns.');
      return;
    }

    if (applicationStatus === 2) {
      toast.error('Cannot withdraw from a completed project.');
      return;
    }

    if (isApplying) {
      return;
    }

    setIsApplying(true);
    try {
      const response = await api.delete(`api/v1/applications/withdraw/${applicationId}`);

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

    if (!userId) {
      toast.error('Unable to get user information');
      return;
    }

    setIsSaving(true);

    const payload = {
      projects_task_id: job.projects_task_id,
    };

    try {
      if (isSaved) {
        const response = await api.delete('api/v1/saved/unsave-project', { data: payload });

        if (response.data?.success) {
          toast.success('Project unsaved successfully');
          setIsSaved(false);
        } else {
          toast.error(response.data?.message || 'Failed to unsave project');
        }
      } else {
        const response = await api.post('api/v1/saved/save-project', payload);

        if (response.data?.data?.saved_projects_id) {
          toast.success('Project saved successfully!');
          setIsSaved(true);
        } else {
          toast.error(response.data?.message || 'Failed to save project');
        }
      }
    } catch (error: any) {
      console.error('Error saving/unsaving job:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    applyLoginModalRef.current?.hide();
    setIsLoggedIn(true);
    window.location.reload();
  };

  return (
    <>
      <style jsx>{`
        /* Desktop: Sidebar floats right */
        @media (min-width: 992px) {
          .job-details-content {
            padding-right: 2rem;
          }
        }
        /* Mobile: Remove extra margins */
        @media (max-width: 991px) {
          .job-details-sidebar {
            margin-bottom: 20px;
          }
          .job-company-info {
            margin-left: 0 !important;
            margin-top: 0 !important;
          }
        }
      `}</style>
      <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
        <div className="container">
          {/* Header: Back button, Posted date, Title - full width */}
          <div className="mb-4">
            <Link href="/job-list" className="btn-two mb-20">
              &larr; Back to Projects
            </Link>

            <div className="post-date">
              Posted on: {job.created_at?.slice(0, 10)}
            </div>
            <h3 className="post-title">{job.project_title}</h3>
          </div>

          <div className="row">
            {/* Sidebar: On mobile appears first, on desktop appears on right */}
            <div className="col-lg-4 col-xl-3 order-lg-2 job-details-sidebar">
              <div className="job-company-info ms-xl-3 lg-mt-0">
                <div className="text-center mb-3">
                  <div className="text-md text-dark text-center mt-15 mb-10 text-capitalize fw-500">
                    {job.project_title}
                  </div>
                  <div className="text-sm text-muted mb-3">
                    Posted by:{' '}
                    <span className="fw-500 text-dark">
                      {job.client_first_name && job.client_last_name
                        ? `${job.client_first_name} ${job.client_last_name}`
                        : job.client_company_name
                          ? job.client_company_name
                          : 'Anonymous Client'}
                    </span>
                  </div>
                  {/* Project Category Badge */}
                  {job.project_category && (
                    <div className="mt-15">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: '#e8f5e9',
                          color: '#31795a',
                          fontSize: '13px',
                          padding: '8px 16px',
                          fontWeight: '500',
                          borderRadius: '20px',
                          whiteSpace: 'normal',
                          display: 'inline-flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          maxWidth: '100%',
                          lineHeight: '1.4'
                        }}
                      >
                        <i className="bi bi-tag-fill me-2 flex-shrink-0"></i>
                        {job.project_category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-top mt-40 pt-40">
                  <ul className="job-meta-data row style-none">
                    <li className="col-6">
                      <span>Category</span>
                      <div>{job.project_category || 'Not specified'}</div>
                    </li>
                    <li className="col-6">
                      <span>Type</span>
                      <div>{job.projects_type || 'Not specified'}</div>
                    </li>
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
                  {/* Check if project is still accepting applications */}
                  {job.status !== undefined && job.status !== 0 ? (
                    <button
                      className="btn-one w-100 mt-25"
                      disabled={true}
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      {job.status === 3 ? '🚫 Project Closed' : '✅ Freelancer Assigned'}
                    </button>
                  ) : (
                    <button
                      className="btn-one w-100 mt-25"
                      onClick={handleApplyClick}
                      disabled={isApplying || userRole === 'CLIENT' || isCheckingApplication || (isApplied && applicationStatus !== 0)}
                    >
                      {isCheckingApplication ? 'Checking...' :
                        isApplying ? (isApplied ? 'Withdrawing...' : 'Applying...') :
                          isApplied ?
                            (applicationStatus === 0 ? <>✅ Applied<br />Click To Withdraw</> :
                              applicationStatus === 1 ? '✅ Application Accepted' :
                                applicationStatus === 2 ? '✅ Project Completed' :
                                  '✅ Applied') :
                            'Apply Now'}
                    </button>
                  )}

                  <button
                    className={`btn-outline w-100 mt-15 ${isSaved ? 'saved' : ''}`}
                    onClick={handleSaveJobClick}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : isSaved ? '❤️ Saved' : '🤍 Save Project'}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content: On mobile appears after sidebar, on desktop appears on left */}
            <div className="col-lg-8 col-xl-9 order-lg-1 job-details-content">
              {/* Project Description */}
              <div className="post-block border-style mt-30 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">1</div>
                  <h4 className="block-title">Project Description</h4>
                </div>
                <p className="mt-25 mb-20">{job.project_description}</p>
                {job.additional_notes && <p><strong>Additional Notes:</strong> {job.additional_notes}</p>}
              </div>

              {/* Required Skills */}
              <div className="post-block border-style mt-40 lg-mt-30">
                <div className="d-flex align-items-center">
                  <div className="block-numb text-center fw-500 text-white rounded-circle me-2">2</div>
                  <h4 className="block-title">Required Skills</h4>
                </div>
                <ul className="list-type-two style-none mt-25 mb-15">
                  {job.skills_required?.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>

              {/* Reference Links */}
              {job.reference_links && job.reference_links.length > 0 && (
                <div className="post-block border-style mt-40 lg-mt-30">
                  <div className="d-flex align-items-center">
                    <div className="block-numb text-center fw-500 text-white rounded-circle me-2">3</div>
                    <h4 className="block-title">Reference Links</h4>
                  </div>
                  <ul className="list-type-two style-none mt-25 mb-15">
                    {job.reference_links.map((link, i) => (
                      <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', textDecoration: 'underline' }}>{link}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ApplyLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default JobDetailsV1Area;