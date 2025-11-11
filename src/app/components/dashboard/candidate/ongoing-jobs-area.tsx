'use client';
import React, { useEffect, useState } from 'react';
import useDecodedToken from '@/hooks/useDecodedToken';
import { useSidebar } from '@/context/SidebarContext';
import DashboardHeader from './dashboard-header-minus';
import DashboardJobDetailsArea from './dashboard-job-details-area';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '@/utils/categoryIcons';
import { authCookies } from "@/utils/cookies";

// Job Interface with submission status
interface IJob {
  projects_task_id: number;
  project_title: string;
  budget: number;
  deadline: string;
  category: string;
  projects_type: string;
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected';
  skills_required?: string[];
  project_description?: string;
  project_format?: string;
  audio_voiceover?: string;
  video_length?: number;
  preferred_video_style?: string;
  audio_description?: string;
  reference_links?: string[];
  created_at?: string;
  additional_notes?: string;
  bidding_enabled: boolean;
  // Submission tracking
  submission_status?: number | null; // 0: Submitted, 1: Approved, 2: Rejected, null: Not submitted
  submission_id?: number | null;
  submitted_files?: string;
  submission_notes?: string;
  submitted_at?: string;
}

type IProps = {};

const OngoingJobsArea = ({}: IProps) => {
  const decoded = useDecodedToken();
  const { setIsOpenSidebar } = useSidebar();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  
  // Submission Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingJob, setSubmittingJob] = useState<IJob | null>(null);
  const [submissionLinks, setSubmissionLinks] = useState<string[]>(['']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch jobs with submission status
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = authCookies.getToken();
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }
        
        // Fetch applications
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/my-applications`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.statusText}`);
        }
        const resData = await response.json();
        if (!resData?.data) {
          throw new Error(resData?.message || 'Failed to fetch applications: Data not found');
        }
        
        const statusMap: Record<number, string> = {
          0: 'Pending',
          1: 'Ongoing',
          2: 'Completed',
          3: 'Rejected',
        };
        
        // Map jobs and enrich with submission data
        const jobData: IJob[] = await Promise.all(
          (resData.data || [])
            .filter((job: any) => statusMap[job.status] === 'Ongoing')
            .map(async (job: any) => {
              // TODO: Replace with actual GET submissions API when available
              // For now, we'll check if submission exists using dummy logic
              // const submissionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${job.projects_task_id}/my-submission`, {...});
              
              // TEMPORARY: Store submission status in localStorage as workaround
              const storedSubmission = localStorage.getItem(`submission_${job.projects_task_id}`);
              let submissionData = null;
              if (storedSubmission) {
                try {
                  submissionData = JSON.parse(storedSubmission);
                } catch (e) {
                  console.error('Failed to parse stored submission:', e);
                }
              }
              
              return {
                projects_task_id: job.projects_task_id,
                project_title: job.project_title || 'Untitled Project',
                budget: job.budget || 0,
                deadline: job.deadline || '',
                category: job.project_category || 'N/A',
                projects_type: job.projects_type || 'N/A',
                skills_required: job.skills_required || [],
                status: statusMap[job.status] || 'Pending',
                project_description: job.project_description || '',
                project_format: job.project_format || '',
                audio_voiceover: job.audio_voiceover || '',
                video_length: job.video_length,
                preferred_video_style: job.preferred_video_style || '',
                audio_description: job.audio_description || '',
                reference_links: job.reference_links || [],
                created_at: job.created_at || '',
                additional_notes: job.additional_notes || '',
                bidding_enabled: job.bidding_enabled || false,
                // Submission data
                submission_status: submissionData?.submission_status ?? null,
                submission_id: submissionData?.submission_id ?? null,
                submitted_files: submissionData?.submitted_files ?? null,
                submission_notes: submissionData?.additional_notes ?? null,
                submitted_at: submissionData?.submitted_at ?? null,
              };
            })
        );
        
        setJobs(jobData);
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        setError(error.message || 'An error occurred while fetching jobs');
      } finally {
        setLoading(false);
      }
    };
    if (decoded) {
      fetchJobs();
    } else {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [decoded]);

  const handleOpenSubmitModal = (job: IJob) => {
    setSubmittingJob(job);
    setShowSubmitModal(true);
    
    // If resubmitting a rejected submission, pre-fill with previous data
    if (job.submission_status === 2 && job.submitted_files) {
      const links = job.submitted_files.split(',').map(link => link.trim());
      setSubmissionLinks(links);
      setAdditionalNotes(job.submission_notes || '');
    } else {
      setSubmissionLinks(['']);
      setAdditionalNotes('');
    }
    
    setSubmitError(null);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmittingJob(null);
    setSubmissionLinks(['']);
    setAdditionalNotes('');
    setSubmitError(null);
  };

  const handleAddLink = () => {
    setSubmissionLinks([...submissionLinks, '']);
  };

  const handleRemoveLink = (index: number) => {
    if (submissionLinks.length > 1) {
      setSubmissionLinks(submissionLinks.filter((_, i) => i !== index));
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...submissionLinks];
    newLinks[index] = value;
    setSubmissionLinks(newLinks);
  };

  const handleSubmitProject = async () => {
    if (!submittingJob || !decoded?.user_id) {
      setSubmitError('Missing required information');
      return;
    }

    // Validate at least one link
    const validLinks = submissionLinks.filter(link => link.trim() !== '');
    if (validLinks.length === 0) {
      setSubmitError('Please provide at least one submission link');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = authCookies.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Join multiple links with comma
      const submittedFiles = validLinks.join(',');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${submittingJob.projects_task_id}/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: decoded.user_id,
            submitted_files: submittedFiles,
            additional_notes: additionalNotes.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Handle "Already Submitted" error
        if (result.message?.includes('Already Submitted')) {
          throw new Error('You have already submitted this project. Please wait for client review.');
        }
        throw new Error(result.message || 'Failed to submit project');
      }

      if (result.success) {
        // Store submission data locally (temporary workaround)
        const submissionData = {
          submission_status: 0, // Pending
          submission_id: result.data.submission_id,
          submitted_files: submittedFiles,
          additional_notes: additionalNotes.trim(),
          submitted_at: result.data.created_at || new Date().toISOString(),
        };
        localStorage.setItem(`submission_${submittingJob.projects_task_id}`, JSON.stringify(submissionData));
        
        // Update jobs list
        setJobs(prev => prev.map(job => 
          job.projects_task_id === submittingJob.projects_task_id
            ? { ...job, ...submissionData }
            : job
        ));
        
        alert('✅ Project submitted successfully! Your submission is now pending client review.');
        handleCloseSubmitModal();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Error submitting project:', error);
      setSubmitError(error.message || 'An error occurred while submitting the project');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionStatusBadge = (job: IJob) => {
    if (job.submission_status === null || job.submission_status === undefined) {
      return null; // Not submitted
    }
    
    switch (job.submission_status) {
      case 0:
        return <span className="badge bg-warning text-dark ms-2">Pending Review</span>;
      case 1:
        return <span className="badge bg-success ms-2">Approved ✓</span>;
      case 2:
        return <span className="badge bg-danger ms-2">Rejected - Resubmit</span>;
      default:
        return null;
    }
  };

  const getSubmitButtonText = (job: IJob) => {
    if (job.submission_status === 2) {
      return 'Resubmit Job';
    }
    if (job.submission_status === 0) {
      return 'Submitted';
    }
    if (job.submission_status === 1) {
      return 'Approved';
    }
    return 'Submit Job';
  };

  const isSubmitButtonDisabled = (job: IJob) => {
    // Disable if already submitted and pending (status 0) or approved (status 1)
    return job.submission_status === 0 || job.submission_status === 1;
  };

  if (selectedJob) {
    return (
      <DashboardJobDetailsArea
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="main-title mb-0">Ongoing Projects</h2>
          </div>
        </div>

        <div className="job-post-item-wrapper mt-4">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : jobs.length === 0 ? (
            <div className="text-center p-5 bg-light rounded mt-4">
              <h4>No Ongoing Projects</h4>
              <p className="text-muted">
                You don't have any ongoing projects at the moment.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.projects_task_id}
                className="candidate-profile-card list-layout mb-25"
              >
                <div className="d-flex">
                  <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
                    <a
                      onClick={() => setSelectedJob(job)}
                      className="rounded-circle cursor-pointer"
                    >
                      <div
                        className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 80,
                          height: 80,
                          fontSize: '28px',
                          fontWeight: 'bold',
                          backgroundColor: getCategoryColor(job.category),
                          color: getCategoryTextColor(job.category),
                        }}
                      >
                        {getCategoryIcon(job.category)}
                      </div>
                    </a>
                  </div>
                  <div className="right-side">
                    <div className="row gx-2 align-items-center">
                      <div className="col-lg-3">
                        <div className="position-relative">
                          <h4 className="candidate-name mb-0">
                            <a
                              onClick={() => setSelectedJob(job)}
                              className="tran3s cursor-pointer"
                            >
                              {job.project_title}
                            </a>
                            {getSubmissionStatusBadge(job)}
                          </h4>
                          <ul className="cadidate-skills style-none d-flex align-items-center">
                            {job.skills_required &&
                              job.skills_required.slice(0, 2).map((s, i) => (
                                <li key={i} className="text-nowrap">
                                  {s}
                                </li>
                              ))}
                            {job.skills_required &&
                              job.skills_required.length > 2 && (
                                <li className="more">
                                  +{job.skills_required.length - 2}
                                </li>
                              )}
                          </ul>
                          {job.submission_status === 2 && (
                            <small className="text-danger fw-semibold">
                              ⚠️ Your submission was rejected. Please review and resubmit.
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Budget</span>
                          <div>₹{job.budget?.toLocaleString() ?? 0}</div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Deadline</span>
                          <div>
                            {job.deadline
                              ? new Date(job.deadline).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Type</span>
                          <div>{job.projects_type || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4">
                        <div className="d-flex justify-content-lg-end align-items-center gap-2">
                          <a
                            onClick={() => setSelectedJob(job)}
                            className="profile-btn tran3s cursor-pointer"
                          >
                            View Details
                          </a>
                          <button
                            onClick={() => handleOpenSubmitModal(job)}
                            className="btn-one"
                            style={{ 
                              fontSize: '14px', 
                              padding: '8px 16px',
                              ...(job.submission_status === 2 && {
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                color: '#ffffff'
                              }),
                              ...(job.submission_status === 0 && {
                                backgroundColor: '#6c757d',
                                borderColor: '#6c757d',
                                opacity: 0.6,
                                cursor: 'not-allowed'
                              }),
                              ...(job.submission_status === 1 && {
                                backgroundColor: '#198754',
                                borderColor: '#198754',
                                opacity: 0.6,
                                cursor: 'not-allowed'
                              })
                            }}
                            disabled={isSubmitButtonDisabled(job)}
                          >
                            {getSubmitButtonText(job)}
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
      </div>

      {/* Submit/Resubmit Project Modal */}
      {showSubmitModal && submittingJob && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {submittingJob.submission_status === 2 ? 'Resubmit Project' : 'Submit Project'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseSubmitModal}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                {submitError && (
                  <div className="alert alert-danger" role="alert">
                    {submitError}
                  </div>
                )}

                {submittingJob.submission_status === 2 && (
                  <div className="alert alert-warning" role="alert">
                    <strong>⚠️ Resubmission Required:</strong> Your previous submission was rejected by the client. 
                    Please review their feedback and make necessary changes before resubmitting.
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Submission Links <span className="text-danger">*</span>
                  </label>
                  <p className="text-muted small mb-3">
                    Provide links to your completed work (Dropbox, Google Drive, WeTransfer, etc.)
                  </p>
                  {submissionLinks.map((link, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://dropbox.com/your-file-link"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        disabled={submitting}
                      />
                      {submissionLinks.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveLink(index)}
                          disabled={submitting}
                          style={{ minWidth: '40px' }}
                        >
                          −
                        </button>
                      )}
                      {index === submissionLinks.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={handleAddLink}
                          disabled={submitting}
                          style={{ minWidth: '40px' }}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Additional Notes <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Add any notes about your submission (e.g., changes made, special considerations, etc.)"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    disabled={submitting}
                  ></textarea>
                </div>

                <div className="alert alert-info" role="alert">
                  <strong>Note:</strong> Once {submittingJob.submission_status === 2 ? 'resubmitted' : 'submitted'}, 
                  your work will be reviewed by the client. You'll be notified when they approve or request changes.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseSubmitModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-one"
                  onClick={handleSubmitProject}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : (submittingJob.submission_status === 2 ? 'Resubmit Project' : 'Submit Project')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OngoingJobsArea;