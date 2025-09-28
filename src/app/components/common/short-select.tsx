"use client";
import React from "react";
import NiceSelect from "@/ui/nice-select";

interface Props {
  onChange: (value: string) => void;
}

const ShortSelect: React.FC<Props> = ({ onChange }) => {
  const handleShort = (item: { value: string; label: string }) => {
    onChange(item.value);
  };

  return (
    <NiceSelect
      options={[
        { value: "New", label: "New" },
        { value: "Category", label: "Category" },
        { value: "Job Type", label: "Job Type" },
        { value: "Budget", label: "Budget" },
      ]}
      defaultCurrent={0}
      onChange={handleShort}
      name="Sort by"
    />
  );
};

export default ShortSelect;
