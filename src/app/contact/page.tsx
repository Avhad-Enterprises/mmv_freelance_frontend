"use client";
import React from "react";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";
import MapArea from "../components/contact/map-area";
import ContactArea from "../components/contact/contact-area";

const ContactPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Conditional header rendering */}
        <Header />

        {/*MapArea start */}
        <MapArea />
        {/*MapArea end */}

        {/* contact area start */}
        <ContactArea />
        {/* contact area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default ContactPage;