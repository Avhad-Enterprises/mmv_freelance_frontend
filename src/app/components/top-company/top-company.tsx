import React from "react";
import { FeaturedCreator } from "@/types/cms.types";

// Generic User Icon to replace local images
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#28a745" // Green color
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lazy-img m-auto"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface TopCompanyProps {
  featuredCreators: FeaturedCreator[];
}

const TopCompany: React.FC<TopCompanyProps> = ({ featuredCreators }) => {
  // Limit to 4 creators for display
  const displayCreators = featuredCreators.slice(0, 4);

  return (
    <section className="top-company-section pt-100 lg-pt-60 pb-130 lg-pb-80 mt-200 xl-mt-150">
      <div className="container">
        <div className="row justify-content-between align-items-center pb-40 lg-pb-10">
          <div className="col-sm-7">
            <div className="title-one">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">
                Meet Our Featured Video Creators
              </h2>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="d-flex justify-content-sm-end">
              <a
                href="/coming-soon"
                className="btn-six d-none d-sm-inline-block"
              >
                Explore All Creators
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          {displayCreators.length > 0 ? (
            displayCreators.map((creator) => (
              <div key={creator.id} className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  {creator.profile_image ? (
                    <img
                      src={creator.profile_image}
                      alt={creator.name}
                      className="lazy-img m-auto"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <UserIcon />
                  )}
                  <div className="text-lg fw-500 text-dark mt-15 mb-30">
                    {creator.name}
                  </div>
                  <p className="mb-20">{creator.title || creator.bio || ""}</p>
                  <a
                    href={creator.portfolio_url || "/coming-soon"}
                    className="open-job-btn fw-500 tran3s"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            ))
          ) : (
            // Fallback to default data if no CMS data
            <>
              <div className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  <UserIcon />
                  <div className="text-lg fw-500 text-dark mt-15 mb-30">
                    Ria Sharra
                  </div>
                  <p className="mb-20">Wedding Film Editor | Mumbai, India</p>
                  <a href="/coming-soon" className="open-job-btn fw-500 tran3s">
                    View Portfolio
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  <UserIcon />
                  <div className="text-lg fw-500 text-dark mt-15 mb-30">
                    Chen Li
                  </div>
                  <p className="mb-20">
                    YouTube Video Specialist | Toronto, Canada
                  </p>
                  <a href="/coming-soon" className="open-job-btn fw-500 tran3s">
                    View services
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  <UserIcon />
                  <div className="text-lg fw-500 text-dark mt-15 mb-30">
                    Marcus V.
                  </div>
                  <p className="mb-20">
                    Corporate Video Specialist | London, UK
                  </p>
                  <a href="/coming-soon" className="open-job-btn fw-500 tran3s">
                    View open jobs
                  </a>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  <UserIcon />
                  <div className="text-lg fw-500 text-dark mt-15 mb-30">
                    Aisha Khan
                  </div>
                  <p className="mb-20">Reels & Shorts Editor | Dubai, UAE</p>
                  <a href="/coming-soon" className="open-job-btn fw-500 tran3s">
                    View portfolio
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-30 d-sm-none">
          <a href="/coming-soon" className="btn-six">
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopCompany;
