// @/components/list/job-skills.tsx

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setTags } from "@/redux/features/filterSlice";

// CHANGED: Update the interface to match the API response
interface ISkill {
  skill_id: number;
  skill_name: string;
}

// Props for the items component
interface IJobSkillsItemsProps {
  all_skills: ISkill[];
}

// This component renders the individual checkboxes
export function JobSkillsItems({ all_skills }: IJobSkillsItemsProps) {
  const { tags } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  return (
    <>
      {all_skills.map((skill) => (
        <li key={skill.skill_id}> {/* CHANGED: Use skill_id for the key */}
          <input
            onChange={() => dispatch(setTags(skill.skill_name))}
            type="checkbox"
            name="skills"
            value={skill.skill_name} 
            checked={tags.includes(skill.skill_name)} 
          />
          <label>{skill.skill_name}</label> 
        </li>
      ))}
    </>
  );
}

// Props for the main component
interface IJobSkillsProps {
  all_skills: ISkill[];
}

const JobSkills = ({ all_skills }: IJobSkillsProps) => {
  return (
    <div className="main-body">
      <ul className="style-none d-flex flex-wrap radio-filter mb-5">
        <JobSkillsItems all_skills={all_skills} />
      </ul>
    </div>
  );
};

export default JobSkills;