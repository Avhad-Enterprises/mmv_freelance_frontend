"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import icon from "@/assets/images/icon/icon_46.svg";
import img from "@/assets/images/assets/img_41.png";
import { useUser } from '@/context/UserContext';

const FancyBannerSeven = () => {
  const router = useRouter();
  const { userData, userRoles, isLoading } = useUser();

  const handlePostJob = () => {
    const isAuthenticated = !!userData && !isLoading;
    if (!isAuthenticated) {
      // Show login modal
      const loginButton = document.querySelector('[data-bs-target="#loginModal"]') as HTMLElement;
      if (loginButton) loginButton.click();
    } else {
      // Check user roles
      const normalizedRoles = userRoles.map(r => r.toUpperCase());
      if (normalizedRoles.includes('CLIENT')) {
        // Redirect to client submit job page
        router.push('/dashboard/client-dashboard/submit-job');
      } else if (normalizedRoles.includes('VIDEOEDITOR') || normalizedRoles.includes('VIDEOGRAPHER')) {
        // Redirect to projects listing page
        router.push('/job-list');
      } else {
        // Default fallback
        router.push('/job-list');
      }
    }
  };

  const handleStartEarning = () => {
    const isAuthenticated = !!userData && !isLoading;
    if (!isAuthenticated) {
      // Show login modal
      const loginButton = document.querySelector('[data-bs-target="#loginModal"]') as HTMLElement;
      if (loginButton) loginButton.click();
    } else {
      // Always redirect to projects listing page
      router.push('/job-list');
    }
  };
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
                  <button onClick={handlePostJob} className="upload-btn position-relative d-flex align-items-center justify-content-center">
                    <span className="fw-500 ms-2 text-white">
                      Post a Job for Free
                    </span>
                  </button>
                  <button onClick={handleStartEarning} className="upload-btn d-flex align-items-center justify-content-center">
                    <span className="fw-500 text-white">Start Earning Now</span>
                  </button>
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
