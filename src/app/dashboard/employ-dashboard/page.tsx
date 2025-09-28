import React from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployDashboardMain from '@/app/components/dashboard/employ';
import OneTimeAutoRefresh from '@/app/components/common/one-time-refresh';

const EmployDashboardPage = () => {
  return (
    <Wrapper>
      <OneTimeAutoRefresh />
      <EmployDashboardMain/>

    </Wrapper>
  );
};

export default EmployDashboardPage;