'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Featured freelancer IDs
const FEATURED_FREELANCER_IDS = [293, 288, 399, 411];

// Interface for freelancer data from API
interface FeaturedFreelancer {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  skills: string[];
  city: string | null;
  country: string | null;
  profile_title: string | null;
}

// Generic User Icon fallback
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#31795A"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lazy-img m-auto"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TopCompany = () => {
  const [featuredFreelancers, setFeaturedFreelancers] = useState<FeaturedFreelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedFreelancers = async () => {
      try {
        setLoading(true);
        // Fetch all freelancers
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`,
          { cache: 'no-cache' }
        );

        if (!response.ok) throw new Error('Failed to fetch freelancers');

        const data = await response.json();
        const allFreelancers: FeaturedFreelancer[] = data.data || [];

        // Filter to get only the featured ones
        const featured = allFreelancers.filter((freelancer) =>
          FEATURED_FREELANCER_IDS.includes(freelancer.user_id)
        );

        // Sort them in the order specified in FEATURED_FREELANCER_IDS
        const sortedFeatured = FEATURED_FREELANCER_IDS.map((id) =>
          featured.find((f) => f.user_id === id)
        ).filter((f): f is FeaturedFreelancer => f !== undefined);

        setFeaturedFreelancers(sortedFeatured);
      } catch (error) {
        console.error('Error fetching featured freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFreelancers();
  }, []);

  // Format skills display (show first 2-3 skills)
  const formatSkills = (skills: string[]) => {
    if (!skills || skills.length === 0) return 'Video Creator';
    return skills.slice(0, 2).join(' | ');
  };

  // Format location
  const formatLocation = (city: string | null, country: string | null) => {
    if (city && country) return `${city}, ${country}`;
    if (country) return country;
    return '';
  };
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
              <a href="/freelancers" className="btn-six d-none d-sm-inline-block">
                Explore All Creators
              </a>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading featured creators...</p>
            </div>
          </div>
        ) : (
          <div className="row">
            {featuredFreelancers.map((freelancer) => (
              <div key={freelancer.user_id} className="col-lg-3 col-sm-6">
                <div className="card-style-ten text-center tran3s mt-25 wow fadeInUp">
                  {/* Profile Picture or Fallback Icon */}
                  {freelancer.profile_picture ? (
                    <div className="position-relative d-inline-block">
                      <Image
                        src={freelancer.profile_picture}
                        alt={`${freelancer.first_name} ${freelancer.last_name}`}
                        width={80}
                        height={80}
                        className="rounded-circle lazy-img m-auto"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <UserIcon />
                  )}
                  
                  {/* Name */}
                  <div className="text-lg fw-500 text-dark mt-15 mb-10">
                    {freelancer.first_name} {freelancer.last_name}
                  </div>
                  
                  {/* Skills and Location */}
                  <p className="mb-20 text-muted" style={{ minHeight: '48px' }}>
                    {formatSkills(freelancer.skills)}
                    {formatLocation(freelancer.city, freelancer.country) && (
                      <>
                        <br />
                        <small>{formatLocation(freelancer.city, freelancer.country)}</small>
                      </>
                    )}
                  </p>
                  
                  {/* View Profile Link */}
                  <a
                    href={`/freelancer-profile/${freelancer.user_id}`}
                    className="open-job-btn fw-500 tran3s"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-30 d-sm-none">
          <a href="/freelancers" className="btn-six">Explore More</a>
        </div>
      </div>
    </section>
  );
};

export default TopCompany;

