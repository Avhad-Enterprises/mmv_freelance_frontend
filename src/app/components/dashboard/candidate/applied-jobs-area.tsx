'use client';
import React, { useEffect, useState } from 'react';
import useDecodedToken from '@/hooks/useDecodedToken';
import { useSidebar } from '@/context/SidebarContext';
import DashboardHeader from './dashboard-header-minus';
import DashboardJobDetailsArea from './dashboard-job-details-area';
import DashboardSearchBar from '../common/DashboardSearchBar';
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '@/utils/categoryIcons';
import { authCookies } from "@/utils/cookies";
import { IJobType } from '@/types/job-data-type';

// Status Mapping for Applications (applied_projects.status)
// 0 = Pending, 1 = Approved/Ongoing, 2 = Completed, 3 = Rejected
const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: 'Pending', className: 'bg-warning' },
  1: { text: 'Ongoing', className: 'bg-info' },
  2: { text: 'Completed', className: 'bg-success' },
  3: { text: 'Rejected', className: 'bg-danger' },
};

// Job Interface - Aligned with IJobType but with string-based status for applications
interface IJob extends Omit<IJobType, 'status'> {
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected'; // Application Status
  rejection_reason?: string; // Reason for rejection (if rejected)
}

type IProps = {};

const AppliedJobsArea = ({ }: IProps) => {
  const decoded = useDecodedToken();
  const { setIsOpenSidebar } = useSidebar();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'All'
  >('All');
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        
        // Debug logging
        console.log('=== FREELANCER: Fetched Applications ===');
        console.log('Raw API Response:', resData);
        console.log('First application (if exists):', resData.data?.[0]);
        console.log('======================================');
        
        if (!resData?.data) {
          throw new Error(resData?.message || 'Failed to fetch applications: Data not found');
        }
        const jobData: IJob[] = (resData.data || []).map((job: any) => {
          // Debug logging for each job
          console.log(`Job: ${job.project_title}, Raw Status: ${job.status} (type: ${typeof job.status}), Mapped: ${statusMap[job.status]?.text}`);
          
          return {
            projects_task_id: job.projects_task_id,
            project_title: job.project_title || 'Untitled Project',
            budget: job.budget || 0,
            deadline: job.deadline || '',
            category: job.project_category || 'N/A',
            projects_type: job.projects_type || 'N/A',
            skills_required: job.skills_required || [],
            status: statusMap[job.status]?.text || 'Pending',
            rejection_reason: job.rejection_reason || null, // Add rejection reason
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
            // Client info
            client_user_id: job.client_user_id,
            client_first_name: job.client_first_name,
            client_last_name: job.client_last_name,
            client_profile_picture: job.client_profile_picture,
            client_company_name: job.client_company_name,
          };
        });
        setJobs(jobData);
        setFilteredJobs(jobData);
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

  const handleStatusFilter = (
    status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'All'
  ) => {
    setSelectedStatus(status);
    applyFilters(status, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(selectedStatus, query);
  };

  const applyFilters = (
    status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'All',
    query: string
  ) => {
    let filtered = jobs;

    // Apply status filter
    if (status !== 'All') {
      filtered = filtered.filter((job) => job.status === status);
    }

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((job) =>
        job.project_title?.toLowerCase().includes(lowerQuery) ||
        job.category?.toLowerCase().includes(lowerQuery) ||
        job.projects_type?.toLowerCase().includes(lowerQuery) ||
        job.project_description?.toLowerCase().includes(lowerQuery) ||
        job.skills_required?.some(skill => skill.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredJobs(filtered);
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
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="main-title mb-0">Applied Jobs</h2>
        </div>

        <DashboardSearchBar
          placeholder="Search applied jobs by title, category, skills..."
          onSearch={handleSearch}
        />

        {/* Improved Filter Section */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-2">Filter by Application Status:</label>
          <div className="d-flex flex-wrap gap-2">
            {['All', 'Pending', 'Ongoing', 'Completed'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn-one ${selectedStatus === status ? 'active' : ''}`}
                style={{ minWidth: '100px' }}
                onClick={() => handleStatusFilter(status as any)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="job-post-item-wrapper mt-4">
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center p-5 bg-light rounded mt-4">
            <h4>No Applied Jobs Found</h4>
            <p className="text-muted">
              You have no applications with the status: '{selectedStatus}'
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const statusInfo =
              Object.values(statusMap).find((s) => s.text === job.status) || {
                className: 'bg-secondary',
              };
            return (
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
                    <div className="row gx-2 align-items-center mb-2">
                      <div className="col-lg-4">
                        <div className="position-relative">
                          <h4 className="candidate-name mb-0">
                            <a
                              onClick={() => setSelectedJob(job)}
                              className="tran3s cursor-pointer"
                            >
                              {job.project_title}
                            </a>
                          </h4>
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
                          <span>Type</span>
                          <div>{job.projects_type || 'N/A'}</div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-6">
                        <div className="candidate-info">
                          <span>Application Status</span>
                          <div>
                            <span className={`fw-bold ${statusInfo.className.replace('bg-', 'text-')}`}>
                              {job.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-4">
                        <div className="d-flex justify-content-lg-end align-items-center">
                          <a
                            onClick={() => setSelectedJob(job)}
                            className="profile-btn tran3s ms-md-2 cursor-pointer"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rejection Reason Display */}
                    {job.status === 'Rejected' && job.rejection_reason && (
                      <div className="row mt-2">
                        <div className="col-12">
                          <div className="candidate-info">
                            <span className="text-danger">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              Rejection Reason
                            </span>
                            <div 
                              className="text-muted"
                              style={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: '14px',
                                lineHeight: '1.5'
                              }}
                            >
                              {job.rejection_reason}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="row">
                      <div className="col-12">
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

export default AppliedJobsArea;