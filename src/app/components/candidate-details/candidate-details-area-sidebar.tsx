"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import avatar from "@/assets/images/candidates/img_01.jpg";
import VideoPopup from "../common/video-popup";
import Skills from "./skills";
import CandidateBio from "./bio";
import { IFreelancer } from "@/app/candidate-profile-v1/[id]/page";

type CandidateDetailsAreaProps = {
  freelancer: IFreelancer | null;
  loading: boolean;
  onBackToList: () => void; // New prop for back button
};

const CandidateDetailsArea = ({ freelancer, loading, onBackToList }: CandidateDetailsAreaProps) => {
  if (loading) return <div className="container text-center p-5"> <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div> </div>;
  if (!freelancer) return <div className="container text-center p-5"><p>No freelancer data found.</p></div>;

  const {
    bio = "No bio available.",
    profile_picture = null,
    skills = [],
    superpowers = [],
    languages = [],
    city = null,
    country = null,
    email = "email@example.com",
    rate_amount = "0.00",
    currency = "USD",
    first_name = "",
    last_name = "",
    portfolio_links = [],
    latitude = null,
    longitude = null,
    availability = "not specified",
    experience_level = "not specified",
    role_name = null,
  } = freelancer;

  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>("-6ZbrfSRWKc"); // Default fallback video ID

  const handleVideoOpen = (videoId: string) => {
    setCurrentVideoId(videoId);
    setIsVideoOpen(true);
  };

  const formatCurrency = (amountStr: string, currencyCode: string) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return `${amountStr} ${currencyCode}`;
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amount);
    } catch (e) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  };

  const formattedRate = formatCurrency(rate_amount, currency);

  // Corrected Dynamic Google Maps URL
  const googleMapsSrc = (latitude && longitude)
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=12&ie=UTF8&iwloc=B&output=embed`
    : "https://maps.google.com/maps?q=Nashik,Maharashtra,India&t=&z=12&ie=UTF8&iwloc=B&output=embed"; // Default fallback location

  return (
    <>
      <section className="candidates-profile pt-100 lg-pt-70 pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-9 col-lg-8">
              <div className="candidates-profile-details me-xxl-5 pe-xxl-4">
                
                {/* --- BACK BUTTON MODIFIED HERE --- */}
                <button onClick={onBackToList} className="btn-two mb-30">
                  ← Back to Saved Candidates
                </button>

                <div className="inner-card border-style mb-65 lg-mb-40">
                  <h3 className="title">Bio</h3>
                  <p>{bio}</p>
                </div>

                {/* Portfolio Links Section */}
                {portfolio_links.length > 0 && (
                  <div className="inner-card border-style mb-60 lg-mb-50">
                    <h3 className="title">Portfolio Links</h3>
                    <div className="row">
                      {portfolio_links.map((link, idx) => {
                        const isYoutube = link.includes("youtube.com/watch?v=");
                        const videoId = isYoutube ? link.split('v=')[1]?.split('&')[0] : null;
                        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

                        return (
                          <div key={idx} className="col-lg-4 col-md-6 mb-4">
                            <div className="portfolio-item-wrapper position-relative overflow-hidden rounded-3">
                              {isYoutube && thumbnailUrl ? (
                                <div className="youtube-thumbnail-wrapper position-relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                                  <Image
                                    src={thumbnailUrl}
                                    alt={`YouTube video thumbnail for ${link}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    className="img-fluid"
                                    onClick={() => handleVideoOpen(videoId!)}
                                    unoptimized
                                  />
                                  <button
                                    onClick={() => handleVideoOpen(videoId!)}
                                    className="play-icon position-absolute top-50 start-50 translate-middle border-0 bg-transparent text-white"
                                    aria-label="Play video"
                                    style={{ zIndex: 10, fontSize: '3rem', cursor: 'pointer' }}
                                  >
                                    <i className="bi bi-play-circle-fill"></i>
                                  </button>
                                </div>
                              ) : (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="d-block p-3 border rounded text-primary text-decoration-underline"
                                  style={{ wordBreak: 'break-all' }}
                                >
                                  <i className="bi bi-link-45deg me-2"></i>
                                  {link}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="inner-card border-style mb-75 lg-mb-50">
                  <h3 className="title">Skills</h3>
                  <Skills skills={skills} />
                </div>

                {superpowers.length > 0 && (
                  <div className="inner-card border-style mb-75 lg-mb-50">
                    <h3 className="title">Superpowers</h3>
                    <Skills skills={superpowers} />
                  </div>
                )}

                {languages.length > 0 && (
                  <div className="inner-card border-style mb-60 lg-mb-50">
                    <h3 className="title">Languages</h3>
                    <ul className="style-none skill-tags d-flex flex-wrap pb-25">
                      {languages.map((lang, idx) => (
                        <li key={idx}>{lang}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="col-xxl-3 col-lg-4">
              <div className="cadidate-profile-sidebar ms-xl-5 ms-xxl-0 md-mt-60">
                <div className="cadidate-bio bg-wrapper bg-color mb-60 md-mb-40">
                  <div className="pt-25">
                    <div className="cadidate-avatar m-auto">
                      {profile_picture && profile_picture.trim() !== '' ? (
                        <Image src={profile_picture} alt="avatar" width={85} height={85} className="lazy-img rounded-circle w-100" style={{ objectFit: 'cover' }} />
                      ) : (
                        <Image src={avatar} alt="default avatar" width={150} height={150} className="lazy-img rounded-circle w-100" style={{ objectFit: 'cover' }} />
                      )}
                    </div>
                  </div>
                  <h3 className="cadidate-name text-center">
                    {first_name} {last_name}
                  </h3>
                  <CandidateBio
                    bio={{
                      location: `${city || 'N/A'}, ${country || 'N/A'}`,
                      email,
                      rateAmount: formattedRate,
                      availability,
                      experience_level,
                      role_name,
                    }}
                  />
                </div>

                <h4 className="sidebar-title">Location</h4>
                <div className="map-area mb-60 md-mb-40">
                  <div className="gmap_canvas h-100 w-100">
                    <iframe
                      className="gmap_iframe h-100 w-100"
                      src={googleMapsSrc}
                      loading="lazy"
                      title="Google Map of Candidate Location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <VideoPopup isVideoOpen={isVideoOpen} setIsVideoOpen={setIsVideoOpen} videoId={currentVideoId} />
    </>
  );
};

export default CandidateDetailsArea;