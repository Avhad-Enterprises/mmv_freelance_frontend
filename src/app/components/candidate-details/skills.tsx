// import React from "react";

// const Skills = () => {
//   return (
//     <ul className="style-none skill-tags d-flex flex-wrap pb-25">
//       <li>Figma</li>
//       <li>HTML5</li>
//       <li>Illustrator</li>
//       <li>Adobe Photoshop</li>
//       <li>WordPress</li>
//       <li>jQuery</li>
//       <li>Web Design</li>
//       <li>Adobe XD</li>
//       <li>CSS</li>
//       <li className="more">3+</li>
//     </ul>
//   );
// };

// export default Skills;

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

