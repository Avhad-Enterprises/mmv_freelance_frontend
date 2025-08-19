"use client";
import React, { useState, useEffect } from "react";
import slugify from "slugify";
import FilterArea from "../filter/filter-area";
import ListItemTwo from "./list-item-2";
import { IJobType } from "@/types/job-data-type";
import Pagination from "@/ui/pagination";
import JobGridItem from "../grid/job-grid-item";
import { useAppSelector } from "@/redux/hook";
import NiceSelect from "@/ui/nice-select";
import {makeGetRequest} from "@/utils/api";

const JobListThree = ({
  itemsPerPage,
  grid_style = false,
}: {
  itemsPerPage: number;
  grid_style?: boolean;
}) => {
  const [all_jobs, setAllJobs] = useState<IJobType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentItems, setCurrentItems] = useState<IJobType[] | null>(null);
  const [filterItems, setFilterItems] = useState<IJobType[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [jobType, setJobType] = useState(grid_style ? "grid" : "list");
  const [priceValue, setPriceValue] = useState<[number, number]>([0, 10000]);
  const [shortValue, setShortValue] = useState("");

  //Redux filter state
  const {
    project_category,
    projects_type,
    tags,
    search_key,
  } = useAppSelector((state) => state.filter);

  // Fetch jobs
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await makeGetRequest("projectsTask/getallprojects_task");

      const data = res.data;
      setAllJobs(data.data || []);

      const maxBudget = Math.max(...(data.data || []).map((j: any) => j.Budget), 0);
      setPriceValue([0, maxBudget || 10000]);
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

  //  Filter logic
  useEffect(() => {
    let filteredData = all_jobs
      .filter((item) =>
        project_category.length
          ? project_category.some((c) => item.project_category?.toLowerCase() === c.toLowerCase())
          : true
      )
      .filter((item) =>
        projects_type
          ? item.projects_type?.toLowerCase() === projects_type.toLowerCase()
          : true
      )
      .filter((item) =>
        tags.length
          ? tags.some((t) => item.tags?.includes(t))
          : true
      )
      .filter((item) => (item.Budget ?? 0) >= priceValue[0] && (item.Budget ?? 0) <= priceValue[1])
      .filter((item) =>
        search_key
          ? item.project_title?.toLowerCase().includes(search_key.toLowerCase()) ||
            item.project_description?.toLowerCase().includes(search_key.toLowerCase())
          : true
      );

    // Sorting
    if (shortValue === "price-low-to-high") {
      filteredData = filteredData.slice().sort((a, b) => Number(a.Budget) - Number(b.Budget));
    } else if (shortValue === "price-high-to-low") {
      filteredData = filteredData.slice().sort((a, b) => Number(b.Budget) - Number(a.Budget));
    }

    const endOffset = itemOffset + itemsPerPage;
    setFilterItems(filteredData);
    setCurrentItems(filteredData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredData.length / itemsPerPage));
  }, [
    itemOffset,
    itemsPerPage,
    project_category,
    projects_type,
    tags,
    all_jobs,
    priceValue,
    shortValue,
    search_key,
  ]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % all_jobs.length;
    setItemOffset(newOffset);
  };

  const handleShort = (item: { value: string; label: string }) => {
    setShortValue(item.value);
  };

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
            <FilterArea priceValue={priceValue} setPriceValue={setPriceValue} maxPrice={priceValue[1]} />
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="job-post-item-wrapper ms-xxl-5 ms-xl-3">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  All <span className="text-dark">{filterItems.length}</span> jobs found
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
                  <button
                    onClick={() => setJobType("list")}
                    className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn ${jobType === "grid" ? "active" : ""}`}
                    title="List View"
                  >
                    <i className="bi bi-list"></i>
                  </button>
                  <button
                    onClick={() => setJobType("grid")}
                    className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn ${jobType === "list" ? "active" : ""}`}
                    title="Grid View"
                  >
                    <i className="bi bi-grid"></i>
                  </button>
                </div>
              </div>

              <div className={`accordion-box list-style ${jobType === "list" ? "show" : ""}`}>
                {currentItems &&
                  currentItems.map((job) => <ListItemTwo key={job.projects_task_id} item={job} />)}
              </div>

              <div className={`accordion-box grid-style ${jobType === "grid" ? "show" : ""}`}>
                <div className="row">
                  {currentItems &&
                    currentItems.map((job) => (
                      <div key={job.projects_task_id} className="col-sm-6 mb-30">
                        <JobGridItem item={job} />
                      </div>
                    ))}
                </div>
              </div>

              {currentItems && (
                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                  <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                    Showing{" "}
                    <span className="text-dark fw-500">{itemOffset + 1}</span> to{" "}
                    <span className="text-dark fw-500">
                      {Math.min(itemOffset + itemsPerPage, filterItems.length)}
                    </span>{" "}
                    of <span className="text-dark fw-500">{filterItems.length}</span>
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
