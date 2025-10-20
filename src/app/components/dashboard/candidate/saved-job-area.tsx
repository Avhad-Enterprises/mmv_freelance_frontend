"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardHeader from "./dashboard-header";
import ShortSelect from "../../common/short-select";
import { makeDeleteRequest, makeGetRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { set_wishlist, remove_from_wishlist } from "@/redux/features/wishlist";
import { useSidebar } from "@/context/SidebarContext";

// Types
interface IProps {
  // No props needed, using context
}

const SavedJobArea: React.FC<IProps> = ({}) => {
  const { setIsOpenSidebar } = useSidebar();
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("New");
  const user = useDecodedToken();

  // Fetch only login user's saved jobs
  const fetchSavedJobs = async () => {
    if (!user?.user_id) return;
    setLoading(true);

    try {
      // Fixed: only 1 argument passed
      const savedRes = await makeGetRequest(
        `api/v1/saved/listsave?user_id=${user.user_id}`
      );
      const savedData = savedRes?.data?.data || [];

      const savedIds = savedData
        .filter(
          (item: any) =>
            !item.is_deleted && Number(item.user_id) === Number(user.user_id)
        )
        .map((item: any) => Number(item.projects_task_id));

      if (savedIds.length === 0) {
        dispatch(set_wishlist([]));
        return;
      }

      const projectsRes = await makeGetRequest("api/v1/projects-tasks/listings");
      const allProjects = projectsRes?.data?.data || [];

      const matched = allProjects.filter((proj: any) =>
        savedIds.includes(Number(proj.projects_task_id))
      );

      dispatch(set_wishlist(matched));
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
      await makeDeleteRequest("api/v1/saved/remove-saved", {
        user_id: user?.user_id,
        projects_task_id: jobId,
      });
      dispatch(remove_from_wishlist(jobId));
      notifySuccess("Removed from saved jobs.");
    } catch (err) {
      console.error("Remove error:", err);
      notifyError("Failed to remove job.");
    }
  };

  const sortJobs = (jobs: any[], type: string) => {
    switch (type) {
      case "Budget":
        return [...jobs].sort((a, b) => b.budget - a.budget);
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
        return [...jobs];
    }
  };

  const sortedJobs = sortJobs(wishlist, sortType);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader />
        {/* header end */}

        <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">Saved Jobs</h2>
          <div className="short-filter d-flex align-items-center">
            <div className="text-dark fw-500 me-2">Sort by:</div>
            <ShortSelect onChange={setSortType} />
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
                    <div className="job-salary">₹{j.budget} / Fixed Budget</div>
                    <div className="job-deadline text-muted">
                      Deadline:{" "}
                      {j.Deadline
                        ? new Date(j.deadline).toLocaleDateString()
                        : "N/A"}
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
                            onClick={() =>
                              j.projects_task_id &&
                              handleRemove(j.projects_task_id)
                            }
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
