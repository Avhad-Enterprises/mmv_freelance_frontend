"use client";
import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import DashboardHeader from "./dashboard-header-minus";
import { makeGetRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { authCookies } from "@/utils/cookies";
import Link from "next/link";

type ApplicationItem = {
  applied_projects_id: number;
  projects_task_id: number;
  project_title: string;
  projects_type: string;
  budget: number;
  project_category: string;
  deadline: string;
  status: string;
  applied_at: string;
};

// card item component
export function CardItem({
  img,
  value,
  title,
  subtitle,
}: {
  img: StaticImageData;
  value: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="col-lg-4 col-sm-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            <Image src={img} alt="icon" className="lazy-img" />
          </div>
          <div className="order-sm-0">
            <div className="value fw-500">{value}</div>
            <span>{title}</span>
            {subtitle && <div className="fs-6 text-muted mt-1">{subtitle}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// props type
type IProps = {
    // No props needed, using context
};

const DashboardArea = ({}: IProps) => {
  const decoded = useDecodedToken();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    totalApplied: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch applications and metrics
  useEffect(() => {
    const fetchData = async () => {
      if (!decoded?.user_id) {
        setLoading(false);
        return;
      }
      try {
        const token = authCookies.getToken();
        
        // Fetch applications
        const applicationsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/my-applications`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            cache: 'no-cache'
          }
        );
        
        if (applicationsRes.ok) {
          const applicationsData = await applicationsRes.json();
          const apps = applicationsData.data || [];
          setApplications(apps);
          
          // Calculate metrics
          const totalApplied = apps.length;
          const pending = apps.filter((app: ApplicationItem) => 
            String(app.status || '').toLowerCase() === 'pending' || String(app.status || '').toLowerCase() === 'applied'
          ).length;
          const accepted = apps.filter((app: ApplicationItem) => 
            String(app.status || '').toLowerCase() === 'accepted' || String(app.status || '').toLowerCase() === 'approved'
          ).length;
          const rejected = apps.filter((app: ApplicationItem) => 
            String(app.status || '').toLowerCase() === 'rejected'
          ).length;
          
          setMetrics({ totalApplied, pending, accepted, rejected });
        }

        // Fetch saved jobs count
        try {
          const savedRes = await makeGetRequest("api/v1/saved/my-saved-projects");
          setSavedJobsCount(savedRes?.data?.data?.length || 0);
        } catch (error) {
          console.error("Error fetching saved jobs:", error);
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
    if (statusLower === 'accepted' || statusLower === 'approved') return 'success';
    if (statusLower === 'rejected') return 'danger';
    if (statusLower === 'pending' || statusLower === 'applied') return 'warning';
    return 'secondary';
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <h2 className="main-title">Freelancer Dashboard</h2>

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
                title="Total Applied" 
                value={`${metrics.totalApplied}`}
              />
              <CardItem 
                img={icon_2} 
                title="Pending" 
                value={`${metrics.pending}`}
              />
              <CardItem 
                img={icon_4} 
                title="Accepted" 
                value={`${metrics.accepted}`}
              />
            </div>

            <div className="row d-flex pt-50 lg-pt-10">
              <div className="col-12">
                <div className="bg-white border-20 mt-30">
                  <div className="card-box">
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <h4 className="dash-title-three">Complete Your Profile</h4>
                        <p className="text-muted mb-0 mt-2">Enhance your profile to attract more clients and increase your chances of getting hired.</p>
                      </div>
                      <div className="col-lg-4 text-lg-end">
                        <Link 
                          href="/dashboard/freelancer-dashboard/profile" 
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

export default DashboardArea;
