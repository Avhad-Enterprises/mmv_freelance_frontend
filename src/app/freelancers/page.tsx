import React from 'react';
import { Metadata } from 'next';
import CandidateClientView from './CandidateClientView';

export const metadata: Metadata = {
  title: "Candidate v1",
};

const CandidatePage = () => {
  return <CandidateClientView />;
};

export default CandidatePage;