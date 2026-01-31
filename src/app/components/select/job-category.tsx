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
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const apiUrl = `${API_BASE}/api/v1/categories`;

        let response: Response | null = null;
        try {
          response = await fetch(apiUrl);
        } catch (networkError) {
          console.warn("📂 [Categories] Network request failed, will try local mock.", networkError);
        }

        // If API failed or returned non-OK, try local mock file under public/mock
        if (!response || !response.ok) {
          response = await fetch("/mock/categories.json");
        }

        //Get raw text first to see what we're receiving
        const responseText = await response.text();

        // Try to parse JSON
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("📂 [Categories] ❌ JSON Parse Error:", parseError);
          console.error("📂 [Categories] ❌ Full response:", responseText);
          throw new Error(
            `API returned non-JSON response. Status: ${response.status}`
          );
        }


        const allCategories = result.data || [];

        // Filter only active categories to match filter component
        const activeCategories = allCategories.filter(
          (cat: any) => cat.is_active
        );
        const options = activeCategories.map((cat: any) => ({
          value: cat.category_name.replace(/\s+/g, " ").trim(),
          label: cat.category_name.replace(/\s+/g, " ").trim(),
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error("📂 [Categories] ❌ Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategory = (item: { value: string; label: string }) => {
    setCategoryVal(item.value.replace(/\s+/g, " ").trim());
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
