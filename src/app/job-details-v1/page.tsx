import React from 'react';
import { Metadata } from 'next';
import JobDetailsClientView from './JobDetailsClientView'; // Adjust path if needed

export const metadata: Metadata = {
  title: "Job Details v1",
};

const JobDetailsV1Page = () => {
  // This parent Server Component now just renders the child Client Component
  return <JobDetailsClientView />;
};

export default JobDetailsV1Page;