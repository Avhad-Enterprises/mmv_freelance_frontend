'use client';
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";
import EmployAside from "@/app/components/dashboard/employ/aside";
import { makePostRequest, makePatchRequest } from "@/utils/api";
import { RxCross1 } from "react-icons/rx";
import { FaArrowLeft, FaCheck, FaQuestion } from "react-icons/fa";
import Link from "next/link";

type Application = {
  applied_projects_id: number;
  projects_task_id: number;
  user_id: number;
  status: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  skill: string[];
  experience: {
    years: number;
    companies: string[];
  };
};

export default function ApplicationDetailsPage({
  params,
}: {
  params: { projectsTaskId: string };
}) {
  const { projectsTaskId } = params;
  const [applications, setApplications] = useState<Application[]>([]);
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Update application status
  const updateApplicationStatus = async (applicationId: number, newStatus: number) => {
    try {
      await makePatchRequest("applications/update-status", { applied_projects_id: applicationId, status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          app.applied_projects_id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!projectsTaskId || isNaN(Number(projectsTaskId))) {
        setError("Invalid Project Task ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await makePostRequest("applications/projects/get-applications", { projects_task_id: Number(projectsTaskId) });
        const fetchedApplications = response.data?.data || [];
        setApplications(fetchedApplications);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [projectsTaskId]);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* Sidebar */}
        <EmployAside
        isOpenSidebar={isOpenSidebar}
        setIsOpenSidebar={setIsOpenSidebar}
      />
        {/* Header */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        {/* Page Title & Back Button */}
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <div className="d-flex align-items-center gap-2">
            <Link href="/dashboard/employ-dashboard/jobs">
              <button type="button" className="btn btn-light p-2 d-flex align-items-center">
                <FaArrowLeft />
              </button>
            </Link>
            <h2 className="main-title m0">Applications</h2>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white card-box border-20">
          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table job-alert-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.applied_projects_id}>
                      <td>{app.first_name} {app.last_name}</td>
                      <td>{app.experience?.years} years</td>
                      <td>{app.skill?.join(", ")}</td>
                      <td style={{ position: "relative" }}>
                        {app.status === 0 ? (
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() => updateApplicationStatus(app.applied_projects_id, 1)}
                            ><FaCheck /></button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => updateApplicationStatus(app.applied_projects_id, 0)}
                            ><FaQuestion /></button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => updateApplicationStatus(app.applied_projects_id, 2)}
                            ><RxCross1 /></button>
                          </div>
                        ) : app.status === 1 ? (
                          <span className="text-success">Accepted</span>
                        ) : (
                          <span className="text-danger">Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
