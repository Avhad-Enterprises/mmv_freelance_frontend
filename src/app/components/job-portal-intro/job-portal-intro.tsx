import React from "react";
import Link from "next/link";

const JobPortalIntro = ({top_border=false}:{top_border?:boolean}) => {
  return (
    <section className="job-portal-intro">
      <div className="container">
        <div className={`wrapper bottom-border ${top_border?'top-border':''} pt-100 lg-pt-80 md-pt-50 pb-65 md-pb-50`}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="text-center text-lg-start wow fadeInUp" data-wow-delay="0.3s">
                {/* Content removed */}
              </div>
            </div>
            <div className="col-lg-5">
              {/* Buttons removed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPortalIntro;
