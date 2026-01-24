"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { TrustedCompany } from "@/types/cms.types";

// ===== Slider settings =====
const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0, // Continuous scrolling - no pause
  speed: 3000, // Slower, smoother transition
  cssEase: "linear",
  pauseOnHover: false,
  infinite: true, // Ensure looping
  variableWidth: false,
  responsive: [
    { breakpoint: 1400, settings: { slidesToShow: 5 } },
    { breakpoint: 992, settings: { slidesToShow: 4 } },
    { breakpoint: 768, settings: { slidesToShow: 3 } },
    { breakpoint: 576, settings: { slidesToShow: 2 } },
  ],
};

interface PartnersSliderProps {
  companies: TrustedCompany[];
}

// ===== Component =====
const PartnersSlider: React.FC<PartnersSliderProps> = ({ companies }) => {
  // If no companies data, return null or show empty state
  if (!companies || companies.length === 0) {
    return null;
  }

  // Dynamic slider settings based on number of companies
  const companiesCount = companies.length;
  const dynamicSliderSettings = {
    ...slider_setting,
    slidesToShow: Math.min(6, companiesCount), // Don't show more slides than available
    infinite: companiesCount > 1, // Only enable infinite loop if more than 1 company
    autoplay: companiesCount > 1, // Only autoplay if more than 1 company
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: Math.min(5, companiesCount) },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.min(4, companiesCount) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(3, companiesCount) },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: Math.min(2, companiesCount) },
      },
    ],
  };

  return (
    <Slider {...dynamicSliderSettings} className="partner-slider">
      {companies.map((company) => (
        <div key={company.cms_id} className="item">
          <div
            className="logo d-flex align-items-center justify-content-center"
            style={{ height: "100px", padding: "8px" }}
          >
            <img
              src={company.logo_url}
              alt={company.company_name}
              title={company.company_name}
              style={{
                width: "100%",
                maxWidth: "160px",
                height: "auto",
                maxHeight: "80px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default PartnersSlider;
