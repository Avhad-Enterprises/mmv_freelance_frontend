"use client";
import React from "react";
import { Container } from "react-bootstrap";
import {
  Shield01Icon,
  Building01Icon,
  Mail01Icon,
  Call02Icon,
  File01Icon,
  UserIcon,
  Clock01Icon,
  Globe02Icon,
  LockIcon,
} from "hugeicons-react";

const headingColor = { color: "rgb(36, 64, 52)" };
const darkText = { color: "#111111" };

const TermsAndConditions = () => {
  return (
    <section className="py-5 bg-white">
      <Container className="max-w-5xl">
        {/* Title */}
        <h1
          className="fw-bold fs-2 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Shield01Icon size={30} /> Make My Vid – Terms of Service
        </h1>
        <p className="text-muted mb-4">Effective Date: 05/09/2025</p>

        {/* 1. About Us */}
        <h2
          className="fs-4 fw-semibold mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Building01Icon size={28} /> 1. About Us
        </h2>
        <p style={darkText}>
          Make My Vid (“we,” “our,” or “us”) is a video production and editing
          service provider operating from:
        </p>
        <p style={darkText}>
          <Building01Icon size={18} className="me-2" /> 11, Star Trade Centre,
          Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092 <br />
          <Mail01Icon size={18} className="me-2" /> info@makemyvid.io <br />
          <Call02Icon size={18} className="me-2" /> India: +91 79774 84292{" "}
          <br />
          <Call02Icon size={18} className="me-2" /> UK: +44 75425 50969
        </p>
        <p style={darkText}>
          We specialise in pre-production, production, and post-production
          services including videography, editing, grading, sound mixing, and
          more.
        </p>

        {/* 2. Purpose of Our Service */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <File01Icon size={28} /> 2. Purpose of Our Service
        </h2>
        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          a) What We Offer
        </h5>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li>Pre-Production: Concept development, script adjustments, project scoping.</li>
          <li>Production: Access to partner videography or shooting services (when available).</li>
          <li>Post-Production: Editing, motion graphics, animation, sound design, grading, subtitles, formatting.</li>
          <li>Custom Deliverables: Final files optimised for YouTube, Instagram, corporate, or events.</li>
        </ul>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          b) How Clients Use Our Service
        </h5>
        <p style={darkText}>
          Clients can submit briefs, upload footage, specify styles, and collaborate with our team to refine revisions and delivery.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          c) Our Commitment to Clients
        </h5>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li>Secure handling of content.</li>
          <li>Timely delivery.</li>
          <li>Professional workflow with industry standards.</li>
          <li>Transparent communication throughout.</li>
        </ul>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          d) Client Responsibilities
        </h5>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li>Accuracy of provided materials.</li>
          <li>Obtaining licences for third-party assets (music, logos, stock).</li>
          <li>Providing timely feedback and approvals.</li>
          <li>Ensuring materials comply with law.</li>
        </ul>

        {/* 3. Your Account */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <UserIcon size={28} /> 3. Your Account
        </h2>
        <p style={darkText}>
          To use services, clients may need to create an account with accurate, complete details. You are responsible for your credentials and permitted use.
        </p>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li>Must be 18+ or legal majority.</li>
          <li>No sharing accounts unless authorised.</li>
          <li>We may suspend accounts for misuse or illegal activity.</li>
        </ul>

        {/* 4. Service Availability */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Clock01Icon size={28} /> 4. Service Availability
        </h2>
        <p style={darkText}>
          While we strive for consistent service, timelines may shift due to technical, client, or external delays. We will notify promptly if delays occur.
        </p>

        {/* Website Terms of Use */}
        <h1
          className="fw-bold fs-2 mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Globe02Icon size={30} /> Make My Vid – Website Terms of Use
        </h1>
        <p className="text-muted mb-4">Effective Date: 05/09/2025</p>

        <h2
          className="fs-4 fw-semibold mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <LockIcon size={28} /> 1. Acceptance of Terms
        </h2>
        <p style={darkText}>
          By using our website, you agree to these Terms. If you don’t agree, stop using the site. These Terms work alongside our Privacy Policy, Cookie Policy, and Terms of Service.
        </p>
      </Container>
    </section>
  );
};

export default TermsAndConditions;
