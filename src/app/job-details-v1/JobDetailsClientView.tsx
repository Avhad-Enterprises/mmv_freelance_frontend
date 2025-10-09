'use client';

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import HeaderDash from '@/layouts/headers/headerDash';
import FooterOne from '@/layouts/footers/footer-one';
import JobPortalIntro from '../components/job-portal-intro/job-portal-intro';
import JobDetailsBreadcrumb from '../components/jobs/breadcrumb/job-details-breadcrumb';
import JobDetailsV1Area from '../components/job-details/job-details-v1-area';
import job_data from '@/data/job-data';
import RelatedJobs from '../components/jobs/related-jobs';

// Define a simple type for the decoded token payload
interface DecodedToken {
  exp: number;
}

const JobDetailsClientView = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const job = job_data[0];

  useEffect(() => {
    // Check for a valid token on page load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        {isAuthenticated ? <HeaderDash /> : <Header />}
        {/* header end */}

        {/* job details breadcrumb start */}
        <JobDetailsBreadcrumb />
        {/* job details breadcrumb end */}

        {/* job details area start */}
        <JobDetailsV1Area job={job} />
        {/* job details area end */}


        {/* job portal intro start */}
        <JobPortalIntro />
        {/* job portal intro end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default JobDetailsClientView;