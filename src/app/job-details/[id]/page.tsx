'use client';

import React, { useEffect, useState } from 'react';
import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import JobDetailsV1Area from '@/app/components/job-details/job-details-v1-area';
import JobPortalIntro from '@/app/components/job-portal-intro/job-portal-intro';
import RelatedJobs from '@/app/components/jobs/related-jobs';
import FooterOne from '@/layouts/footers/footer-one';
import { IJobType } from '@/types/job-data-type';
import { makeGetRequest } from '@/utils/api';

const JobDetailsDynamicPage = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<IJobType | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Effect for fetching job data ---
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await makeGetRequest('api/v1/projects-tasks/listings');
        const allJobs: IJobType[] = response?.data?.data || [];
        const matchedJob = allJobs.find(
          (j) => j.projects_task_id === Number(params.id)
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
  }, [params.id]);

  if (loading) {
    return <p className="text-center py-5">Loading...</p>;
  }

  if (!job) {
    return <p className="text-center py-5">Project not found.</p>;
  }

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Conditionally render the header */}
        <Header />

        <JobDetailsV1Area job={job} />
        <RelatedJobs category={[job.project_category || '']} />
        <JobPortalIntro />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobDetailsDynamicPage;