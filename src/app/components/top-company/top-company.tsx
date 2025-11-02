import React from 'react';
// import Link from 'next/link'; // Removed Next.js dependency
// import Image, { StaticImageData } from 'next/image'; // Removed Image component
// import company_1 from '@/assets/images/logo/media_29.png'; // Removed local asset
// import company_2 from '@/assets/images/logo/media_30.png'; // Removed local asset
// import company_3 from '@/assets/images/logo/media_31.png'; // Removed local asset
// import company_4 from '@/assets/images/logo/media_32.png'; // Removed local asset

// Generic User Icon to replace local images
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#28a745" // Green color from your image
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lazy-img m-auto" // Kept original class
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);


// company data: Updated based on the image
const company_data: {
  id: number;
  name: string;
  desc: string;
  linkText: string; // Changed from 'job: number' to 'linkText: string'
}[] = [
    {
      id: 1,
      name: 'Ria Sharra',
      desc: 'Wedding Film Editor | Mumbai, India',
      linkText: 'View Portfolio',
    },
    {
      id: 2,
      name: 'Chen Li',
      desc: 'YouTube Video Specialist | Toronto, Canada CA',
      linkText: 'View services',
    },
    {
      id: 3,
      name: 'Marcus V.',
      desc: 'Corporate Video Specialist | Tondoe, UK',
      linkText: 'View open jobs',
    },
    {
      id: 4,
      name: 'Aisha Khan',
      desc: 'Reels & Shorts Editor | <br />Dubai, UAE', // Added <br /> for new line
      linkText: 'View portfolio',
    },
  ]

const TopCompany = () => {
  return (
    <section className="top-company-section pt-100 lg-pt-60 pb-130 lg-pb-80 mt-200 xl-mt-150">
      <div className="container">
        <div className="row justify-content-between align-items-center pb-40 lg-pb-10">
          <div className="col-sm-7">
            <div className="title-one">
              <h2 className="main-font wow fadeInUp" data-wow-delay="0.3s">Meet Our Featured Video Creators</h2>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="d-flex justify-content-sm-end">
              {/* Replaced Next.js Link with standard <a> tag */}
              <a href="/" className="btn-six d-none d-sm-inline-block">Explore All Creators</a>
            </div>
          </div>
        </div>

        <div className="row">
          {company_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-sm-6">
              <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                {/* Replaced next/image with the SVG icon */}
                <UserIcon />
                <div className="text-lg fw-500 text-dark mt-15 mb-30">{item.name}</div>
                {/* Updated description to render HTML for the line break */}
                <p className="mb-20" dangerouslySetInnerHTML={{ __html: item.desc }} />
                {/* Updated link text and replaced Next.js Link with standard <a> tag */}
                <a href="/company-v2" className="open-job-btn fw-500 tran3s">{item.linkText}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-30 d-sm-none">
          {/* Replaced Next.js Link with standard <a> tag */}
          <a href="/company" className="btn-six">Explore More</a>
        </div>
      </div>
    </section>
  );
};

export default TopCompany;

