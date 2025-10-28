import React from "react";
import Select from 'react-select';

const FilterJobSkills = ({
  skills,
  onChange,
  value,
}: {
  skills: { skill_id: number; skill_name: string }[];
  onChange: (values: string[]) => void;
  value: string[];
}) => {
  const options = skills.map((skill) => ({
    value: skill.skill_name,
    label: skill.skill_name,
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
      placeholder="Select Skills"
    />
  );
};

export default FilterJobSkills;