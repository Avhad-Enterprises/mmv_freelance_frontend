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
        console.log("📂 [Categories] Fetching from API...");
        console.log(
          "📂 [Categories] API URL:",
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`
        );
        console.log("📂 [Categories] Response status:", response.status);
        console.log("📂 [Categories] Response OK:", response.ok);

        //Get raw text first to see what we're receiving
        const responseText = await response.text();
        console.log(
          "📂 [Categories] Raw response (first 500 chars):",
          responseText.substring(0, 500)
        );

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

        console.log("📂 [Categories] Parsed API response:", result);

        const allCategories = result.data || [];
        console.log(
          "📂 [Categories] All categories count:",
          allCategories.length
        );

        // Filter only active categories to match filter component
        const activeCategories = allCategories.filter(
          (cat: any) => cat.is_active
        );
        console.log(
          "📂 [Categories] Active categories count:",
          activeCategories.length
        );
        console.log("📂 [Categories] Active categories:", activeCategories);

        const options = activeCategories.map((cat: any) => ({
          value: cat.category_name.replace(/\s+/g, " ").trim(),
          label: cat.category_name.replace(/\s+/g, " ").trim(),
        }));

        console.log("📂 [Categories] Dropdown options:", options);
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
