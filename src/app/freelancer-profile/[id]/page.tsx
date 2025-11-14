// app/freelancer-profile/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area";
import JobPortalIntro from "@/app/components/job-portal-intro/job-portal-intro";

// Define the structure of a freelancer object that matches your API response
interface RawApiFreelancer {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  is_banned: boolean;
  is_deleted: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
  freelancer_id: number;
  profile_title: string | null;
  role: string | null;
  short_description: string | null;
  experience_level: string | null;
  skills: string[];
  superpowers: string[];
  skill_tags: string[];
  base_skills: string[];
  languages: string[];
  portfolio_links: string[]; // Can contain YouTube links and others
  certification: any; // Can be null
  education: any; // Can be null
  previous_works: any; // Can be null
  services: any; // Can be null
  rate_amount: string;
  currency: string;
  availability: string;
  work_type: string | null;
  hours_per_week: number | null;
  id_type: string | null;
  id_document_url: string | null;
  kyc_verified: boolean;
  aadhaar_verification: boolean;
  hire_count: number;
  review_id: number;
  total_earnings: number;
  time_spent: number;
  projects_applied: any[];
  projects_completed: any[];
  payment_method: any;
  bank_account_info: any;
  role_name: string | null;
  experience: any; // Added this line to fix the error
}

// Refined IFreelancer type for CandidateDetailsArea, with pre-processed data
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
  // Pre-processed YouTube videos (without titles)
  youtube_videos: { id: string; url: string; }[];
  // Other details you might want to display
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
  // Fields that were removed from the display, but kept in type for completeness
  experience: any[];
  education: any[];
  previous_works: string[];
  certification: any[];
  services: any[];
  portfolio_links: string[];
}

const DynamicCandidateProfilePage = () => {
  const params = useParams();
  const candidateId = params.id as string;
  const [freelancer, setFreelancer] = useState<IFreelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidateId) {
      const parsedId = parseInt(candidateId);
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, {
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) throw new Error(`Failed to fetch data`);

          const responseData = await response.json();
          const foundRawFreelancer: RawApiFreelancer | undefined = responseData.data?.find((f: RawApiFreelancer) => String(f.user_id) === candidateId);

          if (foundRawFreelancer) {
            // Process YouTube links to extract ID and URL
            const youtubeVideos = (foundRawFreelancer.portfolio_links || [])
              .filter(link => link.includes("youtube.com/watch?v="))
              .map(link => {
                const videoId = link.split('v=')[1]?.split('&')[0] || '';
                return { id: videoId, url: link };
              })
              .filter(video => video.id !== ''); // Ensure we have a valid ID

            // Map raw API data to the refined IFreelancer type
            const mappedFreelancer: IFreelancer = {
              user_id: foundRawFreelancer.user_id,
              first_name: foundRawFreelancer.first_name,
              last_name: foundRawFreelancer.last_name,
              bio: foundRawFreelancer.bio || foundRawFreelancer.short_description || null,
              profile_picture: foundRawFreelancer.profile_picture || null,
              skills: foundRawFreelancer.skills || [],
              superpowers: foundRawFreelancer.superpowers || [],
              languages: foundRawFreelancer.languages || [],
              city: foundRawFreelancer.city || null,
              country: foundRawFreelancer.country || null,
              email: `${foundRawFreelancer.username || 'unknown'}@example.com`,
              rate_amount: foundRawFreelancer.rate_amount || "0.00",
              currency: foundRawFreelancer.currency || "USD",
              availability: foundRawFreelancer.availability || "not specified",
              latitude: foundRawFreelancer.latitude || null,
              longitude: foundRawFreelancer.longitude || null,
              profile_title: foundRawFreelancer.profile_title || null,
              short_description: foundRawFreelancer.short_description || null,
              youtube_videos: youtubeVideos,
              experience_level: foundRawFreelancer.experience_level || null,
              work_type: foundRawFreelancer.work_type || null,
              hours_per_week: foundRawFreelancer.hours_per_week || null,
              kyc_verified: foundRawFreelancer.kyc_verified,
              aadhaar_verification: foundRawFreelancer.aadhaar_verification,
              hire_count: foundRawFreelancer.hire_count,
              review_id: foundRawFreelancer.review_id,
              total_earnings: foundRawFreelancer.total_earnings,
              time_spent: foundRawFreelancer.time_spent,
              role_name: foundRawFreelancer.role_name || null,
              // Fields kept for type but not displayed
              experience: foundRawFreelancer.experience || [],
              education: foundRawFreelancer.education || [],
              previous_works: foundRawFreelancer.previous_works || [],
              certification: foundRawFreelancer.certification || [],
              services: foundRawFreelancer.services || [],
              portfolio_links: foundRawFreelancer.portfolio_links || [],
            };
            setFreelancer(mappedFreelancer);
          } else {
            setError("Sorry, this freelancer could not be found.");
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [candidateId]);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        {error && (
            <div className="container text-center pt-80 pb-80">
                <h2 className="text-danger">An Error Occurred</h2>
                <p>{error}</p>
            </div>
        )}

        {!error && (
            <CandidateDetailsArea freelancer={freelancer} loading={loading} />
        )}

        <JobPortalIntro top_border={true} />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default DynamicCandidateProfilePage;