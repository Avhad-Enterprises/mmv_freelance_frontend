"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import job_data from "@/data/job-data";
import JobGridItem from "./grid/job-grid-item";
import { IJobType } from "@/types/job-data-type";

const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

interface RelatedJobsProps {
  category: string[];
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({ category }) => {
  const sliderRef = useRef<Slider | null>(null);

  // Debug logs
  console.log("Received category:", category);

  const job_items: IJobType[] = job_data.filter((job) => {
    if (!job.project_category) return false;

    return category.some((c) =>
      job.project_category.toLowerCase().trim() === c.toLowerCase().trim()
    );
  });

  console.log("Filtered Related Jobs:", job_items);

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };

  if (job_items.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        No related jobs found.
      </div>
    );
  }

  return (
    <section className="related-job-section pt-90 lg-pt-70 pb-120 lg-pb-70">
      <div className="container">
        <div className="position-relative">
          <div className="title-three text-center text-md-start mb-55 lg-mb-40">
            <h2 className="main-font">Related Jobs</h2>
          </div>

          <Slider {...slider_setting} ref={sliderRef} className="related-job-slider">
            {job_items.map((j) => (
              <div key={j.projects_task_id} className="item">
                <JobGridItem item={j} />
              </div>
            ))}
          </Slider>

          <ul className="slider-arrows slick-arrow-one color-two d-flex justify-content-center style-none sm-mt-20">
            <li onClick={sliderPrev} className="prev_e slick-arrow">
              <i className="bi bi-arrow-left"></i>
            </li>
            <li onClick={sliderNext} className="next_e slick-arrow">
              <i className="bi bi-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedJobs;
