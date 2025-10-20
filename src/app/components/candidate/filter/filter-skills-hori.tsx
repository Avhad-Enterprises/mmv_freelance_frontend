"use client";
import React from "react";
// Import the component and regular types
import Select, { StylesConfig } from "react-select";
// Import the 'MultiValue' type separately using 'import type'
import type { MultiValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

type Props = {
  skills: string[];
  onChange: (values: string[]) => void;
  selectedValues: string[];
  placeholder: string; // Added placeholder prop
};

const customStyles: StylesConfig<OptionType> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
    boxShadow: 'none',
    '&:hover': { borderColor: '#e8e8e8' },
    minHeight: '48px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f5f3' : 'white',
    color: '#333',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    overflow: 'hidden',
  }),
};

// This local constant named MultiValue is a component. It's safe now.
const MultiValue = () => null;

const FilterSkills = ({ skills, onChange, selectedValues, placeholder }: Props) => {
  const options: OptionType[] = skills.map((skill) => ({ value: skill, label: skill }));
  const currentValues = options.filter(option => selectedValues.includes(option.value));

  return (
    <Select
      isMulti
      options={options}
      value={currentValues}
      onChange={(selectedOptions: MultiValue<OptionType>) => {
        const values = selectedOptions.map(option => option.value);
        onChange(values);
      }}
      styles={customStyles}
      placeholder={placeholder} // Use the passed placeholder prop
      components={{ MultiValue }}
      closeMenuOnSelect={false}
    />
  );
};

export default FilterSkills;