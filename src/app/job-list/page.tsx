import React from 'react';
import { Metadata } from 'next';
import JobListClientView from './JobListClientView'; // Import the new client component

// This file is now a Server Component, so metadata is allowed here.
export const metadata: Metadata = {
  
};

const JobListOnePage = () => {
  // This Server Component simply renders the Client Component as a child.
  return <JobListClientView />;
};

export default JobListOnePage;