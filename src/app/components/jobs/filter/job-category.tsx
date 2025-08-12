import React, { useEffect, useState } from "react";
import { setProjectCategory } from "@/redux/features/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { makeGetRequest } from "@/utils/api";

interface ProjectType {
  project_category?: string;
}

export function JobCategoryItems({ showLength = true }: { showLength?: boolean }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const { project_category } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await makeGetRequest("projectsTask/getallprojects_task");
        const data = res.data?.data || [];

        setProjects(data);

        const allCategories = (data as ProjectType[])
          .map((job) => job.project_category)
          .filter((c): c is string => Boolean(c));

        const unique = [...new Set(allCategories)];
        setCategories(unique);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {categories.map((c, index) => (
        <li key={index}>
          <input
            onChange={() => dispatch(setProjectCategory(c))}
            type="checkbox"
            name={c}
            id={`cat-${index}`}
            value={c}
            checked={project_category.includes(c)}
          />
          <label htmlFor={`cat-${index}`}>
            {c}
            {showLength && (
              <span>
                {projects.filter((job) => job.project_category === c).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobCategory = () => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobCategoryItems />
      </ul>
    </div>
  );
};

export default JobCategory;
