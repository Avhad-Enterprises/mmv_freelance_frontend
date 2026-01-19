import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import HowToFindWorkArea from "../components/how-to-find-work/how-to-find-work-area";

export const metadata: Metadata = {
    title: "How to Find Work",
};

const HowToFindWorkPage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="How to Find Work"
                    subtitle="Get Paid to Create"
                />
                <HowToFindWorkArea />
                {/* <JobPortalIntro top_border={true} /> */}
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default HowToFindWorkPage;
