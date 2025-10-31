"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header-minus";
import DashboardJobDetailsArea from "./dashboard-job-details-area";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import { makeGetRequest, makeDeleteRequest, makePostRequest } from "@/utils/api";
import { set_wishlist, remove_from_wishlist, add_to_wishlist } from "@/redux/features/wishlist";
import useDecodedToken from "@/hooks/useDecodedToken";
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from "@/utils/categoryIcons";
import SaveJobLoginModal from "@/app/components/common/popup/save-job-login-modal";
import toast from "react-hot-toast";

const SavedJobArea = () => {
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken();

  // State for this component
  const [loading, setLoading] = useState<boolean>(true);
  const [gridStyle, setGridStyle] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobType | null>(null);

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
        
        // Then, get the user's saved project IDs
        const savedProjectsRes = await makeGetRequest("api/v1/saved/my-saved-projects");
        const savedProjectIds = new Set(savedProjectsRes.data.data.map((p: any) => p.projects_task_id));
        
        // Filter the main job list to get the full objects for saved jobs
        const userSavedJobs = allJobs.filter((job: IJobType) => 
          job.projects_task_id !== undefined && savedProjectIds.has(job.projects_task_id)
        );
        
        // Populate the Redux store with the saved jobs
        dispatch(set_wishlist(userSavedJobs));
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load saved jobs.");
        dispatch(set_wishlist([])); // Clear list on error
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [decoded, dispatch]);

  // Handler to unsave a job (it will disappear from this page)
  const handleToggleSave = async (job: IJobType) => {
    if (!decoded || !decoded.user_id || job.projects_task_id === undefined) return;

    // In the context of this page, clicking a saved job always means unsaving it.
    try {
      await makeDeleteRequest("api/v1/saved/unsave-project", {
        projects_task_id: job.projects_task_id,
      });
      dispatch(remove_from_wishlist(job.projects_task_id));
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast.error("Could not remove the job.");
    }
  };

  // --- Reusable UI Components for List and Grid View ---

  const ListItemTwo = ({ item }: { item: IJobType }) => {
    return (
      <div className={`candidate-profile-card list-layout mb-25`}>
        <div className="d-flex">
          <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
            <a onClick={() => setSelectedJob(item)} className="rounded-circle cursor-pointer">
              <div
                className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  backgroundColor: getCategoryColor(item.project_category),
                  color: getCategoryTextColor(item.project_category)
                }}
              >
                {getCategoryIcon(item.project_category)}
              </div>
            </a>
          </div>
          <div className="right-side">
            <div className="row gx-1 align-items-center">
              <div className="col-xl-3">
                <div className="position-relative">
                  <h4 className="candidate-name mb-0">
                    <a onClick={() => setSelectedJob(item)} className="tran3s cursor-pointer">
                      {item.project_title
                        ? `${item.project_title.slice(0, 22)}${item.project_title.length > 22 ? ".." : ""}`
                        : ""}
                    </a>
                  </h4>
                  <ul className="cadidate-skills style-none d-flex align-items-center">
                    {item.skills_required?.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-nowrap">{s}</li>
                    ))}
                    {item.skills_required && item.skills_required.length > 3 && (
                      <li className="more">+{item.skills_required.length - 3}</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-4 col-sm-6">
                <div className="candidate-info">
                  <span>Budget</span>
                  <div>${item.budget ?? 0}</div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4 col-sm-6">
                <div className="candidate-info">
                  <span>Type</span>
                  <div>{item.projects_type || 'Not specified'}</div>
                </div>
              </div>
              <div className="col-xl-3 col-md-4">
                <div className="d-flex justify-content-lg-end align-items-center">
                  <button
                    type="button"
                    className="save-btn text-center rounded-circle tran3s"
                    onClick={() => handleToggleSave(item)}
                    title="Unsave"
                  >
                    <i className="bi bi-heart-fill text-danger"></i>
                  </button>
                  <a
                    onClick={() => setSelectedJob(item)}
                    className="profile-btn tran3s ms-md-2 cursor-pointer"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const JobGridItem = ({ item }: { item: IJobType }) => {
    return (
      <div className={`candidate-profile-card grid-layout`}>
        <a
          onClick={() => handleToggleSave(item)}
          className={`save-btn text-center rounded-circle tran3s cursor-pointer active`}
          title='Unsave Job'
        >
          <i className="bi bi-heart-fill text-danger"></i>
        </a>
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto mb-3">
          <a onClick={() => setSelectedJob(item)} className="rounded-circle cursor-pointer">
            <div
              className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 80, height: 80, fontSize: '28px', fontWeight: 'bold',
                backgroundColor: getCategoryColor(item.project_category),
                color: getCategoryTextColor(item.project_category)
              }}
            >
              {getCategoryIcon(item.project_category)}
            </div>
          </a>
        </div>
        <div className="text-center mb-2">
          <h4 className="candidate-name mb-2">
            <a onClick={() => setSelectedJob(item)} className="tran3s cursor-pointer">
              {item.project_title}
            </a>
          </h4>
          <ul className="cadidate-skills style-none d-flex align-items-center justify-content-center mb-3">
            {item.skills_required?.slice(0, 2).map((s, i) => (
              <li key={i} className="text-nowrap">{s}</li>
            ))}
          </ul>
        </div>
        <div className="candidate-info text-center mb-3">
          <span>Budget</span>
          <div>${item.budget ?? 0}</div>
        </div>
        <div className="candidate-info text-center mb-3">
          <span>Type</span>
          <div>{item.projects_type || 'Not specified'}</div>
        </div>
        <div className="d-flex justify-content-center">
          <a onClick={() => setSelectedJob(item)} className="profile-btn tran3s cursor-pointer">
            View Details
          </a>
        </div>
      </div>
    );
  };

  // If a job is selected, show the details view
  if (selectedJob) {
    return <DashboardJobDetailsArea job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  // Main component render
  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <h2 className="main-title mb-30">Saved Jobs</h2>

          <div className="job-post-item-wrapper">
            <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
              <div className="total-job-found">
                <span className="text-dark fw-500">{savedJobs.length}</span> saved jobs found
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="layout-switcher">
                  <button
                    className={`style-changer-btn text-center ${!gridStyle ? 'active' : ''}`}
                    onClick={() => setGridStyle(false)}
                    title="List Layout"
                  >
                    <i className="bi bi-list"></i>
                  </button>
                  <button
                    className={`style-changer-btn text-center ${gridStyle ? 'active' : ''}`}
                    onClick={() => setGridStyle(true)}
                    title="Grid Layout"
                  >
                    <i className="bi bi-grid-3x2"></i>
                  </button>
                </div>
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
                        <h3>No saved jobs found</h3>
                        <p>You can save jobs from the 'Browse Projects' page.</p>
                    </div>
                ) : (
                    <>
                        {/* List View */}
                        <div className={`accordion-box list-style ${!gridStyle ? "show" : ""}`}>
                            {savedJobs.map((job) => (
                                <ListItemTwo key={job.projects_task_id} item={job} />
                            ))}
                        </div>

                        {/* Grid View */}
                        <div className={`accordion-box grid-style ${gridStyle ? "show" : ""}`}>
                            <div className="row">
                                {savedJobs.map((job) => (
                                <div key={job.projects_task_id} className="col-sm-6 mb-30">
                                    <JobGridItem item={job} />
                                </div>
                                ))}
                            </div>
                        </div>
                    </>
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