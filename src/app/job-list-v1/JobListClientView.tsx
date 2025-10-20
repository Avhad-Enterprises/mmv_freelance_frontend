'use client'; // This file is now explicitly a Client Component
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import JobListThree from '../components/jobs/list/job-list-three';
import JobPortalIntro from '../components/job-portal-intro/job-portal-intro';
import FooterOne from '@/layouts/footers/footer-one';

interface DecodedToken {
  exp: number;
}

const JobListClientView = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
        <Header isAuthenticated={isAuthenticated} />

        <JobListThree itemsPerPage={8} />

        <JobPortalIntro top_border={true} />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobListClientView;