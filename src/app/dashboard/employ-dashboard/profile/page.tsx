'use client'
import React, { useState } from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployAside from '@/app/components/dashboard/employ/aside';
import EmployProfileArea from '@/app/components/dashboard/employ/profile-area';
import Header from '@/layouts/headers/headerDash';

const EmployDashboardProfilePage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <Header />

      <div className='main-page-wrapper'>
        {/* aside start */}
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar} />
        {/* aside end  */}

        {/* profile area start */}
        <EmployProfileArea setIsOpenSidebar={setIsOpenSidebar} />
        {/* profile area end */}
      </div>
    </Wrapper>
  );
};

export default EmployDashboardProfilePage;