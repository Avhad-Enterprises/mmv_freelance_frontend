"use client";
import React from "react";
import { Container } from "react-bootstrap";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  UserIcon,
  File01Icon,
  Wallet01Icon,
  Message01Icon,
  Upload01Icon,
  StarIcon,
  Globe02Icon,
  Shield01Icon,
  CookieIcon,
  Megaphone01Icon,
  Chip02Icon,
  ArchiveIcon,
  Share01Icon,
  LockIcon,
  Key01Icon,
  RefreshIcon,
  IcoIcon,
} from "hugeicons-react";

const headingColor = { color: "rgb(36, 64, 52)" };
const darkText = { color: "#111111" };

const PrivacyPolicy = () => {
  return (
    <section className="py-5 bg-white">
      <Container className="max-w-4xl">
        {/* Title */}
        <h1 className="fw-bold fs-2 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <Shield01Icon size={34} /> Privacy Policy
        </h1>
        <p className="text-muted mb-4">Last updated: 05/09/2025</p>
        <p style={darkText}>
          Make My Vid (“we,” “our,” or “us”) is committed to protecting the privacy of our clients, collaborators, and visitors who use our website, editing services, and production solutions (collectively referred to as the “Platform”).
          This Privacy Policy explains how we collect, use, share, and protect your personal information, and outlines your rights in relation to that information. By using our Platform, you agree to the practices described below. If you do not agree, please refrain from using our Platform.
        </p>

        {/* 1. Contact Details */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <IcoIcon size={28} /> 1. Contact Details
        </h2>
        <p style={darkText}>
          If you have questions or concerns about this Privacy Policy or how your personal data is handled, please contact us:
        </p>
        <div className="d-flex flex-column gap-2 mt-2" style={darkText}>
          <span className="d-flex align-items-center gap-2">
            <Mail01Icon size={18} /> info@makemyvid.io
          </span>
          <span className="d-flex align-items-center gap-2">
            <Call02Icon size={18} /> India: +91 79774 84292
          </span>
          <span className="d-flex align-items-center gap-2">
            <Call02Icon size={18} /> UK: +44 75425 50969
          </span>
          <span className="d-flex align-items-center gap-2">
            <Location01Icon size={18} /> 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
          </span>
        </div>

        {/* 2. Information We Collect */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <UserIcon size={28} /> 2. Information We Collect About You
        </h2>
        <p style={darkText}>
          At Make My Vid, protecting your privacy is a core priority. To deliver high-quality video production and editing services, ensure smooth workflows, and maintain a secure platform, we collect and process certain categories of information. This collection happens when you use our website, contact us, share content for editing, or engage with us in any way.
        </p>

        {/* a) You Provide */}
        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>a) Information You Provide Directly</h5>
        <p style={darkText}>You may provide personal and project-related information directly to us when you register, request services, or communicate with us.
          This includes:</p>
        <ul className="list-unstyled d-flex flex-column gap-2" style={darkText}>
          <li className="d-flex align-items-center gap-2"> Account Creation: When you sign up, we collect details such as your full name, email address, phone number, password, and any optional information you provide (e.g., display name, profile photo, company details).
          </li>
          <li className="d-flex align-items-center gap-2"> Project details: raw footage, editing instructions, creative preferences.</li>
          <li className="d-flex align-items-center gap-2"><Wallet01Icon size={18} /> Payment & billing info (processed securely by third-party providers).</li>
          <li className="d-flex align-items-center gap-2"><Message01Icon size={18} /> Customer support communications.</li>
          <li className="d-flex align-items-center gap-2"><Upload01Icon size={18} /> Uploaded files & creative materials.</li>
          <li className="d-flex align-items-center gap-2"><StarIcon size={18} /> Reviews, testimonials, and feedback.</li>
        </ul>

        {/* b) Auto */}
        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>b) Information We Collect Automatically</h5>
        <ul className="list-unstyled d-flex flex-column gap-2" style={darkText}>
          <li className="d-flex align-items-center gap-2"><Chip02Icon size={18} /> Device and technical data (OS, browser, IP address).</li>
          <li className="d-flex align-items-center gap-2"><Globe02Icon size={18} /> Usage data (pages visited, features used).</li>
          <li className="d-flex align-items-center gap-2"><Location01Icon size={18} /> Location data (with consent).</li>
          <li className="d-flex align-items-center gap-2"><CookieIcon size={18} /> Cookies & tracking technologies.</li>
        </ul>

        {/* c) Third Parties */}
        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>c) Information From Third Parties</h5>
        <ul className="list-unstyled d-flex flex-column gap-2" style={darkText}>
          <li className="d-flex align-items-center gap-2"><Wallet01Icon size={18} /> Payment providers (transaction confirmations).</li>
          <li className="d-flex align-items-center gap-2"><Megaphone01Icon size={18} /> Analytics & advertising partners (Google Analytics, Meta Ads).</li>
          <li className="d-flex align-items-center gap-2"><Share01Icon size={18} /> Cloud storage & collaboration tools.</li>
          <li className="d-flex align-items-center gap-2"><Shield01Icon size={18} /> Fraud detection & security partners.</li>
        </ul>

        {/* 3. How We Use */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <Key01Icon size={28} /> 3. How We Use Your Information
        </h2>
        <ul className="list-unstyled d-flex flex-column gap-2" style={darkText}>
          <li>Deliver services (editing, production, secure file sharing).</li>
          <li>Manage accounts and preferences.</li>
          <li>Provide customer support.</li>
          <li>Send essential service communications.</li>
          <li>Research & improve services.</li>
          <li>Marketing & promotions (with consent).</li>
          <li>Fraud prevention & security.</li>
          <li>Legal & regulatory compliance.</li>
        </ul>

        {/* 4. Cookies */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <CookieIcon size={28} /> 4. Cookies and Tracking Technologies
        </h2>
        <p style={darkText}>
          We use cookies to enable functionality, analyse performance, personalise content, and deliver marketing.
          You can manage cookies via browser settings or opt-out tools. Disabling cookies may affect certain features.
        </p>

        {/* baaki sections bhi isi tarah gap aur bade icons ke saath honge */}

        {/* 12. Changes */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <RefreshIcon size={28} /> 12. Changes to This Policy
        </h2>
        <p style={darkText}>
          We may update this Privacy Policy for legal, business, or security reasons.
          Minor updates will change the “Last Updated” date. Major updates will be notified via email or platform notice.
        </p>
      </Container>
    </section>
  );
};

export default PrivacyPolicy;
