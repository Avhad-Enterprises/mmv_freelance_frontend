"use client";
import Slider from "react-slick";
import React, { useRef } from "react";
import { Quote } from "lucide-react";
import { SuccessStory } from "@/types/cms.types";

// slider_setting
const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

// Default feedback data (fallback if no CMS data)
const default_feedback_data: {
  id: number;
  title: string;
  name: string;
  user_title: string;
  rating: number;
  rating_text: string;
}[] = [
    {
      id: 1,
      title:
        "MakeMyVid.io unlocked a global talent pool of freelance video editors for our campaigns. Unmatched quality, affordable rates, every time.",
      name: "Rajeev Aggarwal",
      user_title: "Partner, That Fig Tree, Singapore",
      rating: 5.0,
      rating_text: "Excellent",
    },
    {
      id: 2,
      title:
        "We wanted dedicated videographers in 9 cities for our UK-India tour. MakeMyVid.io help us connect with right talent and streamlined our entire production workflow.",
      name: "Sanam Arora",
      user_title: "Founder, NISAU-UK, London",
      rating: 4.9,
      rating_text: "Excellent",
    },
    {
      id: 3,
      title:
        "Zero commission for videographers? It's revolutionary. I've doubled my gigs this quarter. The platform consistently provides freelance videography projects and connect me with amazing clients. It's truly built for video creators.",
      name: "Ravinder Singh",
      user_title: "Freelance Videographer, Chandigarh, India",
      rating: 5.0,
      rating_text: "Excellent",
    },
  ];

interface FeedbackOneProps {
  successStories?: SuccessStory[];
  style_2?: boolean;
  style_3?: boolean;
  about_p?: boolean;
}

const FeedbackOne: React.FC<FeedbackOneProps> = ({
  successStories = [],
  style_2 = false,
  style_3 = false,
  about_p = false,
}) => {
  const sliderRef = useRef<Slider | null>(null);

  // Use CMS data if available, otherwise use default data
  const displayData =
    successStories.length > 0
      ? successStories.map((story) => ({
        id: story.cms_id,
        title: story.testimonial,
        name: story.client_name,
        user_title: story.client_title || "",
        rating: story.rating || 5.0,
        rating_text:
          story.rating && story.rating >= 4.5 ? "Excellent" : "Great",
      }))
      : default_feedback_data;

  // Dynamic slider settings based on number of stories
  const storiesCount = displayData.length;
  const dynamicSliderSettings = {
    ...slider_setting,
    slidesToShow: Math.min(2, storiesCount), // Don't show more slides than available
    infinite: storiesCount > 1, // Only enable infinite loop if more than 1 story
    autoplay: storiesCount > 1, // Only autoplay if more than 1 story
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Always show 1 on mobile
        },
      },
    ],
  };

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };
  return (
    <section
      className={`feedback-section-one ${style_3 ? "pt-120 lg-pt-100" : "pt-180 xl-pt-150 lg-pt-100"
        } ${about_p ? "pb-80 lg-pb-20" : ""}`}
    >
      <style jsx>{`
        .feedback-block-one {
          background-color: #2ce08b;
          transition: all 0.3s ease;
          border: none !important;
          border-radius: 20px;
        }
        .feedback-block-one:hover {
          background-color: #2ce08b;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(44, 224, 139, 0.3);
        }
        .quote-icon {
          width: 120px;
          height: 120px;
          color: rgba(255, 255, 255, 0.2);
        }
        .feedback-block-one blockquote {
          font-size: 1.2em;
        }
        .feedback-block-one .name {
          font-size: 1em;
        }
        .feedback-block-one .review {
          font-size: 1em;
        }

        /* Fix slider item widths */
        :global(.feedback-slider-one .slick-slide) {
          padding: 0 10px;
        }
        :global(.feedback-slider-one .slick-slide > div) {
          width: 100%;
        }
        :global(.feedback-slider-one .slick-track) {
          display: flex !important;
        }
        :global(.feedback-slider-one .item) {
          height: auto;
          width: 100%;
        }
      `}</style>
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-5 col-md-6">
            <div
              className="title-one text-center text-md-start mb-65 md-mb-50 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <h2 className={style_3 ? "main-font" : ""}>Success Stories</h2>
            </div>
          </div>
        </div>

        <Slider
          {...dynamicSliderSettings}
          className="feedback-slider-one"
          ref={sliderRef}
        >
          {displayData.map((item) => (
            <div key={item.id} className="item">
              <div className="px-3">
                <div
                  className={`feedback-block-one ${style_2 ? "color-two" : ""}`}
                >
                  <div className="logo">
                    <Quote className="quote-icon" strokeWidth={3} />
                  </div>
                  <blockquote className="fw-500 mt-50 md-mt-30 mb-50 md-mb-30 text-white">
                    {item.title}
                  </blockquote>
                  <div className="name text-white">
                    <span className="fw-500">{item.name},</span>
                    {` ${item.user_title}`}
                  </div>
                  <div className="review pt-40 md-pt-20 mt-40 md-mt-30 d-flex justify-content-between align-items-center">
                    <div className="text-md fw-500 text-white">
                      {item.rating.toFixed(1)} {item.rating_text}
                    </div>
                    <ul className="style-none d-flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <li key={index}>
                          <a href="#">
                            <i
                              className={`bi ${index < Math.round(item.rating)
                                  ? "bi-star-fill"
                                  : "bi-star"
                                }`}
                              style={{ color: "white" }}
                            ></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <ul className="slider-arrows slick-arrow-one d-flex justify-content-center style-none sm-mt-30">
          <li className="prev_b slick-arrow" onClick={sliderPrev}>
            <i className="bi bi-arrow-left"></i>
          </li>
          <li className="next_b slick-arrow" onClick={sliderNext}>
            <i className="bi bi-arrow-right"></i>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default FeedbackOne;
