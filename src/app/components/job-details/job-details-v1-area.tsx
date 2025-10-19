'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IJobType } from '@/types/job-data-type';
import ApplyLoginModal from '@/app/components/common/popup/apply-login-modal';
import { makeGetRequest, makePostRequest } from '@/utils/api';
import toast from 'react-hot-toast';

// Helper function to format seconds into a more readable string
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
  const [userRole, setUserRole] = useState<string | null>(null); // New state for user role
  const applyLoginModalRef = useRef<any>(null);

  // State for Apply Button
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false); // To track if user has already applied

  useEffect(() => {
    const token = localStorage.getItem('token');
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
  }, []);

  const fetchUserIdAndInitialState = async () => {
    try {
      const response = await makeGetRequest('api/v1/users/me');
      const userData = response.data?.data; // Adjusted to access 'data' then 'user' and 'userType'
      if (userData?.user?.user_id) {
        setUserId(userData.user.user_id);
        setUserRole(userData.userType); // Set the user role
        // Check initial saved and applied status
        checkInitialJobStatus(userData.user.user_id);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  // Function to check if job is already saved or applied
  const checkInitialJobStatus = async (currentUserId: number) => {
    try {
      // NOTE: You will need to create these backend endpoints
      // const savedStatus = await makeGetRequest(`saved/status/${job.projects_task_id}/${currentUserId}`);
      // if (savedStatus.data?.isSaved) setIsSaved(true);

      // const appliedStatus = await makeGetRequest(`applications/status/${job.projects_task_id}/${currentUserId}`);
      // if (appliedStatus.data?.isApplied) setIsApplied(true);
    } catch (error) {
        console.error("Error checking initial job status:", error);
    }
  };

  // This function now calls the API submit handler directly
  const handleApplyClick = () => {
    if (!isLoggedIn) {
      // Open the APPLY-SPECIFIC login modal if not logged in
      applyLoginModalRef.current?.show();
      return;
    }

    // Check if the user is a client
    if (userRole === 'CLIENT') {
      toast.error('Only freelancers can apply.');
      return;
    }

    // If logged in and not a client, proceed with application
    handleApplySubmit();
  };
  
  // New function to handle the "Apply" API call
  const handleApplySubmit = async () => {
    if (!userId) {
        toast.error('Could not verify user. Please refresh and try again.');
        return;
    }
    
    setIsApplying(true);
    try {
        // Replace 'applications/create' with your actual endpoint for applying to a job
        const response = await makePostRequest('api/v1/applications/projects/apply', {
            projects_task_id: job.projects_task_id,
            user_id: userId,
        });

        if (response.data?.success) {
            toast.success('Application submitted successfully!');
            setIsApplied(true);
        } else {
            toast.error(response.data?.message || 'Failed to submit application.');
        }
    } catch (error: any) {
        console.error('Error submitting application:', error);
        toast.error(error.response?.data?.message || 'An error occurred while applying.');
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
    try {
      if (isSaved) {
        // TODO: Add unsave API call when available
        toast.success('Job unsaved successfully');
        setIsSaved(false);
      } else {
        const response = await makePostRequest('api/v1/saved/create', {
          projects_task_id: job.projects_task_id,
          user_id: userId,
          is_active: true,
          created_by: userId
        });

        if (response.data?.data?.saved_projects_id) {
          toast.success('Job saved successfully!');
          setIsSaved(true);
        } else {
          // Use the backend message for more specific errors
          toast.error(response.data?.message || 'Failed to save job');
        }
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    applyLoginModalRef.current?.hide();
    setIsLoggedIn(true);
    window.location.reload(); // Reload to refetch user data and status
  };

  return (
    <>
      <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
        <div className="container">
          <div className="row">
            {/* Left Side: Details */}
            <div className="col-xxl-9 col-xl-8">
              <div className="details-post-data me-xxl-5 pe-xxl-4">
                
                {/* --- BACK BUTTON ADDED HERE --- */}
                <Link href="/job-list-v1" className="btn btn-secondary btn-sm mb-20">
                  &larr; Back to Jobs
                </Link>

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

            {/* Right Side: Metadata */}
            <div className="col-xxl-3 col-xl-4">
              <div className="job-company-info ms-xl-5 ms-xxl-0 lg-mt-50">
                <div className="text-md text-dark text-center mt-15 mb-20 text-capitalize">
                  {job.project_title}
                </div>
                <div className="border-top mt-40 pt-40">
                  <ul className="job-meta-data row style-none">
                    <li className="col-6">
                      <span>Budget</span>
                      <div>${job.budget?.toLocaleString()}</div>
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
                  
                  <button 
                    className="btn-one w-100 mt-25" 
                    onClick={handleApplyClick}
                    disabled={isApplying || isApplied}
                  >
                    {isApplying ? 'Applying...' : isApplied ? '✅ Applied' : 'Apply Now'}
                  </button>

                  <button
                    className={`btn-outline w-100 mt-15 ${isSaved ? 'saved' : ''}`}
                    onClick={handleSaveJobClick}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : isSaved ? '❤️ Saved' : '🤍 Save Job'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ApplyLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default JobDetailsV1Area;