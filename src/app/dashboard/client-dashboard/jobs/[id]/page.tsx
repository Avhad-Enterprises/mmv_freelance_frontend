'use client';

import React, { useState } from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployAside from '@/app/components/dashboard/employ/aside';
import JobDetailsDashboardArea from '@/app/components/dashboard/employ/job-details-dashboard-area';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';

const JobDetailsPage = ({ params }: { params: { id: string } }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <DashboardHeader />
        <main className="dashboard-body">
          <div className="d-flex">
            <div className="main-content">
              <EmployAside />
              <JobDetailsDashboardArea job_id={params.id} />
            </div>
          </div>
        </main>
      </div>
    </Wrapper>
  );
};

export default JobDetailsPage;
