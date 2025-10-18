// app/candidate-profile-v1/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import CandidateProfileBreadcrumb from "@/app/components/candidate-details/profile-bredcrumb";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area";
import JobPortalIntro from "@/app/components/job-portal-intro/job-portal-intro";

// Define the structure of a freelancer object that matches your API response
// This type is used after fetching and before passing to CandidateDetailsArea
export interface IFreelancer {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string; // Used for email fallback
  profile_picture: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  skills: string[];
  superpowers: string[];
  languages: string[];
  portfolio_links: string[]; // Raw portfolio links
  rate_amount: string;
  currency: string;
  availability: string;
  profile_title: string | null;
  short_description: string | null;
  experience_level: string | null;
  role_name: string | null;
  // Fields that were removed from display or are not directly used in IFreelancer for display logic,
  // but might be present in the raw API response or needed for type completeness.
  timezone: string | null;
  address_line_first: string | null;
  address_line_second: string | null;
  state: string | null;
  pincode: string | null;
  is_active: boolean;
  is_banned: boolean;
  is_deleted: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
  freelancer_id: number;
  certification: any;
  education: any;
  previous_works: any;
  services: any;
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
}

const DynamicCandidateProfilePage = () => {
  const params = useParams();
  const candidateId = params.id as string;
  const [freelancer, setFreelancer] = useState<IFreelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (candidateId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch('http://localhost:8000/api/v1/freelancers/getfreelancers-public', {
            cache: 'no-cache'
          });
          if (!response.ok) throw new Error(`Failed to fetch data`);

          const responseData = await response.json();
          const foundRawFreelancer: IFreelancer | undefined = responseData.data.find((f: IFreelancer) => f.user_id === parseInt(candidateId));

          if (foundRawFreelancer) {
            // Map raw API data to the IFreelancer type, ensuring arrays are not null
            const mappedFreelancer: IFreelancer = {
              ...foundRawFreelancer, // Spread all existing properties
              bio: foundRawFreelancer.bio || foundRawFreelancer.short_description || null,
              skills: foundRawFreelancer.skills || [],
              superpowers: foundRawFreelancer.superpowers || [],
              languages: foundRawFreelancer.languages || [],
              portfolio_links: foundRawFreelancer.portfolio_links || [],
              email: `${foundRawFreelancer.username || 'unknown'}@example.com`, // Placeholder email
              rate_amount: foundRawFreelancer.rate_amount || "0.00",
              currency: foundRawFreelancer.currency || "USD",
              availability: foundRawFreelancer.availability || "not specified",
              experience_level: foundRawFreelancer.experience_level || null,
              role_name: foundRawFreelancer.role_name || null,
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

  const breadcrumbTitle = loading
    ? "Loading Profile..."
    : freelancer
    ? `${freelancer.first_name} ${freelancer.last_name}`
    : "Candidate Profile";

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header />

        <CandidateProfileBreadcrumb title={breadcrumbTitle} subtitle="Candidate Profile" />

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