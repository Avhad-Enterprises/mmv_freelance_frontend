"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardHeader from "./dashboard-header";
import ShortSelect from "../../common/short-select";
import { makeGetRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { notifyError } from "@/utils/toast";

// Types
interface IProject {
  projects_task_id: number;
  project_title: string;
  Budget: number;
  Deadline: string;
  project_category: string;
  projects_type: string;
  status?: string | number;
  location?: string;
}

interface IProps {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const getStatusLabel = (status: any) => {
  switch (status) {
    case 0:
    case "0":
      return "Pending";
    case 1:
    case "1":
      return "Accepted";
    case 2:
    case "2":
      return "Rejected";
    default:
      return "Unknown";
  }
};

const AppliedJobArea: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const [appliedJobs, setAppliedJobs] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("New");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const user = useDecodedToken();

  const fetchAppliedJobs = async () => {
    if (!user?.user_id) return;
    setLoading(true);

    try {
      const appliedRes = await makeGetRequest("applied/lists");
      // , {
      //   user_id: user.user_id,
      // }

      const appliedData = appliedRes?.data?.data || [];
      const appliedIds = appliedData.map((item: any) => Number(item.projects_task_id));
      const statusMap = new Map<number, any>();
      appliedData.forEach((item: any) => {
        statusMap.set(Number(item.projects_task_id), item.status);
      });

      if (appliedIds.length === 0) {
        setAppliedJobs([]);
        return;
      }

      const projectsRes = await makeGetRequest("projectsTask/getallprojects_task");
      const allProjects = projectsRes?.data?.data || [];

      const matched = allProjects
        .filter((proj: any) => appliedIds.includes(Number(proj.projects_task_id)))
        .map((proj: any) => ({
          ...proj,
          status: statusMap.get(proj.projects_task_id),
        }));

      setAppliedJobs(matched);
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
      notifyError("Failed to load applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, [user]);

  const sortJobs = (jobs: IProject[], type: string) => {
    let filtered = [...jobs];

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (job) => getStatusLabel(job.status) === selectedStatus
      );
    }

    switch (type) {
      case "Budget":
        return filtered.sort((a, b) => b.Budget - a.Budget);
      case "Category":
        return filtered.sort((a, b) =>
          a.project_category.localeCompare(b.project_category)
        );
      case "Job Type":
        return filtered.sort((a, b) =>
          a.projects_type.localeCompare(b.projects_type)
        );
      case "New":
      default:
        return filtered;
    }
  };

  const sortedJobs = sortJobs(appliedJobs, sortType);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="main-title m0">Applied Jobs</h2>

        <div className="short-filter d-flex align-items-center">
          <div className="text-dark fw-500 me-2">Sort by:</div>
          <ShortSelect onChange={() => ''} />
        </div>
      </div>

      {/* Filter buttons */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-3 justify-content-end" role="tablist">
          {["All", "Pending", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              type="button"
              className={`btn-one px-4 py-2 ${selectedStatus === status ? "active" : ""}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="wrapper">
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : sortedJobs.length === 0 ? (
          <div className="text-center text-muted">No applied jobs found.</div>
        ) : (
          sortedJobs.map((j) => (
            <div
              key={j.projects_task_id}
              className="job-list-one style-two position-relative mb-20"
            >
              <div className="row justify-content-between align-items-center">
                <div className="col-xxl-3 col-lg-4">
                  <div className="job-title d-flex align-items-center">
                    {/* <a href="#" className="logo">
                      <Image
                        src={"/images/default-logo.png"}
                        alt="logo"
                        className="lazy-img m-auto"
                        width={50}
                        height={50}
                      />
                    </a> */}
                    <a href="#" className="title fw-500 tran3s">
                      {j.project_title}
                    </a>
                  </div>
                </div>

                <div className="col-lg-3 col-md-4 col-sm-6 ms-auto">
                  <div className="job-category text-dark fw-500">
                    {j.project_category || "Uncategorized"}
                  </div>
                  <div className="job-salary">₹{j.Budget} / Fixed Budget</div>
                  <div className="job-deadline text-muted">
                    Deadline: {new Date(j.Deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 ms-auto xs-mt-10">
                  <div className="job-type">
                    <span className="badge bg-success">{j.projects_type}</span>
                  </div>
                  <div className="mt-1">
                    <span className="badge bg-secondary">
                      {getStatusLabel(j.status)}
                    </span>
                  </div>
                </div>

                <div className="col-lg-2 col-md-4">
                  <div className="action-dots float-end">
                    <button
                      className="action-btn dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span></span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item"
                          href={`/job-details-v1/${j.projects_task_id}`}
                        >
                          View
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedJobArea;
