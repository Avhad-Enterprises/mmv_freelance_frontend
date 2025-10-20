import React from "react";
import Select from 'react-select';

interface Props {
  locations: string[];
  onChange: (values: string[]) => void;
  value: string[];
}

const FilterCandidateLocation = ({ locations, onChange, value }: Props) => {
  const options = locations.map(loc => ({
    value: loc,
    label: loc,
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
      placeholder="Select Locations"
    />
  );
};

export default FilterCandidateLocation;
