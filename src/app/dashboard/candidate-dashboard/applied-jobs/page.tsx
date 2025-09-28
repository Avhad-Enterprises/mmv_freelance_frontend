'use client';
import React, { useState } from 'react';
import Wrapper from "@/layouts/wrapper";
import CandidateAside from "@/app/components/dashboard/candidate/aside";
import AppliedJobsArea from "@/app/components/dashboard/candidate/applied-jobs-area";

const CandidateAppliedJobsPage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Aside Sidebar */}
        <CandidateAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />

        {/* Applied Jobs Area */}
        <AppliedJobsArea setIsOpenSidebar={setIsOpenSidebar} />
      </div>
    </Wrapper>
  );
};

export default CandidateAppliedJobsPage;
