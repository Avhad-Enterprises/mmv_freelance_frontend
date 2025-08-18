"use client";
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import EmployAside from '@/app/components/dashboard/employ/aside';
import { makePostRequest, makePatchRequest } from '@/utils/api';
import { RxCross1 } from "react-icons/rx";
import { FaArrowLeft, FaCheck, FaQuestion } from "react-icons/fa";
import Link from 'next/link';

type Props = {
    params: { projectsTaskId: string };
   // setIsOpenSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

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

const ApplicationDetailsPage = ({ params }: Props) => {
    const { projectsTaskId } = params;

    const [applications, setApplications] = useState<Application[]>([]);
    const [isOpenSidebar, setIsOpenSidebarState] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // ✅ ✅ ✅ Move THIS to the top-level, NOT inside useEffect:
    const updateApplicationStatus = async (applicationId: number, newStatus: number) => {
        try {
            const payload = {
                applied_projects_id: applicationId,
                status: newStatus,
            };

            const response = await makePatchRequest(
                "applications/update-status",
                payload
            );

            console.log("Status update response:", response);

            setApplications((prev) =>
                prev.map((app) =>
                    app.applied_projects_id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            if (!projectsTaskId || isNaN(Number(projectsTaskId))) {
                setError('Invalid Project Task ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await makePostRequest(
                    'applications/projects/get-applications',
                    { projects_task_id: Number(projectsTaskId) }
                );
                const fetchedApplications = response.data?.data || [];
                setApplications(fetchedApplications);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
                setError('Failed to load applications. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [projectsTaskId]);

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <EmployAside isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebarState} />
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebarState} />
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
                <div className="bg-white card-box border-20">
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
                                            {app.status === 0 && (
                                                <div className="position-absolute top-50 start-50 translate-middle d-flex gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-success me-2"
                                                        onClick={() => updateApplicationStatus(app.applied_projects_id, 1)}
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary me-2"
                                                        onClick={() => updateApplicationStatus(app.applied_projects_id, 0)}
                                                    >
                                                        <FaQuestion />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger me-2"
                                                        onClick={() => updateApplicationStatus(app.applied_projects_id, 2)}
                                                    >
                                                        <RxCross1 />
                                                    </button>
                                                </div>
                                            )}

                                            {app.status === 1 && <span className="text-success">Accepted</span>}
                                            {app.status === 2 && <span className="text-danger">Rejected</span>}
                                            {app.status === 0 && <span className="text-secondary">Pending Review</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsPage;