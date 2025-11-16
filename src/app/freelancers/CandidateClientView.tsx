// CandidateClientView.tsx
'use client';
import React from 'react';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import CandidateV1Area from '../components/candidate/candidate-v1-area';
import FooterOne from '@/layouts/footers/footer-one';

const CandidateClientView = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        {/* ✅ 2. Pass down the state and the handler function as props */}
        <CandidateV1Area />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default CandidateClientView;