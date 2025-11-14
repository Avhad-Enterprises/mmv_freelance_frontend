"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/headers/header";
import FooterOne from "@/layouts/footers/footer-one";
import CandidateProfileBreadcrumb from "@/app/components/candidate-details/profile-bredcrumb";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area";
import JobPortalIntro from "@/app/components/job-portal-intro/job-portal-intro";
import { IFreelancer } from "@/interfaces/freelancer"; // <-- IMPORT the shared type

// Remove the old, local IFreelancer interface from this file

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

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, {
            cache: 'no-cache'
          });
          if (!response.ok) throw new Error(`Failed to fetch data`);

          const responseData = await response.json();
          // Find the raw data. Assume the raw data might not have all IFreelancer fields.
          const foundRawFreelancer = responseData.data.find((f: any) => f.user_id === parseInt(candidateId));

          if (foundRawFreelancer) {
            // Process YouTube links to create the 'youtube_videos' array
            const youtubeVideos = (foundRawFreelancer.portfolio_links || [])
              .filter((link: string) => link.includes("youtube.com/watch?v="))
              .map((link: string) => {
                const videoId = link.split('v=')[1]?.split('&')[0] || '';
                return { id: videoId, url: link };
              })
              .filter((video: {id: string}) => video.id !== '');

            // Map the raw data to the complete IFreelancer type
            const mappedFreelancer: IFreelancer = {
              ...foundRawFreelancer, // Spread all properties from the raw object
              bio: foundRawFreelancer.bio || foundRawFreelancer.short_description || null,
              email: `${foundRawFreelancer.username || 'unknown'}@example.com`,
              // Ensure arrays and required fields have default values
              skills: foundRawFreelancer.skills || [],
              superpowers: foundRawFreelancer.superpowers || [],
              languages: foundRawFreelancer.languages || [],
              portfolio_links: foundRawFreelancer.portfolio_links || [],
              experience: foundRawFreelancer.experience || [],
              education: foundRawFreelancer.education || [],
              previous_works: foundRawFreelancer.previous_works || [],
              services: foundRawFreelancer.services || [],
              certification: foundRawFreelancer.certification || [],
              // Add the processed youtube_videos
              youtube_videos: youtubeVideos,
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