import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setTags } from "@/redux/features/filterSlice";
import { makeGetRequest } from "@/utils/api";

const JobTags = () => {
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const { tags } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await makeGetRequest("projectsTask/getallprojects_task");
        const projects = res.data?.data || [];

        const allTags = (projects as { tags?: string[] }[]).flatMap(
          (project) => project.tags || []
        );

        const unique = [...new Set(allTags)];
        setUniqueTags(unique);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="main-body">
      <ul className="style-none d-flex flex-wrap justify-space-between radio-filter mb-5">
        {uniqueTags.map((t, i) => (
          <li key={i}>
            <input
              onChange={() => dispatch(setTags(t))}
              type="checkbox"
              name="tags"
              value={t}
              checked={tags.includes(t)}
            />
            <label>{t}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobTags;
