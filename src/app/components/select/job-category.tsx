import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/nice-select";

interface Category {
  category_name: string;
}

type Props = {
  setCategoryVal: React.Dispatch<React.SetStateAction<string>>;
};

const JobCategorySelect = ({ setCategoryVal }: Props) => {
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
        const result = await response.json();
        const allCategories = result.data || [];
        
        // Filter only active categories to match filter component
        const activeCategories = allCategories.filter((cat: any) => cat.is_active);

        const options = activeCategories.map((cat: any) => ({
          value: cat.category_name.replace(/\s+/g, ' ').trim(),
          label: cat.category_name.replace(/\s+/g, ' ').trim(),
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategory = (item: { value: string; label: string }) => {
    setCategoryVal(item.value.replace(/\s+/g, ' ').trim());
  };

  return (
    <NiceSelect
      options={categoryOptions}
      defaultCurrent={0}
      onChange={handleCategory}
      name="Category"
      cls="category"
    />
  );
};

export default JobCategorySelect;
