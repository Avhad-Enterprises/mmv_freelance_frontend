'use client';
import React, { useEffect, useState } from 'react';
import { IJobType } from '@/types/job-data-type';
import { makeGetRequest } from '@/utils/api';
import JobDetailsV1Area from '@/app/components/job-details/job-details-v1-area';

const JobDetailsDashboardArea = ({ job_id }: { job_id: string }) => {
  const [job, setJob] = useState<IJobType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await makeGetRequest('api/v1/projects-tasks/listings');
        const allJobs: IJobType[] = response?.data?.data || [];

        const matchedJob = allJobs.find(
          (j) => j.projects_task_id === Number(job_id)
        );

        setJob(matchedJob || null);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [job_id]);

  if (loading) {
    return <div className="dashboard-body"><div className="text-center py-5">Loading...</div></div>;
  }

  if (!job) {
    return <div className="dashboard-body"><div className="text-center py-5">Job not found.</div></div>;
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <JobDetailsV1Area job={job} />
      </div>
    </div>
  );
};

export default JobDetailsDashboardArea;
