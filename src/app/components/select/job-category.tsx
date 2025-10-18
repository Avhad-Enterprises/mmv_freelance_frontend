import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/nice-select";
import { makeGetRequest } from "@/utils/api"; // adjust this path as needed
import slugify from "slugify";

interface ProjectTask {
  project_category: string;
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
        const res = await makeGetRequest("projects-tasks/listings");
        const projects: ProjectTask[] = res.data?.data || [];

        const uniqueCategories = [
          ...new Set(
            projects
              .map((proj) => proj.project_category)
              .filter(Boolean) // ignore null/undefined
          ),
        ];

        const options = uniqueCategories.map((cat) => ({
          value: slugify(cat.toLowerCase(), "-"),
          label: cat,
        }));

        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching project categories:", error);
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
