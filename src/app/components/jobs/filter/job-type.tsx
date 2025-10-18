import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setProjectsType } from "@/redux/features/filterSlice";
import { makeGetRequest } from "@/utils/api";

// Job type items (One-Time, Ongoing, etc.)
export function JobTypeItems({ showLength = true }: { showLength?: boolean }) {
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { projects_type } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const res = await makeGetRequest("projects-tasks/listings");
        const data = res.data?.data || [];

        setProjects(data);

        const allTypes = (data as { projects_type?: string }[])
          .map((job) => job.projects_type)
          .filter((type): type is string => Boolean(type));

        const unique = [...new Set(allTypes)];
        setJobTypes(unique);
      } catch (error) {
        console.error("Error fetching project types:", error);
      }
    };

    fetchJobTypes();
  }, []);

  return (
    <>
      {jobTypes.map((type, index) => (
        <li key={index}>
          <input
            onChange={() => dispatch(setProjectsType(type))}
            type="checkbox"
            name="JobType"
            value={type}
            checked={projects_type === type}
          />
          <label>
            {type}
            {showLength && (
              <span>
                {projects.filter((job) => job.projects_type === type).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobType = () => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobTypeItems />
      </ul>
    </div>
  );
};

export default JobType;
