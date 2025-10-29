"use client";
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
import { how_works_data } from "@/data/how-works-data";
import FeatureTen from "./components/features/feature-ten";
import { FaqItems } from "./components/faqs/faq-one";
import FancyBannerSeven from "./components/fancy-banner/fancy-banner-7";
import FooterOne from "@/layouts/footers/footer-one";
import { authCookies } from "@/utils/cookies";

interface DecodedToken {
  exp: number;
}

const HomeSix = () => {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        {/* Conditional header rendering */}
        <Header isAuthenticated={isAuthenticated} />

        {/* hero banner start */}
        <HeroBannerSeven />
        {/* hero banner end */}

        {/* partner slider start */}
        <div className="partner-logos border-0 pt-45 pb-45 ps-3 pe-3">
          <PartnersSlider />
        </div>
        {/* partner slider end */}

        {/* category section start */}
        <section className="category-section-two bg-color position-relative mt-45 md-mt-10 pt-150 xl-pt-130 lg-pt-80 pb-170 xl-pb-130 lg-pb-70">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-sm-8">
                <div className="title-three">
                  <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">Most Demanding Categories.</h2>
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
        {/* category section end */}

        {/* How It Works Two start*/}
        <section className="how-it-works-two position-relative pt-130 lg-pt-80">
          <div className="container">
            <div className="title-one text-center mb-70 lg-mb-30">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">How it's Work?</h2>
            </div>

            <div className="border-bottom">
              <div className="row justify-content-center">
                {how_works_data.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                    <div className="card-style-five text-center position-relative mt-25 pb-70 lg-pb-20 wow fadeInUp">
                      <div className="icon rounded-circle d-flex align-items-center justify-content-center m-auto">
                        <Image src={item.icon_white} alt="icon" className="lazy-img" /></div>
                      <div className="title fw-500 text-lg text-dark mt-25 lg-mt-20 mb-10">{item.title}</div>
                      <p>{item.sub_title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* How It Works Two end*/}

        {/* text feature start */}
        <FeatureTen />
        {/* text feature end */}

        {/* faq start */}
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
        {/* faq end */}

        {/* fancy banner start */}
        <FancyBannerSeven/>
        {/* fancy banner end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default HomeSix;