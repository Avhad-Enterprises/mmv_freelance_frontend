// CandidateClientView.tsx
'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import FooterOne from '@/layouts/footers/footer-one';

// Dynamic import with loading state
const CandidateV1Area = dynamic(() => import('../components/candidate/candidate-v1-area'), {
  loading: () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
});

const CandidateClientView = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        <CandidateV1Area />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default CandidateClientView;