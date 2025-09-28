"use client";
import React, { useEffect, useState } from "react";
import CandidateGridItem from "./candidate-grid-item";
import CandidateListItem from "./candidate-list-item";
import CandidateV1FilterArea from "./filter/candidate-v1-filter-area";
import ShortSelect from "../common/short-select";
import { makeGetRequest, makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";

const CandidateV1Area = ({ style_2 = false }: { style_2?: boolean }) => {
  const [jobType, setJobType] = useState<string>(style_2 ? "list" : "grid");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Saved Candidates
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);

  // Current User Info
  const decoded = useDecodedToken();

  // Filter State
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentCandidates = candidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);

  // Debug setJobType
  const setJobTypeAndLog = (type: string) => {
    console.log("Setting jobType to:", type);
    setJobType(type);
  };

  // Toggle Save
  const handleToggleSave = async (freelancerId: number) => {
    if (!decoded) {
      console.error("User not logged in");
      return;
    }

    const userId = decoded.user_id;
    const payload = {
      user_id: userId,
      freelancer_id: freelancerId,
      created_by: 1,
    };

    try {
      if (savedCandidates.includes(freelancerId)) {
        await makePostRequest("favorites/remove", payload);
        setSavedCandidates((prev) => prev.filter((id) => id !== freelancerId));
      } else {
        await makePostRequest("favorites/add", payload);
        setSavedCandidates((prev) => [...prev, freelancerId]);
      }
    } catch (err) {
      console.error("Error in save/remove API:", err);
    }
  };

  // Fetch All Active Freelancers
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await makeGetRequest("users/freelancers/active");
      const data = res.data.data;
      console.log("Fetched candidates:", data);
      if (!Array.isArray(data)) {
        console.error("API data is not an array:", data);
        setAllCandidates([]);
        setCandidates([]);
      } else {
        setAllCandidates(data);
        setCandidates(data);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setAllCandidates([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Saved Favorites
  const fetchSavedCandidates = async () => {
    if (!decoded) return;
    try {
      const res = await makePostRequest(`getfreelanceby${decoded.user_id}`);
      const saved = res.data.data.map((fav: any) => fav.favorite_freelancer_id);
      console.log("Fetched saved candidates:", saved);
      setSavedCandidates(saved);
    } catch (err) {
      console.error("Error fetching saved favorites:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (decoded) {
      fetchSavedCandidates();
    }
  }, [decoded]);

  // Apply Filter
  const applyFilter = () => {
    let filtered = [...allCandidates];

    if (selectedSkill) {
      filtered = filtered.filter((c) =>
        Array.isArray(c.skill?.languages)
          ? c.skill.languages.includes(selectedSkill)
          : false
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (c) => `${c.city}, ${c.country}` === selectedLocation
      );
    }

    setCandidates(filtered);
    setCurrentPage(1);
    console.log("Filtered candidates:", filtered);
  };

  //dropDown Sorting Function
  const handleSort = (sortValue: string) => {
    console.log("Sort by:", sortValue);
    let sorted = [...candidates];

    switch (sortValue) {
      case "New":
        sorted = [...allCandidates]; // reset to API data
        break;
      case "Category":
        sorted.sort((a, b) =>
          (a.category || "").localeCompare(b.category || "")
        );
        break;
      case "Job Type":
        sorted.sort((a, b) =>
          (a.job_type || "").localeCompare(b.job_type || "")
        );
        break;
      case "Budget":
        sorted.sort(
          (a, b) => (a.expected_salary || 0) - (b.expected_salary || 0)
        );
        break;
      default:
        break;
    }

    setCandidates(sorted);
    setCurrentPage(1);
  };

  //Collect unique skills (flattened languages array)
  const allSkills = Array.from(
    new Set(allCandidates.flatMap((c) => c.skill?.languages || []))
  );

  const allLocations = Array.from(
    new Set(allCandidates.map((c) => `${c.city}, ${c.country}`))
  );

  return (
    <section className="candidates-profile pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          {/* Filter Sidebar */}
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

          {/* Candidate List / Grid */}
          <div className="col-xl-9 col-lg-8">
            <div className="ms-xxl-5 ms-xl-3">
              {/* Sort + Toggle */}
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  All{" "}
                  <span className="text-dark fw-500">{candidates.length}</span>{" "}
                  candidates found
                </div>
                <div className="d-flex align-items-center">
                  <div className="short-filter d-flex align-items-center">
                    <div className="text-dark fw-500 me-2">Sort:</div>
                    <ShortSelect onChange={handleSort} />
                  </div>
                  {/* Toggle Button */}
                  <div className="d-flex ms-2" style={{ display: "flex" }}>
                    {jobType === "list" ? (
                      <button
                        data-testid="grid-view-button"
                        onClick={(e) => {
                          e.preventDefault();
                          setJobTypeAndLog("grid");
                        }}
                        className="style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn"
                        title="Switch to Grid View"
                        style={{ display: "inline-block" }}
                      >
                        <i className="bi bi-grid"></i>
                      </button>
                    ) : (
                      <button
                        data-testid="list-view-button"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("List button clicked");
                          setJobTypeAndLog("list");
                        }}
                        className="style-changer-btn text-center rounded-circle tran3s ms-2 list-btn"
                        title="Switch to List View"
                        style={{ display: "inline-block" }}
                      >
                        <i className="bi bi-list"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <p>Loading candidates...</p>
              ) : (
                <>
                  {/* Grid View */}
                  <div
                    data-testid="grid-view"
                    className={`accordion-box grid-style ${jobType === "grid" ? "show" : "d-none"
                      }`}
                  >
                    <div className="row">
                      {currentCandidates.length > 0 ? (
                        currentCandidates.map((item) => (
                          <div
                            key={item.user_id}
                            className="col-xxl-4 col-sm-6 d-flex"
                          >
                            <CandidateGridItem
                              item={item}
                              isSaved={savedCandidates.includes(item.user_id)}
                              onToggleSave={handleToggleSave}
                            />
                          </div>
                        ))
                      ) : (
                        <p>No candidates found.</p>
                      )}
                    </div>
                  </div>

                  {/* List View */}
                  <div
                    data-testid="list-view"
                    className={`accordion-box list-style ${jobType === "list" ? "show" : "d-none"
                      }`}
                  >
                    {currentCandidates.length > 0 ? (
                      currentCandidates.map((item) => (
                        <CandidateListItem
                          key={item.user_id}
                          item={item}
                          isSaved={savedCandidates.includes(item.user_id)}
                          onToggleSave={handleToggleSave}
                        />
                      ))
                    ) : (
                      <p>No candidates found.</p>
                    )}
                  </div>
                </>
              )}

              {/* Pagination */}
              <div className="pt-20 d-sm-flex align-items-center justify-content-between">
                <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                  Showing{" "}
                  <span className="text-dark fw-500">
                    {indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, candidates.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-dark fw-500">{candidates.length}</span>
                </p>

                <div className="d-flex justify-content-center">
                  <ul className="pagination-two d-flex align-items-center style-none">
                    {/* Previous */}
                    <li className={currentPage === 1 ? "disabled" : ""}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => Math.max(prev - 1, 1));
                        }}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </a>
                    </li>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={currentPage === i + 1 ? "active" : ""}
                      >
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </a>
                      </li>
                    ))}

                    {/* Next */}
                    <li
                      className={currentPage === totalPages ? "disabled" : ""}
                    >
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          );
                        }}
                      >
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
