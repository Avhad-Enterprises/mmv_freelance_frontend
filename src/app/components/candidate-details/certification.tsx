import React from "react";

type CertificationProps = {
  certification?: {
    name: string;
    issued_by: string;
    year: number;
  }[];
};

const Certifications = ({ certification }: CertificationProps) => {
  if (!certification || certification.length === 0) {
    return <p>No certifications added yet.</p>;
  }

  return (
    <div className="time-line-data position-relative pt-15">
      {certification.map((cert, idx) => (
        <div key={idx} className="info position-relative">
          <div className="numb fw-500 rounded-circle d-flex align-items-center justify-content-center">
            {idx + 1}
          </div>
          <div className="text_1 fw-500">
            {cert.year}
          </div>
          <h4>{cert.name}</h4>
          <p><strong>Issued By:</strong> {cert.issued_by}</p>
        </div>
      ))}
    </div>
  );
};

export default Certifications;
