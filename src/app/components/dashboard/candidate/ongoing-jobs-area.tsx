'use client';
import React, { useEffect, useState } from 'react';
import useDecodedToken from '@/hooks/useDecodedToken';
import { useSidebar } from '@/context/SidebarContext';
import DashboardHeader from './dashboard-header-minus';
import DashboardJobDetailsArea from './dashboard-job-details-area';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '@/utils/categoryIcons';
import { authCookies } from "@/utils/cookies";

// Job Interface
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
  const [submittingJobId, setSubmittingJobId] = useState<number | null>(null);
  const [submissionLinks, setSubmissionLinks] = useState<string[]>(['']);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        
        const jobData: IJob[] = (resData.data || [])
          .map((job: any) => ({
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
          }))
          .filter((job: IJob) => job.status === 'Ongoing'); // Only show Ongoing projects
        
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

  const handleOpenSubmitModal = (jobId: number) => {
    setSubmittingJobId(jobId);
    setShowSubmitModal(true);
    setSubmissionLinks(['']);
    setAdditionalNotes('');
    setSubmitError(null);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmittingJobId(null);
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
    if (!submittingJobId || !decoded?.user_id) {
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

      // Join multiple links with comma (or use JSON based on backend preference)
      const submittedFiles = validLinks.join(',');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${submittingJobId}/submit`,
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
        throw new Error(result.message || 'Failed to submit project');
      }

      if (result.success) {
        // Success! Close modal and refresh jobs
        alert('Project submitted successfully! Your submission is now pending client review.');
        handleCloseSubmitModal();
        
        // Refresh the jobs list
        const jobsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/my-applications`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (jobsResponse.ok) {
          const resData = await jobsResponse.json();
          const statusMap: Record<number, string> = {
            0: 'Pending',
            1: 'Ongoing',
            2: 'Completed',
            3: 'Rejected',
          };
          
          const jobData: IJob[] = (resData.data || [])
            .map((job: any) => ({
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
            }))
            .filter((job: IJob) => job.status === 'Ongoing');
          
          setJobs(jobData);
        }
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
                            onClick={() => handleOpenSubmitModal(job.projects_task_id)}
                            className="btn-one"
                            style={{ fontSize: '14px', padding: '8px 16px' }}
                          >
                            Submit Job
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

      {/* Submit Project Modal */}
      {showSubmitModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Project</h5>
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

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Submission Links <span className="text-danger">*</span>
                  </label>
                  <p className="text-muted small mb-3">
                    Provide links to your completed work (Dropbox, Google Drive, etc.)
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
                  <strong>Note:</strong> Once submitted, your work will be reviewed by the client. 
                  You'll be notified when they approve or request changes.
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
                  {submitting ? 'Submitting...' : 'Submit Project'}
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