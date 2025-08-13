"use client";
import React, { useState } from "react";
import Image from "next/image";
import CandidateProfileSlider from "./candidate-profile-slider";
import avatar from "@/assets/images/candidates/img_01.jpg";
import VideoPopup from "../common/video-popup";
import Skills from "./skills";
import WorkExperience from "./work-experience";
import Certifications from "./certification";
import CandidateBio from "./bio";
import EmailSendForm from "../forms/email-send-form";
import Education from "./education";

type IFreelancer = {
  user_id: number;
  first_name: string;
  last_name: string;
  bio?: string;
  profile_picture?: string;
  skill?: any[];
  experience?: any[];
  education?: any[];
  previous_works: string[];
  location: string;
  city: string;
  country: string;
  email: string;
  certification: any[];
  services: any[];
  total_earnings: number;
};

type CandidateDetailsAreaProps = {
  freelancer: IFreelancer | null ;
  loading: boolean;
};

const CandidateDetailsArea = ({ freelancer, loading }: CandidateDetailsAreaProps) => {
  console.log("CandidateDetailsArea Freelancer Prop: ", JSON.stringify(freelancer, null, 2));
  console.log("CandidateDetailsArea Loading: ", loading);

  if (loading) return <p>Loading...</p>;
  if (!freelancer || Object.keys(freelancer).length === 0) return <p>No freelancer data found.</p>;

  const {
    bio = "No bio available",
    profile_picture = "",
    skill = [],
    experience = [],
    education = [],
    previous_works = [],
    location = "",
    city = "",
    country = "",
    email = "",
    certification = [],
    services = [],
    total_earnings,
    first_name = "",
    last_name = "",
  } = freelancer;

  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  return (
    <>
      <section className="candidates-profile pt-100 lg-pt-70 pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-9 col-lg-8">
              <div className="candidates-profile-details me-xxl-5 pe-xxl-4">
                <div className="inner-card border-style mb-65 lg-mb-40">
                  <h3 className="title">Bio</h3>
                  <p>{freelancer?.bio}</p>
                </div>
                <h3 className="title">Intro</h3>
                <div className="video-post d-flex align-items-center justify-content-center mt-25 lg-mt-20 mb-75 lg-mb-50">
                  <a
                    onClick={() => setIsVideoOpen(true)}
                    className="fancybox rounded-circle video-icon tran3s text-center cursor-pointer"
                  >
                    <i className="bi bi-play"></i>
                  </a>
                </div>
                <div className="inner-card border-style mb-75 lg-mb-50">
                  <h3 className="title">Education</h3>
                  <Education education={freelancer?.education} />
                </div>
                <div className="inner-card border-style mb-75 lg-mb-50">
                  <h3 className="title">Skills</h3>
                  <Skills skills={skill} />
                </div>
                <div className="inner-card border-style mb-60 lg-mb-50">
                  <h3 className="title">Work Experience</h3>
                  <WorkExperience experience={experience} />
                </div>
                <div className="inner-card border-style mb-60 lg-mb-50">
                  <h3 className="title">Certifications</h3>
                  <Certifications certification={certification} />
                </div>
                <div className="inner-card border-style mb-60 lg-mb-50">
                  <h3 className="title">Services</h3>
                  {services && services.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Rate</th>
                            <th>Currency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service, idx) => (
                            <tr key={idx}>
                              <td>{service.title || "N/A"}</td>
                              <td>{service.rate || "N/A"}</td>
                              <td>{service.currency || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No services listed.</p>
                  )}
                </div>
                <div className="inner-card border-style mb-65 lg-mb-40">
                  <h3 className="title">Previous Works</h3>
                  {previous_works.length > 0 ? (
                    <ul>
                      {previous_works.map((link, idx) => (
                        <li key={idx}>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No previous works added yet.</p>
                  )}
                </div>
                <h3 className="title">Portfolio</h3>
                <CandidateProfileSlider />
              </div>
            </div>
            <div className="col-xxl-3 col-lg-4">
              <div className="cadidate-profile-sidebar ms-xl-5 ms-xxl-0 md-mt-60">
                <div className="cadidate-bio bg-wrapper bg-color mb-60 md-mb-40">
                  <div className="pt-25">
                    <div className="cadidate-avatar m-auto">
                      {profile_picture ? (
                        <Image
                          src={profile_picture}
                          alt="avatar"
                          width={85}
                          height={85}
                          className="lazy-img rounded-circle w-100"
                        />
                      ) : (
                        <Image
                          src={avatar}
                          alt="default avatar"
                          width={150}
                          height={150}
                          className="lazy-img rounded-circle w-100"
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="cadidate-name text-center">
                    {loading ? "Loading..." : `${freelancer?.first_name} ${freelancer?.last_name}`}
                  </h3>
                  <CandidateBio
                    bio={{
                      location: `${city}, ${country}`,
                      email,
                      total_earnings,
                    }}
                  />
                </div>
                <h4 className="sidebar-title">Location</h4>
                <div className="map-area mb-60 md-mb-40">
                  <div className="gmap_canvas h-100 w-100">
                    <iframe
                      className="gmap_iframe h-100 w-100"
                      src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                  </div>
                </div>
                <h4 className="sidebar-title">Email {first_name} {last_name}.</h4>
                <div className="email-form bg-wrapper bg-color">
                  <p>Your email address & profile will be shown to the recipient.</p>
                  <EmailSendForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <VideoPopup isVideoOpen={isVideoOpen} setIsVideoOpen={setIsVideoOpen} videoId={"-6ZbrfSRWKc"} />
    </>
  );
};

export default CandidateDetailsArea;