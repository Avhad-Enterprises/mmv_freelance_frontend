import React from "react";
import Select from 'react-select';

const FilterJobCategory = ({
  categories,
  onChange,
  value,
}: {
  categories: { category_id: number; category_name: string }[];
  onChange: (values: string[]) => void;
  value: string[];
}) => {
  const options = categories.map((category) => ({
    value: category.category_name,
    label: category.category_name,
  }));

  return (
    <Select
      isMulti
      options={options}
      value={options.filter(option => value.includes(option.value))}
      onChange={(selectedOptions) => {
        onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
      }}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select Categories"
    />
  );
};

export default FilterJobCategory;