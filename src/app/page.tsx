"use client";
// Homepage temporarily showing Coming Soon page
// Original homepage code commented out below - uncomment when ready to go live

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import icon from '@/assets/images/icon/icon_61.svg';
import comingsoon_img from './coming-soon/coming_soon.png';
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import Wrapper from "@/layouts/wrapper";

/* ========== ORIGINAL HOMEPAGE CODE - COMMENTED OUT ==========
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import shape from '@/assets/images/shape/shape_24.svg';
import PartnersSlider from "./components/partners/partners-slider";
import HeroBannerSeven from "./components/hero-banners/hero-banner-seven";
import { CategoryCardWrapper } from "./components/category/category-section-2";
import FeatureTen from "./components/features/feature-ten";
import { FaqItems } from "./components/faqs/faq-one";
import FancyBannerSeven from "./components/fancy-banner/fancy-banner-7";
import FooterOne from "@/layouts/footers/footer-one";
import { authCookies } from "@/utils/cookies";
import TopCompany from "./components/top-company/top-company";
import FeedbackOne from "./components/feedBacks/feedback-one";

interface DecodedToken {
  exp: number;
}

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<'client' | 'freelancer'>('client');

  useEffect(() => {
    // Check authentication status from cookies
    const token = authCookies.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          authCookies.removeToken();
          setIsAuthenticated(false);
        }
      } catch (error) {
        authCookies.removeToken();
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

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

  if (isLoading) {
    return (
      <Wrapper>
        <div className="main-page-wrapper">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Conditional header rendering *\/}
        <Header isAuthenticated={isAuthenticated} />

        {/* hero banner start *\/}
        <HeroBannerSeven />
        {/* hero banner end *\/}

        {/* partner slider start *\/}
        <div className="partner-logos border-0 pt-45 pb-45 ps-3 pe-3">
          <PartnersSlider />
        </div>
        {/* partner slider end *\/}

        {/* category section start *\/}
        <section className="category-section-two bg-color position-relative mt-45 md-mt-10 pt-150 xl-pt-130 lg-pt-80 pb-170 xl-pb-130 lg-pb-70">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-sm-8">
                <div className="title-three">
                  <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">Find Your Perfect Video Production Services.</h2>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-none d-sm-flex justify-content-sm-end mt-15">
                  <Link href="/coming-soon" className="btn-six">All Categories</Link>
                </div>
              </div>
            </div>
            <CategoryCardWrapper />
            <div className="text-center d-sm-none mt-50">
              <Link href="/coming-soon" className="btn-six">All Categories</Link>
            </div>
          </div>
          <Image src={shape} alt="shape" className="lazy-img shapes shape_01" />
        </section>
        {/* category section end *\/}

        {/* How It Works Two start*\/}
        <section className="how-it-works-two position-relative pt-130 lg-pt-80">
          <div className="container">
            <div className="title-one text-center mb-40 lg-mb-30">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">How it's Work?</h2>
            </div>

            {/* Modern Toggle Switch *\/}
            <div className="d-flex justify-content-center mb-60 lg-mb-40">
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

              .icon-image-wrapper {
                width: 80px;
                height: 80px;
              }
            }
          `}</style>
        </section>
        {/* How It Works Two end*\/}

        {/* text feature start *\/}
        <FeatureTen />
        {/* text feature end *\/}
        <TopCompany />
        <FeedbackOne/>

        {/* faq start *\/}
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
              <Link href="/coming-soon">Click here</Link>
              </div>
            </div>
          </div>
        </section>
        {/* faq end *\/}

        {/* fancy banner start *\/}
        <FancyBannerSeven/>
        {/* fancy banner end *\/}

        {/* footer start *\/}
        <FooterOne />
        {/* footer end *\/}
      </div>
    </Wrapper>
  );
};

export default HomeSix;
============ END OF COMMENTED CODE ========== */

// Actual component - showing Coming Soon page
const HomePage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                {/* header start */}
                <Header />
                {/* header end */}
                
                <div className="comingsoon-page d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
                    {/* Image Section (Top) */}
                    <Image
                        src={comingsoon_img}
                        alt="comingsoon-img"
                        width={400}
                        height={400}
                        className="img-fluid mx-auto d-block mb-4"
                    />

                    {/* Text Section (Below Image) */}
                    <h2>Coming Soon 🚀</h2>
                    <p className="text-md mb-4">
                        Your portal to abundance is coming soon
                    </p>

                    {/* Button - Disabled since we're on homepage */}
                    <div
                        className="btn-one d-flex align-items-center justify-content-between mt-3 opacity-50"
                        style={{ maxWidth: "250px", width: "100%", cursor: "default" }}
                    >
                        <span>HOMEPAGE</span>
                        <Image src={icon} alt="icon" />
                    </div>
                </div>

                {/* footer start */}
                <FooterOne />
                {/* footer end */}
            </div>
        </Wrapper>
    );
};

export default HomePage;