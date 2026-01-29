"use client";
import React from "react";
import { Container } from "react-bootstrap";
import {
  Cookie,
  Globe,
  Shield,
  BarChart3,
  Settings,
  RefreshCw,
  Mail,
  Building,
  Phone,
} from "lucide-react";

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
          <Cookie size={32} /> Cookie Policy
        </h1>
        <p className="text-muted mb-4">Last updated: 05/09/2025</p>

        {/* 1. Introduction */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Globe size={28} /> 1. Introduction
        </h2>
        <h5 className="fw-medium mb-2" style={headingColor}>
          Purpose of this Policy
        </h5>
        <p style={darkText}>
          This Cookie Policy explains how <strong>Make My Vid</strong> (“we,” “our,” or “us”) uses
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
          applications, and any other digital services provided by <strong>Make My Vid</strong>.
        </p>
        <p style={darkText}>It should be read together with our <strong>Privacy Policy</strong>, which explains how we handle your personal data more broadly. By continuing to use our platform, you consent to the use of cookies in line with this policy.</p>

        {/* 2. What Are Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Cookie size={28} /> 2. What Are Cookies?
        </h2>
        <h5 className="fw-medium mb-2" style={headingColor}>
          Definition
        </h5>
        {/* <p style={darkText}>
          Cookies are small text files placed on your device when you visit a
          website. They help remember information like login status, preferences,
          or cart items. They don’t run programs or deliver viruses—they simply
          improve functionality and personalization.
        </p> */}

        <p style={darkText}>
          Cookies are small text files that a website places on your device (computer, phone, or tablet) when you visit. They serve as a tool to <strong>rremember information about you</strong>, such as your login status, preferences, or the items in your shopping cart.
        </p>
        <p style={darkText}>
          They don’t run programs or deliver viruses; instead, they help websites function properly and deliver a smoother, more personalized experience.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Types of Cookies
        </h5>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">Session Cookies</h5>
          <p className="mb-2">These are temporary cookies that only exist while you are browsing our site.</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              These expire once you close your browser.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Example: Keeping you logged in while you move between pages.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Help maintain your session security while browsing.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4"> Persistent Cookies</h5>
          <p className="mb-2">These cookies stay on your device even after you close the browser.</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              They help us remember your preferences and settings for your next visit.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Example: Remembering your language choice or login details for faster access.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Store your long-term preferences to enhance user experience.
            </li>
          </ul>
        </div>


        {/* 3. How We Use Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <BarChart3 size={28} /> 3. How We Use Cookies
        </h2>
        <p style={darkText} className="mb-4">
          We use cookies to make sure our platform works the way you expect and to give you the best possible experience. Here's how each type of cookie helps:
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Essential Cookies</h5>
          <p className="mb-2">These are the backbone of our website — without them, basic features wouldn't work.</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Keep you logged in as you move between pages.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Enable secure login and account protection.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Ensure the website loads correctly and functions smoothly.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Performance & Analytics Cookies</h5>
          <p className="mb-2">These cookies help us understand how people use our platform so we can improve it.</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Track which pages are visited most often.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Identify issues such as slow loading or errors.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Collect anonymous data that helps us make the site faster and easier to use.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Functionality Cookies</h5>
          <p className="mb-2">These cookies make your experience more personal.</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Remember your preferences, such as language or region.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Save your settings so you don't have to re-enter them every time.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Provide enhanced features like remembering your last search.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Advertising & Targeting Cookies</h5>
          <p className="mb-2">These cookies make sure the ads you see are <strong>relevant to you.</strong></p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Deliver personalized ads based on your interests.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Limit the number of times you see the same ad.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Help us measure how effective our marketing campaigns are.
            </li>
          </ul>
        </div>

        {/* 4. Third-Party Cookies */}
<h2 className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Shield size={28} /> 4. Third-Party Cookies
</h2>
<p style={darkText} className="mb-3">
  In addition to the cookies we set, some cookies are placed on your device by trusted third parties. 
  These cookies help us provide better services, measure performance, and enable features you might use on our platform.
</p>
<p style={darkText} className="mb-4">Here's how third-party cookies come into play:</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Analytics Providers</h5>
  <p className="mb-2">We use tools like <strong>Google Analytics</strong> and <strong>Meta Ads Pixel</strong> to understand how users interact with our website.</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Track visitor numbers and behavior patterns.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Measure the success of marketing campaigns.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Help us improve site performance and user experience.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">b) Payment & Authentication Services</h5>
  <p className="mb-2">When you make a payment or log in using secure methods, external providers may set cookies to process your requests safely.</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Payment gateways (e.g., Stripe, PayPal, Razorpay).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Authentication services (e.g., Google Sign-In, Apple ID, OTP-based login).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      These cookies are essential for fraud prevention and transaction security.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">c) Social Media Integrations</h5>
  <p className="mb-2">If you interact with our platform through social media, those platforms may place cookies on your device.</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Login through <strong>Facebook, Google, LinkedIn, or Apple</strong>.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Sharing content or linking accounts to social media.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      These cookies help personalize your experience and connect accounts seamlessly.
    </li>
  </ul>
</div>

{/* 5. Managing Cookies */}
<h2 className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Settings size={28} /> 5. Managing Cookies
</h2>
<p style={darkText} className="mb-3">
  You're in control of how cookies are used on your device. Here's how you can manage them:
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Browser Settings and Controls</h5>
  <p className="mb-2">Most web browsers automatically accept cookies, but you can change your settings at any time to block or delete them.</p>
  {/* Browser Settings List */}
<ul className="list-unstyled ps-4">
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    <strong>Google Chrome</strong> {'->'} Settings {'->'} Privacy and Security {'->'} Cookies and Other Site Data
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    <strong>Safari</strong> {'->'} Preferences {'->'} Privacy {'->'} Manage Website Data
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    <strong>Firefox</strong> {'->'} Options {'->'} Privacy & Security {'->'} Cookies and Site Data
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    <strong>Microsoft Edge</strong> {'->'} Settings {'->'} Cookies and Site Permissions
  </li>
</ul>

  <h5 className="fw-medium mb-2 mt-4">b) Opt-Out Options</h5>
  <p className="mb-2">You can also:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Adjust your cookie preferences directly in our <strong>cookie banner or settings panel</strong>.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Opt out of analytics tracking (e.g., Google Analytics opt-out tool).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Opt out of personalized advertising via Your Online Choices or Network Advertising Initiative.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">c) Impact of Disabling Cookies</h5>
  <p className="mb-2">If you block or delete cookies, some parts of our platform may not work as intended. For example:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      You may need to log in every time you visit.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Certain settings (like language or region) may not be remembered.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Features such as secure checkout or project matching may not function properly.
    </li>
  </ul>
</div>

{/* 6. Consent to Use Cookies */}
<h2 className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Cookie size={28} /> 6. Consent to Use Cookies
</h2>
<h5 className="fw-medium mb-2">How Consent Is Obtained</h5>
<p style={darkText} className="mb-3">
  When you first visit our platform, we'll ask for your consent to use non-essential cookies (such as analytics, functionality, and advertising cookies). 
  Essential cookies, which are required for our website to function properly, are always active.
</p>
<p style={darkText} className="mb-3">Your consent is recorded the moment you:</p>
<ul className="list-unstyled ps-4" style={darkText}>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Click <strong>"Accept All"</strong> on the cookie banner, or
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Adjust your preferences and save your choices.
  </li>
</ul>
<p style={darkText} className="mb-4">You can withdraw your consent at any time by updating your cookie settings.</p>

<h5 className="fw-medium mb-2">Cookie Banner & Preferences Management</h5>
<p style={darkText} className="mb-3">
  Our cookie banner appears the first time you visit the site (and occasionally after updates to this policy). Through this banner, you can:
</p>
<ul className="list-unstyled ps-4" style={darkText}>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Accept all cookies.
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Reject non-essential cookies.
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Manage cookie preferences by category (Essential, Performance, Functionality, Advertising).
  </li>
</ul>
<p style={darkText} className="mb-4">
  Your selections will be remembered, but you can revisit the <strong>"Cookie Settings"</strong> link in the footer of our website to review or update your preferences at any time.
</p>

{/* 7. Updates to This Policy */}
<h2 className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <RefreshCw size={28} /> 7. Updates to This Policy
</h2>
<p style={darkText} className="mb-3">
  We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or how we operate our platform.
</p>
<p style={darkText} className="mb-3">When we make significant changes, we will:</p>
<ul className="list-unstyled ps-4" style={darkText}>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Update the "Last Updated" date at the top of this page.
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Notify you through a banner on our website or by email (if appropriate).
  </li>
  <li className="position-relative ps-4 mb-2">
    <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Provide a clear summary of what has changed.
  </li>
</ul>
<p style={darkText} className="mb-4">
  We encourage you to review this policy regularly so you're always informed about how we use cookies.
</p>

{/* 8. Contact Information */}
<h2 className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Mail size={28} /> 8. Contact Information
</h2>
<p style={darkText} className="mb-3">
  If you have any questions about this Cookie Policy, or about how we use cookies on our platform, please reach out to us.
</p>
<p style={darkText}>
  <Mail className="me-2" size={18} /> Email: info@makemyvid.io
  <br />
  <Building className="me-2 mt-2" size={18} /> Office: 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West Mumbai 400092
  <br />
  <Phone className="me-2 mt-2" size={18} /> Phone: +91 79774 84292 / +44 75425 50969
</p>



      </Container>
    </section>
  );
};

export default CookiePolicy;
