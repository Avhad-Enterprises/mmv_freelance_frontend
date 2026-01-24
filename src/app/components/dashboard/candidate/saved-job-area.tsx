"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header-minus";
import DashboardJobDetailsArea from "./dashboard-job-details-area";
import DashboardSearchBar from "../common/DashboardSearchBar";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import {
  makeGetRequest,
  makeDeleteRequest,
  makePostRequest,
} from "@/utils/api";
import {
  set_wishlist,
  remove_from_wishlist,
  add_to_wishlist,
} from "@/redux/features/wishlist";
import useDecodedToken from "@/hooks/useDecodedToken";
import {
  getCategoryIcon,
  getCategoryColor,
  getCategoryTextColor,
} from "@/utils/categoryIcons";
import SaveJobLoginModal from "@/app/components/common/popup/save-job-login-modal";
import toast from "react-hot-toast";

const SavedJobArea = () => {
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken();

  // State for this component
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<IJobType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get saved jobs directly from the Redux store
  const { wishlist: savedJobs } = useAppSelector((state) => state.wishlist);

  // Fetch saved jobs on component mount
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!decoded?.user_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // First, get the list of all jobs
        const jobsRes = await makeGetRequest("api/v1/projects-tasks/listings");
        const allJobs = jobsRes.data.data || [];

        // Then, get the user's saved project IDs - convert to strings for robust comparison
        const savedProjectsRes = await makeGetRequest(
          "api/v1/saved/my-saved-projects"
        );
        const savedProjectIds = new Set(
          savedProjectsRes.data.data.map((p: any) => String(p.projects_task_id))
        );

        // Filter the main project list to get the full objects for saved projects
        const userSavedJobs = allJobs.filter(
          (job: IJobType) =>
            job.projects_task_id !== undefined &&
            savedProjectIds.has(String(job.projects_task_id))
        );

        // Populate the Redux store with the saved projects
        dispatch(set_wishlist(userSavedJobs));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load saved projects.");
        dispatch(set_wishlist([])); // Clear list on error
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [decoded, dispatch]);

  // Handler to unsave a project (it will disappear from this page)
  const handleToggleSave = async (job: IJobType) => {
    if (!decoded || !decoded.user_id || job.projects_task_id === undefined)
      return;

    // In the context of this page, clicking a saved project always means unsaving it.
    try {
      await makeDeleteRequest("api/v1/saved/unsave-project", {
        projects_task_id: job.projects_task_id,
      });
      dispatch(remove_from_wishlist(job.projects_task_id));
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast.error("Could not remove the project.");
    }
  };

  // --- Reusable UI Components for List View ---

  const ListItemTwo = ({ item }: { item: IJobType }) => {
    // Check if this job matches search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matches =
        item.project_title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.projects_type?.toLowerCase().includes(query) ||
        item.project_description?.toLowerCase().includes(query) ||
        item.skills_required?.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      if (!matches) return null;
    }

    return (
      <div className={`candidate-profile-card list-layout mb-25 border-0`}>
        <div className="d-flex flex-column flex-lg-row">
          {/* Mobile/Tablet Header: Avatar + Title (Visible < lg) */}
          <div className="d-flex d-lg-none align-items-center mb-3">
            <div className="cadidate-avatar online position-relative d-block me-3">
              <a
                onClick={() => setSelectedJob(item)}
                className="rounded-circle cursor-pointer"
              >
                <div
                  className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 60,
                    height: 60,
                    fontSize: "24px",
                    fontWeight: "bold",
                    backgroundColor: getCategoryColor(item.project_category),
                    color: getCategoryTextColor(item.project_category),
                  }}
                >
                  {getCategoryIcon(item.project_category)}
                </div>
              </a>
            </div>
            <div>
              <h4 className="candidate-name mb-0">
                <a
                  onClick={() => setSelectedJob(item)}
                  className="tran3s cursor-pointer"
                >
                  {item.project_title
                    ? `${item.project_title.slice(0, 30)}${
                        item.project_title.length > 30 ? ".." : ""
                      }`
                    : ""}
                </a>
              </h4>
            </div>
          </div>

          {/* Desktop Avatar (Visible >= lg) */}
          <div className="cadidate-avatar online position-relative d-none d-lg-block me-4">
            <a
              onClick={() => setSelectedJob(item)}
              className="rounded-circle cursor-pointer"
            >
              <div
                className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: "28px",
                  fontWeight: "bold",
                  backgroundColor: getCategoryColor(item.project_category),
                  color: getCategoryTextColor(item.project_category),
                }}
              >
                {getCategoryIcon(item.project_category)}
              </div>
            </a>
          </div>

          <div className="right-side flex-grow-1">
            <div className="row gx-2 align-items-center mb-2">
              {/* Desktop Title (Visible >= lg) */}
              <div className="col-lg-3 d-none d-lg-block">
                <div className="position-relative">
                  <h4 className="candidate-name mb-0">
                    <a
                      onClick={() => setSelectedJob(item)}
                      className="tran3s cursor-pointer"
                    >
                      {item.project_title
                        ? `${item.project_title.slice(0, 22)}${
                            item.project_title.length > 22 ? ".." : ""
                          }`
                        : ""}
                    </a>
                  </h4>
                </div>
              </div>

              {/* Info Columns */}
              <div className="col-6 col-md-4 col-lg-2">
                <div className="candidate-info">
                  <span>Budget</span>
                  <div>${item.budget ?? 0}</div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <div className="candidate-info">
                  <span>Type</span>
                  <div>{item.projects_type || "Not specified"}</div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-2 mt-2 mt-md-0">
                <div className="candidate-info">
                  <span>Pricing</span>
                  <div>
                    {item.bidding_enabled ? (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#D2F34C",
                          color: "#244034",
                          fontSize: "11px",
                          padding: "4px 10px",
                          fontWeight: "500",
                        }}
                      >
                        <i className="bi bi-gavel me-1"></i>Bidding
                      </span>
                    ) : (
                      <span
                        className="badge"
                        style={{
                          backgroundColor: "#6c757d",
                          color: "white",
                          fontSize: "11px",
                          padding: "4px 10px",
                          fontWeight: "500",
                        }}
                      >
                        <i className="bi bi-cash-stack me-1"></i>Fixed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="col-12 col-lg-3 mt-3 mt-lg-0">
                <div className="d-flex justify-content-lg-end align-items-center gap-2">
                  <button
                    type="button"
                    className="save-btn text-center rounded-circle tran3s"
                    onClick={() => handleToggleSave(item)}
                    title="Unsave"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      minHeight: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className="bi bi-heart-fill text-danger"></i>
                  </button>
                  <a
                    onClick={() => setSelectedJob(item)}
                    className="profile-btn tran3s cursor-pointer flex-grow-1 flex-lg-grow-0 text-center"
                    style={{ whiteSpace: "nowrap", minWidth: "fit-content" }}
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="row">
              <div className="col-12">
                <ul className="cadidate-skills style-none d-flex align-items-center flex-wrap gap-2 mt-2">
                  {item.skills_required?.slice(0, 5).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                  {item.skills_required && item.skills_required.length > 5 && (
                    <li className="more">+{item.skills_required.length - 5}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If a job is selected, show the details view
  if (selectedJob) {
    return (
      <DashboardJobDetailsArea
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  // Main component render
  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <h2 className="main-title mb-30">Saved Projects</h2>

          <DashboardSearchBar
            placeholder="Search saved projects by title, category, type..."
            onSearch={setSearchQuery}
          />

          <div className="job-post-item-wrapper">
            <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
              <div className="total-job-found">
                <span className="text-dark fw-500">{savedJobs.length}</span>{" "}
                saved projects found
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {savedJobs.length === 0 ? (
                  <div className="text-center mt-5">
                    <h3>No saved projects found</h3>
                    <p>You can save jobs from the 'Browse Projects' page.</p>
                  </div>
                ) : (
                  <div className="accordion-box list-style show">
                    {savedJobs.map((job) => (
                      <ListItemTwo key={job.projects_task_id} item={job} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SaveJobLoginModal onLoginSuccess={() => {}} />
    </>
  );
};

export default SavedJobArea;
