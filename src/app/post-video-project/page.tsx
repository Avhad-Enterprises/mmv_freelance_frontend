import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import PostVideoProjectArea from "../components/post-video-project/post-video-project-area";

export const metadata: Metadata = {
    
};

const PostVideoProjectPage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="Post a Video Project"
                    subtitle="Tell us what you need"
                />
                <PostVideoProjectArea />
                {/* <JobPortalIntro top_border={true} /> */}
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default PostVideoProjectPage;
