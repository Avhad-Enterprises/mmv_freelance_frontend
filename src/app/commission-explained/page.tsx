import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import CommissionExplainedArea from "../components/commission-explained/commission-explained-area";

export const metadata: Metadata = {
    title: "Commission Explained",
};

const CommissionExplainedPage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="A Transparent System for Serious Video Creators"
                    subtitle="Commission Structure & Keys to Abundance"
                />
                <CommissionExplainedArea />
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default CommissionExplainedPage;
