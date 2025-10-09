"use client";
import React, { useState, useEffect } from "react";
import FilterArea from "../filter/filter-area";
import ListItemTwo from "./list-item-2";
import JobGridItem from "../grid/job-grid-item";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import { useAppSelector } from "@/redux/hook";
import { IJobType } from "@/types/job-data-type";
import { makeGetRequest } from "@/utils/api";

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
  // The 'jobType' state has been removed as it's no longer needed.

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
          makeGetRequest("/projectsTask/getallprojectlisting-public"),
          makeGetRequest("/category/getallcategorys"),
          makeGetRequest("/tags/getallskill"),
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

  // --- Filtering and Sorting Effect ---
  useEffect(() => {
    let filteredData = all_jobs;

    if (project_category.length > 0) {
      filteredData = filteredData.filter((item) =>
        project_category.some((c) => item.project_category?.toLowerCase() === c.toLowerCase())
      );
    }

    if (projects_type) {
      filteredData = filteredData.filter(
        (item) => item.projects_type?.toLowerCase() === projects_type.toLowerCase()
      );
    }

    if (tags.length > 0) {
      filteredData = filteredData.filter((item) =>
        tags.some((selectedSkill) =>
          selectedSkill && item.skills_required?.some(
            (jobSkill) => jobSkill && jobSkill.toLowerCase() === selectedSkill.toLowerCase()
          )
        )
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
    itemOffset, itemsPerPage, project_category, projects_type,
    tags, all_jobs, priceValue, shortValue, search_key,
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
                {currentItems && currentItems.map((job) => <ListItemTwo key={job.projects_task_id} item={job} />)}
              </div>

              <div className={`accordion-box grid-style ${grid_style ? "show" : ""}`}>
                <div className="row">
                  {currentItems &&
                    currentItems.map((job) => (
                      <div key={job.projects_task_id} className="col-sm-6 mb-30">
                        <JobGridItem item={job} />
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
  );
};

export default JobListThree;