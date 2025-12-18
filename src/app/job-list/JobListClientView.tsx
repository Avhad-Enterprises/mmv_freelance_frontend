'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import FooterOne from '@/layouts/footers/footer-one';

// Dynamic imports for better performance
const JobListThree = dynamic(() => import('../components/jobs/list/job-list-three'), {
  loading: () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading jobs...</span>
      </div>
    </div>
  )
});
const JobListClientView = () => {

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        <JobListThree itemsPerPage={8} />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobListClientView;