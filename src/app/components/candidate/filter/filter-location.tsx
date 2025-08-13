import React from "react";
import NiceSelect from "@/ui/nice-select";

const FilterCandidateLocation = ({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (value: string) => void;
}) => {
  const options = locations.map((loc) => ({
    value: loc,
    label: loc,
  }));

  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => onChange(item.value)}
      cls="bg-white"
      name="Location"
    />
  );
};

export default FilterCandidateLocation;
