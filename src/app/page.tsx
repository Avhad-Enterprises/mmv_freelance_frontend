"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import shape from '@/assets/images/shape/shape_24.svg';

// Dynamic imports for better code splitting
const PartnersSlider = dynamic(() => import("./components/partners/partners-slider"), {
  loading: () => <div style={{ height: '100px' }} />
});
const HeroBannerSeven = dynamic(() => import("./components/hero-banners/hero-banner-seven"), {
  loading: () => <div style={{ height: '500px' }} />
});
const CategoryCardWrapper = dynamic(() => import("./components/category/category-section-2").then(mod => ({ default: mod.CategoryCardWrapper })), {
  loading: () => <div style={{ height: '300px' }} />
});
const FeatureTen = dynamic(() => import("./components/features/feature-ten"), {
  loading: () => <div style={{ height: '200px' }} />
});
const FaqItems = dynamic(() => import("./components/faqs/faq-one").then(mod => ({ default: mod.FaqItems })), {
  loading: () => <div style={{ height: '200px' }} />
});
const FancyBannerSeven = dynamic(() => import("./components/fancy-banner/fancy-banner-7"), {
  loading: () => <div style={{ height: '150px' }} />
});
const TopCompany = dynamic(() => import("./components/top-company/top-company"), {
  loading: () => <div style={{ height: '200px' }} />
});
const FeedbackOne = dynamic(() => import("./components/feedBacks/feedback-one"), {
  loading: () => <div style={{ height: '200px' }} />
});

// Data for How It Works section
const howItWorksData = {
  client: [
    {
      id: 1,
      title: "Post Your Video Project",
      description: "Quick, Easy, Effortless. Define video editing or videography needs. Our smart form makes job posting simple.",
      icon: "/assets/images/assets/c1.png"
    },
    {
      id: 2,
      title: "Connect & Collaborate",
      description: "Find Your Perfect Match. Receive proposals from vetted video professionals, review portfolios, and select the ideal talent.",
      icon: "/assets/images/assets/c2.png"
    },
    {
      id: 3,
      title: "Hire & Deliver Brilliance",
      description: "Seamless Execution. Hire securely, manage projects, and get exceptional video content delivered on time.",
      icon: "/assets/images/assets/c3.png"
    }
  ],
  freelancer: [
    {
      id: 1,
      title: "Build Your Creator Profile",
      description: "Showcase Your Best Work. Create a compelling profile, highlight video skills, and upload your stunning portfolio.",
      icon: "/assets/images/assets/f1.png"
    },
    {
      id: 2,
      title: "Discover Global Opportunities",
      description: "Bid on Exciting Projects. Explore a steady stream of video jobs, editing and videography gigs from clients worldwide.",
      icon: "/assets/images/assets/f2.png"
    },
    {
      id: 3,
      title: "Deliver & Get Paid Securely",
      description: "Focus on Your Craft. Complete projects, collaborate efficiently, and receive payment securely directly to your account.",
      icon: "/assets/images/assets/f3.png"
    }
  ]
};

const HomeSix = () => {
  const searchParams = useSearchParams();
  const [activeRole, setActiveRole] = useState<'client' | 'freelancer'>('client');

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          const loginButton = document.querySelector('[data-bs-target="#loginModal"]') as HTMLElement;
          if (loginButton) loginButton.click();
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        <HeroBannerSeven />

        <div className="partner-logos border-0 pt-45 pb-45 ps-3 pe-3">
          <div className="container">
            <div className="title fw-500 text-dark text-uppercase text-center mb-65 lg-mb-30" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>Trusted by</div>
          </div>
          <PartnersSlider />
        </div>

        <section className="category-section-two bg-color position-relative mt-45 md-mt-10 pt-150 xl-pt-130 lg-pt-80 pb-170 xl-pb-130 lg-pb-70">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-sm-8">
                <div className="title-three">
                  <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>Find Your Perfect Video Production Services.</h2>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-none d-sm-flex justify-content-sm-end mt-15">
                  <Link href="/job-grid-v2" className="btn-six">All Categories</Link>
                </div>
              </div>
            </div>
            {/* CategoryCardWrapper */}
            <CategoryCardWrapper />
            {/* CategoryCardWrapper */}
            <div className="text-center d-sm-none mt-50">
              <Link href="/job-grid-v2" className="btn-six">All Categories</Link>
            </div>
          </div>
          <Image src={shape} alt="shape" className="lazy-img shapes shape_01" />
        </section>

        {/* How It Works Two start*/}
        <section className="how-it-works-two position-relative pt-130 lg-pt-80">
          <div className="container">
            <div className="d-flex justify-content-center mb-30 lg-mb-20">
              <div className="role-toggle-container">
                <button
                  onClick={() => setActiveRole('client')}
                  className={`role-toggle-btn ${activeRole === 'client' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  For Clients
                </button>
                <button
                  onClick={() => setActiveRole('freelancer')}
                  className={`role-toggle-btn ${activeRole === 'freelancer' ? 'active' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  For Freelancers
                </button>
              </div>
            </div>

            <div className="title-one text-center mb-60 lg-mb-40">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">Your journey to abundance starts here</h2>
            </div>

            <div className="border-bottom">
              <div className="row justify-content-center">
                {howItWorksData[activeRole].map((item, index) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                    <div
                      className="card-style-five text-center position-relative mt-25 pb-70 lg-pb-20 wow fadeInUp"
                      data-wow-delay={`${index * 0.1}s`}
                    >
                      <div className="icon-image-wrapper m-auto">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="lazy-img"
                        />
                      </div>
                      <div className="title fw-500 text-lg text-dark mt-25 lg-mt-20 mb-10">{item.title}</div>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            .role-toggle-container {
              display: inline-flex;
              background: #f0f0f0;
              border-radius: 50px;
              padding: 4px;
              gap: 4px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .role-toggle-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 12px 28px;
              border: none;
              background: transparent;
              color: #666;
              font-size: 15px;
              font-weight: 500;
              border-radius: 50px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
            }

            .role-toggle-btn:hover {
              color: #333;
            }

            .role-toggle-btn.active {
              background: #00bf63;
              color: white;
              box-shadow: 0 4px 12px rgba(0, 191, 99, 0.3);
            }

            .icon-image-wrapper {
              width: 100px;
              height: 100px;
            }

            .icon-image-wrapper img {
              max-width: 100%;
              height: auto;
            }

            @media (max-width: 768px) {
              .role-toggle-container {
                width: 100%;
                max-width: 400px;
              }

              .role-toggle-btn {
                flex: 1;
                padding: 10px 20px;
                font-size: 14px;
              }

              .role-toggle-btn svg {
                width: 16px;
                height: 16px;
              }

              .icon-image-wrapper {
                width: 80px;
                height: 80px;
              }

              .card-style-five {
                padding-left: 15px;
                padding-right: 15px;
              }

              .card-style-five .title {
                font-size: 1.1rem !important;
              }

              .card-style-five p {
                font-size: 0.9rem;
              }
            }

            @media (max-width: 576px) {
              .role-toggle-container {
                max-width: 100%;
                padding: 3px;
              }

              .role-toggle-btn {
                padding: 8px 12px;
                font-size: 13px;
              }

              .role-toggle-btn svg {
                display: none;
              }
            }

            /* Hero Banner Responsive Fixes */
            :global(.understroke-img) {
              bottom: -120px !important;
            }

            @media (max-width: 1200px) {
              :global(.understroke-img) {
                bottom: -80px !important;
              }
            }

            @media (max-width: 768px) {
              :global(.understroke-img) {
                bottom: -50px !important;
              }
            }

            @media (max-width: 576px) {
              :global(.understroke-img) {
                bottom: -30px !important;
              }
            }

            /* Category Section Responsive */
            @media (max-width: 991px) {
              :global(.category-section-two .title-three h2) {
                font-size: 1.8rem;
              }
            }

            @media (max-width: 576px) {
              :global(.category-section-two .title-three h2) {
                font-size: 1.5rem;
              }
              
              :global(.partner-logos .title) {
                font-size: 1rem;
              }
            }
          `}</style>
        </section>
        {/* How It Works Two end */}

        <FeatureTen />
        {/* text feature end */}

        {/* top company start */}
        <TopCompany />
        <FeedbackOne/>

        <section className="faq-section position-relative mt-180 xl-mt-150 lg-mt-80">
          <div className="container">
            <div className="title-one text-center">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">Questions & Answers</h2>
            </div>
            <div className="mt-60 lg-mt-30">
              <div className="row">
                <div className="col-xxl-11 m-auto wow fadeInUp" data-wow-delay="0.3s">
                  <FaqItems />
                </div>
              </div>
            </div>
            <div className="text-center mt-50 lg-mt-30 wow fadeInUp">
              <div className="btn-eight fw-500">Don't find the answer? We can help.
              <Link href="/faq">Click here</Link>
              </div>
            </div>
          </div>
        </section>

        <FancyBannerSeven/>

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default HomeSix;