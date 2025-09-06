"use client";
import React from "react";
import { Container } from "react-bootstrap";
import {
  CookieIcon,
  Globe02Icon,
  Shield01Icon,
  ChartIcon,
  Settings02Icon,
  RefreshIcon,
  Mail01Icon,
  Building01Icon,
  Call02Icon,
} from "hugeicons-react";

const headingColor = { color: "rgb(36, 64, 52)" };
const darkText = { color: "#111111" };

const CookiePolicy = () => {
  return (
    <section className="py-5 bg-white">
      <Container className="max-w-4xl">
        {/* Title */}
        <h1
          className="fw-bold fs-2 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CookieIcon size={32} /> Cookie Policy
        </h1>
        <p className="text-muted mb-4">Last updated: 05/09/2025</p>

        {/* 1. Introduction */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Globe02Icon size={28} /> 1. Introduction
        </h2>
        <h5 className="fw-medium mb-2" style={headingColor}>
          Purpose of this Policy
        </h5>
        <p style={darkText}>
          This Cookie Policy explains how Make My Vid (“we,” “our,” or “us”) uses
          cookies and similar technologies on our website and platform. We want
          you to clearly understand what cookies are, how we use them, and the
          choices you have when it comes to managing them.
        </p>
        <p style={darkText} className="mt-2">
          Our goal is transparency — so you know exactly how your data is
          collected, stored, and used to provide you with a smooth and
          personalized experience.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Scope and Applicability
        </h5>
        <p style={darkText}>
          This policy applies to all users who access our website, mobile
          applications, and any other digital services provided by Make My Vid.
          It should be read together with our Privacy Policy. By continuing to
          use our platform, you consent to the use of cookies in line with this
          policy.
        </p>

        {/* 2. What Are Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CookieIcon size={28} /> 2. What Are Cookies?
        </h2>
        <h5 className="fw-medium mb-2" style={headingColor}>
          Definition
        </h5>
        <p style={darkText}>
          Cookies are small text files placed on your device when you visit a
          website. They help remember information like login status, preferences,
          or cart items. They don’t run programs or deliver viruses—they simply
          improve functionality and personalization.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Types of Cookies
        </h5>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li className="mb-2">
            <strong>Session Cookies:</strong> Temporary cookies that expire when
            you close your browser. Example: Keeping you logged in between pages.
          </li>
          <li>
            <strong>Persistent Cookies:</strong> Remain on your device after
            closing the browser. Example: Remembering your language or login
            details.
          </li>
        </ul>

        {/* 3. How We Use Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <ChartIcon size={28} /> 3. How We Use Cookies
        </h2>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li className="mb-2">
            <strong>Essential Cookies:</strong> Enable secure login, session
            continuity, and smooth page loading.
          </li>
          <li className="mb-2">
            <strong>Performance & Analytics Cookies:</strong> Track usage
            patterns, detect errors, and improve site speed.
          </li>
          <li className="mb-2">
            <strong>Functionality Cookies:</strong> Remember preferences like
            language and region, and enhance features.
          </li>
          <li>
            <strong>Advertising & Targeting Cookies:</strong> Deliver relevant
            ads, limit repetition, and measure campaign effectiveness.
          </li>
        </ul>

        {/* 4. Third-Party Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Shield01Icon size={28} /> 4. Third-Party Cookies
        </h2>
        <p style={darkText}>Trusted third parties may place cookies:</p>
        <ul className="ps-3 list-unstyled mt-2" style={darkText}>
          <li className="mb-2">
            <strong>Analytics Providers:</strong> Google Analytics, Meta Ads
            Pixel — track behavior and campaign success.
          </li>
          <li className="mb-2">
            <strong>Payment & Authentication:</strong> Stripe, PayPal, Razorpay,
            Google Sign-In — ensure secure transactions.
          </li>
          <li>
            <strong>Social Media Integrations:</strong> Facebook, LinkedIn, Apple
            — enable login and sharing features.
          </li>
        </ul>

        {/* 5. Managing Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Settings02Icon size={28} /> 5. Managing Cookies
        </h2>
        <h5 className="fw-medium mb-2" style={headingColor}>
          Browser Settings
        </h5>
        <p style={darkText}>Change cookie settings in your browser:</p>
        <ul className="ps-3 list-unstyled mt-2" style={darkText}>
          <li className="mb-1">
            <strong>Chrome:</strong> Settings &gt; Privacy and Security &gt;
            Cookies
          </li>
          <li className="mb-1">
            <strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website
            Data
          </li>
          <li className="mb-1">
            <strong>Firefox:</strong> Options &gt; Privacy &amp; Security &gt;
            Cookies
          </li>
          <li>
            <strong>Edge:</strong> Settings &gt; Cookies and Site Permissions
          </li>
        </ul>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Opt-Out Options
        </h5>
        <p style={darkText}>
          Use our cookie banner or tools like Google Analytics Opt-Out and Your
          Online Choices to manage preferences.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Impact of Disabling Cookies
        </h5>
        <p style={darkText}>
          Blocking cookies may affect functionality—like login persistence, saved
          settings, or secure checkout.
        </p>

        {/* 6. Consent */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CookieIcon size={28} /> 6. Consent to Use Cookies
        </h2>
        <p style={darkText}>
          We request consent for non-essential cookies via our banner. Essential
          cookies are always active. You can withdraw consent anytime via
          settings.
        </p>

        {/* 7. Updates */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <RefreshIcon size={28} /> 7. Updates to This Policy
        </h2>
        <p style={darkText}>
          We may update this policy to reflect changes. When we do, we’ll update
          the date, notify you, and summarize changes.
        </p>

        {/* 8. Contact Info */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Mail01Icon size={28} /> 8. Contact Information
        </h2>
        <p style={darkText}>
          <Mail01Icon className="me-2" size={18} /> Email: info@makemyvid.io
          <br />
          <Building01Icon className="me-2 mt-2" size={18} /> Office: 11, Star
          Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West Mumbai
          400092
          <br />
          <Call02Icon className="me-2 mt-2" size={18} /> Phone: +91 79774 84292 /
          +44 75425 50969
        </p>
      </Container>
    </section>
  );
};

export default CookiePolicy;
