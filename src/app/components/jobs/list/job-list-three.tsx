"use client";
import React, { useState, useEffect } from "react";
import FilterArea from "../filter/filter-area";
import ListItemTwo from "./list-item-2";
import JobGridItem from "../grid/job-grid-item";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import { makeGetRequest, makePostRequest, makeDeleteRequest } from "@/utils/api";
import { add_to_wishlist, remove_from_wishlist } from "@/redux/features/wishlist";
import useDecodedToken from "@/hooks/useDecodedToken";
import SaveJobLoginModal from "@/app/components/common/popup/save-job-login-modal";

// Define simple types for categories and skills for clarity
interface ICategory {
  category_id: number;
  category_name: string;
}

// Corrected ISkill interface to match your API data
interface ISkill {
  skill_id: number;
  skill_name: string;
}

const JobListThree = ({
  itemsPerPage,
  grid_style = false,
}: {
  itemsPerPage: number;
  grid_style?: boolean;
}) => {
  // Component State
  const [all_jobs, setAllJobs] = useState<IJobType[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<IJobType[] | null>(null);
  const [filterItems, setFilterItems] = useState<IJobType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [priceValue, setPriceValue] = useState<[number, number]>([0, 10000]);
  const [shortValue, setShortValue] = useState("");
  // Add dropdown filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  // The 'jobType' state has been removed as it's no longer needed.

  // Redux
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken();

  // Modal ref - removed, using direct Bootstrap modal access
  // const loginModalRef = useRef<any>(null);

  // Redux filter state from the store
  const { project_category, projects_type, tags, search_key } = useAppSelector(
    (state) => state.filter
  );

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [jobsRes, categoriesRes, skillsRes] = await Promise.all([
          makeGetRequest("api/v1/projects-tasks/listings"),
          makeGetRequest("api/v1/categories"),
          makeGetRequest("api/v1/skills"),
        ]);

        const jobsData = jobsRes.data.data || [];
        setAllJobs(jobsData);
        const maxBudget = Math.max(...jobsData.map((j: any) => j.budget || 0), 0);
        setPriceValue([0, maxBudget || 10000]);

        setCategories(categoriesRes.data.data || []);
        setSkills(skillsRes.data.data || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Initialize the login modal - removed, using direct Bootstrap modal access
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const initModal = async () => {
  //       const bootstrap = await import('bootstrap');
  //       const modalElement = document.getElementById('saveJobLoginModal');
  //       if (modalElement && !loginModalRef.current) {
  //         loginModalRef.current = new bootstrap.Modal(modalElement);
  //       }
  //     };
  //     initModal();
  //   }
  // }, []);

  // --- Filtering and Sorting Effect ---
  useEffect(() => {
    let filteredData = all_jobs;

    // Use local state for category and skill filtering
    if (selectedCategory) {
      filteredData = filteredData.filter((item) =>
        item.project_category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedSkill) {
      filteredData = filteredData.filter((item) =>
        item.skills_required?.some(
          (jobSkill) => jobSkill && jobSkill.toLowerCase() === selectedSkill.toLowerCase()
        )
      );
    }

    // Keep Redux state for other filters
    if (projects_type) {
      filteredData = filteredData.filter(
        (item) => item.projects_type?.toLowerCase() === projects_type.toLowerCase()
      );
    }

    filteredData = filteredData.filter(
      (item) => (item.budget ?? 0) >= priceValue[0] && (item.budget ?? 0) <= priceValue[1]
    );

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
    itemOffset, itemsPerPage, selectedCategory, selectedSkill, projects_type,
    all_jobs, priceValue, shortValue, search_key,
  ]);

  // --- Event Handlers ---
  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % (filterItems.length || 1);
    setItemOffset(newOffset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShort = (item: { value: string; label: string }) => {
    setShortValue(item.value);
  };

  const handleToggleSave = async (job: IJobType) => {
    if (!decoded || !decoded.user_id) {
      // Show login modal for unauthenticated users
      const modalElement = document.getElementById('saveJobLoginModal');
      if (modalElement) {
        // Bootstrap JS is now loaded globally, so we can use it directly
        const bootstrap = (window as any).bootstrap;
        if (bootstrap && bootstrap.Modal) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      }
      return;
    }

    const { wishlist } = useAppSelector((state) => state.wishlist);
    const isActive = wishlist.some((p) => p.projects_task_id === job.projects_task_id);

    try {
      const userId = decoded.user_id;

      if (isActive) {
        if (job.projects_task_id !== undefined) {
          await makeDeleteRequest("api/v1/saved/remove-saved", {
            user_id: userId,
            projects_task_id: job.projects_task_id,
          });
          dispatch(remove_from_wishlist(job.projects_task_id));
        }
      } else {
        if (job.projects_task_id !== undefined) {
          const payload = {
            user_id: userId,
            projects_task_id: job.projects_task_id,
            is_active: true,
            is_deleted: false,
            created_by: userId,
          };

          await makePostRequest("api/v1/saved/create", payload);
          dispatch(add_to_wishlist(job));
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleLoginSuccess = () => {
    // Modal will be hidden automatically by Bootstrap when login succeeds
    // The LoginForm component handles the redirect
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <p>Loading jobs...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <button
              type="button"
              className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
              data-bs-toggle="offcanvas"
              data-bs-target="#filteroffcanvas"
            >
              <i className="bi bi-funnel"></i>
              Filter
            </button>
            <FilterArea
              priceValue={priceValue}
              setPriceValue={setPriceValue}
              maxPrice={priceValue[1]}
              all_categories={categories}
              all_skills={skills}
              onCategoryChange={setSelectedCategory}
              onSkillChange={setSelectedSkill}
              selectedCategory={selectedCategory}
              selectedSkill={selectedSkill}
            />
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="job-post-item-wrapper ms-xxl-5 ms-xl-3">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  All <span className="text-dark fw-500">{filterItems.length}</span> jobs found
                </div>
                <div className="d-flex align-items-center">
                  <div className="short-filter d-flex align-items-center">
                    <div className="text-dark fw-500 me-2">Sort:</div>
                    <NiceSelect
                      options={[
                        { value: "", label: "Price Sort" },
                        { value: "price-low-to-high", label: "Low to High" },
                        { value: "price-high-to-low", label: "High to Low" },
                      ]}
                      defaultCurrent={0}
                      onChange={handleShort}
                      name="Price Sort"
                    />
                  </div>
                  {/* --- REMOVED --- The List/Grid view buttons were here */}
                </div>
              </div>

              {/* View now depends directly on the 'grid_style' prop */}
              <div className={`accordion-box list-style ${!grid_style ? "show" : ""}`}>
                {currentItems && currentItems.map((job) => <ListItemTwo key={job.projects_task_id} item={job} onToggleSave={handleToggleSave} />)}
              </div>

              <div className={`accordion-box grid-style ${grid_style ? "show" : ""}`}>
                <div className="row">
                  {currentItems &&
                    currentItems.map((job) => (
                      <div key={job.projects_task_id} className="col-sm-6 mb-30">
                        <JobGridItem item={job} onToggleSave={handleToggleSave} />
                      </div>
                    ))}
                </div>
              </div>

              {currentItems && currentItems.length === 0 && (
                <div className="text-center mt-5">
                  <h3>No jobs found</h3>
                  <p>Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}

              {currentItems && currentItems.length > 0 && (
                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                  <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                    Showing <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                    <span className="text-dark fw-500">
                      {Math.min(itemOffset + itemsPerPage, filterItems.length)}
                    </span> of <span className="text-dark fw-500">{filterItems.length}</span>
                  </p>
                  {filterItems.length > itemsPerPage && (
                    <Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <SaveJobLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default JobListThree;