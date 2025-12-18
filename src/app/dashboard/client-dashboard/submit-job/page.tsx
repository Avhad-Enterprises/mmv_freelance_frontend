'use client'
import React from "react";
import EmployJobArea from "@/app/components/dashboard/employ/job-area";
import PermissionGuard from "@/components/auth/PermissionGuard";

const EmployDashboardSubmitJobPage = () => {
  return (
    <PermissionGuard permission="projects.create" fallback={<div className="p-4 text-center">You do not have permission to post jobs.</div>}>
      <EmployJobArea startInPostMode={true} />
    </PermissionGuard>
  );
};

export default EmployDashboardSubmitJobPage;
