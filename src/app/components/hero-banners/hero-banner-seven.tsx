'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import screen_1 from '@/assets/images/assets/screen_17.png';
import screen_2 from '@/assets/images/assets/screen_18.png';
import JobCategorySelect from '../select/job-category';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import understroke from '@/assets/images/assets/picture 1.png';
import { authCookies } from '@/utils/cookies';

interface DecodedToken {
  exp: number;
}

const HeroBannerSeven = () => {
  const router = useRouter();
  const { handleSubmit, setCategoryVal, setSearchText } = useSearchFormSubmit();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePostProject = () => {
    if (!isAuthenticated) {
      // Show login modal
      const loginButton = document.querySelector('[data-bs-target="#loginModal"]') as HTMLElement;
      if (loginButton) loginButton.click();
    } else {
      // Redirect to coming soon page
      router.push('/coming-soon');
    }
  };

  const handleFindFreelanceWork = () => {
    // Always redirect to coming soon page
    router.push('/coming-soon');
  };

  return (
    <div className="hero-banner-seven position-relative pt-200 lg-pt-150 pb-110 md-pb-40">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-xl-7 col-lg-8 m-auto text-center">
              <h1
                className="wow fadeInUp text-3xl md:text-4xl lg:text-5xl"
                data-wow-delay="0.3s"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)' }}
              >
                World's First & Only Freelance Marketplace Exclusively for{' '}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ color: '#6DB945', fontStyle: 'italic' }}>Videos</span>
                  <Image
                    src={understroke}
                    alt=""
                    className="lazy-img understroke-img"
                    style={{
                      position: 'absolute',
                      bottom: '-120px',
                      left: '0',
                      width: '100%',
                      height: 'auto',
                      pointerEvents: 'none'
                    }}
                  />
                </span>
              </h1>

              <p className="text-md mt-25 mb-40 wow fadeInUp" data-wow-delay="0.4s">
                Hire aligned video editors and videographers anywhere across the globe
              </p>
            </div>
          </div>
          <div className="position-relative">
            <div className="row">
              <div className="col-xxl-7 col-lg-8 col-md-11 m-auto">
                <div
                  className="job-search-one style-two border-style position-relative wow fadeInUp"
                  data-wow-delay="0.5s"
                >
                  <form onSubmit={handleSubmit}>
                    <div className="row align-items-center">
                      <div className="col-md-5">
                        <div className="input-box">
                          <div className="label">Select Superpowers</div>
                          <JobCategorySelect setCategoryVal={setCategoryVal} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-box border-left">
                          <div className="label">Keywords or Title</div>
                          <input
                            onChange={handleSearchInput}
                            type="text"
                            placeholder="Design, branding"
                            className="keyword"
                          />
                        </div>
                      </div>
                      <div className="col-md-3 sm-mb-10 sm-mt-10">
                        <button className="text-uppercase btn-five border6 tran3s m-auto">
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-25 lg-mt-20">
                    <button 
                      className="btn-five fw-500 tran3s flex-fill"
                      onClick={handlePostProject}
                    >
                      Post Project
                    </button>
                    <button 
                      className="btn-five fw-500 tran3s flex-fill"
                      onClick={handleFindFreelanceWork}
                    >
                      Find Freelance Work
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ Larger images positioned in the middle */}
      <Image
        src={screen_2}
        alt="screen-img"
        width={800}
        height={1000}
        className="lazy-img shapes screen01"
        style={{ transform: 'translateY(-50%)', top: '50%' }}
      />
      <Image
        src={screen_1}
        alt="screen-img"
        width={800}
        height={1000}
        className="lazy-img shapes screen02"
        style={{ transform: 'translateY(-50%)', top: '50%' }}
      />

    </div>
  );
};

export default HeroBannerSeven;