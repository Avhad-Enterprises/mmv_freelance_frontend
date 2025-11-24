"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header-minus";
import DashboardJobDetailsArea from "./dashboard-job-details-area";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import { makeGetRequest, makePostRequest, makeDeleteRequest } from "@/utils/api";
import { add_to_wishlist, remove_from_wishlist, set_wishlist } from "@/redux/features/wishlist";
import { resetFilter } from "@/redux/features/filterSlice";
import useDecodedToken from "@/hooks/useDecodedToken";
import { useSidebar } from "@/context/SidebarContext";
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from "@/utils/categoryIcons";
import SaveJobLoginModal from "@/app/components/common/popup/save-job-login-modal";
import toast from "react-hot-toast";

const DashboardJobBrowseArea = () => {
  const { setIsOpenSidebar } = useSidebar();
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken();

  // Component State
  const [all_jobs, setAllJobs] = useState<IJobType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<IJobType[] | null>(null);
  const [filterItems, setFilterItems] = useState<IJobType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [biddingFilter, setBiddingFilter] = useState<string>("all"); // "all", "bidding", "fixed"
  const [gridStyle, setGridStyle] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobType | null>(null);
  const [shortValue, setShortValue] = useState<string>("");

  // Available options from jobs
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  const itemsPerPage = 10;

  // Redux filter state
  const { projects_type, search_key } = useAppSelector((state) => state.filter);
  const { wishlist } = useAppSelector((state) => state.wishlist);

  // Data Fetching Effect
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [jobsRes, userRes] = await Promise.all([
          makeGetRequest("api/v1/projects-tasks/listings"),
          makeGetRequest("api/v1/users/me"),
        ]);

        const jobsData = jobsRes.data.data || [];
        setAllJobs(jobsData);

        // Get user currency
        const userData = userRes.data?.data;
        const currency = userData?.profile?.currency || 'USD';

        // Extract unique skills from all jobs
        const skillsSet = new Set<string>();
        jobsData.forEach((job: IJobType) => {
          if (job.skills_required && Array.isArray(job.skills_required)) {
            job.skills_required.forEach(skill => {
              if (skill) skillsSet.add(skill);
            });
          }
        });
        setAvailableSkills(Array.from(skillsSet).sort());

        // Fetch saved projects if user is logged in
        if (decoded?.user_id) {
          try {
            const savedProjectsRes = await makeGetRequest("api/v1/saved/my-saved-projects");
            const savedProjectIds = savedProjectsRes.data.data.map((p: any) => p.projects_task_id);
            
            const savedJobs = jobsData.filter((job: IJobType) => 
              job.projects_task_id !== undefined && savedProjectIds.includes(job.projects_task_id)
            );
            
            dispatch(set_wishlist(savedJobs));
          } catch (error) {
            console.error("Error fetching saved projects:", error);
            dispatch(set_wishlist([]));
          }
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [decoded, dispatch]);

  // Filtering and Sorting Effect
  useEffect(() => {
    let filteredData = all_jobs;

    if (selectedSkills.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.skills_required?.some(jobSkill => 
          jobSkill && selectedSkills.includes(jobSkill)
        )
      );
    }

    // Filter by bidding status
    if (biddingFilter === "bidding") {
      filteredData = filteredData.filter((item) => item.bidding_enabled === true);
    } else if (biddingFilter === "fixed") {
      filteredData = filteredData.filter((item) => item.bidding_enabled === false);
    }

    if (projects_type) {
      filteredData = filteredData.filter(
        (item) => item.projects_type?.toLowerCase() === projects_type.toLowerCase()
      );
    }

    if (search_key) {
      filteredData = filteredData.filter((item) =>
        item.project_title?.toLowerCase().includes(search_key.toLowerCase()) ||
        item.project_description?.toLowerCase().includes(search_key.toLowerCase())
      );
    }

    if (shortValue === "price-low-to-high") {
      filteredData = filteredData.slice().sort((a, b) => (a.budget ?? 0) - (b.budget ?? 0));
    } else if (shortValue === "price-high-to-low") {
      filteredData = filteredData.slice().sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0));
    }

    const endOffset = itemOffset + itemsPerPage;
    setFilterItems(filteredData);
    setCurrentItems(filteredData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredData.length / itemsPerPage));
  }, [
    itemOffset, itemsPerPage, selectedSkills, projects_type,
    all_jobs, search_key, biddingFilter, shortValue,
  ]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % (filterItems.length || 1);
    setItemOffset(newOffset);
  };

  const handleToggleSave = async (job: IJobType) => {
    if (!decoded || !decoded.user_id) {
      if (typeof window !== "undefined") {
        const modalElement = document.getElementById('saveJobLoginModal');
        if (modalElement) {
          const bootstrap = (window as any).bootstrap;
          if (bootstrap && bootstrap.Modal) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        }
      }
      return;
    }

    const isActive = wishlist.some((p) => p.projects_task_id === job.projects_task_id);

    try {
      if (job.projects_task_id === undefined) return;

      if (isActive) {
        await makeDeleteRequest("api/v1/saved/unsave-project", {
          projects_task_id: job.projects_task_id,
        });
        dispatch(remove_from_wishlist(job.projects_task_id));
        toast.success("Project removed from saved list");
      } else {
        const payload = {
          projects_task_id: job.projects_task_id,
        };
        await makePostRequest("api/v1/saved/save-project", payload);
        dispatch(add_to_wishlist(job));
        toast.success("Project saved successfully!");
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };

  const handleReset = () => {
    dispatch(resetFilter());
    setSelectedSkills([]);
    setBiddingFilter("all");
    setShortValue("");
    setItemOffset(0);
    toast.success("Filters reset successfully");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
    setItemOffset(0);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove));
    setItemOffset(0);
  };

  const hasSelections = selectedSkills.length > 0 || biddingFilter !== "all" || shortValue !== "";

  const ListItemTwo = ({ item }: { item: IJobType }) => {
    const isActive = wishlist.some((p) => p.projects_task_id === item.projects_task_id);

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
                        ? `${item.project_title.slice(0, 22)}${
                            item.project_title.length > 22 ? ".." : ""
                          }`
                        : ""}
                    </a>
                  </h4>

                  <ul className="cadidate-skills style-none d-flex align-items-center">
                    {item.skills_required && item.skills_required.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-nowrap">{s}</li>
                    ))}
                    {item.skills_required && item.skills_required.length > 3 && (
                      <li className="more">+{item.skills_required.length - 3}</li>
                    )}
                  </ul>
                  
                  {/* Bidding Badge */}
                  <div className="mt-2">
                    {item.bidding_enabled ? (
                      <span className="badge" style={{ 
                        backgroundColor: '#D2F34C', 
                        color: '#244034',
                        fontSize: '11px',
                        padding: '4px 10px',
                        fontWeight: '500'
                      }}>
                        <i className="bi bi-gavel me-1"></i>Bidding Enabled
                      </span>
                    ) : (
                      <span className="badge" style={{ 
                        backgroundColor: '#6c757d', 
                        color: 'white',
                        fontSize: '11px',
                        padding: '4px 10px',
                        fontWeight: '500'
                      }}>
                        <i className="bi bi-cash-stack me-1"></i>Fixed Price
                      </span>
                    )}
                  </div>
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
                    title={isActive ? "Unsave" : "Save"}
                  >
                    <i className={`bi ${isActive ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
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
    const { projects_task_id, projects_type, budget, project_title } = item || {};
    const isActive = wishlist.some(p => p.projects_task_id === projects_task_id);

    return (
      <div className={`candidate-profile-card grid-layout`}>
        <a
          onClick={() => handleToggleSave(item)}
          className={`save-btn text-center rounded-circle tran3s cursor-pointer ${isActive ? 'active' : ''}`}
          title={isActive ? 'Unsave Job' : 'Save Job'}
        >
          <i className={`bi ${isActive ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
        </a>

        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto mb-3">
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

        <div className="text-center mb-2">
          <h4 className="candidate-name mb-2">
            <a onClick={() => setSelectedJob(item)} className="tran3s cursor-pointer">
              {project_title}
            </a>
          </h4>

          <ul className="cadidate-skills style-none d-flex align-items-center justify-content-center mb-3">
            {item.skills_required && item.skills_required.slice(0, 2).map((s, i) => (
              <li key={i} className="text-nowrap">{s}</li>
            ))}
          </ul>
          
          {/* Bidding Badge */}
          <div className="mb-3">
            {item.bidding_enabled ? (
              <span className="badge" style={{ 
                backgroundColor: '#D2F34C', 
                color: '#244034',
                fontSize: '11px',
                padding: '4px 10px',
                fontWeight: '500'
              }}>
                <i className="bi bi-gavel me-1"></i>Bidding Enabled
              </span>
            ) : (
              <span className="badge" style={{ 
                backgroundColor: '#6c757d', 
                color: 'white',
                fontSize: '11px',
                padding: '4px 10px',
                fontWeight: '500'
              }}>
                <i className="bi bi-cash-stack me-1"></i>Fixed Price
              </span>
            )}
          </div>
        </div>

        <div className="candidate-info text-center mb-3">
          <span>Budget</span>
          <div>${budget ?? 0}</div>
        </div>

        <div className="candidate-info text-center mb-3">
          <span>Type</span>
          <div>{projects_type || 'Not specified'}</div>
        </div>

        <div className="d-flex justify-content-center">
          <a
            onClick={() => setSelectedJob(item)}
            className="profile-btn tran3s cursor-pointer"
          >
            View Details
          </a>
        </div>
      </div>
    );
  };

  // If job is selected, show the details component
  if (selectedJob) {
    return <DashboardJobDetailsArea job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <h2 className="main-title mb-30">Browse Projects</h2>

          {/* Horizontal Filter Area - Theme Consistent Style */}
          <div className="bg-white card-box border-20 mb-30">
            <div className="row g-3 g-lg-4 align-items-end">
              {/* Skills Filter */}
              <div className="col-lg-3 col-md-6 col-12">
                <label className="form-label fw-500 text-dark mb-2" style={{ fontSize: '15px' }}>Skills</label>
                <select
                  className="filter-select form-select"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !selectedSkills.includes(e.target.value)) {
                      toggleSkill(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Skills</option>
                  {availableSkills.map((skill, idx) => (
                    <option key={idx} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Bidding Filter */}
              <div className="col-lg-3 col-md-6 col-12">
                <label className="form-label fw-500 text-dark mb-2" style={{ fontSize: '15px' }}>Pricing Type</label>
                <select
                  className="filter-select form-select"
                  value={biddingFilter}
                  onChange={(e) => {
                    setBiddingFilter(e.target.value);
                    setItemOffset(0);
                  }}
                >
                  <option value="all">All Projects</option>
                  <option value="bidding">Bidding Only</option>
                  <option value="fixed">Fixed Price Only</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="col-lg-3 col-md-6 col-12">
                <label className="form-label fw-500 text-dark mb-2" style={{ fontSize: '15px' }}>Sort By</label>
                <select
                  className="filter-select form-select"
                  value={shortValue}
                  onChange={(e) => {
                    setShortValue(e.target.value);
                    setItemOffset(0);
                  }}
                >
                  <option value="">Default</option>
                  <option value="price-low-to-high">Price: Low to High</option>
                  <option value="price-high-to-low">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Button */}
              <div className="col-lg-3 col-md-6 col-12">
                <button
                  onClick={handleReset}
                  className="dash-btn-two w-100 fw-500"
                  style={{ height: '55px' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Selected Filters Display */}
            {hasSelections && (
              <div className="d-flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: '1px solid #E3F0EB' }}>
                {biddingFilter !== "all" && (
                  <span 
                    className="d-inline-flex align-items-center px-3 py-2 rounded-pill" 
                    style={{ 
                      backgroundColor: '#D2F34C', 
                      color: '#244034',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {biddingFilter === "bidding" ? "Bidding Enabled" : "Fixed Price"}
                    <button 
                      onClick={() => setBiddingFilter("all")} 
                      className="btn-close ms-2 opacity-100" 
                      style={{ 
                        width: '8px', 
                        height: '8px',
                        fontSize: '10px'
                      }}
                      aria-label="Remove filter"
                    ></button>
                  </span>
                )}
                {shortValue && (
                  <span 
                    className="d-inline-flex align-items-center px-3 py-2 rounded-pill" 
                    style={{ 
                      backgroundColor: '#D2F34C', 
                      color: '#244034',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {shortValue === "price-low-to-high" ? "Price: Low to High" : "Price: High to Low"}
                    <button 
                      onClick={() => setShortValue("")} 
                      className="btn-close ms-2 opacity-100" 
                      style={{ 
                        width: '8px', 
                        height: '8px',
                        fontSize: '10px'
                      }}
                      aria-label="Remove filter"
                    ></button>
                  </span>
                )}
                {selectedSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="d-inline-flex align-items-center px-3 py-2 rounded-pill" 
                    style={{ 
                      backgroundColor: '#D2F34C', 
                      color: '#244034',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)} 
                      className="btn-close ms-2 opacity-100" 
                      style={{ 
                        width: '8px', 
                        height: '8px',
                        fontSize: '10px'
                      }}
                      aria-label="Remove filter"
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Jobs Display Area */}
          <div className="job-post-item-wrapper">
            <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
              <div className="total-job-found">
                All <span className="text-dark fw-500">{filterItems.length}</span> jobs found
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
                {/* List View */}
                <div className={`accordion-box list-style ${!gridStyle ? "show" : ""}`}>
                  {currentItems && currentItems.map((job) => (
                    <ListItemTwo key={job.projects_task_id} item={job} />
                  ))}
                </div>

                {/* Grid View */}
                <div className={`accordion-box grid-style ${gridStyle ? "show" : ""}`}>
                  <div className="row">
                    {currentItems && currentItems.map((job) => (
                      <div key={job.projects_task_id} className="col-sm-6 mb-30">
                        <JobGridItem item={job} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {currentItems && currentItems.length === 0 && (
                  <div className="text-center mt-5">
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters to find what you're looking for.</p>
                  </div>
                )}

                {/* Pagination */}
                {currentItems && currentItems.length > 0 && (
                  <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                    <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                      Showing <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                      <span className="text-dark fw-500">
                        {Math.min(itemOffset + itemsPerPage, filterItems.length)}
                      </span> of <span className="text-dark fw-500">{filterItems.length}</span>
                    </p>
                    {filterItems.length > itemsPerPage && pageCount > 1 && (
                      <ul className="pagination-one d-flex align-items-center style-none">
                        <li className={itemOffset === 0 ? "disabled" : ""}>
                          <a onClick={() => handlePageClick({ selected: Math.floor(itemOffset / itemsPerPage) - 1 })}>
                            Prev
                          </a>
                        </li>
                        {Array.from({ length: pageCount }, (_, i) => (
                          <li key={i} className={Math.floor(itemOffset / itemsPerPage) === i ? "active" : ""}>
                            <a onClick={() => handlePageClick({ selected: i })}>{i + 1}</a>
                          </li>
                        ))}
                        <li className={itemOffset + itemsPerPage >= filterItems.length ? "disabled" : ""}>
                          <a onClick={() => handlePageClick({ selected: Math.floor(itemOffset / itemsPerPage) + 1 })}>
                            Next
                          </a>
                        </li>
                      </ul>
                    )}
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

export default DashboardJobBrowseArea;