'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- Import the decoder
import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import JobDetailsV1Area from '@/app/components/job-details/job-details-v1-area';
import JobPortalIntro from '@/app/components/job-portal-intro/job-portal-intro';
import RelatedJobs from '@/app/components/jobs/related-jobs';
import FooterOne from '@/layouts/footers/footer-one';
import { IJobType } from '@/types/job-data-type';
import { makeGetRequest } from '@/utils/api';
import { authCookies } from '@/utils/cookies';

// Define a simple type for the decoded token payload
interface DecodedToken {
  exp: number;
}

const JobDetailsDynamicPage = ({ params }: { params: { id: string } }) => {
  const [job, setJob] = useState<IJobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Added authentication state

  // --- Effect for authentication check ---
  useEffect(() => {
    const token = authCookies.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          authCookies.removeToken();
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []); // Runs once on component mount

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
    return <p className="text-center py-5">Job not found.</p>;
  }

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Conditionally render the header */}
        <Header isAuthenticated={isAuthenticated} />

        <JobDetailsV1Area job={job} />
        <RelatedJobs category={[job.project_category || '']} />
        <JobPortalIntro />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobDetailsDynamicPage;