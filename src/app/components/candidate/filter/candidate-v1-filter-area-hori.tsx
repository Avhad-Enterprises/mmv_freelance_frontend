"use client";

import React from "react";
import FilterSkills from "./filter-skills-hori";
import FilterCandidateLocation from "./filter-location-hori";

type Props = {
  onSkillChange: (values: string[]) => void;
  onLocationChange: (values: string[]) => void;
  onSuperpowerChange: (values: string[]) => void;
  onClearFilters: () => void;
  skills: string[];
  locations: string[];
  superpowers: string[];
  selectedSkills: string[];
  selectedLocations: string[];
  selectedSuperpowers: string[];
};

const CandidateV1FilterArea = ({
  onSkillChange,
  onLocationChange,
  onSuperpowerChange,
  onClearFilters,
  skills,
  locations,
  superpowers,
  selectedSkills,
  selectedLocations,
  selectedSuperpowers,
}: Props) => {
  // Handler to remove a single skill
  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    onSkillChange(newSkills);
  };

  // Handler to remove a single location
  const handleRemoveLocation = (locationToRemove: string) => {
    const newLocations = selectedLocations.filter(loc => loc !== locationToRemove);
    onLocationChange(newLocations);
  };

  // Handler to remove a single superpower
  const handleRemoveSuperpower = (superpowerToRemove: string) => {
    const newSuperpowers = selectedSuperpowers.filter(sp => sp !== superpowerToRemove);
    onSuperpowerChange(newSuperpowers);
  };

  const hasSelections = selectedSkills.length > 0 || selectedLocations.length > 0 || selectedSuperpowers.length > 0;

  return (
    <div className="p-4 rounded-3" style={{ backgroundColor: '#f0f5f3' }}>
      {/* This row contains the dropdowns and buttons */}
      <div className="row g-3 align-items-end">
        {/* --- Skill Filter --- */}
        <div className="col-lg-3 col-md-6">
          <div className="filter-title fw-500 text-dark mb-2">Skill</div>
          <FilterSkills
            skills={skills}
            onChange={onSkillChange}
            selectedValues={selectedSkills}
            placeholder="Select Skills"
          />
        </div>

        {/* --- Superpower Filter --- */}
        <div className="col-lg-3 col-md-6">
          <div className="filter-title fw-500 text-dark mb-2">Superpower</div>
          <FilterSkills
            skills={superpowers}
            onChange={onSuperpowerChange}
            selectedValues={selectedSuperpowers}
            placeholder="Select Superpowers"
          />
        </div>

        {/* --- Location Filter --- */}
        <div className="col-lg-3 col-md-6">
          <div className="filter-title fw-500 text-dark mb-2">Location</div>
          <FilterCandidateLocation
            locations={locations}
            onChange={onLocationChange}
            selectedValues={selectedLocations}
            placeholder="Select Location"
          />
        </div>
        
        {/* --- Action Buttons --- */}
        <div className="col-lg-3 col-md-12">
          <div className="d-flex gap-2 mt-md-0 mt-3">
            <button
              onClick={onClearFilters}
              className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* --- Section to display selected tags --- */}
      {hasSelections && (
        <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
          {selectedSkills.map(skill => (
            <div 
              key={skill} 
              className="btn-eight fw-500 d-flex align-items-center" 
              style={{ backgroundColor: '#00BF58', color: 'white' }}
            >
              <span style={{ color: 'white' }}>{skill}</span>
              <button 
                onClick={() => handleRemoveSkill(skill)} 
                className="btn-close ms-2" 
                style={{ width: '5px', height: '5px', filter: 'brightness(0) invert(1)' }}
              ></button>
            </div>
          ))}
          {selectedSuperpowers.map(superpower => (
            <div 
              key={superpower} 
              className="btn-eight fw-500 d-flex align-items-center" 
              style={{ backgroundColor: '#FF6B35', color: 'white' }}
            >
              <span style={{ color: 'white' }}>{superpower}</span>
              <button 
                onClick={() => handleRemoveSuperpower(superpower)} 
                className="btn-close ms-2" 
                style={{ width: '5px', height: '5px', filter: 'brightness(0) invert(1)' }}
              ></button>
            </div>
          ))}
          {selectedLocations.map(location => (
            <div 
              key={location} 
              className="btn-eight fw-500 d-flex align-items-center" 
              style={{ backgroundColor: '#00BF58', color: 'white' }}
            >
              <span style={{ color: 'white' }}>{location}</span>
              <button 
                onClick={() => handleRemoveLocation(location)} 
                className="btn-close ms-2" 
                style={{ width: '5px', height: '5px', filter: 'brightness(0) invert(1)' }}
              ></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateV1FilterArea;