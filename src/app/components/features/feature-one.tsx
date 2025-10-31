import React from "react";
import Link from "next/link";
import Image from "next/image";
import imgi from "@/assets/images/assets/picture 2.png"; // fixed path

// FeatureImgData
export function FeatureImgData() {
  return (
    <div className="img-data position-relative text-center md-mt-50">
      <Image
        src={imgi}
        alt="feature image"
        className="lazy-img mx-auto ms-[-1000px]" // moved slightly to the left
        width={900}
        height={600}
        priority
      />
    </div>
  );
}

const FeatureOne = () => {
  return (
    <section className="text-feature-one position-relative pt-180 xl-pt-150 lg-pt-100 md-pt-80 pb-180 xl-pb-150">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5 order-lg-last">
            <div className="ps-xxl-4 wow fadeInRight">
              <div className="title-one">
                <h2>Get over 50,000+ creative experts on one stage.</h2>
              </div>
              <p className="mt-40 md-mt-20 mb-40 md-mb-20">
                From indie filmmakers to top 3% video editors, our marketplace is loaded with talent you can trust.
              </p>
              <ul className="list-style-one style-none">
                <li>Seamless search & filters</li>
                <li>Verified top-tier creators</li>
                <li>Protected escrow payments</li>
              </ul>
              <Link href="/register" className="btn-one lg mt-50 md-mt-30">
                Post a Job
              </Link>
            </div>
          </div>
          <div className="col-lg-7 col-md-11 m-auto order-lg-first">
            <FeatureImgData />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureOne;
