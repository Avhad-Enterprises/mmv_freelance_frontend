"use client";
import { useEffect, useState } from "react";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area";
import { makePostRequest } from "@/utils/api";
import ProfileBreadcrumb from "@/app/components/candidate-details/profile-bredcrumb";
import Header from "@/layouts/headers/header";

interface PageProps {
    params: {
        username: string;
    };
}
console.log()
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

const CandidateProfilePage = ({ params }: PageProps) => {
    const { username } = params;
    const [freelancer, setFreelancer] = useState<IFreelancer | null>(null);
    const [loading, setLoading] = useState(true);
    // console.log("dekh bhai ayagaya hai", username);
    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                const response = await makePostRequest("users/getfreelaner", {username });
                console.log("Full API Response: ", JSON.stringify(response, null, 2));
                console.log("Response Data: ", JSON.stringify(response.data, null, 2));
                if (response.data && typeof response.data === "object" && Object.keys(response.data).length > 0) {
                    setFreelancer(response.data.data); // Adjust if nested, e.g., response.data.freelancer
                    console.log("Set Freelancer: ", response.data);
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

    const title = freelancer
        ? `${freelancer.first_name} ${freelancer.last_name}`
        : "Loading...";

    return <>

        <Header />
        {/* Breadcrumb Header */}
        <ProfileBreadcrumb title={title} subtitle="Profile" />

        {/* Candidate Details Section */}
        {freelancer && <CandidateDetailsArea freelancer={freelancer} loading={false} />}
    </>
};

export default CandidateProfilePage;