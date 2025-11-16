'use client'; // This file is now explicitly a Client Component
import React from 'react';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import JobListThree from '../components/jobs/list/job-list-three';
import FooterOne from '@/layouts/footers/footer-one';

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