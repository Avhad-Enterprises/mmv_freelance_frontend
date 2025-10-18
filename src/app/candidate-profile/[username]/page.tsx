"use client";
import { useEffect, useState } from "react";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area";
import { makePostRequest } from "@/utils/api";
import ProfileBreadcrumb from "@/app/components/candidate-details/profile-bredcrumb";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper"; // Added Wrapper for consistent layout
import JobPortalIntro from "@/app/components/job-portal-intro/job-portal-intro"; // Added for layout
import FooterOne from "@/layouts/footers/footer-one"; // Added for layout

interface PageProps {
    params: {
        username: string;
    };
}

// Use the comprehensive IFreelancer interface expected by CandidateDetailsArea
export interface IFreelancer {
  user_id: number;
  first_name: string;
  last_name: string;
  bio: string | null;
  profile_picture: string | null;
  skills: string[];
  superpowers: string[];
  languages: string[];
  city: string | null;
  country: string | null;
  email: string;
  rate_amount: string;
  currency: string;
  availability: string;
  latitude: string | null;
  longitude: string | null;
  profile_title: string | null;
  short_description: string | null;
  youtube_videos: { id: string; url: string; }[];
  experience_level: string | null;
  work_type: string | null;
  hours_per_week: number | null;
  kyc_verified: boolean;
  aadhaar_verification: boolean;
  hire_count: number;
  review_id: number;
  total_earnings: number;
  time_spent: number;
  role_name: string | null;
  experience: any[];
  education: any[];
  previous_works: string[];
  certification: any[];
  services: any[];
  portfolio_links: string[];
}


const CandidateProfilePage = ({ params }: PageProps) => {
    const { username } = params;
    const [freelancer, setFreelancer] = useState<IFreelancer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                // Potential Typo Alert: "getfreelaner" might need to be "getfreelancer"
                const response = await makePostRequest("users/getfreelaner", {username});
                
                // Check your console logs to confirm the structure.
                // You might need response.data instead of response.data.data
                if (response.data && typeof response.data === "object") {
                    setFreelancer(response.data); 
                } else {
                    console.warn("No valid freelancer data received from API");
                    setFreelancer(null);
                }
            } catch (error) {
                console.error("Error fetching freelancer:", error);
                setFreelancer(null);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchFreelancer();
        } else {
            console.warn("No username provided");
            setLoading(false);
        }
    }, [username]);

    const title = loading
      ? "Loading Profile..."
      : freelancer
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : "Profile Not Found";

    return (
        <Wrapper>
          <div className="main-page-wrapper">
            <Header />
            {/* Breadcrumb Header */}
            <ProfileBreadcrumb title={title} subtitle="Profile" />

            {/* Candidate Details Section */}
            <CandidateDetailsArea freelancer={freelancer} loading={loading} />

            <JobPortalIntro top_border={true} />
            <FooterOne />
          </div>
        </Wrapper>
    )
};

export default CandidateProfilePage;