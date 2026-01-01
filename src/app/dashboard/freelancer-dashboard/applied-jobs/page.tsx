'use client';
import React from 'react';
import AppliedJobsArea from "@/app/components/dashboard/candidate/applied-jobs-area";
import PermissionGuard from "@/components/auth/PermissionGuard";

const CandidateAppliedJobsPage = () => {
  return (
    <PermissionGuard permission="projects.apply" fallback={<div className="p-4 text-center">You do not have permission to view applied projects.</div>}>
      <AppliedJobsArea />
    </PermissionGuard>
  );
};

export default CandidateAppliedJobsPage;
