"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IJobType } from "@/types/job-data-type";
import ListItemTwo from "../jobs/list/list-item-2";
import JobGridItem from "../jobs/grid/job-grid-item";
import { makeGetRequest } from "@/utils/api";

const SearchItems = () => {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<IJobType[]>([]);
  const [viewType, setViewType] = useState<string>("list");

  const categoryParam = searchParams.get("category"); // like "video-editing"
  const categoryNormalized = categoryParam?.replace(/-/g, " ").toLowerCase(); // "video editing"

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await makeGetRequest("api/v1/projects-tasks/listings");
        const data = response.data?.data || []; //account for nested "data" key

        const filtered = data.filter((item: IJobType) => {
          if (!categoryNormalized) return true;
          return (item.project_category ?? "").toLowerCase().includes(categoryNormalized);

        });

        setProjects(filtered);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [categoryNormalized]);

  return (
    <section className="job-listing-three pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter-area-tab">
              <div className="light-bg border-20 ps-4 pe-4">
                <a className="filter-header border-20 d-block search" href="#">
                  <span className="main-title fw-500 text-dark">
                    {projects.length === 0
                      ? "No Projects Found"
                      : `Search Results (${projects.length})`}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="col-12">
              <div className="job-post-item-wrapper">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-25 mt-70 lg-mt-40">
                  <div className="total-job-found">
                    Showing <span className="text-dark">{projects.length}</span> projects
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() => setViewType("list")}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn
                      ${viewType === "grid" ? "active" : ""}`}
                      title="List View"
                    >
                      <i className="bi bi-list"></i>
                    </button>
                    <button
                      onClick={() => setViewType("grid")}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn
                      ${viewType === "list" ? "active" : ""}`}
                      title="Grid View"
                    >
                      <i className="bi bi-grid"></i>
                    </button>
                  </div>
                </div>

                {/* List View */}
                <div className={`accordion-box list-style ${viewType === "list" ? "show" : ""}`}>
                  {projects.map((project) => (
                    <ListItemTwo key={project.projects_task_id} item={project} isActive={false} />
                  ))}
                </div>

                {/* Grid View */}
                <div className={`accordion-box grid-style ${viewType === "grid" ? "show" : ""}`}>
                  <div className="row">
                    {projects.map((project) => (
                      <div key={project.projects_task_id} className="col-sm-6 mb-30">
                        <JobGridItem item={project} isActive={false} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchItems;
