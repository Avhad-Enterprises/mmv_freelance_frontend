import React from "react";
import job_data from "@/data/job-data";
import { setExperience } from "@/redux/features/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

export function JobExperienceItems({ showLength = true }: { showLength?: boolean }) {
  const dispatch = useAppDispatch();
  const { experience } = useAppSelector((state) => state.filter);

  // Filter out undefined values from experience
  const uniqueExperiences = [...new Set(
    job_data
      .map((job) => job.experience)
      .filter((exp): exp is string => typeof exp === "string")
  )];

  return (
    <>
      {uniqueExperiences.map((exp, index) => (
        <li key={index}>
          <input
            type="checkbox"
            name="experience"
            id={`exp-${index}`}
            value={exp}
            checked={experience.includes(exp)}
            onChange={() => dispatch(setExperience(exp))}
          />
          <label htmlFor={`exp-${index}`}>
            {exp}
            {showLength && (
              <span>
                {
                  job_data.filter(
                    (job) => job.experience?.trim().toLowerCase() === exp.trim().toLowerCase()
                  ).length
                }
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobExperience = () => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobExperienceItems />
      </ul>
    </div>
  );
};

export default JobExperience;
