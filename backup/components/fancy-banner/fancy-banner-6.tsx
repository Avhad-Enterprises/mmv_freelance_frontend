import Link from "next/link";
import React from "react";

const FancyBannerSix = () => {
  return (
    <section className="fancy-banner-five bg-image position-relative pt-100 lg-pt-60 pb-100 lg-pb-60">
      <div className="container">
        <div className="position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="title-one text-center text-lg-start">
              </div>
            </div>
            <div className="col-lg-5 ms-auto">
              <ul className="btn-group style-none d-flex justify-content-center justify-content-lg-start">
                <li className="me-2 ms-2 ms-lg-0">
                  <Link href="/job-list-v1" className="btn-seven border6">
                    Looking for job?
                  </Link>
                </li>
                <li className="ms-2 ms-2 ms-lg-0">
                  <Link href="/coming-soon" className="btn-five border6">
                    Start Hiring
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FancyBannerSix;
