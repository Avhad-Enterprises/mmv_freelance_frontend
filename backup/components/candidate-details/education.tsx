// components/candidate/education.tsx
"use client";

import React from "react";

export type EducationItem = {
  degree: string;
  institution: string;
  year_of_completion: number;
};

type EducationProps = {
  education?: EducationItem[];
};

const Education: React.FC<EducationProps> = ({ education }) => {
  if (!education || education.length === 0) {
    return <p>No education added yet.</p>;
  }

  return (
    <div className="time-line-data position-relative pt-15">
      {education.map((edu, idx) => (
        <div key={idx} className="info position-relative">
          <div className="numb fw-500 rounded-circle d-flex align-items-center justify-content-center">
            {idx + 1}
          </div>
          <div className="text_1 fw-500">{edu.institution}</div>
          <h4>{edu.degree}</h4>
          <p>Year of completion: {edu.year_of_completion}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;