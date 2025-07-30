import React from "react";
import NiceSelect from "@/ui/nice-select";

type StateSelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

const StateSelect = ({ value, onChange }: StateSelectProps) => {
  const options = [
    { value: "Sydney", label: "Sydney" },
    { value: "Tokyo", label: "Tokyo" },
    { value: "Delhi", label: "Delhi" },
    { value: "Shanghai", label: "Shanghai" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "London", label: "London" },
  ];

  const selectedIndex = options.findIndex(opt => opt.value === value);

  return (
    <NiceSelect
      key={value}
      options={options}
      defaultCurrent={selectedIndex >= 0 ? selectedIndex : 0}
      onChange={(item) => onChange(item.value)}
      name="State"
    />
  );
};

export default StateSelect;
