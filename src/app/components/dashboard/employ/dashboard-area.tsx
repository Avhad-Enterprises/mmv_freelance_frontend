"use client";
import React, { useEffect, useState } from "react";
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
  project_status: string;
  created_at: string;
  applicants_count?: number;
};

// props type 
type IProps = {
    // No props needed, using context
}

const EmployDashboardArea = ({}: IProps) => {
  const decoded = useDecodedToken();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalApplicants: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch projects and metrics
  useEffect(() => {
    const fetchData = async () => {
      if (!decoded?.client_id) {
        setLoading(false);
        return;
      }
      try {
        const token = authCookies.getToken();
        
        // Fetch projects for this client
        const projectsRes = await makeGetRequest(`api/v1/projects-tasks/client/${decoded.client_id}`);
        
        if (projectsRes?.data?.data) {
          const projectsData = projectsRes.data.data;
          setProjects(projectsData);
          
          // Calculate metrics
          const totalProjects = projectsData.length;
          const activeProjects = projectsData.filter((p: ProjectItem) => 
            String(p.project_status || '').toLowerCase() === 'active' || 
            String(p.project_status || '').toLowerCase() === 'open' ||
            String(p.project_status || '').toLowerCase() === 'in progress'
          ).length;
          const completedProjects = projectsData.filter((p: ProjectItem) => 
            String(p.project_status || '').toLowerCase() === 'completed' || 
            String(p.project_status || '').toLowerCase() === 'closed'
          ).length;
          
          // Calculate total applicants across all projects
          let totalApplicants = 0;
          for (const project of projectsData) {
            try {
              const applicantsRes = await makeGetRequest(
                `api/v1/applications/projects/${project.project_id}/applications`
              );
              const applicantCount = applicantsRes?.data?.data?.length || 0;
              totalApplicants += applicantCount;
              
              // Update project with applicant count
              project.applicants_count = applicantCount;
            } catch (error) {
              console.error(`Error fetching applicants for project ${project.project_id}:`, error);
              project.applicants_count = 0;
            }
          }
          
          setMetrics({ totalProjects, activeProjects, totalApplicants, completedProjects });
          setProjects([...projectsData]); // Re-render with applicant counts
        }

      } catch (error) {
        console.error("Error fetching data:", error);
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
                        <p className="text-muted mb-0 mt-2">Enhance your profile to attract better freelancers and improve project success rates.</p>
                      </div>
                      <div className="col-lg-4 text-lg-end">
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
