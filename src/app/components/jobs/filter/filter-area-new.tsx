"use client"
import React, { useState, useEffect } from 'react';
import JobType from './job-type';
import { useAppDispatch } from '@/redux/hook';
import { resetFilter } from '@/redux/features/filterSlice';
import { makeGetRequest } from '@/utils/api';

// Currency conversion rates (hardcoded, base currency: USD)
const EXCHANGE_RATES: { [key: string]: number } = {
  'USD': 1,
  'INR': 83.12,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'CNY': 7.24,
  'NZD': 1.67,
  'SGD': 1.34,
  'HKD': 7.83,
  'KRW': 1338.50,
  'SEK': 10.87,
  'NOK': 10.93,
  'DKK': 6.88,
  'MXN': 17.12,
  'BRL': 4.98,
  'ZAR': 18.65,
  'RUB': 92.50,
  'TRY': 34.15,
  'AED': 3.67,
  'SAR': 3.75,
  'MYR': 4.48,
  'THB': 34.82,
  'IDR': 15680.00,
  'PHP': 56.45,
  'PLN': 3.98,
  'CZK': 23.15,
  'ILS': 3.68,
};

const convertToUserCurrency = (amountInUSD: number, userCurrency: string): number => {
  const rate = EXCHANGE_RATES[userCurrency] || 1;
  return amountInUSD * rate;
};

type IProps = {
  priceValue: [number, number];
  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  maxPrice: number;
  availableSkills: string[];
  availableTypes: string[];
  onSkillChange: (values: string[]) => void;
  onTypeChange: (values: string[]) => void;
  selectedSkills: string[];
  selectedTypes: string[];
};

const FilterArea = ({
  priceValue,
  setPriceValue,
  maxPrice,
  availableSkills,
  availableTypes,
  onSkillChange,
  onTypeChange,
  selectedSkills,
  selectedTypes
}: IProps) => {
  const dispatch = useAppDispatch();
  const [userCurrency, setUserCurrency] = useState<string>('USD');

  useEffect(() => {
    const fetchUserCurrency = async () => {
      try {
        const userRes = await makeGetRequest("api/v1/users/me");
        const currency = userRes.data?.data?.profile?.currency || 'USD';
        setUserCurrency(currency);
      } catch (error) {
        console.error("Error fetching user currency:", error);
      }
    };

    fetchUserCurrency();
  }, []);

  const handleReset = () => {
    dispatch(resetFilter());
    setPriceValue([0, maxPrice]);
    onSkillChange([]);
    onTypeChange([]);
  };

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    onSkillChange(newSkills);
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypeChange(newTypes);
  };

  const maxPriceInUserCurrency = convertToUserCurrency(maxPrice, userCurrency);

  return (
    <div className="filter-area-tab offcanvas offcanvas-start" id="filteroffcanvas">
      <button type="button" className="btn-close text-reset d-lg-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
        
        {/* Skills */}
        <div className="filter-block bottom-line pb-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseSkills" role="button" aria-expanded="true">
            Skills
          </a>
          <div className="collapse show" id="collapseSkills">
            <div className="main-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {availableSkills.length === 0 ? (
                <p className="text-muted mb-0 mt-2">No skills available</p>
              ) : (
                availableSkills.map((skill, idx) => (
                  <div key={idx} className="form-check mb-2 mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      id={`skill-filter-${idx}`}
                    />
                    <label className="form-check-label fw-500" htmlFor={`skill-filter-${idx}`}>
                      {skill}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Project Types */}
        <div className="filter-block bottom-line pb-25 mt-25">
          <a className="filter-title fw-500 text-dark" data-bs-toggle="collapse" href="#collapseTypes" role="button" aria-expanded="true">
            Project Type
          </a>
          <div className="collapse show" id="collapseTypes">
            <div className="main-body" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {availableTypes.length === 0 ? (
                <p className="text-muted mb-0 mt-2">No types available</p>
              ) : (
                availableTypes.map((type, idx) => (
                  <div key={idx} className="form-check mb-2 mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      id={`type-filter-${idx}`}
                    />
                    <label className="form-check-label fw-500" htmlFor={`type-filter-${idx}`}>
                      {type}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

{/* Budget */}
        {/* I've updated this block to match the UI of your second file 
          (using a <label> instead of a collapsible <a> tag)
          AND I've included the functional fix for the slider.
        */}
        <div className="filter-block bottom-line pb-25 mt-25">
          
          {/* This <label> matches the UI of your second file */}
          <label className="form-label fw-500">Budget Range ({userCurrency})</label>

          {/* This <input> contains the FUNCTIONAL FIX */}
          <input
            type="range"
            className="form-range mb-2" // This className is the same as your working file
            min="0"
            max={Math.ceil(maxPriceInUserCurrency)}
            
            // THIS IS THE FIX:
            // It converts your USD 'priceValue' prop into the 'userCurrency'
            // so the slider's 'value' and 'max' are in the same currency.
            value={Math.round(convertToUserCurrency(priceValue[1], userCurrency))}
            
            onChange={(e) => {
              // This part was already correct:
              // It converts the new slider value back to USD for the parent component.
              const newMaxInUserCurrency = Number(e.target.value);
              const newMaxInUSD = newMaxInUserCurrency / (EXCHANGE_RATES[userCurrency] || 1);
              setPriceValue([0, newMaxInUSD]);
            }}
          />
          
          {/* This <div> matches the UI of your second file (I added 'mb-3') */}
          <div className="d-flex justify-content-between mb-3">
            <span className="fw-500">{userCurrency} 0</span>
            
            {/* THIS IS THE SECOND FIX:
                This label also needs to show the converted value. */}
            <span className="fw-500">
              {userCurrency} {Math.round(convertToUserCurrency(priceValue[1], userCurrency)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default FilterArea;