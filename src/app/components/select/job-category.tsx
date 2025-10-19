import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/nice-select";
import slugify from "slugify";

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
        const categories: Category[] = result.data || [];

        const options = categories.map((cat) => ({
          value: slugify(cat.category_name.toLowerCase(), "-"),
          label: cat.category_name,
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategory = (item: { value: string; label: string }) => {
    setCategoryVal(item.value);
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
