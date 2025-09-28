"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import RegisterArea from "../components/register/register-area";
import LoadingSpinner from "../components/common/loading-spinner";

const PageTitle = "Register";

const RegisterPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 500ms, or set to false immediately if you want
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {loading && <LoadingSpinner />}
        {/* header start */}
        <Header />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb
          title="Register"
          subtitle="Create an account & Start posting or hiring talents"
        />
        {/*breadcrumb end */}

        {/* register area start */}
        <RegisterArea/>
        {/* register area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default RegisterPage;
