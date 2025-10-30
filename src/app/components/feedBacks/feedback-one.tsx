"use client"
import Slider from "react-slick";
import React, { useRef } from "react";
import { Quote } from "lucide-react";

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

// feedback data
const feedback_data: {
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
    {
      id: 4,
      title:
        "MakeMyVid.io isn't just a place to find video editing jobs; their integrated tools are a lifesaver. The built-in tools like CompVid save me hours on every project. It truly helps video freelancers like me manage projects more efficiently.",
      name: "Mayuri Kudalkar",
      user_title: "Freelance Video Editor, Kolhapur, India",
      rating: 4.9,
      rating_text: "Excellent",
    },
    {
      id: 5,
      title:
        "The quality of curated video talent on MakeMyVid.io is exceptional. The rigorous vetting process means we consistently find high-quality video editors with proven portfolios. For any video creation project, this is our go-to for reliable and professional talent.",
      name: "Amanda Martin",
      user_title: "Co-founder, The SignBee Academy, New York, USA",
      rating: 5.0,
      rating_text: "Excellent",
    },
    {
      id: 6,
      title:
        "Finding a remote video editor who truly understood our brand voice was a challenge until MakeMyVid.io. We found a highly skilled professional in days, and our YouTube video editing quality has never been better. The platform made the outsource video editing process incredibly smooth and efficient. Truly a game-changer for our content strategy",
      name: "Aditya John",
      user_title: "Founder, How to DXB Real Estate, Dubai",
      rating: 4.9,
      rating_text: "Excellent",
    },
];

const FeedbackOne = ({ style_2 = false, style_3 = false, about_p = false }: { style_2?: boolean; style_3?: boolean; about_p?: boolean }) => {
  const sliderRef = useRef<Slider | null>(null);

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };
  return (
    <section className={`feedback-section-one ${style_3 ? 'pt-120 lg-pt-100' : 'pt-180 xl-pt-150 lg-pt-100'} ${about_p ? 'pb-80 lg-pb-20' : ''}`}>
      <style jsx>{`
        .feedback-block-one {
          background-color: #2CE08B;
          transition: all 0.3s ease;
          border: none !important;
          border-radius: 20px;
        }
        .feedback-block-one:hover {
          background-color: #2CE08B;
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
      `}</style>
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-5 col-md-6">
            <div className="title-one text-center text-md-start mb-65 md-mb-50 wow fadeInUp" data-wow-delay="0.3s">
              <h2 className={style_3 ? 'main-font' : ''}>Success Stories</h2>
            </div>
          </div>
        </div>

        <Slider
          {...slider_setting}
          className="row feedback-slider-one"
          ref={sliderRef}
        >
          {feedback_data.map((item) => (
            <div key={item.id} className="item">
              <div className={`feedback-block-one ${style_2 ? 'color-two' : ''}`}>
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
                            className={`bi ${
                              index < Math.round(item.rating)
                                ? 'bi-star-fill'
                                : 'bi-star'
                            }`}
                            style={{ color: 'white' }}
                          ></i>
                        </a>
                      </li>
                    ))}
                  </ul>
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