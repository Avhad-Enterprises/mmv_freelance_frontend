"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./dashboard-header";
import toast from "react-hot-toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type Service = { title: string; rate: string; currency: string };
type PreviousWork = { title: string; description: string; url: string };

type ProfileData = {
  full_name: string;
  email: string;
  phone_number: string;
  bio: string;
  address_line_first: string;
  address_line_second: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  skills: string[];
  services: Service[];
  previous_works: PreviousWork[];
  profile_title?: string;
  skill_tags?: string[];
  superpowers?: string[];
  languages?: string[];
  availability?: string;
  experience_level?: string;
  role?: string;
  rate_amount?: number;
  currency?: string;
  short_description?: string;
};

const DashboardProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");

  // Utility: safely parse arrays that might come as JSON strings or arrays
  const safeArray = <T,>(val: any, fallback: T[] = []): T[] => {
    try {
      if (Array.isArray(val)) return val as T[];
      if (typeof val === "string" && val.trim().startsWith("[")) {
        return JSON.parse(val) as T[];
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    void fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const res = await fetch(`http://localhost:8000/api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const response = await res.json();
      
      if (response.success && response.data) {
        const { user, profile, userType: type } = response.data;
        setUserType(type);

        let parsedSkills: string[] = [];
        let parsedServices: Service[] = [];
        let parsedPreviousWorks: PreviousWork[] = [];
        let parsedSkillTags: string[] = [];
        let parsedSuperpowers: string[] = [];
        let parsedLanguages: string[] = [];

        if (type === "VIDEO_EDITOR" || type === "VIDEOGRAPHER") {
          parsedSkills = safeArray<string>(profile?.skills);
          parsedSkillTags = safeArray<string>(profile?.skill_tags);
          parsedSuperpowers = safeArray<string>(profile?.superpowers);
          parsedLanguages = safeArray<string>(profile?.languages);
          
          const portfolioLinks = safeArray<string>(profile?.portfolio_links);
          parsedPreviousWorks = portfolioLinks.map((url: string) => ({
            title: "Portfolio Item",
            description: "",
            url
          }));

          if (profile?.rate_amount) {
            parsedServices = [{
              title: profile?.profile_title || "Service",
              rate: profile.rate_amount.toString(),
              currency: profile?.currency || "USD"
            }];
          }
        }

        setProfileData({
          full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email || "",
          phone_number: user.phone_number || "",
          bio: user.bio || profile?.short_description || "",
          address_line_first: user.address_line_first || profile?.address || "",
          address_line_second: user.address_line_second || "",
          city: user.city || "",
          state: user.state || "",
          country: user.country || "",
          pincode: user.pincode || "",
          skills: parsedSkills,
          services: parsedServices,
          previous_works: parsedPreviousWorks,
          profile_title: profile?.profile_title,
          skill_tags: parsedSkillTags,
          superpowers: parsedSuperpowers,
          languages: parsedLanguages,
          availability: profile?.availability,
          experience_level: profile?.experience_level,
          role: profile?.role,
          rate_amount: profile?.rate_amount,
          currency: profile?.currency,
          short_description: profile?.short_description
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      toast.error("Failed to load profile data", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | number }) => {
    if (!value) return null;
    return (
      <div className="row mb-3">
        <div className="col-md-4">
          <strong>{label}:</strong>
        </div>
        <div className="col-md-8">
          {value}
        </div>
      </div>
    );
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white card-box border-20 mt-30">
      <h4 className="dash-title-three mb-4">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="dashboard-body" style={{ marginTop: "85px" }}>
      <div className="position-relative">

        <h2 className="main-title">My Profile</h2>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && profileData && (
          <>
            {/* Basic Information */}
            <InfoSection title="Basic Information">
              {userType && (
                <div className="mb-4">
                  <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    {userType.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
              
              <InfoRow label="Full Name" value={profileData.full_name} />
              <InfoRow label="Email" value={profileData.email} />
              <InfoRow label="Phone Number" value={profileData.phone_number} />
              
              {profileData.profile_title && (
                <InfoRow label="Profile Title" value={profileData.profile_title} />
              )}
              
              {profileData.role && (
                <InfoRow label="Role" value={profileData.role} />
              )}
              
              {profileData.experience_level && (
                <InfoRow label="Experience Level" value={profileData.experience_level} />
              )}
              
              {profileData.availability && (
                <InfoRow label="Availability" value={profileData.availability} />
              )}

              {profileData.bio && (
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Bio:</strong>
                  </div>
                  <div className="col-md-8">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{profileData.bio}</p>
                  </div>
                </div>
              )}
            </InfoSection>

            {/* Skills & Expertise */}
            {(profileData.skills.length > 0 || 
              profileData.skill_tags && profileData.skill_tags.length > 0 || 
              profileData.superpowers && profileData.superpowers.length > 0) && (
              <InfoSection title="Skills & Expertise">
                {profileData.skills.length > 0 && (
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Skills:</strong>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex flex-wrap gap-2">
                        {profileData.skills.map((skill, idx) => (
                          <span key={idx} className="badge bg-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {profileData.skill_tags && profileData.skill_tags.length > 0 && (
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Skill Tags:</strong>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex flex-wrap gap-2">
                        {profileData.skill_tags.map((tag, idx) => (
                          <span key={idx} className="badge bg-info" style={{ fontSize: '13px', padding: '6px 12px' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {profileData.superpowers && profileData.superpowers.length > 0 && (
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Superpowers:</strong>
                    </div>
                    <div className="col-md-8">
                      <div className="d-flex flex-wrap gap-2">
                        {profileData.superpowers.map((power, idx) => (
                          <span key={idx} className="badge bg-success" style={{ fontSize: '13px', padding: '6px 12px' }}>
                            {power}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {profileData.languages && profileData.languages.length > 0 && (
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Languages:</strong>
                    </div>
                    <div className="col-md-8">
                      {profileData.languages.join(', ')}
                    </div>
                  </div>
                )}
              </InfoSection>
            )}

            {/* Services & Rates */}
            {profileData.services.length > 0 && (
              <InfoSection title="Services & Rates">
                {profileData.services.map((service, index) => (
                  <div key={index} className="mb-3 p-3" style={{ 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div className="row">
                      <div className="col-md-8">
                        <h5 className="mb-2">{service.title}</h5>
                      </div>
                      <div className="col-md-4 text-end">
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#244034' }}>
                          {service.currency} {service.rate}/hr
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </InfoSection>
            )}

            {/* Portfolio / Previous Work */}
            {profileData.previous_works.length > 0 && (
              <InfoSection title="Portfolio">
                {profileData.previous_works.map((work, index) => (
                  <div key={index} className="mb-3 p-3" style={{ 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    {work.title && <h6 className="mb-2">{work.title}</h6>}
                    {work.description && <p className="mb-2">{work.description}</p>}
                    {work.url && (
                      <a 
                        href={work.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary"
                        style={{ textDecoration: 'none' }}
                      >
                        View Portfolio →
                      </a>
                    )}
                  </div>
                ))}
              </InfoSection>
            )}

            {/* Address & Location */}
            <InfoSection title="Address & Location">
              <InfoRow label="Address Line 1" value={profileData.address_line_first} />
              <InfoRow label="Address Line 2" value={profileData.address_line_second} />
              
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Location:</strong>
                </div>
                <div className="col-md-8">
                  {[profileData.city, profileData.state, profileData.country]
                    .filter(Boolean)
                    .join(', ') || 'Not provided'}
                </div>
              </div>
              
              <InfoRow label="Zip/Pin Code" value={profileData.pincode} />
            </InfoSection>
          </>
        )}

        {!loading && !profileData && (
          <div className="bg-white card-box border-20 text-center py-5">
            <p>No profile data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProfileArea;