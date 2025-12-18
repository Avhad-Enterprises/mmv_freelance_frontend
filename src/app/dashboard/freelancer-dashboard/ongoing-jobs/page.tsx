'use client';
import React from 'react';
import OngoingJobsArea from "@/app/components/dashboard/candidate/ongoing-jobs-area";

import PermissionGuard from "@/components/auth/PermissionGuard";

const CandidateOngoingJobsPage = () => {
  return (
    <PermissionGuard permission="projects.view" fallback={<div className="p-4 text-center">You do not have permission to view ongoing jobs.</div>}>
      <OngoingJobsArea />
    </PermissionGuard>
  );
};

export default CandidateOngoingJobsPage;
