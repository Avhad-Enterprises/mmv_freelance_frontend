'use client';
import React, { useEffect, useState } from 'react';
import useDecodedToken from '@/hooks/useDecodedToken';
import { useSidebar } from '@/context/SidebarContext';
import DashboardHeader from './dashboard-header-minus';
import DashboardJobDetailsArea from './dashboard-job-details-area';
import DashboardSearchBar from '../common/DashboardSearchBar';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '@/utils/categoryIcons';
import { authCookies } from "@/utils/cookies";
import { validateURL } from '@/utils/validation';

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

const OngoingJobsArea = ({ }: IProps) => {
  const decoded = useDecodedToken();
  const { setIsOpenSidebar } = useSidebar();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Submission Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittingJob, setSubmittingJob] = useState<IJob | null>(null);
  const [submissionLinks, setSubmissionLinks] = useState<string[]>(['']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // View Submission Modal State
  const [showViewSubmissionModal, setShowViewSubmissionModal] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<IJob | null>(null);

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

        // Application Status mapping: 0=Pending, 1=In Progress, 2=Completed, 3=Rejected
        const statusMap: Record<number, string> = {
          0: 'Pending',
          1: 'In Progress',
          2: 'Completed',
          3: 'Rejected',
        };

        // Map jobs and enrich with submission data
        const jobData: IJob[] = (resData.data || [])
          .filter((job: any) => job.status === 1) // Only "In Progress" jobs (status === 1)
          .map((job: any) => {
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
              // Submission data now comes from API!
              submission_status: job.submission_status ?? null,
              submission_id: job.submission_id ?? null,
              submitted_files: job.submitted_files ?? null,
              submission_notes: job.submission_notes ?? null,
              submitted_at: job.submitted_at ?? null,
            };
          });

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

  const handleOpenViewSubmission = (job: IJob) => {
    setViewingSubmission(job);
    setShowViewSubmissionModal(true);
  };

  const handleCloseViewSubmission = () => {
    setShowViewSubmissionModal(false);
    setViewingSubmission(null);
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

    // Clear error when user starts typing
    if (submitError && value.trim()) {
      setSubmitError(null);
    }
  };

  const handleSubmitProject = async () => {
    if (!submittingJob || !decoded?.user_id) {
      setSubmitError('Missing required information');
      return;
    }

    // Validate at least one link and check URL format
    const nonEmptyLinks = submissionLinks.filter(link => link.trim() !== '');
    if (nonEmptyLinks.length === 0) {
      setSubmitError('Please provide at least one submission link');
      return;
    }

    // Validate URL format for each link
    const invalidLinks: string[] = [];
    const validLinks: string[] = [];

    nonEmptyLinks.forEach((link, index) => {
      const validation = validateURL(link, { allowEmpty: false });
      if (!validation.isValid) {
        invalidLinks.push(`Link ${index + 1}: ${validation.error}`);
      } else {
        validLinks.push(validation.normalizedURL || link);
      }
    });

    if (invalidLinks.length > 0) {
      setSubmitError(invalidLinks.join('; '));
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
        alert('Project submitted successfully! Your submission is now pending client review.');
        handleCloseSubmitModal();

        // Refresh page to get updated data from API
        window.location.reload();
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
        return null; // Don't show badge for rejected - banner is enough
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

  // If selectedJob is set, render the details area instead of the list
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

          <DashboardSearchBar
            placeholder="Search ongoing jobs by title, category..."
            onSearch={(query) => setSearchQuery(query)}
          />
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
            jobs
              .filter((job) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return (
                  job.project_title.toLowerCase().includes(query) ||
                  job.category.toLowerCase().includes(query) ||
                  job.projects_type.toLowerCase().includes(query) ||
                  job.project_description?.toLowerCase().includes(query) ||
                  job.skills_required?.some(skill => skill.toLowerCase().includes(query))
                );
              })
              .map((job) => (
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
                      <div className="row gx-3 align-items-center mb-3">
                        <div className="col-lg-4 col-md-6 mb-2 mb-lg-0">
                          <div className="position-relative">
                            <h4 className="candidate-name mb-0">
                              <a
                                onClick={() => setSelectedJob(job)}
                                className="tran3s cursor-pointer"
                              >
                                {job.project_title
                                  ? `${job.project_title.slice(0, 30)}${job.project_title.length > 30 ? "..." : ""
                                  }`
                                  : "Untitled Project"}
                              </a>
                            </h4>
                            {getSubmissionStatusBadge(job)}
                          </div>
                        </div>
                        <div className="col-lg-8 col-md-6">
                          <div className="row gx-3">
                            <div className="col-6 col-md-3 mb-2 mb-md-0">
                              <div className="candidate-info">
                                <span>Budget</span>
                                <div>₹{job.budget?.toLocaleString() ?? 0}</div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3 mb-2 mb-md-0">
                              <div className="candidate-info">
                                <span>Deadline</span>
                                <div>
                                  {job.deadline
                                    ? new Date(job.deadline).toLocaleDateString()
                                    : 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3 mb-2 mb-md-0">
                              <div className="candidate-info">
                                <span>Status</span>
                                <div>{job.status || 'N/A'}</div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3 mb-2 mb-md-0">
                              <div className="candidate-info">
                                <span>Type</span>
                                <div>{job.projects_type || 'N/A'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <ul className="cadidate-skills style-none d-flex align-items-center flex-wrap">
                              {job.skills_required &&
                                job.skills_required.slice(0, 5).map((s, i) => (
                                  <li key={i}>
                                    {s}
                                  </li>
                                ))}
                              {job.skills_required &&
                                job.skills_required.length > 5 && (
                                  <li className="more">
                                    +{job.skills_required.length - 5}
                                  </li>
                                )}
                            </ul>
                            <div className="d-flex align-items-center gap-2">
                              <a
                                onClick={() => setSelectedJob(job)}
                                className="profile-btn tran3s ms-md-2 cursor-pointer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '40px',
                                  padding: '0 16px',
                                  lineHeight: '40px',
                                  whiteSpace: 'nowrap',
                                  minWidth: 'fit-content'
                                }}
                              >
                                View Details
                              </a>
                              {/* View Submission button - show if submission exists */}
                              {(job.submission_status === 0 || job.submission_status === 1 || job.submission_status === 2) && (
                                <button
                                  onClick={() => handleOpenViewSubmission(job)}
                                  className="profile-btn tran3s"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '40px',
                                    padding: '0 16px',
                                    lineHeight: '40px',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'fit-content',
                                    backgroundColor: '#17a2b8',
                                    borderColor: '#17a2b8',
                                    color: '#ffffff'
                                  }}
                                >
                                  View Submission
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenSubmitModal(job)}
                                className="profile-btn tran3s"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '40px',
                                  padding: '0 16px',
                                  lineHeight: '40px',
                                  whiteSpace: 'nowrap',
                                  minWidth: 'fit-content',
                                  ...(job.submission_status === 2 && {
                                    backgroundColor: '#dc3545',
                                    borderColor: '#dc3545',
                                    color: '#ffffff'
                                  }),
                                  ...(job.submission_status === 0 && {
                                    backgroundColor: '#6c757d',
                                    borderColor: '#6c757d',
                                    opacity: 0.7,
                                    cursor: 'not-allowed'
                                  }),
                                  ...(job.submission_status === 1 && {
                                    backgroundColor: '#198754',
                                    borderColor: '#198754',
                                    opacity: 0.7,
                                    cursor: 'not-allowed'
                                  })
                                }}
                                disabled={isSubmitButtonDisabled(job)}
                              >
                                {getSubmitButtonText(job)}
                              </button>
                            </div>
                          </div>

                          {/* Rejection Alert Banner */}
                          {job.submission_status === 2 && (
                            <div className="alert alert-warning mt-3 mb-0" style={{
                              padding: '12px 16px',
                              borderRadius: '8px',
                              backgroundColor: '#fff3cd',
                              border: '1px solid #ffc107'
                            }}>
                              <strong style={{ color: '#856404' }}>Submission Rejected</strong>
                              <p className="mb-0 mt-1" style={{ fontSize: '13px', color: '#856404' }}>
                                Your previous submission was rejected. Please improve your work and click "Resubmit Project" to submit again.
                              </p>
                            </div>
                          )}

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
        <div className="modal fade show d-block" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto'
        }}>
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

      {/* View Submission Modal */}
      {showViewSubmissionModal && viewingSubmission && (
        <div className="modal fade show d-block" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto'
        }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Submission</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseViewSubmission}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6 className="mb-2"><strong>Project:</strong></h6>
                  <p className="mb-0">{viewingSubmission.project_title || 'Untitled Project'}</p>
                </div>

                <div className="mb-4">
                  <h6 className="mb-2"><strong>Submission Status:</strong></h6>
                  {viewingSubmission.submission_status === 0 && (
                    <span className="badge bg-warning text-dark">Pending Review</span>
                  )}
                  {viewingSubmission.submission_status === 1 && (
                    <span className="badge bg-success">Approved ✓</span>
                  )}
                  {viewingSubmission.submission_status === 2 && (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                </div>

                <div className="mb-4">
                  <h6 className="mb-2"><strong>Submitted On:</strong></h6>
                  <p className="mb-0">
                    {viewingSubmission.submitted_at
                      ? new Date(viewingSubmission.submitted_at).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3"><strong>Submitted Files/Links:</strong></h6>
                  {viewingSubmission.submitted_files ? (
                    <div className="list-group">
                      {viewingSubmission.submitted_files.split(',').map((file, index) => (
                        <a
                          key={index}
                          href={file.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="list-group-item list-group-item-action"
                          style={{
                            wordBreak: 'break-all',
                            fontSize: '14px'
                          }}
                        >
                          <i className="bi bi-link-45deg me-2"></i>
                          {file.trim()}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No files submitted</p>
                  )}
                </div>

                {viewingSubmission.submission_notes && (
                  <div className="mb-3">
                    <h6 className="mb-2"><strong>Additional Notes:</strong></h6>
                    <div className="p-3" style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {viewingSubmission.submission_notes}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseViewSubmission}
                >
                  Close
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