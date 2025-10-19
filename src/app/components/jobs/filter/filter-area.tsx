// @/components/filter/filter-area.tsx (Updated)

"use client"
import React from 'react';
import JobType from './job-type';
import FilterJobCategory from './filter-job-category'; // <-- IMPORT the new dropdown component
import FilterJobSkills from './filter-job-skills'; // <-- IMPORT the new dropdown component
import JobPrices from './job-prices';
import { useAppDispatch } from '@/redux/hook';
import { resetFilter } from '@/redux/features/filterSlice';

// Define types for the data we expect from parent
interface ICategory {
  category_id: number;
  category_name: string;
}
interface ISkill {
  skill_id: number;
  skill_name: string;
}

// Update props to accept categories and skills lists and change handlers
type IProps = {
  priceValue: [number, number];
  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  maxPrice: number;
  all_categories: ICategory[]; // <-- ADDED
  all_skills: ISkill[];       // <-- ADDED
  onCategoryChange: (value: string) => void; // <-- ADDED
  onSkillChange: (value: string) => void;    // <-- ADDED
  selectedCategory: string; // <-- ADDED
  selectedSkill: string;    // <-- ADDED
};

const FilterArea = ({
  priceValue,
  setPriceValue,
  maxPrice,
  all_categories,
  all_skills,
  onCategoryChange,
  onSkillChange,
  selectedCategory,
  selectedSkill
}: IProps) => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetFilter());
    setPriceValue([0, maxPrice]);
    onCategoryChange(""); // Reset category
    onSkillChange("");    // Reset skill
  };

  return (
    <div className="filter-area-tab offcanvas offcanvas-start" id="filteroffcanvas">
      <button type="button" className="btn-close text-reset d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">

        {/* Job Type */}
        <div className="filter-block bottom-line pb-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseJobType" role="button" aria-expanded="true">Job Type</a>
          <div className="collapse show" id="collapseJobType">
            <JobType />
          </div>
        </div>

        {/* Budget */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseSalary" role="button" aria-expanded="true">Budget</a>
          <div className="collapse show" id="collapseSalary">
            <JobPrices priceValue={priceValue} setPriceValue={setPriceValue} maxPrice={maxPrice} />
          </div>
        </div>

        {/* Category */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseCategory" role="button" aria-expanded="false">Category</a>
          <div className="collapse" id="collapseCategory">
            {/* Use dropdown filter */}
            <FilterJobCategory categories={all_categories} onChange={onCategoryChange} />
          </div>
        </div>

        {/* Skills Section */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseSkills" role="button" aria-expanded="false">Skills</a>
          <div className="collapse" id="collapseSkills">
             {/* Use dropdown filter */}
            <FilterJobSkills skills={all_skills} onChange={onSkillChange} />
          </div>
        </div>

        {/* Reset Button */}
        <button onClick={handleReset} className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30">
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default FilterArea;