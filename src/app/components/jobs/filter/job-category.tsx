// @/components/list/job-category.tsx (Corrected)

import React from "react";
import { setProjectCategory } from "@/redux/features/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

// Define the type to match your API response
interface ICategory {
  category_id: number;
  category_name: string;
}

interface IJobCategoryItemsProps {
    all_categories: ICategory[];
}

export function JobCategoryItems({ all_categories }: IJobCategoryItemsProps) {
  const { project_category } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  
  return (
    <>
      {all_categories.map((cat) => (
        <li key={cat.category_id}> {/* <-- CHANGED from cat.id */}
          <input
            onChange={() => dispatch(setProjectCategory(cat.category_name))} 
            type="checkbox"
            name={cat.category_name} 
            id={`cat-${cat.category_id}`} 
            value={cat.category_name} 
            checked={project_category.includes(cat.category_name)} 
          />
          <label htmlFor={`cat-${cat.category_id}`}>{cat.category_name}</label> 
        </li>
      ))}
    </>
  );
}

interface IJobCategoryProps {
    all_categories: ICategory[];
}

const JobCategory = ({ all_categories }: IJobCategoryProps) => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobCategoryItems all_categories={all_categories} />
      </ul>
    </div>
  );
};

export default JobCategory;