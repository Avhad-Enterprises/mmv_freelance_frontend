import React from 'react';
import Wrapper from '@/layouts/wrapper';
import CandidateDashboardMain from '@/app/components/dashboard/candidate';
import OneTimeAutoRefresh from '@/app/components/common/one-time-refresh';

const CandidateDashboardPage = () => {
  return (
    <Wrapper>
      <OneTimeAutoRefresh />
      <CandidateDashboardMain />
    </Wrapper>
  );
};

export default CandidateDashboardPage;