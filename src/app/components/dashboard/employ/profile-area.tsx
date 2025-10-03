"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import toast from "react-hot-toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type IPreviousWork = {
  title: string;
  url: string;
  description: string;
};

type IClientProfile = {
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
  created_at: string;
  previous_works: IPreviousWork[];
  // Client specific fields
  company_name?: string;
  website?: string;
  company_description?: string;
  industry?: string;
  company_size?: string;
  work_arrangement?: string;
  project_frequency?: string;
  hiring_preferences?: string;
};

const EmployProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [profileData, setProfileData] = useState<IClientProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const res = await fetch('http://localhost:8000/api/v1/users/me', {
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

          let parsedPreviousWorks: IPreviousWork[] = [];

          // For CLIENT, check if they have previous_works
          if (type === "CLIENT") {
            parsedPreviousWorks = safeArray<IPreviousWork>(user?.previous_works);
          }

          setProfileData({
            full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            email: user.email || "",
            phone_number: user.phone_number || "",
            bio: user.bio || profile?.company_description || "",
            address_line_first: user.address_line_first || profile?.address || "",
            address_line_second: user.address_line_second || "",
            city: user.city || "",
            state: user.state || "",
            country: user.country || "",
            pincode: user.pincode || "",
            created_at: user.created_at || "",
            previous_works: parsedPreviousWorks,
            // Client specific fields
            company_name: profile?.company_name,
            website: profile?.website,
            company_description: profile?.company_description,
            industry: profile?.industry,
            company_size: profile?.company_size,
            work_arrangement: profile?.work_arrangement,
            project_frequency: profile?.project_frequency,
            hiring_preferences: profile?.hiring_preferences,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        toast.error("Failed to load profile data", {
          duration: 3000,
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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

  if (loading) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body" style={{ marginTop: "15px" }}>
      <div className="position-relative">
        <h2 className="main-title">My Profile</h2>

        {profileData && (
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
              
              {profileData.created_at && (
                <InfoRow 
                  label="Member Since" 
                  value={new Date(profileData.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                />
              )}

              {profileData.bio && (
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>About:</strong>
                  </div>
                  <div className="col-md-8">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{profileData.bio}</p>
                  </div>
                </div>
              )}
            </InfoSection>

            {/* Company Information (Client Specific) */}
            {userType === "CLIENT" && (profileData.company_name || profileData.website || profileData.industry) && (
              <InfoSection title="Company Information">
                <InfoRow label="Company Name" value={profileData.company_name} />
                <InfoRow label="Website" value={profileData.website} />
                <InfoRow label="Industry" value={profileData.industry} />
                <InfoRow label="Company Size" value={profileData.company_size} />
                
                {profileData.company_description && (
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Company Description:</strong>
                    </div>
                    <div className="col-md-8">
                      <p style={{ whiteSpace: 'pre-wrap' }}>{profileData.company_description}</p>
                    </div>
                  </div>
                )}
              </InfoSection>
            )}

            {/* Hiring Preferences (Client Specific) */}
            {userType === "CLIENT" && (profileData.work_arrangement || profileData.project_frequency || profileData.hiring_preferences) && (
              <InfoSection title="Hiring Preferences">
                <InfoRow label="Work Arrangement" value={profileData.work_arrangement} />
                <InfoRow label="Project Frequency" value={profileData.project_frequency} />
                <InfoRow label="Hiring Preferences" value={profileData.hiring_preferences} />
              </InfoSection>
            )}

            {/* Previous Work */}
            {profileData.previous_works.length > 0 && (
              <InfoSection title="Previous Work">
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
                        View Project →
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

        {!profileData && (
          <div className="bg-white card-box border-20 text-center py-5">
            <p>No profile data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployProfileArea;