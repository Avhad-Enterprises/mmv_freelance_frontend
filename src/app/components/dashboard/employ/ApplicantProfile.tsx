"use client";
import React from "react";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import { IFreelancer } from "@/app/candidate-profile-v1/[id]/page";

interface ApplicantProfileProps {
  selectedApplicant: IFreelancer | null;
  loadingProfile: boolean;
  onBackToApplicants: () => void;
}

const ApplicantProfile: React.FC<ApplicantProfileProps> = ({
  selectedApplicant,
  loadingProfile,
  onBackToApplicants
}) => {
  return (
    <CandidateDetailsArea
      freelancer={selectedApplicant}
      loading={loadingProfile}
      onBackToList={onBackToApplicants}
    />
  );
};

export default ApplicantProfile;