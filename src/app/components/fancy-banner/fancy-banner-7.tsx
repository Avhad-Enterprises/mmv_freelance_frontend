import React from "react";
import Image from "next/image";
import icon from "@/assets/images/icon/icon_46.svg";
import img from "@/assets/images/assets/img_41.png";

const FancyBannerSeven = () => {
  return (
    <section className="fancy-banner-six mt-150 xl-mt-120 lg-mt-100">
      <div className="container">
        <div className="bg-wrapper position-relative ps-4 pe-4 pt-50 pb-50 md-pt-30 md-pb-30 wow fadeInUp">
          <div className="row">
            <div className="col-lg-6 d-flex align-items-center">
              <div className="img-meta position-relative md-mt-20">
                <Image
                  src={img}
                  alt="img"
                  className="lazy-img"
                  style={{ height: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center">
              <div className="text-wrapper">
                <div className="title-two">
                  <h2 className="main-font">
                    Ready to launch you next video project?</h2>
                </div>
                <p className="text-dark opacity-70 mt-25 lg-mt-20 mb-45 lg-mb-30">
                  Join world's leading marketplace for video creators today.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <a href="/coming-soon" className="upload-btn position-relative d-flex align-items-center justify-content-center">
                    <span className="fw-500 ms-2 text-white">
                      Post a Job for Free
                    </span>
                  </a>
                  <a href="/coming-soon" className="upload-btn d-flex align-items-center justify-content-center">
                    <span className="fw-500 text-white">Start Earning Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FancyBannerSeven;
