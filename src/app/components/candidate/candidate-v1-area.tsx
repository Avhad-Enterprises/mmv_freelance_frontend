"use client";
import React, { useEffect, useState } from "react";
import CandidateGridItem from "./candidate-grid-item";
import CandidateListItem from "./candidate-list-item";
import CandidateV1FilterArea from "./filter/candidate-v1-filter-area";
import ShortSelect from "../common/short-select";
import { makeGetRequest } from "@/utils/api";

const CandidateV1Area = ({ style_2 = false }: { style_2?: boolean }) => {
  const [jobType, setJobType] = useState<string>(style_2 ? "list" : "grid");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  //Filtered State 
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  //Pagination State 
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await makeGetRequest("users/freelancers/active");
      console.log("API Response: ", res);
      const data = res.data.data;

      setAllCandidates(data);
      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const applyFilter = () => {
    let filtered = [...allCandidates];

    if (selectedSkill) {
      filtered = filtered.filter((c) =>
        c.skill?.includes(selectedSkill)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (c) => `${c.city}, ${c.country}` === selectedLocation
      );
    }

    setCandidates(filtered);
  };

  const allSkills = Array.from(
    new Set(allCandidates.flatMap((c) => c.skill || []))
  );

  const allLocations = Array.from(
    new Set(allCandidates.map((c) => `${c.city}, ${c.country}`))
  );

  return (
    <section className="candidates-profile pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-4">
            <button
              type="button"
              className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
              data-bs-toggle="offcanvas"
              data-bs-target="#filteroffcanvas"
            >
              <i className="bi bi-funnel"></i> Filter
            </button>
            <CandidateV1FilterArea
              onSkillChange={setSelectedSkill}
              onLocationChange={setSelectedLocation}
              onApplyFilter={applyFilter}
              skills={allSkills}
              locations={allLocations}
            />
          </div>

          <div className="col-xl-9 col-lg-8">
            <div className="ms-xxl-5 ms-xl-3">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  All <span className="text-dark fw-500">{candidates.length}</span> candidates found
                </div>
                <div className="d-flex align-items-center">
                  <div className="short-filter d-flex align-items-center">
                    <div className="text-dark fw-500 me-2">Sort:</div>
                    <ShortSelect onChange={function (value: string): void {
                      throw new Error("Function not implemented.");
                    }} />
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

              {loading ? (
                <p>Loading candidates...</p>
              ) : (
                <>
                  <div className={`accordion-box grid-style ${jobType === "grid" ? "show" : ""}`}>
                    <div className="row">
                      {candidates.map((item) => (
                        <div key={item.user_id} className="col-xxl-4 col-sm-6 d-flex">
                          <CandidateGridItem item={item} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`accordion-box list-style ${jobType === "list" ? "show" : ""}`}>
                    {currentCandidates.map((item) => (
                      <CandidateListItem key={item.candidate} item={item} />
                    ))}
                  </div>
                </>
              )}

              {/* For Pagination */}
              <div className="pt-20 d-sm-flex align-items-center justify-content-between">
                <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                  Showing{" "}
                  <span className="text-dark fw-500">
                    {indexOfFirst + 1} to {Math.min(indexOfLast, candidates.length)}
                  </span>{" "}
                  of <span className="text-dark fw-500">{candidates.length}</span>
                </p>

                <div className="d-flex justify-content-center">
                  <ul className="pagination-two d-flex align-items-center style-none">
                    {/* Previous */}
                    <li className={currentPage === 1 ? "disabled" : ""}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}>
                        <i className="bi bi-chevron-left"></i>
                      </a>
                    </li>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}>
                          {i + 1}
                        </a>
                      </li>
                    ))}

                    {/* Next */}
                    <li className={currentPage === totalPages ? "disabled" : ""}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      }}>
                        <i className="bi bi-chevron-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandidateV1Area;
