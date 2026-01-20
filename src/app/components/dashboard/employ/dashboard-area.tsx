"use client";
import React, { useEffect, useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import DashboardHeader from "../candidate/dashboard-header";
import { CardItem } from "../candidate/dashboard-area";
import { makeGetRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { authCookies } from "@/utils/cookies";
import Link from "next/link";

type ProjectItem = {
  project_id: number;
  projects_task_id: number;
  project_title: string;
  projects_type: string;
  budget: number;
  project_category: string;
  deadline: string;
  status: number; // Database field is 'status', not 'project_status'
  created_at: string;
  applicants_count?: number;
};

type ProfileCompletion = {
  completed: number;
  total: number;
  percentage: number;
  completedFields: string[];
  missingFields: string[];
};

// props type 
type IProps = {
  // No props needed, using context
}

const EmployDashboardArea = ({ }: IProps) => {
  const decoded = useDecodedToken();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalApplicants: 0,
    completedProjects: 0,
  });
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchedRef = useRef(false);

  // Fetch projects and metrics
  useEffect(() => {
    const fetchData = async () => {

      // Fetch profile completion only once for authenticated users
      if (!profileFetchedRef.current && decoded) {
        try {
          const profileRes = await makeGetRequest("api/v1/users/me/profile-completion");
          if (profileRes?.data?.success) {
            setProfileCompletion(profileRes.data.data);
          }
          profileFetchedRef.current = true;
        } catch (error) {
          console.error("Error fetching profile completion:", error);
          profileFetchedRef.current = true; // Mark as fetched even on error to prevent retries
        }
      }

      // Only fetch client-specific data if user has client_id
      if (!decoded?.client_id) {
        if (!decoded?.user_id) {
          setLoading(false);
          return;
        }

        try {
          // Fetch client profile to get client_id
          const profileRes = await makeGetRequest(`api/v1/clients/profile`);

          if (profileRes?.data?.success && profileRes?.data?.data?.profile?.client_id) {
            const clientId = profileRes.data.data.profile.client_id;
            // Update decoded with client_id for future use
            decoded.client_id = clientId;
          } else {
            setLoading(false);
            return;
          }
        } catch (error) {
          setLoading(false);
          return;
        }
      }

      try {
        const token = authCookies.getToken();

        // Fetch projects for this client
        const projectsRes = await makeGetRequest(`api/v1/projects-tasks/client/${decoded.client_id}`);

        if (projectsRes?.data?.data) {
          const projectsData = projectsRes.data.data;
          setProjects(projectsData);

          // Calculate metrics based on numeric status values
          // Status: 0 = Pending/Awaiting Assignment, 1 = In Progress, 2 = Completed
          const totalProjects = projectsData.length;
          const activeProjects = projectsData.filter((p: ProjectItem) => p.status === 1).length; // In Progress
          const completedProjects = projectsData.filter((p: ProjectItem) => p.status === 2).length; // Completed

          // Get total applicants count efficiently using count endpoints
          let totalApplicants = 0;
          try {
            // Use individual project count endpoints for efficiency
            const applicantPromises = projectsData.map(async (project: ProjectItem) => {
              try {
                const countRes = await makeGetRequest(`api/v1/applications/projects/${project.projects_task_id}/application-count`);
                const count = countRes?.data?.count || 0;
                // Update project with applicant count for display
                project.applicants_count = count;
                return count;
              } catch (error) {
                project.applicants_count = 0;
                return 0;
              }
            });

            // Wait for all count requests to complete
            const applicantCounts = await Promise.all(applicantPromises);
            totalApplicants = applicantCounts.reduce((sum, count) => sum + count, 0);
          } catch (error) {
            totalApplicants = 0;
          }

          const finalMetrics = { totalProjects, activeProjects, totalApplicants, completedProjects };
          setMetrics(finalMetrics);
          setProjects([...projectsData]); // Re-render with applicant counts
        }

      } catch (error) {
        console.error("❌ [DASHBOARD] Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decoded]);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const statusLower = String(status || '').toLowerCase();
    if (statusLower === 'completed' || statusLower === 'closed') return 'success';
    if (statusLower === 'active' || statusLower === 'open') return 'primary';
    if (statusLower === 'in progress') return 'warning';
    return 'secondary';
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader />
        {/* header end */}

        <h2 className="main-title">Client Dashboard</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              <CardItem
                img={icon_1}
                title="Total Projects"
                value={`${metrics.totalProjects}`}
              />
              <CardItem
                img={icon_3}
                title="Active Projects"
                value={`${metrics.activeProjects}`}
              />
              <CardItem
                img={icon_2}
                title="Total Applicants"
                value={`${metrics.totalApplicants}`}
              />
            </div>

            <div className="row d-flex pt-50 lg-pt-10">
              <div className="col-12">
                <div className="bg-white border-20 mt-30">
                  <div className="card-box">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <h4 className="dash-title-three">Complete Your Profile</h4>
                        {profileCompletion ? (
                          <>
                            <p className="text-muted mb-2">
                              Enhance your profile to attract better freelancers and improve project success rates.
                            </p>
                            <div className="progress mb-2" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${profileCompletion.percentage}%` }}
                                aria-valuenow={profileCompletion.percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {profileCompletion.completed} of {profileCompletion.total} fields completed ({profileCompletion.percentage}%)
                            </small>
                          </>
                        ) : (
                          <p className="text-muted mb-0 mt-2">
                            Enhance your profile to attract better freelancers and improve project success rates.
                          </p>
                        )}
                      </div>
                      <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <Link
                          href="/dashboard/client-dashboard/profile"
                          className="dash-btn-two"
                        >
                          Go to My Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployDashboardArea;
