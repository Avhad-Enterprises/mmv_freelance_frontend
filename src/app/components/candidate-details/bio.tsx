// app/components/candidate/bio.tsx
import React from "react";

interface CandidateBioProps {
  bio: {
    location: string;
    email: string;
    rateAmount: string; // Changed from total_earnings
    availability: string;
    experience_level: string | null;
    role_name: string | null;
  };
}

const CandidateBio: React.FC<CandidateBioProps> = ({ bio }) => {
  return (
    <ul className="style-none">
      {/* <li>
        <span>Location: </span>
        <div>{bio.location}</div>
      </li> */}
      {bio.email &&
        !bio.email.includes("@example.com") &&
        bio.email.trim() !== "" && (
          <li>
            <span>Email: </span>
            <div>
              <a href={`mailto:${bio.email}`}>{bio.email}</a>
            </div>
          </li>
        )}
      <li>
        <span>Expected Rate: </span>
        <div>{bio.rateAmount} / hr</div>
      </li>
      {bio.availability && (
        <li>
          <span>Availability: </span>
          <div className="text-capitalize">
            {bio.availability.replace(/_/g, " ")}
          </div>
        </li>
      )}
      {bio.experience_level && (
        <li>
          <span>Experience: </span>
          <div className="text-capitalize">
            {bio.experience_level.replace(/_/g, " ")}
          </div>
        </li>
      )}
      {bio.role_name && (
        <li>
          <span>Role: </span>
          <div className="text-capitalize">
            {bio.role_name.replace(/_/g, " ")}
          </div>
        </li>
      )}
    </ul>
  );
};

export default CandidateBio;
