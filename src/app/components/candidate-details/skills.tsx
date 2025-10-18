// components/candidate/skills.tsx
import React from "react";

type SkillsProps = {
  skills?: string[];
};

const Skills = ({ skills }: SkillsProps) => {
  if (!skills || skills.length === 0) {
    return <p>No skills listed yet.</p>;
  }

  return (
    <ul className="style-none skill-tags d-flex flex-wrap pb-25">
      {skills.map((skill, idx) => (
        <li key={idx}>{skill}</li>
      ))}
    </ul>
  );
};

export default Skills;