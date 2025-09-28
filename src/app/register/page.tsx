"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import CompanyBreadcrumb from "../components/common/common-breadcrumb";
import FooterOne from "@/layouts/footers/footer-one";
import RegisterArea from "../components/register/register-area";

const PageTitle = "Register";

const RegisterPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
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
