'use client'
import React, { useState } from 'react';
import CandidateAside from './aside';
import DashboardArea from './dashboard-area';

const CandidateDashboardMain = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  return (
    <div className='main-page-wrapper'>
      {/* dashboard layout with header on top */}
      <div className='dashboard-layout'>
        {/* aside start */}
        <CandidateAside />
        {/* aside end  */}

        {/* dashboard area start */}
        <DashboardArea />
        {/* dashboard area end */}
      </div>
    </div>
  );
};

export default CandidateDashboardMain;