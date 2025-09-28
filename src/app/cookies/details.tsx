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
          This Cookie Policy explains how Make My Vid (“we,” “our,” or “us”) uses cookies and similar technologies on our website and platform. We want you to clearly understand what cookies are, how we use them, and the choices you have when it comes to managing them.
          Our goal is transparency — so you know exactly how your data is collected, stored, and used to provide you with a smooth and personalized experience.
        </p>
        {/* <p style={darkText} className="mt-2">
          Our goal is transparency — so you know exactly how your data is
          collected, stored, and used to provide you with a smooth and
          personalized experience.
        </p> */}

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Scope and Applicability
        </h5>
        <p style={darkText}>
          This policy applies to all users who access our website, mobile applications, and any other digital services provided by Make My Vid.
          It should be read together with our Privacy Policy, which explains how we handle your personal data more broadly. By continuing to use our platform, you consent to the use of cookies in line with this policy.
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
          Cookies are small text files that a website places on your device (computer, phone, or tablet) when you visit. They serve as a tool to remember information about you, such as your login status, preferences, or the items in your shopping cart.
          They don’t run programs or deliver viruses; instead, they help websites function properly and deliver a smoother, more personalized experience.
        </p>

        <h5 className="fw-medium mt-4 mb-2" style={headingColor}>
          Types of Cookies
        </h5>
        <ul className="ps-3 list-unstyled" style={darkText}>
          <li className="mb-2">
            <p >1. Session Cookies:</p>
            <ul>
              <li>These are temporary cookies that only exist while you are browsing our site.</li>
              <li>They expire once you close your browser.</li>
              <li>Example: Keeping you logged in while you move between pages.</li>
            </ul>
          </li>
          <li>
            <p>2. Persistent Cookies:</p>
            <ul>
              <li>These cookies stay on your device even after you close the browser.</li>
              <li>They help us remember your preferences and settings for your next visit.</li>
              <li>Example: Remembering your language choice or login details for faster access.</li>
            </ul>
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
            <h3 className="pb-3">a) Essential Cookies</h3>
            <p>These are the backbone of our website — without them, basic features wouldn’t work.</p>
            <ul>
              <li>Keep you logged in as you move between pages.</li>
              <li>Enable secure login and account protection.</li>
              <li>Ensure the website loads correctly and functions smoothly.</li>
            </ul>
          </li>
          <li className="mb-2">
            <h3>b) Performance & Analytics Cookies:</h3>
            These cookies help us understand how people use our platform so we can improve it.
            <ul>
              <li>Track which pages are visited most often.</li>
              <li>Identify issues such as slow loading or errors.</li>
              <li>Collect anonymous data that helps us make the site faster and easier to use.</li>
            </ul>
          </li>
          <li className="mb-2">
            <h3>c) Functionality Cookies:</h3>
            These cookies make your experience more personal.
            <ul>
              <li>Remember your preferences, such as language or region.</li>
              <li>Save your settings so you don’t have to re-enter them every time.</li>
              <li>Provide enhanced features like remembering your last search.</li>
            </ul>
          </li>
          <li>
            <h3>d) Advertising & Targeting Cookies</h3>
            These cookies make sure the ads you see are relevant to you
            <ul>
              <li>Deliver personalized ads based on your interests.</li>
              <li>Limit the number of times you see the same ad.</li>
              <li>Help us measure how effective our marketing campaigns are.</li>
            </ul>
          </li>
        </ul>

        {/* 4. Third-Party Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Shield01Icon size={28} /> 4. Third-Party Cookies
        </h2>
        In addition to the cookies we set, some cookies are placed on your device by trusted third parties. These cookies help us provide better services, measure performance, and enable features you might use on our platform.
        <p>Here’s how third-party cookies come into play:</p>
        <ul className="ps-3 list-unstyled mt-2" style={darkText}>
          <li className="mb-2">
            <h3>a) Analytics Providers:</h3>
            We use tools like Google Analytics and Meta Ads Pixel to understand how users interact with our website.
            <ul>
              <li>Track visitor numbers and behavior patterns.</li>
              <li>Measure the success of marketing campaigns.</li>
              <li>Help us improve site performance and user experience.</li>
            </ul>
          </li>
          <li className="mb-2">
            <h3>b) Payment & Authentication Services:</h3>
            When you make a payment or log in using secure methods, external providers may set cookies to process your requests safely.
            <ul>
              <li>Payment gateways (e.g., Stripe, PayPal, Razorpay).</li>
              <li>Authentication services (e.g., Google Sign-In, Apple ID, OTP-based login).</li>
              <li>These cookies are essential for fraud prevention and transaction security.</li>
            </ul>
          </li>
          <li>
            <h3>Social Media Integrations:</h3>
            If you interact with our platform through social media, those platforms may place cookies on your device.
            <ul>
              <li>Login through Facebook, Google, LinkedIn, or Apple.</li>
              <li>Sharing content or linking accounts to social media.</li>
              <li>These cookies help personalize your experience and connect accounts seamlessly.</li>
            </ul>
          </li>
        </ul>

        {/* 5. Managing Cookies */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Settings02Icon size={28} /> 5. Managing Cookies
        </h2>
        You’re in control of how cookies are used on your device. Here’s how you can manage them:
        <h3 className="fw-medium mb-2" style={headingColor}>
          a) Browser Settings and Controls
        </h3>
        Most web browsers automatically accept cookies, but you can change your settings at any time to block or delete them.
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>Google Chrome: Settings › Privacy and Security › Cookies and Other Site Data</li>
          <li>Safari: Preferences › Privacy › Manage Website Data</li>
          <li>Firefox: Options › Privacy & Security › Cookies and Site Data</li>
          <li>Microsoft Edge: Settings › Cookies and Site Permissions</li>
        </ul>
        <h3 className="fw-medium mb-2" style={headingColor}>
          b) Opt-Out Options
        </h3>
        <ul className="ps-3 list-unstyled mt-2" style={darkText}>
          You can also:
          <li className="mb-1">
            <li>Adjust your cookie preferences directly in our cookie banner or settings panel.</li>
            <li>Opt out of analytics tracking (e.g., Google Analytics opt-out tool).</li>
            <li>Opt out of personalized advertising via Your Online Choices or Network Advertising Initiative.</li>
          </li>
          <h3 className="fw-medium mb-2" style={headingColor}>
            c) Impact of Disabling Cookies
          </h3>
          <ul>
            if you block or delete cookies, some parts of our platform may not work as intended. For example:
            <li>
              <li>You may need to log in every time you visit.</li>
              <li>Certain settings (like language or region) may not be remembered.</li>
              <li>Features such as secure checkout or project matching may not function properly.</li>
            </li>
          </ul>
        </ul>
        {/* 6. Consent */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CookieIcon size={28} /> 6. Consent to Use Cookies
        </h2>
        <p> How Consent Is Obtained</p>
        <p style={darkText}>
          When you first visit our platform, we’ll ask for your consent to use non-essential cookies (such as analytics, functionality, and advertising cookies). Essential cookies, which are required for our website to function properly, are always active.
        </p>
        <ul>
          Your consent is recorded the moment you:
          <li>Click “Accept All” on the cookie banner, or</li>
          <li>Adjust your preferences and save your choices</li>
          You can withdraw your consent at any time by updating your cookie settings.
          <p className="text-info">Cookie Banner & Preferences Management</p>
          Our cookie banner appears the first time you visit the site (and occasionally after updates to this policy). Through this banner, you can:
          <ul>
            <li>Accept all cookies.</li>
            <li>Reject non-essential cookies.</li>
            <li>Manage cookie preferences by category (Essential, Performance, Functionality, Advertising).</li>
            Your selections will be remembered, but you can revisit the “Cookie Settings” link in the footer of our website to review or update your preferences at any time.
          </ul>
        </ul>

        {/* 7. Updates */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <RefreshIcon size={28} /> 7. Updates to This Policy
        </h2>
        <p style={darkText}>
          We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or how we operate our platform
        </p>
        <p>When we make significant changes, we will:</p>
        <ul>
          <li>Update the “Last Updated” date at the top of this page.</li>
          <li>Notify you through a banner on our website or by email (if appropriate).</li>
          <li>Provide a clear summary of what has changed.</li>
          We encourage you to review this policy regularly so you’re always informed about how we use cookies.
        </ul>

        {/* 8. Contact Info */}
        <h2
          className="fs-4 fw-semibold mt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Mail01Icon size={28} /> 8. Contact Information
        </h2>

        <div className="text-dark small">
          <div className="d-flex align-items-start mb-2">
            <Mail01Icon className="me-2 mt-1" size={18} />
            <span>Email: info@makemyvid.io</span>
          </div>

          <div className="d-flex align-items-start mb-2">
            <Building01Icon className="me-2 mt-1" size={18} />
            <span>
              Office: 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West Mumbai 400092
            </span>
          </div>

          <div className="d-flex align-items-start">
            <Call02Icon className="me-2 mt-1" size={18} />
            <span>Phone: +91 79774 84292 / +44 75425 50969</span>
          </div>
        </div>

      </Container>
    </section>
  );
};

export default CookiePolicy;
