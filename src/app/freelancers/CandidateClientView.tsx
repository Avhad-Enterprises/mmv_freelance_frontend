// CandidateClientView.tsx
'use client';
import React, { Suspense } from 'react';
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
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <CandidateV1Area />
        </Suspense>

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default CandidateClientView;