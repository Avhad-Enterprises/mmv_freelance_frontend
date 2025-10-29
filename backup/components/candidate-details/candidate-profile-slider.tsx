// app/components/candidate-details/candidate-profile-slider.tsx
"use client";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import default_port_1 from "@/assets/images/candidates/CP_01.jpg";

interface CandidateProfileSliderProps {
  portfolioLinks?: string[];
}

const CandidateProfileSlider: React.FC<CandidateProfileSliderProps> = ({ portfolioLinks }) => {
  const slider_setting = {
    // ... your slider settings
  };

  // --- MODIFIED: Filter the links to only include actual image files ---
  const imageLinks = (portfolioLinks || []).filter(link =>
    /\.(jpeg|jpg|gif|png|webp)$/.test(link.toLowerCase())
  );

  const imagesToDisplay = imageLinks.length > 0 ? imageLinks : [default_port_1.src];

  if (imagesToDisplay.length === 0) {
    return <p>No portfolio images available.</p>;
  }

  return (
    <Slider {...slider_setting} className="candidate-portfolio-slider">
      {imagesToDisplay.map((imgSrc, i) => (
        <div className="item" key={i}>
          <a href={imgSrc} target="_blank" rel="noopener noreferrer" className="w-100 d-blok">
            <Image
              src={imgSrc}
              alt={`Portfolio image ${i + 1}`}
              width={300}
              height={200}
              className="w-100"
              style={{ width: "100%", height: "auto", objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200'; }}
            />
          </a>
        </div>
      ))}
    </Slider>
  );
};

export default CandidateProfileSlider;