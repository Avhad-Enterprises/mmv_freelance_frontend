import React from "react";
import NiceSelect from "@/ui/nice-select";

const FilterJobCategory = ({
  categories,
  onChange,
}: {
  categories: { category_id: number; category_name: string }[];
  onChange: (value: string) => void;
}) => {
  const options = [
    { value: "", label: "Select Category" }, // Default option
    ...categories.map((category) => ({
      value: category.category_name,
      label: category.category_name,
    })),
  ];

  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => onChange(item.value)}
      cls="bg-white"
      name="Category"
    />
  );
};

export default FilterJobCategory;