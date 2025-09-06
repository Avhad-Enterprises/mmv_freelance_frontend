import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";
import Details from "./details";
import CandidateProfileBreadcrumb from "../components/candidate-details/profile-bredcrumb";
import TermsAndConditions from "./details";

export const metadata: Metadata = {
  title: "Contact",
};

const TermsAndConditionsPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}
        <CandidateProfileBreadcrumb title="Terms And Conditions" subtitle="Terms And Conditions" />
        <Details />
        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default TermsAndConditionsPage;
