import NiceSelect from "@/ui/nice-select";
import React from "react";

type CountrySelectProps = {
  value?: string;
  onChange: (value: string) => void;
};

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const options = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Belgium", label: "Belgium" },
    { value: "Barbados", label: "Barbados" },
    { value: "Australia", label: "Australia" },
    { value: "Angola", label: "Angola" },
    { value: "Austria", label: "Austria" },
    { value: "London", label: "London" },
  ];

  const selectedIndex = options.findIndex(opt => opt.value === value);

  return (
    <NiceSelect
      key={value} // ✅ force update when DB country changes
      options={options}
      defaultCurrent={selectedIndex >= 0 ? selectedIndex : 0}
      onChange={(item) => onChange(item.value)}
      name="Country"
    />
  );
};
export default CountrySelect;
