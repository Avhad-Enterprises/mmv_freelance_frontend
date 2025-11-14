import React from "react";
import Select from 'react-select';

interface Skill {
  skill_id: number;
  skill_name: string;
}

interface Props {
  skills: Skill[];
  onChange: (values: string[]) => void;
  value: string[];
}

const FilterJobSkills = ({ skills, onChange, value }: Props) => {
  const options = skills.map(skill => ({
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