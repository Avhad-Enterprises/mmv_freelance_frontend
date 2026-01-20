import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import HowToHireArea from "../components/how-to-hire/how-to-hire-area";

export const metadata: Metadata = {
    
};

const HowToHirePage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="How to Hire"
                    subtitle="Simple steps to find the perfect video talent"
                />
                <HowToHireArea />
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default HowToHirePage;
