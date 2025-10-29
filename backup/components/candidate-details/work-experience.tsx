// components/candidate/work-experience.tsx
import React from "react";

type ExperienceProps = {
  experience?: {
    title: string;
    company?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
  }[];
};

const WorkExperience = ({ experience }: ExperienceProps) => {
  if (!experience || experience.length === 0) {
    return <p>No work experience yet.</p>;
  }

  return (
    <div className="time-line-data position-relative pt-15">
      {experience.map((exp, idx) => (
        <div key={idx} className="info position-relative">
          <div className="numb fw-500 rounded-circle d-flex align-items-center justify-content-center">
            {idx + 1}
          </div>
          <div className="text_1 fw-500">
            {exp.start_date} - {exp.end_date}
          </div>
          <h4>
            {exp.title} {exp.company ? `(${exp.company})` : ""}
          </h4>
          <p>{exp.description}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkExperience;