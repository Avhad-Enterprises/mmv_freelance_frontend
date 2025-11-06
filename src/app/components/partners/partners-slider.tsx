"use client";
import React from "react";
import Slider from "react-slick";
import Image, { StaticImageData } from "next/image";

// ===== Import all carousal images manually =====
import logo_1 from "@/assets/images/logo/carousal_1.png";
import logo_2 from "@/assets/images/logo/carousal_2.png";
import logo_3 from "@/assets/images/logo/carousal_3.png";
import logo_4 from "@/assets/images/logo/carousal_4.png";
import logo_5 from "@/assets/images/logo/carousal_5.png";
import logo_6 from "@/assets/images/logo/carousal_6.png";
import logo_7 from "@/assets/images/logo/carousal_7.png";
import logo_8 from "@/assets/images/logo/carousal_8.png";
import logo_9 from "@/assets/images/logo/carousal_9.png";
import logo_10 from "@/assets/images/logo/carousal_10.jpg";
import logo_11 from "@/assets/images/logo/carousal_11.jpg";
import logo_12 from "@/assets/images/logo/carousal_12.png";
import logo_13 from "@/assets/images/logo/carousal_13.png";
import logo_14 from "@/assets/images/logo/carousal_14.png";
import logo_15 from "@/assets/images/logo/carousal_15.png";
import logo_16 from "@/assets/images/logo/carousal_16.png";
import logo_17 from "@/assets/images/logo/carousal_17.png";
import logo_18 from "@/assets/images/logo/carousal_18.png";
import logo_19 from "@/assets/images/logo/carousal_19.png";
import logo_20 from "@/assets/images/logo/carousal_20.png";
// 👉 You can continue adding up to carousal_60 if needed
// import logo_21 from "@/assets/images/logo/carousal_21.png";
// ...

// ===== Slider settings =====
const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 6,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  responsive: [
    { breakpoint: 1400, settings: { slidesToShow: 5 } },
    { breakpoint: 768, settings: { slidesToShow: 4 } },
    { breakpoint: 576, settings: { slidesToShow: 3 } },
  ],
};

// ===== Logo array =====
const logos: StaticImageData[] = [
  logo_1,
  logo_2,
  logo_3,
  logo_4,
  logo_5,
  logo_6,
  logo_7,
  logo_8,
  logo_9,
  logo_10,
  logo_11,
  logo_12,
  logo_13,
  logo_14,
  logo_15,
  logo_16,
  logo_17,
  logo_18,
  logo_19,
  logo_20,
];

// ===== Component =====
const PartnersSlider = () => {
  return (
    <Slider {...slider_setting} className="partner-slider">
      {logos.map((logo, i) => (
        <div key={i} className="item">
          <div className="logo d-flex align-items-center justify-content-center" style={{ height: '70px', padding: '5px' }}>
            <Image
              src={logo}
              alt={`carousal logo ${i + 1}`}
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default PartnersSlider;
