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
  CookieIcon,
  Chip02Icon,
  ArchiveIcon,
  Share01Icon,
  LockIcon,
  Key01Icon,
  RefreshIcon,
  IcoIcon,
  Megaphone01Icon,
  Settings03Icon,
  Shield01Icon,
  DatabaseIcon,
  Building01Icon,
  UserCheck01Icon,
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
        <p className="text-muted mb-4"><strong>Last updated</strong>: 05/09/2025</p>
        <p style={darkText}>
          <strong>Make My Vid</strong> ("we," "our," or "us") is committed to protecting the privacy of our clients, collaborators, and visitors who use our website, editing services, and production solutions (collectively referred to as the "Platform").
          This Privacy Policy explains how we collect, use, share, and protect your personal information, and outlines your rights in relation to that information. By using our Platform, you agree to the practices described below. If you do not agree, please refrain from using our Platform.
        </p>

        {/* 1. Contact Details */}
        <h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
          <IcoIcon size={28} /> 1. Contact Details
        </h2>
        <p style={darkText}>
          If you have questions or concerns about this Privacy Policy, or how your personal data is handled, please contact us:
        </p>
        <div className="d-flex flex-column gap-2 mt-2" style={darkText}>
          <span className="d-flex align-items-center gap-2">
            <Mail01Icon size={18} /> <strong>Email</strong>: info@makemyvid.io
          </span>
          <span className="d-flex align-items-center gap-2">
            <Call02Icon size={18} /> <strong>Phone (India)</strong>: +91 79774 84292
          </span>
          <span className="d-flex align-items-center gap-2">
            <Call02Icon size={18} /> <strong>Phone (UK Enquiries)</strong>: +44 75425 50969
          </span>
          <span className="d-flex align-items-center gap-2">
            <Location01Icon size={18} /> <strong>Office Address</strong>: 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
          </span>
        </div>

        

{/* 2. Information We Collect */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <UserIcon size={28} /> 2. Information We Collect About You
</h2>
<p style={darkText} className="mb-4">
  At <strong>Make My Vid</strong>, protecting your privacy is a core priority. To deliver high-quality video production and editing services, 
  ensure smooth workflows, and maintain a secure platform, we collect and process certain categories of information. 
  This collection happens when you use our website, contact us, share content for editing, or engage with us in any way.
</p>

{/* a) You Provide Directly */}
<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-3">a) Information You Provide Directly</h5>
  <div className="mb-4">
    <p className="mb-3">You may provide personal and project-related information directly to us when you register, request services, or communicate with us. This includes:</p>
    
    <h6 className="fw-medium mb-2"><strong>Account Creation:</strong></h6>
    <p className="mb-3 ps-3">When you sign up, we collect details such as your full name, email address, phone number, password, and any optional information you provide (e.g., display name, profile photo, company details).</p>

    <h6 className="fw-medium mb-2"><strong>Service Requests & Project Details:</strong></h6>
    <p className="mb-2 ps-3">To deliver tailored services, we collect the information you provide about your project requirements, such as:</p>
    <ul className="list-unstyled ps-4">
      <li className="position-relative ps-4 mb-2">
        <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
        Type of video (e.g., corporate video, event coverage, social media ad)
      </li>
      <li className="position-relative ps-4 mb-2">
        <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
        Raw footage or media you upload
      </li>
      <li className="position-relative ps-4 mb-2">
        <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
        Editing requirements (e.g., transitions, motion graphics, subtitles, audio sync)
      </li>
      <li className="position-relative ps-4 mb-2">
        <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
        Creative preferences, timelines, and special instructions
      </li>
    </ul>

    <h6 className="fw-medium mb-2"><strong>Payments & Billing Information:</strong></h6>
    <p className="mb-3 ps-3"> When you make a payment, we collect necessary details including your billing name, address, and partial payment details. Full card or banking information is processed securely by our third-party payment providers (such as Stripe, PayPal, or Razorpay).<strong>Make My Vid</strong> does not store your complete card details.</p>

<h6 className="fw-medium mb-2"><strong>Customer Support & Communication:</strong></h6>
    <p className="mb-3 ps-3"> If you contact us by email, phone, chat, or through our website, we record the details you provide (such as your name, contact information, and the content of your message) so we can respond effectively and keep track of support history.</p>

<h6 className="fw-medium mb-2"><strong>Portfolio & Uploaded Content:</strong></h6>
    <p className="mb-3 ps-3">As part of project delivery, you may upload video files, audio files, images, scripts, or other creative materials to our platform or shared storage. This content is used exclusively for providing the requested services.</p>

<h6 className="fw-medium mb-2"><strong>Reviews, Testimonials & Feedback:</strong></h6>
    <p className="mb-3 ps-3"> If you provide reviews, ratings, testimonials, or survey responses, this information may be linked to your account and, with your consent, may be publicly displayed (e.g., on our website or marketing materials).</p>


  </div>
{/* b) Auto Collect */}
<h5 className="fw-medium mb-3">b) Information We Collect Automatically</h5>
<p className="mb-3">
  When you interact with our website, services, or digital tools, we automatically collect certain technical and usage data. 
  This helps us secure the platform, improve performance, and deliver a better experience:
</p>

<h6 className="fw-medium mb-2"><strong>Device & Technical Information:</strong></h6>
<p className="mb-3 ps-3">
  Type of device, operating system and version, browser type, IP address, and unique device identifiers.
</p>

<h6 className="fw-medium mb-2"><strong>Usage Data:</strong></h6>
<p className="mb-3 ps-3">
  Pages you visit, time spent on site, features you use, links you click, and general navigation patterns. 
  This helps us understand which services are most useful and where improvements are needed.
</p>

<h6 className="fw-medium mb-2"><strong>Location Information:</strong></h6>
<p className="mb-3 ps-3">
  With your consent, we may collect approximate or precise location data (via IP address or device settings). 
  This allows us to provide region-specific support, such as suggesting local collaborators or aligning with time zones for project delivery.
</p>

<h6 className="fw-medium mb-2"><strong>Cookies & Tracking Technologies:</strong></h6>
<p className="mb-3 ps-3">
  We use cookies and similar technologies to analyse traffic, remember your preferences, and personalise your experience. 
  For more details, please see <strong>Section 4 – Cookies and Tracking Technologies</strong>.
</p>




{/* c) Third Party Information */}
<h5 className="fw-medium mb-3">c) Information We Receive From Third Parties</h5>
<p className="mb-3">
  In certain cases, we may receive information about you from trusted partners and service providers that support our platform and services:
</p>

<h6 className="fw-medium mb-2"><strong>Payment Providers:</strong></h6>
<p className="mb-3 ps-3">
  To confirm and process your transactions securely, payment gateways share confirmation records with us (but never your full card details).
</p>

<h6 className="fw-medium mb-2"><strong>Advertising & Analytics Partners:</strong></h6>
<p className="mb-3 ps-3">
  We may receive aggregated insights from analytics services (e.g., Google Analytics, Meta Ads) to help us measure performance, improve user experience, and ensure our promotions are relevant.
</p>

<h6 className="fw-medium mb-2"><strong>Cloud Storage & Collaboration Tools:</strong></h6>
<p className="mb-3 ps-3">
  If you share project files with us via third-party services such as Google Drive, Dropbox, or WeTransfer, we collect access information and file details necessary to process your project.
</p>

<h6 className="fw-medium mb-2"><strong>Fraud Detection & Security Services:</strong></h6>
<p className="mb-3 ps-3">
  To protect against suspicious or unauthorised activity, we may use data from fraud detection partners.
</p>
 </div>      

{/* 3. How We Use Your Information */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Key01Icon size={28} /> 3. How We Use Your Information
</h2>
<p style={darkText} className="mb-4">
  We collect and process your personal information only where it is necessary to deliver our services, fulfil contractual and legal obligations, 
  protect your data, and continually improve your experience with <strong>Make My Vid</strong>.
</p>
<p style={darkText} className="mb-4">Below is a detailed explanation of how we use the information we collect:</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Delivering Services</h5>
  <p className="mb-2">Your information is essential for us to carry out the services you request. This includes:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Receiving, processing, and editing your raw video, audio, and project files
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Applying your creative instructions and producing final outputs
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Sharing drafts, previews, or final versions through secure channels
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Ensuring smooth project collaboration between you and our creative team
    </li>
  </ul>
  <p>Without this information, we cannot provide our core editing and production services.</p>

  <h5 className="fw-medium mb-2 mt-4">b) Managing Your Account</h5>
  <p className="mb-2">We use your details to:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Create and maintain your <strong>Make My Vid</strong> account
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Save your preferences (e.g., editing style, project templates)
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Allow you to view your past projects, order history, and invoices
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Provide secure log-in access across our website and services
    </li>
  </ul>
  <p>This helps deliver a consistent and personalised experience every time you work with us.</p>

  <h5 className="fw-medium mb-2 mt-4">c) Providing Customer Support</h5>
  <p className="mb-2">We process your contact details, order information, and communication history so that we can:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Respond to queries, requests, or complaints quickly
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Track conversations for accuracy and quality assurance
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Offer tailored solutions based on your past interactions and preferences.
    </li>
  </ul>
  <p>This ensures that our support team can provide you with effective and reliable assistance.
</p>

  <h5 className="fw-medium mb-2 mt-4">d) Service-Related Communications</h5>
  <p className="mb-2">We use your contact details to send important, non-promotional notifications such as:
</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Confirmation of project submissions and payments.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Updates about editing progress, revisions, or delivery timelines.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Notifications about technical issues, service maintenance, or policy changes.
    </li>
  </ul>
  <p>These communications are considered essential for service delivery and cannot usually be opted out of.</p>

  <h5 className="fw-medium mb-2 mt-4">e) Research and Service Improvement</h5>
  <p className="mb-2">We analyse customer feedback, project data, and usage patterns to:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Identify trends in the types of services clients request
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Improve editing workflows and turnaround times
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Enhance our website, tools, and project management systems
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Train our creative team using anonymised examples and feedback.
    </li>
  </ul>
  <p>This allows us to continually refine our offerings to meet industry standards and client expectations.
</p>

  <h5 className="fw-medium mb-2 mt-4">f) Marketing and Promotions (with consent)</h5>
  <p className="mb-2">Where legally permitted and with your consent (or where you have not opted out), we may use your information to:
</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Send newsletters, promotions, and updates about our services.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Inform you about seasonal discounts, new features, or package deals.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Share case studies, success stories, or video trends relevant to your industry.

    </li>
  </ul>
  <p>You can manage or withdraw your marketing preferences at any time by clicking “unsubscribe” in emails or contacting us at <strong>info@makemyvid.io</strong>.
</p>

  <h5 className="fw-medium mb-2 mt-4">g) Fraud Prevention and Security</h5>
  <p className="mb-2">We process your information to:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Verify payment details and ensure transactions are valid
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Monitor accounts for unusual or suspicious activity.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Detect and prevent unauthorised access or potential misuse of our services.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
Protect the integrity of your content and ensure your files are handled securely.

    </li>
    
  </ul>

  <h5 className="fw-medium mb-2 mt-4">h) Legal and Regulatory Compliance</h5>
  <p className="mb-2">We may use your information to comply with applicable laws, regulations, and reporting obligations, including:
</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Taxation and financial reporting requirements.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Responding to lawful requests from government or law enforcement agencies.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Ensuring our services are not used for unlawful or prohibited activities.
    </li>
  </ul>
</div>

      
{/* 4. Cookies and Tracking Technologies */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <CookieIcon size={28} /> 4. Cookies and Tracking Technologies
</h2>
<p style={darkText} className="mb-3">
  Like most online platforms, <strong>Make My Vid</strong> uses cookies and similar tracking technologies on our website and related services. 
  Cookies are small text files stored on your device that help us recognise your browser, remember your preferences, and improve your overall experience.
</p>
<p style={darkText} className="mb-4">
  These tools allow us to keep our platform secure, ensure smooth functionality, and provide you with a faster and more personalised service.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Why We Use Cookies</h5>
  <p className="mb-2">We use cookies and tracking technologies for the following purposes:</p>

  <h6 className="fw-medium mb-2 mt-3">Essential Functionality</h6>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      To enable core features of our platform, such as secure login, account management, file uploads, and payment processing
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Without these cookies, many parts of our service may not function properly
    </li>
  </ul>

  <h6 className="fw-medium mb-2 mt-3">Performance and Analytics</h6>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      To understand how visitors use our website (e.g., which pages are most visited, how long users stay, and what features are most popular)
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      This helps us identify technical issues, improve website performance, and enhance the user experience
    </li>
  </ul>

  <h6 className="fw-medium mb-2 mt-3">Personalisation</h6>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      To remember your preferences such as language, region, saved settings, and frequently used services
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      This ensures you don't have to re-enter details each time you use our platform
    </li>
  </ul>

  <h6 className="fw-medium mb-2 mt-3">Marketing and Advertising</h6>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      To deliver relevant promotions and offers, both on our site and across third-party platforms (e.g., Google, Meta Ads).

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     These cookies may track browsing behaviour across websites to provide you with more personalised advertising and to limit repetitive ads.

    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">b) Types of Cookies We Use</h5>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Session Cookies</strong>: Temporary cookies that are deleted once you close your browser
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Persistent Cookies</strong>: Remain on your device until they expire or are manually deleted
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>First-Party Cookies</strong>: Set directly by <strong>Make My Vid</strong> for essential site functions
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Third-Party Cookies</strong>: Set by trusted partners such as analytics providers or advertising networks
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">c) Your Choices and Controls</h5>
  <p className="mb-2">You are in control of how cookies are used. You can:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Adjust your browser or device settings to block or delete cookies
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Opt out of analytics tracking using tools like the <strong>Google Analytics Opt-out Add-on</strong>
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Manage advertising preferences via industry programs such as Your Online Choices or Network Advertising Initiative.

    </li>
  </ul>
  <p className="mb-3 mt-2 fst-italic">
    Please note: if you disable certain cookies, some features of our website (such as file uploads, account login, or payment processing) may not work properly.
  </p>

  <h5 className="fw-medium mb-2 mt-4">d) Transparency and Updates</h5>
  <p className="mb-3">
    We are committed to transparency in how we use cookies. This section may be updated from time to time to reflect changes in technology, legal requirements, or the services we provide. Updates will be posted on this page, and in some cases, we may notify you directly (e.g., via a banner or email).
  </p>
  <p className="mb-3">
    For more detailed information, please refer to our <strong>Cookie Policy</strong>.
  </p>
</div>

{/* 5. Marketing and Advertising */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Megaphone01Icon size={28} /> 5. Marketing and Advertising
</h2>
<p style={darkText} className="mb-3">
  At <strong>Make My Vid</strong>, we may use your personal information to keep you updated about our latest services, creative tools, offers, and industry insights. 
  These communications are designed to add value by informing you about opportunities that may be relevant to your projects and creative needs.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Types of Marketing Communications</h5>
  <p className="mb-2">We may contact you with the following:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Service Updates:</strong>  Information about new features on our platform, improvements to editing tools, or additional services we offer.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Promotions and Discounts:</strong>  Limited-time offers, seasonal discounts, referral rewards, or special bundles on editing and production services.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Portfolio Showcases:</strong>  Examples of successful projects (with client permission) that highlight our expertise and inspire potential collaborations.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Industry Insights:</strong> Tips, trends, and updates in the video production and post-production industry that may benefit your creative journey.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">b) Your Choice and Control</h5>
  <p className="mb-2">You remain in full control of how you receive marketing messages from us. You can:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Adjust your communication preferences in your <strong>Make My Vid</strong> account settings
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Click the <strong>“unsubscribe”</strong> link in any promotional email you receive from us.

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     Disable push notifications via your mobile or browser settings (if applicable).

    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
    Contact us directly at <strong>info@makemyvid.io</strong> to update your preferences or opt out.
    </li>
  </ul>
  <p className="mb-3 mt-2 fst-italic">
    We will respect your preferences, and opting out of marketing communications will not affect the service-related messages you receive (such as project updates, billing, or account notifications).

  </p>

  <h5 className="fw-medium mb-2 mt-4">c) Advertising and Personalisation</h5>
  <p className="mb-2">We may work with trusted partners (such as Google Ads, Meta Ads, or analytics providers) to deliver more relevant advertising. This may involve:
</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Using cookies or tracking technologies to understand your interests
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Showing you targeted promotions across our website and third-party platforms
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Measuring the effectiveness of our advertising campaigns
    </li>
  </ul>
  <p className="mb-3 mt-2">
    Where applicable, we will only use your information for personalised advertising if you have consented to such use.
  </p>

  <h5 className="fw-medium mb-2 mt-4">d) Legal Basis for Marketing</h5>
  <p className="mb-2">Our marketing practices are carried out in line with applicable data protection laws, such as the <strong>EU GDPR, UK GDPR</strong>, and India’s <strong>Digital Personal Data Protection Act (DPDP Act)</strong>.</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
     We will only send you direct marketing if you have provided your consent, or where you are an existing client and have not opted out.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      You can withdraw your consent at any time without affecting the lawfulness of processing carried out before withdrawal.

    </li>
    {/* <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Withdrawal won't affect previous processing based on consent
    </li> */}
  </ul>
</div>


{/* 6. Use of Automated Systems */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Settings03Icon size={28} /> 6. Use of Automated Systems
</h2>
<p style={darkText} className="mb-3">
  To keep <strong>Make My Vid</strong> safe, secure, and efficient for all users, we use automated systems and decision-making tools. 
  These systems help us detect fraud, streamline workflows, and ensure the integrity of our platform.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Why We Use Automated Systems</h5>
  <p className="mb-2">We may use automated processes for the following purposes:</p>
  
  <h6 className="fw-medium mb-2 mt-3">Fraud Detection and Prevention:</h6>
  <p className="mb-3 ps-3">
    Automated tools monitor payment activity, account logins, and unusual file-sharing patterns to identify potentially fraudulent or unauthorized behaviour.
  </p>

  <h6 className="fw-medium mb-2">Payment Verification:</h6>
  <p className="mb-3 ps-3">
    Automated checks validate that payments are genuine, secure, and consistent with previous account activity. This protects both our clients and our platform from fraudulent transactions.
  </p>

  <h6 className="fw-medium mb-2">Account Protection:</h6>
  <p className="mb-3 ps-3">
    We use automated monitoring to detect suspicious login attempts, location mismatches, or multiple failed login attempts that may indicate unauthorized access.
  </p>

  <h6 className="fw-medium mb-2">File Security and Content Handling:</h6>
  <p className="mb-3 ps-3">
    Automated systems scan uploaded files for malware or suspicious content to protect your projects and our servers.
  </p>

  <h6 className="fw-medium mb-2">Platform Performance Monitoring:</h6>
  <p className="mb-3 ps-3">
    Automated monitoring tools track system performance, load times, and error reports to ensure our website and services run smoothly.
  </p>

  <h5 className="fw-medium mb-2 mt-4">b) Impact on Your Use of the Platform</h5>
  <p className="mb-2">In some cases, automated decisions may:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Delay or block a payment if flagged as unusual or high-risk
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Temporarily suspend account access while additional security checks are carried out
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Restrict uploads or downloads if files are suspected of containing harmful content
    </li>
  </ul>
  <p className="mb-3 fst-italic">These measures are in place to protect you and ensure the reliability of our services.</p>

  <h5 className="fw-medium mb-2 mt-4">c) Your Rights and Manual Review</h5>
  <p className="mb-3">
    We recognise that automated systems can sometimes produce false positives. If you believe that an automated decision has wrongly affected your account, payment, or project, you have the right to request a <strong>manual review</strong>.
  </p>
  <p className="mb-3">
    You can contact us at <strong>info@makemyvid.io</strong>, and our support team will review the situation and provide a resolution.
  </p>

  <h5 className="fw-medium mb-2 mt-4">d) Legal Basis for Automated Processing</h5>
  <p className="mb-2">Our use of automated systems is based on:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Legitimate Interests:</strong> To prevent fraud, ensure secure payments, and maintain platform safety
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Legal Obligations:</strong> To comply with anti-fraud, financial, and data protection regulations
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Contractual Necessity:</strong> Automated tools are necessary to deliver reliable services
    </li>
  </ul>
</div>

{/* 7. Retention of Your Information */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <DatabaseIcon size={28} /> 7. Retention of Your Information
</h2>
<p style={darkText} className="mb-3">
  <strong>Make My Vid</strong> will only keep your personal information for as long as it is reasonably necessary to fulfil the purposes outlined in this Privacy Policy. 
  The exact retention period depends on the nature of the information, the services requested, and any legal, accounting, or regulatory obligations that apply.
</p>
<p style={darkText} className="mb-4">
  We follow the principle of <strong>data minimisation</strong>, meaning we keep information only for as long as it is required and securely delete or anonymise it once it is no longer needed.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Why We Retain Data</h5>
  <p>We retain your personal data for several important reasons:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Legal, Regulatory, and Tax Obligations:</strong>Certain records must be kept for statutory compliance, including financial reporting and tax purposes.
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Service History and Support:</strong> To provide you with continuity on future projects, respond to complaints, or resolve disputes.

    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Fraud Prevention:</strong> To monitor for suspicious activity, enforce our Terms & Conditions, and maintain platform safety.
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Analytics:</strong> To analyse past usage trends and improve our services in the long term.

    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">b) Examples of Retention Periods</h5>
  <p>To give you clarity, here are examples of how long we may retain specific categories of data:
</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Project and Payment Records:</strong> Retained for up to <strong>6 years</strong> to comply with tax, accounting, and regulatory requirements.
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Uploaded Files and Media:</strong> Retained only for the <strong>duration of the project</strong> and securely deleted after delivery, unless you request longer retention (e.g., extended storage for revisions or archiving).
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Customer Reviews and Testimonials:</strong> Retained for up to <strong>2 years</strong> to maintain accuracy and relevance for potential clients.
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Account Information:</strong> Retained for as long as your account is active. If your account becomes inactive, certain information may be retained for up to <strong>12 months</strong> before deletion or anonymisation.
    </li>
    <li className="position-relative ps-4 mb-3">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Customer Support Communications:</strong> Retained for up to <strong>3 years</strong> after the issue is resolved to assist with training, dispute resolution, and service improvements.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">c) What Happens After Retention</h5>
  <p className="mb-2">When personal data is no longer required, we will take one of the following actions:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Secure Deletion:</strong> Permanently erase the data from our active and backup systems.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>Anonymisation:</strong> Remove all identifiers so the data can no longer be linked to you.
    </li>
  </ul>
  <p className="mb-3 ps-4 fst-italic">
    Anonymised data may still be used for analytics, research, or service improvement.
  </p>
</div>

{/* 8. Sharing Your Information */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Share01Icon size={28} /> 8. Sharing Your Information
</h2>
<p style={darkText} className="mb-3">
  At <strong>Make My Vid</strong>, we respect your privacy and only share your personal information where it is necessary, lawful, and consistent with this Privacy Policy. 
  We never sell your personal information to third parties.
</p>
<p style={darkText} className="mb-3">
  We may share your information with the following categories of trusted partners and service providers:
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Payment Providers</h5>
  <p className="mb-2">To process transactions securely, we work with regulated third-party payment processors such as <strong>Stripe, PayPal, Razorpay, and banking partners</strong>.</p>
  <p className="mb-2">These providers handle your sensitive financial information and share with us only confirmation records of payments.</p>
  <p className="mb-3"><strong>Make My Vid</strong> does not store your complete debit/credit card or bank details.</p>

  <h5 className="fw-medium mb-2 mt-4">b) Cloud Storage & Hosting Providers</h5>
  <p className="mb-2">We rely on cloud-based services to store project files, deliver final outputs, and provide secure backups.</p>
  <p className="mb-2">This includes services such as <strong>AWS, Google Drive, Dropbox, or equivalent providers</strong>.</p>
  <p className="mb-3">These partners are contractually bound to protect your content and cannot use it for any other purpose.</p>

  <h5 className="fw-medium mb-2 mt-4">c) Analytics & Advertising Partners</h5>
  <p className="mb-2">We may share limited information (such as cookies, device identifiers, or anonymised usage data) with trusted analytics and advertising providers.</p>
  <p className="mb-2">This helps us measure website performance, understand user behaviour, and deliver relevant promotions.</p>
  <p className="mb-2">Examples include <strong>Google Analytics, Meta Ads, and similar services</strong>.</p>
  <p className="mb-3">We always implement safeguards to ensure your personal data is protected in these processes.</p>

  <h5 className="fw-medium mb-2 mt-4">d) Technology & Service Providers</h5>
  <p className="mb-2">To operate effectively, we work with third-party service providers for:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      IT support and security monitoring.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Project management and communication tools.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Customer support platforms.
    </li>
  </ul>
  <p className="mb-3">
    These partners are only permitted to use your data in accordance with our instructions and solely for the purpose of providing their services to us.
  </p>

  <h5 className="fw-medium mb-2 mt-4">e) Legal Authorities</h5>
  <p className="mb-2">We may disclose your personal information if required to do so by law or in response to valid legal requests from government, regulatory, or law enforcement authorities.</p>
  <p className="mb-3">This includes obligations relating to fraud prevention, financial compliance, and data protection laws.</p>

  <h5 className="fw-medium mb-2 mt-4">f) Business Transfers</h5>
  <p className="mb-2">If <strong>Make My Vid</strong> undergoes a business transition such as a merger, acquisition, or sale of assets, your personal information may be transferred to the new entity.</p>
  <p className="mb-3">
    In such cases, your information will remain protected under the same standards described in this Privacy Policy.
  </p>
</div>

{/* 9. International Data Transfers */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Globe02Icon size={28} /> 9. International Data Transfers
</h2>
<p style={darkText} className="mb-4">
  Your data may be transferred and stored outside India or the UK, depending on our hosting and service providers. 
  We ensure adequate safeguards such as encryption and contractual agreements to protect your data.
</p>
{/* 10. Security */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <Shield01Icon size={28} /> 10. Security
</h2>
<p style={darkText} className="mb-3">
  At <strong>Make My Vid</strong>, protecting your personal data and creative content is one of our highest priorities. We use a combination of <strong>technical, 
  organisational, and procedural safeguards</strong> to reduce the risk of loss, misuse, or unauthorised access to your information.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Technical Measures</h5>
  <h6 className="fw-medium mb-2 mt-3">Encryption:</h6>
  <p className="mb-3 ps-3">
    Sensitive information such as payment details and uploaded files are encrypted both <strong>in transit</strong> (while being sent) and <strong>at rest</strong> (while stored on our systems).
  </p>

  <h6 className="fw-medium mb-2">Access Controls:</h6>
  <p className="mb-3 ps-3">
    Access to personal data and project files is restricted to authorised staff members who require it to perform their duties. Multi-factor authentication is used wherever possible.
  </p>

  <h6 className="fw-medium mb-2">Secure Servers and Firewalls:</h6>
  <p className="mb-3 ps-3">
    All information is hosted on secure servers protected by firewalls and intrusion detection systems to prevent unauthorised access.
  </p>

  <h6 className="fw-medium mb-2">Monitoring and Auditing:</h6>
  <p className="mb-3 ps-3">
    Our systems are continuously monitored for unusual or suspicious activity. We apply fraud-detection tools and conduct regular audits to maintain the integrity of our platform.
  </p>

  <h5 className="fw-medium mb-2 mt-4">b) Organisational Measures</h5>
  <h6 className="fw-medium mb-2">Employee Training:</h6>
  <p className="mb-3 ps-3">
    All staff members handling personal data or client content receive training on data protection, confidentiality, and cybersecurity best practices.
  </p>

  <h6 className="fw-medium mb-2">Policies and Procedures:</h6>
  <p className="mb-3 ps-3">
    Internal policies govern how information is collected, processed, shared, and deleted. These are reviewed regularly to ensure compliance with evolving laws and industry standards.
  </p>

  <h6 className="fw-medium mb-2">Third-Party Agreements:</h6>
  <p className="mb-3 ps-3">
    Service providers who process data on our behalf (such as hosting or payment partners) are contractually required to maintain equivalent levels of data security.
  </p>

  <h5 className="fw-medium mb-2 mt-4">c) Limitations</h5>
  <p className="mb-3">
    While we take strong precautions, <strong>no system or method of data transmission over the internet can be guaranteed 100% secure</strong>. 
    You acknowledge that information you send to us online is done at your own risk.
  </p>
  <p className="mb-3">
    Once we receive your data, we apply strict procedures and security features to try to prevent unauthorised access. 
    If a security breach occurs, we will act swiftly, investigate thoroughly, and notify you where required by law.
  </p>
</div>

{/* 11. Your Rights */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <UserCheck01Icon size={28} /> 11. Your Rights
</h2>
<p style={darkText} className="mb-3">
  As a user of <strong>Make My Vid</strong>, you are entitled to certain rights over your personal information under applicable data protection laws, 
  including the <strong>EU General Data Protection Regulation (GDPR), the UK GDPR</strong>, and India's <strong>Digital Personal Data Protection Act (DPDP Act)</strong>. 
  These rights ensure that you remain in control of your personal data.
</p>

<div className="ps-3" style={darkText}>
  <h5 className="fw-medium mb-2">a) Right of Access</h5>
  <p className="mb-3 ps-3">
    You have the right to request confirmation of whether we hold personal data about you. If we do, you may request a copy of the information along with details about how we use it.
  </p>

  <h5 className="fw-medium mb-2">b) Right to Rectification (Correction)</h5>
  <p className="mb-3 ps-3">
    If any of your personal details are inaccurate, incomplete, or outdated, you can request that we correct or update them.
  </p>

  <h5 className="fw-medium mb-2">c) Right to Erasure ("Right to be Forgotten")</h5>
  <p className="mb-2">You may request deletion of your personal information in certain circumstances, such as:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      When the information is no longer necessary for the purposes it was collected.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      When you withdraw consent (where processing was based on consent).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      When you object to processing and we have no overriding legitimate reason to continue.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">d) Right to Restrict Processing</h5>
  <p className="mb-2">You can ask us to limit the way we process your data, for example:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      While a dispute is being resolved.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      If you contest the accuracy of the information.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">e) Right to Object</h5>
  <p className="mb-3 ps-3">
    You have the right to object to our processing of your personal information where it is based on <strong>legitimate interests</strong>, including processing for <strong>direct marketing purposes</strong>. If you object to direct marketing, we will stop sending you promotional communications immediately.
  </p>

  <h5 className="fw-medium mb-2">f) Right to Data Portability</h5>
  <p className="mb-3 ps-3">
    You can request that we transfer your personal data to you or to another service provider in a structured, commonly used, and machine-readable format, where technically feasible. This applies to data processed with your consent or under a contract.
  </p>

  <h5 className="fw-medium mb-2">g) Right to Withdraw Consent</h5>
  <p className="mb-3 ps-3">
    Where our processing relies on your consent (e.g., for marketing emails), you may withdraw that consent at any time. Withdrawing consent will not affect the lawfulness of processing carried out before the withdrawal.
  </p>

  <h5 className="fw-medium mb-2">h) Right to Lodge a Complaint</h5>
  <p className="mb-2">You have the right to lodge a complaint with a data protection authority if you are unhappy with how we handle your personal information.</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>India</strong>: Data Protection Board under the DPDP Act.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>UK</strong>: Information Commissioner's Office (ICO).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      <strong>EU</strong>: Your local supervisory authority.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">How to Exercise Your Rights</h5>
  <p className="mb-2">To exercise any of the above rights, please contact us at:</p>
  <p className="mb-2"> <strong>info@makemyvid.io</strong></p>
  <p className="mb-3">
    We may need to verify your identity before fulfilling your request to ensure the security of your data. We aim to respond within <strong>30 days</strong>, although this may be extended in complex cases.
  </p>
</div>

{/* 12. Changes to This Privacy Policy */}
<h2 className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2" style={headingColor}>
  <RefreshIcon size={28} /> 12. Changes to This Privacy Policy
</h2>
<p style={darkText} className="mb-3">
  We may update or revise this Privacy Policy from time to time to reflect:
</p>

<div className="ps-3" style={darkText}>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Changes in our business practices or services.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Updates to legal or regulatory requirements.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Improvements in how we protect your data.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">a) How We Will Notify You</h5>
  <h6 className="fw-medium mb-2">Minor Updates:</h6>
  <p className="mb-3 ps-3">
    For small changes (e.g., clarifications or formatting adjustments), we will update the "Effective Date" at the top of this page and publish the new version on our website.
  </p>

  <h6 className="fw-medium mb-2">Significant Changes:</h6>
  <p className="mb-2">For major changes (e.g., new ways we process data, additional sharing with partners, or expanded user rights), we will notify you in advance through:</p>
  <ul className="list-unstyled ps-4">
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Email communications (if you have an active account).
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      A notice on our website or platform.
    </li>
    <li className="position-relative ps-4 mb-2">
      <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
      Other appropriate channels, where required by law.
    </li>
  </ul>

  <h5 className="fw-medium mb-2 mt-4">b) Your Responsibility to Stay Informed</h5>
  <p className="mb-2">
    We encourage you to review this Privacy Policy regularly to stay informed about how we collect, use, and protect your information.
  </p>
  <p className="mb-3">
    By continuing to use our services after updates are posted, you agree to the revised Privacy Policy.
  </p>
</div>


      </Container>
    </section>
  );
};

export default PrivacyPolicy;
