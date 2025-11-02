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
  const [isCheckingApplication, setIsCheckingApplication] = useState(true);
  
  // Ref to prevent duplicate useEffect runs
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('=== JobDetailsV1Area useEffect triggered ===');
    console.log('Job ID:', job?.projects_task_id);
    console.log('Job object reference:', job);
    console.log('Has initialized:', hasInitialized.current);
    
    // Prevent duplicate initialization in development mode
    if (hasInitialized.current) {
      console.log('Skipping duplicate initialization');
      return;
    }
    
    const token = authCookies.getToken();
    setIsLoggedIn(!!token);
    console.log('User logged in:', !!token);
    
    // Reset states when job changes
    setIsApplied(false);
    setApplicationId(null);
    setIsCheckingApplication(true);
    hasInitialized.current = false; // Reset initialization flag for new job
    console.log('States reset: isApplied=false, applicationId=null, isCheckingApplication=true, hasInitialized=false');

    const initialize = async () => {
      if (token) {
        await fetchUserIdAndInitialState();
      } else {
        setIsCheckingApplication(false);
        console.log('No token, user not logged in');
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
      console.log('No job or projects_task_id undefined:', job);
      setIsCheckingApplication(false);
      return;
    }
    
    console.log('Checking application status for job:', job.projects_task_id, 'user:', currentUserId);
    
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
      
      console.log('Applied response:', appliedRes.data); // Debug log
      
      if (appliedRes.data?.success && appliedRes.data?.data) {
        let application = null;
        
        // Handle both single object and array responses
        if (Array.isArray(appliedRes.data.data)) {
          console.log('API returned array, checking first item');
          application = appliedRes.data.data.length > 0 ? appliedRes.data.data[0] : null;
        } else {
          console.log('API returned single object');
          application = appliedRes.data.data;
        }
        
        console.log('Application object:', application);
        
        if (application && application.applied_projects_id && application.projects_task_id === job.projects_task_id) {
          setIsApplied(true);
          setApplicationId(application.applied_projects_id);
          console.log('User has applied to this project, application ID:', application.applied_projects_id);
        } else {
          console.log('No valid application found for this project');
          setIsApplied(false);
          setApplicationId(null);
        }
      } else {
        setIsApplied(false);
        setApplicationId(null);
        console.log('User has not applied or API returned no data');
      }

    } catch (error: any) {
      console.log('Error response:', error.response); // Debug log
      // If 404 or no application found, user hasn't applied
      if (error.response?.status === 404) {
        setIsApplied(false);
        setApplicationId(null);
        console.log('404 error - user has not applied');
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
    console.log('=== handleApplyClick called ===');
    console.log('isApplied:', isApplied, 'applicationId:', applicationId);
    console.log('isApplying:', isApplying, 'userRole:', userRole);
    
    if (!isLoggedIn) {
      console.log('User not logged in, showing modal');
      applyLoginModalRef.current?.show();
      return;
    }

    if (userRole === 'CLIENT') {
      console.log('User is client, showing error');
      toast.error('Only freelancers can apply.');
      return;
    }

    if (isApplied && applicationId) {
      console.log('User has applied, withdrawing application');
      handleWithdrawApplication();
    } else {
      console.log('User has not applied, submitting application');
      handleApplySubmit();
    }
  };
  
  const handleApplySubmit = async () => {
    if (!userId) {
        toast.error('Could not verify user. Please refresh and try again.');
        return;
    }
    
    if (isApplying) {
      console.log('Already applying, skipping duplicate call');
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

    if (isApplying) {
      console.log('Already withdrawing, skipping duplicate call');
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
          toast.success('Job unsaved successfully');
          setIsSaved(false);
        } else {
          toast.error(response.data?.message || 'Failed to unsave job');
        }
      } else {
        const response = await api.post('api/v1/saved/save-project', payload);

        if (response.data?.data?.saved_projects_id) {
          toast.success('Job saved successfully!');
          setIsSaved(true);
        } else {
          toast.error(response.data?.message || 'Failed to save job');
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
      <section className="job-details pt-100 lg-pt-80 pb-130 lg-pb-80">
        <div className="container">
          <div className="row">
            {/* Left Side: Details */}
            <div className="col-xxl-9 col-xl-8">
              <div className="details-post-data me-xxl-5 pe-xxl-4">
                
                <Link href="/job-list" className="btn-two mb-20">
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
                    disabled={isApplying || userRole === 'CLIENT' || isCheckingApplication}
                  >
                    {isCheckingApplication ? 'Checking...' : 
                     isApplying ? (isApplied ? 'Withdrawing...' : 'Applying...') : 
                     isApplied ? <>✅ Applied<br/>Click To Withdraw</> : 'Apply Now'}
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