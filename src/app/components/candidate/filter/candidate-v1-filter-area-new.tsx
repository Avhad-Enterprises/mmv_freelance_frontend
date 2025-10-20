"use client";
import React from "react";
import FilterSkills from "./filter-skills";
import FilterCandidateLocation from "./filter-location";
import FilterSuperpowers from "./filter-superpowers";

interface Props {
  onSkillChange: (skills: string[]) => void;
  onLocationChange: (locations: string[]) => void;
  onSuperpowersChange: (superpowers: string[]) => void;
  skills: string[];
  locations: string[];
  selectedSkills: string[];
  selectedLocations: string[];
  selectedSuperpowers: string[];
  onClearFilters: () => void;
}

const CandidateV1FilterArea = ({
  onSkillChange,
  onLocationChange,
  onSuperpowersChange,
  onClearFilters,
  skills,
  locations,
  selectedSkills,
  selectedLocations,
  selectedSuperpowers,
}: Props) => {
  return (
    <div
      className="filter-area-tab offcanvas offcanvas-start"
      id="filteroffcanvas"
    >
      <button
        type="button"
        className="btn-close text-reset d-lg-none"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
        <div className="filter-block bottom-line pb-25">
          <a
            className="filter-title fw-500 text-dark"
            data-bs-toggle="collapse"
            href="#collapseSuperpowers"
            role="button"
            aria-expanded="true"
          >
            Superpowers
          </a>
          <div className="collapse show" id="collapseSuperpowers">
            <div className="main-body">
              <FilterSuperpowers 
                onChange={onSuperpowersChange} 
                value={selectedSuperpowers}
              />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title fw-500 text-dark"
            data-bs-toggle="collapse"
            href="#collapseCategory"
            role="button"
            aria-expanded="true"
          >
            Skills
          </a>
          <div className="collapse show" id="collapseCategory">
            <div className="main-body">
              <FilterSkills skills={skills} onChange={onSkillChange} value={selectedSkills} />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title fw-500 text-dark"
            data-bs-toggle="collapse"
            href="#collapseLocation"
            role="button"
            aria-expanded="true"
          >
            Locations
          </a>
          <div className="collapse show" id="collapseLocation">
            <div className="main-body">
              <FilterCandidateLocation 
                locations={locations} 
                onChange={onLocationChange} 
                value={selectedLocations}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onClearFilters}
          className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default CandidateV1FilterArea;