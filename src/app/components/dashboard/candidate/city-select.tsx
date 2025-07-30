import NiceSelect from "@/ui/nice-select";
import React from "react";

type CitySelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

const CitySelect = ({ value, onChange }: CitySelectProps) => {
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
      name="City"
    />
  );
};
export default CitySelect;
