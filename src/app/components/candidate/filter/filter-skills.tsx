import React from "react";
import NiceSelect from "@/ui/nice-select";

const FilterSkills = ({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (value: string) => void;
}) => {
  const options = skills.map((skill) => ({
    value: skill,
    label: skill,
  }));

  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => onChange(item.value)}
      cls="bg-white"
      name="Skills"
    />
  );
};

export default FilterSkills;
