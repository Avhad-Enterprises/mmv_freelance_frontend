// @/components/list/job-prices.tsx (Updated with Button-Style Ranges)

import React from 'react';

// Prop type remains the same
type IProps = {
  priceValue: [number, number];
  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  maxPrice: number;
};

const JobPrices = ({ priceValue, setPriceValue, maxPrice }: IProps) => {
  // You can still customize the price ranges here
  const priceRanges = [
    { label: 'Any Price', value: [0, maxPrice] as [number, number] },
    { label: 'Under $1,000', value: [0, 1000] as [number, number] },
    { label: '$1,000 - $5,000', value: [1000, 5000] as [number, number] },
    { label: '$5,000 - $10,000', value: [5000, 10000] as [number, number] },
    { label: 'Over $10,000', value: [10000, maxPrice] as [number, number] },
  ];

  const handleRangeChange = (range: [number, number]) => {
    setPriceValue(range);
  };

  // Helper function to check if a range is currently selected
  const isSelected = (rangeValue: [number, number]) => {
    return JSON.stringify(priceValue) === JSON.stringify(rangeValue);
  };

  return (
    <div className="main-body">
      <div className="d-flex flex-wrap gap-2">
        {priceRanges.map((range) => (
          // We use the label as a key since it's unique
          <div key={range.label}>
            {/* The actual radio input is now visually hidden but still functional */}
            <input
              type="radio"
              name="budgetRange"
              id={range.label}
              checked={isSelected(range.value)}
              onChange={() => handleRangeChange(range.value)}
              style={{ display: 'none' }}
            />

            {/* The label is styled to look and act like a button */}
            <label
              htmlFor={range.label}
              className={`btn btn-sm ${
                isSelected(range.value) ? 'btn-dark' : 'btn-outline-secondary'
              }`}
              style={{ cursor: 'pointer' }}
            >
              {range.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobPrices;