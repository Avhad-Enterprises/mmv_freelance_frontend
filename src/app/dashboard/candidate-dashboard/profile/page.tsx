'use client'
import React,{useState} from 'react';
import Wrapper from '@/layouts/wrapper';
import CandidateAside from '@/app/components/dashboard/candidate/aside';
import DashboardProfileArea from '@/app/components/dashboard/candidate/dashboard-profile-area';
import Header from '@/layouts/headers/headerDash';

const CandidateProfilePage = () => {
  const [isOpenSidebar,setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <Header />

    <div className='main-page-wrapper'>
      {/* aside start */}
      <CandidateAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar}/>
      {/* aside end  */}

      {/* profile area start */}
      <DashboardProfileArea setIsOpenSidebar={setIsOpenSidebar}/>
      {/* profile area end */}
    </div>
    </Wrapper>
  );
};

export default CandidateProfilePage;