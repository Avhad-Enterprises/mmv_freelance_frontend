import React from "react";
import EmployAside from "@/app/components/dashboard/employ/aside";
import CompletedProjectsArea from "@/app/components/dashboard/employ/completed-projects-area";

const CompletedProjectsPage = () => {
  return (
    <div className='dashboard-wrapper'>
        <EmployAside />
        <CompletedProjectsArea />
    </div>
  );
};

export default CompletedProjectsPage;
