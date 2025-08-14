"use client"
import React from 'react';
import JobType from './job-type';
import JobCategory from './job-category';
import JobTags from './job-tags';
import JobPrices from './job-prices';
import { useAppDispatch } from '@/redux/hook';
import { resetFilter } from '@/redux/features/filterSlice';
import { setBudgetRange } from '@/redux/features/filterSlice';

type IProps = {
  priceValue: [number, number];
  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  maxPrice: number;
};

const FilterArea = ({ priceValue, setPriceValue, maxPrice }: IProps) => {
  const dispatch = useAppDispatch();
  

  const handleReset = () => {
    dispatch(resetFilter());
    setPriceValue([0, maxPrice]);
  };

  return (
    <div className="filter-area-tab offcanvas offcanvas-start" id="filteroffcanvas">
      <button type="button" className="btn-close text-reset d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">

        {/* Job Type */}
        <div className="filter-block bottom-line pb-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseJobType" role="button" aria-expanded="false">Job Type</a>
          <div className="collapse show" id="collapseJobType">
            <JobType />
          </div>
        </div>

        {/* Salary */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseSalary" role="button" aria-expanded="false">Budget</a>
          <div className="collapse show" id="collapseSalary">
            <JobPrices priceValue={priceValue} setPriceValue={setPriceValue} maxPrice={maxPrice} />
          </div>
        </div>

        {/* Category */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseCategory" role="button" aria-expanded="false">Category</a>
          <div className="collapse" id="collapseCategory">
            <JobCategory />
          </div>
        </div>

        {/* Tags */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark collapsed" data-bs-toggle="collapse" href="#collapseTag" role="button" aria-expanded="false">Tags</a>
          <div className="collapse" id="collapseTag">
            <JobTags />
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

