"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardHeader from "./dashboard-header";
import ShortSelect from "../../common/short-select";
import { makeDeleteRequest, makeGetRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { notifyError, notifySuccess } from "@/utils/toast";

// Types
interface IProject {
  projects_task_id: number;
  project_title: string;
  Budget: number;
  Deadline: string;
  project_category: string;
  projects_type: string;
  location?: string;
}

interface IProps {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SavedJobArea: React.FC<IProps> = ({ setIsOpenSidebar }) => {
  const [savedJobs, setSavedJobs] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("New");
  const user = useDecodedToken();

  const fetchSavedJobs = async () => {
    if (!user?.user_id) return;
    setLoading(true);

    try {
      const savedRes = await makeGetRequest("saved/listsave");
//  {
      //   user_id: user.user_id,
      // }
      const savedData = savedRes?.data?.data || [];
      const savedIds = savedData
        .filter((item: any) => !item.is_deleted)
        .map((item: any) => Number(item.projects_task_id));

      if (savedIds.length === 0) {
        setSavedJobs([]);
        return;
      }

      const projectsRes = await makeGetRequest("projectsTask/getallprojects_task");
      const allProjects = projectsRes?.data?.data || [];

      const matched = allProjects.filter((proj: any) =>
        savedIds.includes(Number(proj.projects_task_id))
      );

      setSavedJobs(matched);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
      notifyError("Failed to load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  const handleRemove = async (jobId: number) => {
    try {
      await makeDeleteRequest("saved/remove-saved", {
        user_id: user?.user_id,
        projects_task_id: jobId,
      });
      notifySuccess("Removed from saved jobs.");
      fetchSavedJobs();
    } catch (err) {
      console.error("Remove error:", err);
      notifyError("Failed to remove job.");
    }
  };

  const sortJobs = (jobs: IProject[], type: string) => {
    switch (type) {
      case "Budget":
        return [...jobs].sort((a, b) => b.Budget - a.Budget);
      case "Category":
        return [...jobs].sort((a, b) =>
          a.project_category.localeCompare(b.project_category)
        );
      case "Job Type":
        return [...jobs].sort((a, b) =>
          a.projects_type.localeCompare(b.projects_type)
        );
      case "New":
      default:
        return [...jobs]; // optionally sort by created_at
    }
  };

  const sortedJobs = sortJobs(savedJobs, sortType);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Saved Jobs</h2>
          <div className="short-filter d-flex align-items-center">
            <div className="text-dark fw-500 me-2">Sort by:</div>
            <ShortSelect  onChange={setSortType} />
          </div>
        </div>

        <div className="wrapper">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : sortedJobs.length === 0 ? (
            <div className="text-center text-muted">No saved jobs found.</div>
          ) : (
            sortedJobs.map((j) => (
              <div
                key={j.projects_task_id}
                className="job-list-one style-two position-relative mb-20"
              >
                <div className="row justify-content-between align-items-center">
                  <div className="col-xxl-3 col-lg-4">
                    <div className="job-title d-flex align-items-center">
                      <a href="#" className="logo">
                        <Image
                          src={"/images/default-logo.png"}
                          alt="logo"
                          className="lazy-img m-auto"
                          width={50}
                          height={50}
                        />
                      </a>
                      <a href="#" className="title fw-500 tran3s">
                        {j.project_title}
                      </a>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-4 col-sm-6 ms-auto">
                    <div className="job-category text-dark fw-500">
                      {j.project_category || "Uncategorized"}
                    </div>
                    <div className="job-salary">
                      ₹{j.Budget} / Fixed Budget
                    </div>
                    <div className="job-deadline text-muted">
                      Deadline: {new Date(j.Deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 ms-auto xs-mt-10">
                    <div className="job-type">
                      <span className="badge bg-secondary">
                        {j.projects_type}
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
                          <button
                            onClick={() => handleRemove(j.projects_task_id)}
                            className="dropdown-item"
                          >
                            Remove
                          </button>
                        </li>
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
    </div>
  );
};

export default SavedJobArea;
