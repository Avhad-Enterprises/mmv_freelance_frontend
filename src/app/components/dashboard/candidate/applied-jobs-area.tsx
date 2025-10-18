'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, CalendarCheck, CashCoin, Tag } from 'react-bootstrap-icons';
import useDecodedToken from '@/hooks/useDecodedToken';

// Status Mapping - FIXED to match API values
const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: 'Pending', className: 'text-bg-warning' },
  1: { text: 'Ongoing', className: 'text-bg-info' },
  2: { text: 'Completed', className: 'text-bg-success' },
  3: { text: 'Rejected', className: 'text-bg-danger' },
};

// Job Interface
interface IJob {
  projects_task_id: number;
  project_title: string;
  budget: number;
  deadline: string;
  project_category: string;
  projects_type: string;
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected';
}

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppliedJobsArea = ({ setIsOpenSidebar }: IProps) => {
  const decoded = useDecodedToken();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'All'>('All');
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          return;
        }
        const response = await fetch('https://api.makemyvid.io/api/v1/applications/my-applications', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.statusText}`);
        }
        const resData = await response.json();
        if (!resData?.data) {
          throw new Error(resData?.message || 'Failed to fetch applications: Data not found');
        }
        const jobData: IJob[] = (resData.data || []).map((job: any) => ({
          projects_task_id: job.projects_task_id,
          project_title: job.project_title || 'Untitled Project',
          budget: job.budget || 0,
          deadline: job.deadline || '',
          project_category: job.project_category || 'N/A',
          projects_type: job.projects_type || 'N/A',
          status: statusMap[job.status]?.text || 'Pending',
        }));
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

  const handleStatusFilter = (status: 'Pending' | 'Ongoing' | 'Completed' | 'Rejected' | 'All') => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === status));
    }
  };


  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <button
            type="button"
            className="dash-mobile-nav-toggler d-block d-md-none me-auto"
            onClick={() => setIsOpenSidebar(true)}
          >
            <span></span>
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="main-title mb-0">Applied Jobs</h2>
          <div className="btn-group" role="group" aria-label="Status Filter">
            {['All', 'Pending', 'Ongoing', 'Completed', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn-one w-100 mt-25 ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => handleStatusFilter(status as any)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center p-5 bg-light rounded">
            <h4>No Applied Jobs Found</h4>
            <p className="text-muted">Your applications will appear here once you apply for a job.</p>
          </div>
        ) : (
          <div className="row">
            {filteredJobs.map((job) => {
              const statusInfo = Object.values(statusMap).find(s => s.text === job.status) || statusMap[0];
              return (
                <div key={job.projects_task_id} className="col-12 mb-4">
                  <div className="card job-card-custom h-100">
                    <div className="card-body p-4">
                      {/* -- Card Header -- */}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title fw-bold mb-0">{job.project_title}</h5>
                        
                        <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                          <span className={`badge rounded-pill status-badge ${statusInfo.className}`}>
                            {job.status}
                          </span>
                          <Link
                            href={`/job-details-v1/${job.projects_task_id}`}
                            className="btn btn-sm btn-one-green"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* -- Card Details Grid -- */}
                      <div className="row g-3 text-muted card-details-grid">
                        <div className="col-md-6 col-lg-3">
                          <div className="detail-item">
                            <CashCoin size={18} />
                            <div>
                              <small>Budget</small>
                              <p className="mb-0 fw-500 text-dark">₹{job.budget.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="detail-item">
                            <Tag size={18} />
                            <div>
                              <small>Category</small>
                              <p className="mb-0 fw-500 text-dark">{job.project_category}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="detail-item">
                            <Briefcase size={18} />
                            <div>
                              <small>Type</small>
                              <p className="mb-0 fw-500 text-dark">{job.projects_type}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                          <div className="detail-item">
                            <CalendarCheck size={18} />
                            <div>
                              <small>Deadline</small>
                              <p className="mb-0 fw-500 text-dark">
                                {new Date(job.deadline).toLocaleDateString('en-GB')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .job-card-custom {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
          border: 1px solid #e9ecef;
          background-color: #fff;
        }

        .job-card-custom:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          border-color: #244034;
        }

        .card-details-grid .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .card-details-grid .detail-item svg {
          flex-shrink: 0;
          color: #31795A;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          padding: 0.35em 0.65em;
        }

        .status-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: currentColor;
        }
        
        .btn-one-green {
          background-color: #244034;
          border-color: #244034;
          color: #fff;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .btn-one-green:hover {
          background-color: #31795A;
          border-color: #31795A;
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default AppliedJobsArea;