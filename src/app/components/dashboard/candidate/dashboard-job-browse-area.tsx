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

// Currency conversion rates (hardcoded, base currency: USD)
const EXCHANGE_RATES: { [key: string]: number } = {
  'USD': 1,
  'INR': 83.12,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'CNY': 7.24,
  'NZD': 1.67,
  'SGD': 1.34,
  'HKD': 7.83,
  'KRW': 1338.50,
  'SEK': 10.87,
  'NOK': 10.93,
  'DKK': 6.88,
  'MXN': 17.12,
  'BRL': 4.98,
  'ZAR': 18.65,
  'RUB': 92.50,
  'TRY': 34.15,
  'AED': 3.67,
  'SAR': 3.75,
  'MYR': 4.48,
  'THB': 34.82,
  'IDR': 15680.00,
  'PHP': 56.45,
  'PLN': 3.98,
  'CZK': 23.15,
  'ILS': 3.68,
};

const convertToUserCurrency = (amountInUSD: number, userCurrency: string): number => {
  const rate = EXCHANGE_RATES[userCurrency] || 1;
  return amountInUSD * rate;
};

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
  const [priceValue, setPriceValue] = useState<[number, number]>([0, 10000]);
  const [shortValue, setShortValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [gridStyle, setGridStyle] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobType | null>(null);
  const [userCurrency, setUserCurrency] = useState<string>('USD');

  // Available options from jobs
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

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
        setUserCurrency(currency);

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

        // Extract unique project types from all jobs
        const typesSet = new Set<string>();
        jobsData.forEach((job: IJobType) => {
          if (job.projects_type) {
            typesSet.add(job.projects_type);
          }
        });
        setAvailableTypes(Array.from(typesSet).sort());

        // Calculate max budget in user's currency
        const maxBudgetUSD = Math.max(...jobsData.map((j: any) => j.budget || 0), 0);
        const maxBudgetUserCurrency = convertToUserCurrency(maxBudgetUSD, currency);
        setPriceValue([0, Math.ceil(maxBudgetUserCurrency)]);

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

    if (selectedTypes.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.projects_type && selectedTypes.includes(item.projects_type)
      );
    }

    if (projects_type) {
      filteredData = filteredData.filter(
        (item) => item.projects_type?.toLowerCase() === projects_type.toLowerCase()
      );
    }

    // Filter by budget range (convert job budget to user currency for comparison)
    filteredData = filteredData.filter((item) => {
      const budgetInUserCurrency = convertToUserCurrency(item.budget ?? 0, userCurrency);
      return budgetInUserCurrency >= priceValue[0] && budgetInUserCurrency <= priceValue[1];
    });

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
    itemOffset, itemsPerPage, selectedSkills, selectedTypes, projects_type,
    all_jobs, priceValue, shortValue, search_key, userCurrency,
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
    const maxBudgetUSD = Math.max(...all_jobs.map((j: any) => j.budget || 0), 0);
    const maxBudgetUserCurrency = convertToUserCurrency(maxBudgetUSD, userCurrency);
    setPriceValue([0, Math.ceil(maxBudgetUserCurrency)]);
    setSelectedSkills([]);
    setSelectedTypes([]);
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

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setItemOffset(0);
  };

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

          {/* Horizontal Filter Area */}
          <div className="bg-white border-20 p-4 mb-30">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-500">Filters</h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="bi bi-funnel me-1"></i>
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Reset
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="row g-3 mt-2">
                {/* Skills */}
                <div className="col-md-4">
                  <label className="form-label fw-500">Skills</label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px' }}>
                    {availableSkills.length === 0 ? (
                      <p className="text-muted mb-0">No skills available</p>
                    ) : (
                      availableSkills.map((skill, idx) => (
                        <div key={idx} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            id={`skill-${idx}`}
                          />
                          <label className="form-check-label fw-500" htmlFor={`skill-${idx}`}>
                            {skill}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Project Types */}
                <div className="col-md-4">
                  <label className="form-label fw-500">Project Type</label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '10px' }}>
                    {availableTypes.length === 0 ? (
                      <p className="text-muted mb-0">No types available</p>
                    ) : (
                      availableTypes.map((type, idx) => (
                        <div key={idx} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            id={`type-${idx}`}
                          />
                          <label className="form-check-label fw-500" htmlFor={`type-${idx}`}>
                            {type}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Budget & Sort */}
                <div className="col-md-4">
                  <label className="form-label fw-500">Budget Range ({userCurrency})</label>
                  <input
                    type="range"
                    className="form-range mb-2"
                    min="0"
                    max={Math.ceil(Math.max(...all_jobs.map((j: any) => convertToUserCurrency(j.budget || 0, userCurrency)), 0))}
                    value={priceValue[1]}
                    onChange={(e) => {
                      setPriceValue([0, Number(e.target.value)]);
                      setItemOffset(0);
                    }}
                  />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-500">{userCurrency} 0</span>
                    <span className="fw-500">{userCurrency} {Math.round(priceValue[1]).toLocaleString()}</span>
                  </div>
                  <label className="form-label fw-500">Sort By Price</label>
                  <select
                    className="form-select"
                    value={shortValue}
                    onChange={(e) => setShortValue(e.target.value)}
                  >
                    <option value="">Select Sort</option>
                    <option value="price-low-to-high">Low to High</option>
                    <option value="price-high-to-low">High to Low</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(selectedSkills.length > 0 || selectedTypes.length > 0) && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e5e5e5' }}>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="text-muted me-2">Active Filters:</span>
                  {selectedTypes.map((type) => (
                    <span key={type} className="badge bg-primary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      {type}
                      <button
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: '10px' }}
                        onClick={() => toggleType(type)}
                      />
                    </span>
                  ))}
                  {selectedSkills.map((skill) => (
                    <span key={skill} className="badge bg-success" style={{ fontSize: '13px', padding: '6px 12px' }}>
                      {skill}
                      <button
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: '10px' }}
                        onClick={() => toggleSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
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