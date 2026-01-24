"use client";
import React from "react";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import { IFreelancer } from "@/app/freelancer-profile/[id]/page";

interface ApplicantProfileProps {
  selectedApplicant: IFreelancer | null;
  loadingProfile: boolean;
  onBackToApplicants: () => void;
  onMessage?: (userId: number) => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
  selectedApplicant,
  loadingProfile,
  onBackToApplicants,
  onMessage
}) => {
  return (
    <CandidateDetailsArea
      freelancer={selectedApplicant}
      loading={loadingProfile}
      onMessage={onMessage}
    />
  );
};

export default ApplicantProfile;