'use client'
import React,{useState} from 'react';
import Wrapper from '@/layouts/wrapper';
import CandidateAside from '@/app/components/dashboard/candidate/aside';
import DashboardResume from '@/app/components/dashboard/candidate/dashboard-resume';

const CandidateDashboardResumePage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>

    <div className='main-page-wrapper'>
      {/* aside start */}
      <CandidateAside />
      {/* aside end  */}

      {/* Resume area start */}
      <DashboardResume />
      {/* Resume area end */}
    </div>
    </Wrapper>
  );
};

export default CandidateDashboardResumePage;