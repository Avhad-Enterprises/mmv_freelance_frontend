'use client';
import React, { useEffect, useState } from 'react';
import useDecodedToken from '@/hooks/useDecodedToken';
import { makePostRequest } from '@/utils/api';

// Status Mapping
const statusMap: Record<number, 'Pending' | 'Accepted' | 'Rejected'> = {
  0: 'Pending',
  1: 'Accepted',
  2: 'Rejected',
};

// Job Interface with string status
interface IJob {
  projects_task_id: number;
  project_title: string;
  budget: number;
  deadline: string;
  project_category: string;
  projects_type: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppliedJobsArea = ({ setIsOpenSidebar }: IProps) => {
  const decoded = useDecodedToken();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'Pending' | 'Accepted' | 'Rejected' | 'All'>('All');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!decoded?.user_id) return;

      try {
        const res = await makePostRequest('applications/my-applications', {
          user_id: decoded.user_id,
        });

        const jobData: IJob[] = (res?.data?.data || []).map((job: any) => ({
          ...job,
          status: statusMap[job.status as number] || 'Pending',
        }));

        setJobs(jobData);
        setFilteredJobs(jobData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [decoded]);

  // Filter by status
  const handleStatusFilter = (status: 'Pending' | 'Accepted' | 'Rejected' | 'All') => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === status));
    }
  };

  return (
    <div className="dashboard-body">
      {/* Sidebar Toggle for Mobile */}
      <div className="position-relative">
        <button
          type="button"
          className="dash-mobile-nav-toggler d-block d-md-none me-auto"
          onClick={() => setIsOpenSidebar(true)}
        >
          <span></span>
        </button>
      </div>

      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="main-title mb-0">Applied Jobs</h2>

        {/* Filter Buttons (Right Side) */}
        <div className="btn-group" role="group" aria-label="Status Filter">
          <button
            type="button"
            className={`btn-one w-100 mt-25 ${selectedStatus === 'All' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('All')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn-one w-100 mt-25 ${selectedStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('Pending')}
          >
            Pending
          </button>
          <button
            type="button"
            className={`btn-one w-100 mt-25 ${selectedStatus === 'Accepted' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('Accepted')}
          >
            Accepted
          </button>
          <button
            type="button"
            className={`btn-one w-100 mt-25 ${selectedStatus === 'Rejected' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('Rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Job Listings */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No applied jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div key={job.projects_task_id} className="job-list-one mb-3 p-3 border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{job.project_title}</h5>
              <span className={`badge
                ${job.status === 'Pending' ? 'bg-warning text-dark' : ''}
                ${job.status === 'Accepted' ? 'bg-success' : ''}
                ${job.status === 'Rejected' ? 'bg-danger' : ''}
              `}>
                {job.status}
              </span>
            </div>
            <p>Category: {job.project_category}</p>
            <p>Type: {job.projects_type}</p>
            <p>Budget: ₹{job.budget}</p>
            <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AppliedJobsArea;
