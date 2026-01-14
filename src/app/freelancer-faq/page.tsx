import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import FreelancerFaqArea from "../components/freelancer-faq/freelancer-faq-area";

export const metadata: Metadata = {
    title: "Freelancer FAQ",
};

const FreelancerFaqPage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="Freelancer FAQ"
                    subtitle="Common questions from creators"
                />
                <FreelancerFaqArea />
                {/* <JobPortalIntro top_border={true} /> */}
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default FreelancerFaqPage;
