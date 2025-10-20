'use client'
import React, { useState } from 'react';
import EmployAside from './aside';
import EmployDashboardArea from './dashboard-area';
import Header from "@/layouts/headers/headerDash"; // <-- IMPORT the header here


const EmployDashboardMain = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  return (
    <div className='main-page-wrapper'>
      {/* aside start */}
     <EmployAside />
      {/* aside end */}

      {/* dashboard area start */}
      <EmployDashboardArea />
      {/* dashboard area end */}
    </div>
  );
};

export default EmployDashboardMain;
