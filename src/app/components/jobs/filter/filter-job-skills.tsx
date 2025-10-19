import React from "react";
import NiceSelect from "@/ui/nice-select";

const FilterJobSkills = ({
  skills,
  onChange,
}: {
  skills: { skill_id: number; skill_name: string }[];
  onChange: (value: string) => void;
}) => {
  const options = [
    { value: "", label: "Select Skill" }, // Default option
    ...skills.map((skill) => ({
      value: skill.skill_name,
      label: skill.skill_name,
    })),
  ];

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

export default FilterJobSkills;