import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";
import Details from "./details";
import CandidateProfileBreadcrumb from "../components/candidate-details/profile-bredcrumb";

export const metadata: Metadata = {
  title: "Contact",
};

const PrivacyPolicy = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}
        <CandidateProfileBreadcrumb title="Privacy Policy" subtitle="All about privacy and Policy" />
        <Details />
        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default PrivacyPolicy;
