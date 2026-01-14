import React from "react";
import { Metadata } from "next";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import ClientFaqArea from "../components/client-faq/client-faq-area";

export const metadata: Metadata = {
    title: "Client FAQ",
};

const ClientFaqPage = () => {
    return (
        <Wrapper>
            <div className="main-page-wrapper">
                <Header />
                <CompanyBreadcrumb
                    title="Client FAQ"
                    subtitle="All your questions answered"
                />
                <ClientFaqArea />
                <FooterOne />
            </div>
        </Wrapper>
    );
};

export default ClientFaqPage;
