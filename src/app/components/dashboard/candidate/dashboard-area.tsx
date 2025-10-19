"use client";
import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import icon_4 from "@/assets/dashboard/images/icon/icon_15.svg";
import main_graph from "@/assets/dashboard/images/main-graph.png";
// import DashboardHeader from "./dashboard-header";
import {
  makePostRequest,
  makeGetRequest,
  makeDeleteRequest,

} from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";

type JobItem = {
  applied_projects_id: number;
  projects_task_id: number;
  project_title: string;
  projects_type: string;
  Budget: number;
  project_category: string;
  Deadline: string;
  tags: string[];
};

// card item component
export function CardItem({
  img,
  value,
  title,
}: {
  img: StaticImageData;
  value: string;
  title: string;
}) {
  return (
    <div className="col-lg-3 col-6">
      <div className="dash-card-one bg-white border-30 position-relative mb-15">
        <div className="d-sm-flex align-items-center justify-content-between">
          <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
            <Image src={img} alt="icon" className="lazy-img" />
          </div>
          <div className="order-sm-0">
            <div className="value fw-500">{value}</div>
            <span>{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardArea = ({ setIsOpenSidebar }: IProps) => {
  const decoded = useDecodedToken();
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [appliedCount, setAppliedCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch job list
  useEffect(() => {
    const fetchJobs = async () => {
      if (!decoded?.user_id) {
        setLoading(false);
        return;
      }
      try {
        const res = await makePostRequest("api/v1/users/get_user_by_id", {
          user_id: decoded.user_id,
        });
        setJobItems(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [decoded]);

  // Fetch applied project count
  useEffect(() => {
    const fetchCount = async () => {
      if (!decoded?.user_id) return;
      try {
        const res = await makePostRequest("api/v1/users/get_user_by_id", {
          user_id: decoded.user_id,
        });
        setAppliedCount(res?.data?.data || 0);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };
    fetchCount();
  }, [decoded]);

  // Handle delete job
  const handleDelete = async (applied_projects_id: number) => {
    try {
      await makeDeleteRequest("api/v1/applications/my-applications/withdraw", {
        applied_projects_id,
      });
      // Remove the deleted job from UI
      setJobItems((prev) =>
        prev.filter((job) => job.applied_projects_id !== applied_projects_id)
      );
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} /> */}
        <h2 className="main-title">Freelancer Dashboard</h2>

        {/* <div className="row">
          <CardItem img={icon_1} title="Total Submitted" value="1.7k+" />
          <CardItem img={icon_2} title="Shortlisted" value="03" />
          <CardItem img={icon_4} title="Applied Project" value={`${appliedCount}`} />
        </div> */}

        <div className="row d-flex pt-50 lg-pt-10">
          <div className="col-xl-7 col-lg-6 d-flex flex-column">
            <div className="user-activity-chart bg-white border-20 mt-30 h-100">
              <h4 className="dash-title-two">Profile Views</h4>
              <div className="ps-5 pe-5 mt-50">
                <Image
                  src={main_graph}
                  alt="main-graph"
                  className="lazy-img m-auto"
                />
              </div>
            </div>
          </div>

          <div className="col-xl-5 col-lg-6 d-flex">
            <div className="recent-job-tab bg-white border-20 mt-30 w-100">
              <h4 className="dash-title-two">Recent Applied Job</h4>
              <div className="wrapper">
                {loading ? (
                  <p>Loading...</p>
                ) : jobItems.length === 0 ? (
                  <p>No recent jobs found.</p>
                ) : (
                  jobItems.slice(0, 5).map((j) => (
                    <div
                      key={j.applied_projects_id}
                      className="job-item-list d-flex align-items-center"
                    >
                      <div>
                        <Image
                          src="/images/logo/default-logo.png"
                          alt="logo"
                          width={40}
                          height={40}
                          className="lazy-img logo"
                        />
                      </div>
                      <div className="job-title">
                        <h6 className="mb-5">
                          <a href="#">{j.project_title}</a>
                        </h6>
                        <div className="meta">
                          <span>{j.projects_type}</span> ·{" "}
                          <span>{j.project_category}</span>
                        </div>
                      </div>
                      <div className="job-action">
                        <button
                          className="action-btn dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span></span>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="dropdown-item"
                              href={`hhttp://13.235.113.131:8000/api/v1/${j.projects_task_id}`}
                            >
                              View Job
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="#">
                              Archive
                            </a>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() =>
                                handleDelete(j.applied_projects_id)
                              }
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardArea;
