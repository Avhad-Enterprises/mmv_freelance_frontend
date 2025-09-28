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
  Edit01Icon,
  CreditCardIcon,
  CopyrightIcon,
  Alert01Icon,
  RefreshIcon,
  AiPhone01Icon,
  MapPinIcon,
  CircleIcon,
  CircleIcon as XCircleIcon,
  Dollar01Icon,
  Settings01Icon,
  DatabaseIcon,
  SafeIcon,
  GameIcon,
  RefreshIcon as RefreshCwIcon,
  HelpCircleIcon,
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
          Make My Vid ("we," "our," or "us") is a video production and editing
          service provider operating from:
        </p>
        <div className="ps-3" style={darkText}>
          <p className="mb-2">
            <MapPinIcon size={18} className="me-2" /> Office Address: 11, Star Trade Centre,
            Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
          </p>
          <p className="mb-2">
            <Mail01Icon size={18} className="me-2" /> Email: info@makemyvid.io
          </p>
          <p className="mb-2">
            <AiPhone01Icon size={18} className="me-2" /> Phone (India): +91 79774 84292
          </p>
          <p className="mb-3">
            <AiPhone01Icon size={18} className="me-2" /> Phone (UK): +44 75425 50969
          </p>
        </div>
        <p style={darkText}>
          We specialise in pre-production, production, and post-production
          services, including videography, video editing, colour grading, sound mixing, motion graphics, and related creative work.
        </p>

        {/* 2. Purpose of Our Service */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <File01Icon size={28} /> 2. Purpose of Our Service
        </h2>
        <p style={darkText} className="mb-3">
          The purpose of Make My Vid is to provide a professional, secure, and reliable platform for clients who require video-related services, ranging from pre-production planning to final delivery of edited content. Our services are designed to help businesses, creators, agencies, and individuals bring their ideas to life through high-quality video.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) What We Offer</h5>
          <p className="mb-2">Our platform and services cover:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Pre-Production Support:</strong> Concept development, script adjustments, consultation on editing requirements, and project scoping.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Production Assistance (where applicable):</strong> Access to videography or shooting solutions through our partner network (subject to availability).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Post-Production Services:</strong> Video editing, motion graphics, animation, sound design, colour grading, subtitles, and content formatting for different platforms.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Custom Deliverables:</strong> Creating final files in industry-standard formats, optimised for client needs (e.g., YouTube, Instagram, corporate presentations, events).
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) How Clients Use Our Service</h5>
          <p className="mb-2">Clients may:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Submit project briefs or requirements directly via our website, email, or project management tools.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Upload raw footage, audio, images, or other assets for editing.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Specify desired style, theme, duration, output format, and deadlines.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Communicate with our creative team to refine revisions and feedback.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Our Commitment to Clients</h5>
          <p className="mb-2">When you engage with Make My Vid, you can expect:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Secure Handling of Content:</strong> All project files, raw footage, and deliverables are treated as confidential and stored securely.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Timely Delivery:</strong> We provide clear timelines and work diligently to meet them, while accounting for project complexity and revision cycles.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Professional Workflow:</strong> Our team of editors, designers, and project managers apply industry-standard practices to ensure consistency, quality, and creativity.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Transparent Communication:</strong> We maintain open communication with clients regarding project status, revisions, and delivery schedules.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Client Responsibilities</h5>
          <p className="mb-2">While we provide the expertise and technical workflow, clients remain responsible for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Accuracy of Materials:</strong> Ensuring that all footage, audio, scripts, and instructions provided are accurate and final.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Rights and Clearances:</strong> Obtaining the necessary permissions and licenses for third-party materials (e.g., background music, stock footage, trademarks, or logos). Make My Vid is not responsible for copyright infringements resulting from client-provided content.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Active Participation:</strong> Providing timely feedback, approvals, and required assets to avoid project delays.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Compliance with Law:</strong> Ensuring that submitted materials do not contain illegal, offensive, or restricted content.
            </li>
          </ul>
        </div>

        {/* 3. Your Account */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <UserIcon size={28} /> 3. Your Account
        </h2>
        <p style={darkText} className="mb-3">
          To access and use the services offered by Make My Vid, you may be required to create an account on our platform. This ensures secure access to your projects, payment history, and communication with our team.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Account Creation</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              When registering, you must provide accurate, complete, and up-to-date information such as your full name, valid email address, phone number, and (if applicable) company details.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Providing false or misleading information may result in account suspension or termination.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In certain cases, we may request additional verification (such as proof of identity or business registration) to ensure the authenticity of your account.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Security of Your Account</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You are solely responsible for maintaining the confidentiality of your login credentials (username, password, or authentication keys).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Any activity performed under your account will be considered as your responsibility, whether authorised by you or not.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If you suspect unauthorised use of your account, you must notify us immediately at info@makemyvid.io so we can secure your access.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Permitted Use</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Accounts are for individual or authorised business use only.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You may not share your account with others unless explicitly authorised (e.g., a company account with multiple authorised users).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Misuse of the platform — including fraudulent activity, attempts to hack systems, or use of the service for unlawful purposes — will result in immediate suspension or permanent termination of your account.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Eligibility</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              By creating an account, you confirm that you are at least 18 years old (or the age of legal majority in your jurisdiction) and are legally capable of entering into binding contracts.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If you are registering on behalf of a company or organisation, you represent that you are authorised to act on its behalf.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">e) Suspension and Termination</h5>
          <p className="mb-2">We reserve the right to suspend or terminate your account if:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You breach these Terms of Service.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We detect fraudulent, abusive, or illegal activity.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You misuse client or project data in violation of our policies.
            </li>
          </ul>
          <p className="mb-3 ps-4">
            In such cases, we may restrict access to your projects and withhold delivery until the issue is resolved.
          </p>
        </div>

        {/* 4. Service Availability */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Clock01Icon size={28} /> 4. Service Availability
        </h2>
        <p style={darkText} className="mb-3">
          At Make My Vid, we strive to ensure our services are consistently available and delivered to a high standard. However, the nature of video production and editing means that availability may depend on editor capacity, technical resources, and client collaboration.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Timelines and Scheduling</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              When you confirm a project, we will provide a realistic timeline for delivery, based on the scope, complexity, and revision cycles.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              These timelines are estimates, not guarantees. While we aim to meet or exceed them, unforeseen factors may cause delays.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Causes of Delay</h5>
          <p className="mb-2">Possible reasons for delays include (but are not limited to):</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Technical issues such as server downtime, software crashes, or corrupted files.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Resource constraints, for example, during high-volume demand or limited editor availability.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Client delays, such as late submission of raw footage, missing assets (logos, audio, subtitles), or slow feedback on revisions.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              External factors, such as internet disruptions, power outages, or force majeure events (natural disasters, government restrictions, etc.).
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Communication of Delays</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If a delay occurs, we will promptly notify you with revised timelines.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Where possible, we will propose alternatives such as partial delivery (e.g., drafts or initial edits) to maintain progress.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Limitation of Liability</h5>
          <p className="mb-2">Make My Vid will not be held responsible for delays caused by:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Circumstances outside our reasonable control.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Client failure to provide required content, instructions, or approvals on time.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Third-party failures (e.g., stock footage providers, music licensing partners).
            </li>
          </ul>
        </div>

        {/* 5. Projects and Orders */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Edit01Icon size={28} /> 5. Projects and Orders
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Project Initiation</h5>
          <p className="mb-2">A project begins only after:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Your order has been confirmed.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Payment terms have been agreed upon.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              All required assets (scripts, footage, audio, logos, brand guidelines) have been submitted.
            </li>
          </ul>
          <p className="mb-3">Until these conditions are met, we cannot commence work.</p>

          <h5 className="fw-medium mb-2">b) Project Acceptance</h5>
          <p className="mb-2">We reserve the right to refuse or cancel a project if:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The content is unlawful, defamatory, obscene, hateful, or otherwise inappropriate.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The project involves political, religious, or sensitive material that may conflict with our values or legal obligations.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Technical or resource limitations make the project unfeasible.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Client Responsibilities</h5>
          <p className="mb-2">Clients are responsible for ensuring that they own or have proper rights/licences to all submitted materials, including:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Music tracks.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Logos, images, or brand assets.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Stock footage or third-party visuals.
            </li>
          </ul>
          <p className="mb-3">Make My Vid will not be liable for copyright or intellectual property violations arising from client-provided content.</p>

          <h5 className="fw-medium mb-2">d) Changes to Orders</h5>
          <p className="mb-3">
            Significant changes to project scope after confirmation (e.g., new footage, extended duration, additional animations) may result in revised costs and delivery timelines. Clients will be informed of these adjustments in advance.
          </p>
        </div>

        {/* 6. Delivery */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CircleIcon size={28} /> 6. Delivery
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Delivery Timelines</h5>
          <p className="mb-3">
            Delivery times are based on project complexity, revision cycles, and timely client feedback. Simple edits may be delivered within days, while more complex projects (with animations, multiple revisions, or special effects) may require longer timelines.
          </p>

          <h5 className="fw-medium mb-2">b) Delivery Method</h5>
          <p className="mb-3">
            Final files are delivered digitally through secure platforms (e.g., download links, cloud storage, or private portals). If physical delivery (e.g., on a hard drive) is requested, additional costs and shipping timelines will apply.
          </p>

          <h5 className="fw-medium mb-2">c) Client Dependencies</h5>
          <p className="mb-2">Delivery cannot be completed if:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Raw footage or assets are missing or in an incorrect format.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Specifications (resolution, aspect ratio, language, subtitles) are unclear or inaccurate.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The client fails to provide timely approval or feedback.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) File Storage and Access</h5>
          <p className="mb-3">
            After final delivery, project files may be retained on our servers for a limited retention period (as per our Privacy Policy). Long-term storage, archiving, or backup beyond the standard period must be requested and may incur additional charges.
          </p>

          <h5 className="fw-medium mb-2">e) Limitations of Responsibility</h5>
          <p className="mb-2">Make My Vid will not be responsible for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Missed deadlines resulting from client delays.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Quality issues arising from low-quality raw footage provided by the client.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              File corruption or loss after the client has downloaded and stored the final files.
            </li>
          </ul>
        </div>

        {/* 7. Revisions and Client Rights */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <RefreshIcon size={28} /> 7. Revisions and Client Rights if Something Goes Wrong
        </h2>
        <div className="ps-3" style={darkText}>
          <p className="mb-2">
            Each project includes a specific number of revisions, agreed at the time of order. Additional revisions may incur extra charges.
          </p>
          <p className="mb-2">
            If the delivered project does not materially match the agreed brief, you must notify us within 7 days of delivery. We may request supporting details or references.
          </p>
          <p className="mb-3">
            If valid, we will provide corrections, replacements, or partial refunds at our discretion.
          </p>
        </div>

        {/* 8. Cancellation and Refunds */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <XCircleIcon size={28} /> 8. Cancellation and Refunds
        </h2>
        <p style={darkText} className="mb-3">
          We understand that project requirements may change, and clients may need to cancel or adjust orders. At the same time, video production and editing involve significant time, resources, and preparation. For this reason, our cancellation and refund policy balances fairness to clients with protection for our creative team.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Client-Initiated Cancellations</h5>
          
          <h6 className="fw-medium mb-2 mt-3">Before Work Has Begun:</h6>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If you cancel a confirmed project before any editing or production work has started, you may be eligible for a refund.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In such cases, an administrative charge (covering project setup, resource allocation, and payment processing fees) may be deducted from the refund.
            </li>
          </ul>

          <h6 className="fw-medium mb-2 mt-3">After Work Has Begun:</h6>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Once editing or production work has started (including file preparation, rough cuts, or initial edits), refunds are generally not available.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In exceptional cases, at our discretion, we may provide partial refunds or account credits to be used for future projects.
            </li>
          </ul>

          <h6 className="fw-medium mb-2 mt-3">No-Response Cases:</h6>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If a client confirms a project but fails to provide necessary materials (footage, scripts, logos, etc.) within 14 days, the project may be cancelled.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In such cases, any refunds will be decided at the sole discretion of Make My Vid.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Make My Vid-Initiated Cancellations</h5>
          <p className="mb-2">
            If we are unable to complete a project due to technical failures, lack of resources, or unforeseen circumstances, you will receive a full refund for the amount paid.
          </p>
          <p className="mb-3">
            Where possible, we will also offer alternative solutions (e.g., extended timelines, collaboration with a partner studio).
          </p>

          <h5 className="fw-medium mb-2">c) Non-Refundable Situations</h5>
          <p className="mb-2">Refunds will not be provided in the following cases:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Delays caused by client inaction (e.g., failure to provide assets, instructions, or timely feedback).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Dissatisfaction based on subjective creative preferences if the project materially follows the agreed brief.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Requests made after the final project files have been delivered and accepted.
            </li>
          </ul>
        </div>

        {/* 9. Prices and Payments */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Dollar01Icon size={28} /> 9. Prices and Payments
        </h2>
        <p style={darkText} className="mb-3">
          Transparent pricing is a core principle at Make My Vid. All clients will be informed of the costs associated with their project in advance, and no hidden charges will be applied.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Price Communication</h5>
          <p className="mb-2">Prices are calculated based on:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Type of service requested (e.g., basic editing, advanced motion graphics, colour grading).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Project complexity and duration.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Number of revisions included.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Delivery timelines (standard vs. urgent).
            </li>
          </ul>
          <p className="mb-3">A clear quotation or invoice will be provided before work begins.</p>

          <h5 className="fw-medium mb-2">b) Payment Terms</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Full Upfront Payment:</strong> For smaller projects, full payment may be required at the time of booking.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Milestone Payments:</strong> For larger projects, payments may be split into stages (e.g., 50% upfront, 25% after draft delivery, 25% on completion).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Due Dates:</strong> All payments must be made in accordance with the agreed schedule. Failure to pay may result in suspension of services.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Payment Methods</h5>
          <p className="mb-2">We accept payments through secure channels, including:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Credit/debit cards.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Bank transfers.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              UPI and digital wallets (for Indian clients).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              PayPal or international gateways (for overseas clients).
            </li>
          </ul>
          <p className="mb-3">All payments are processed through trusted third-party providers. Make My Vid does not store your full card details.</p>

          <h5 className="fw-medium mb-2">d) Taxes and Additional Charges</h5>
          <p className="mb-2">
            All prices are subject to applicable taxes (e.g., GST for Indian clients, VAT where applicable internationally).
          </p>
          <p className="mb-2">Additional charges may apply for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Extra revisions beyond the agreed scope.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Urgent delivery requests.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Specialised services not included in the original quotation.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">e) Discounts, Credits, and Promotions</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Any discounts, referral credits, or promotional offers must be applied at the time of booking.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Credits cannot be exchanged for cash and must be used within the specified validity period.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Discounts or credits cannot be applied retrospectively to completed or ongoing projects.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">f) Currency and Conversion</h5>
          <p className="mb-3">
            Prices will be quoted in Indian Rupees (INR) for Indian clients and British Pounds (GBP) or US Dollars (USD) for international clients. Exchange rates are determined by your payment provider, and Make My Vid is not responsible for additional fees charged by banks or gateways.
          </p>
        </div>

        {/* 10. Intellectual Property and Usage Rights */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CopyrightIcon size={28} /> 10. Intellectual Property and Usage Rights
        </h2>
        <p style={darkText} className="mb-3">
          At Make My Vid, we respect intellectual property rights and aim to ensure clarity regarding ownership and usage of all creative materials.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Client Ownership</h5>
          <p className="mb-2">Clients retain full ownership of all raw materials they provide to us, including but not limited to:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Raw video footage.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Audio recordings.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Scripts, storyboards, or written content.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Logos, images, and other branding elements.
            </li>
          </ul>
          <p className="mb-3">We act only as service providers to process, edit, and enhance the content supplied by the client.</p>

          <h5 className="fw-medium mb-2">b) Final Edited Deliverables</h5>
          <p className="mb-2">
            Upon full payment, the client receives the final edited videos and associated files. Clients are granted a perpetual, non-exclusive, worldwide licence to use the final deliverables for their agreed purposes (e.g., marketing, corporate use, social media distribution, events, advertising).
          </p>
          <p className="mb-3">Unless explicitly agreed otherwise, Make My Vid does not restrict how the client uses the final deliverables after payment has been completed.</p>

          <h5 className="fw-medium mb-2">c) Make My Vid Rights</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Portfolio Showcase:</strong> We reserve the right to use completed projects (or extracts thereof) in our portfolio, case studies, social media, or marketing materials, unless the client specifically requests otherwise in writing before the project is completed.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Unpaid Projects:</strong> All intellectual property rights in edited videos or draft outputs remain with Make My Vid until full payment is received. Clients may not use, publish, or distribute unpaid or partially paid deliverables.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Tools and Templates:</strong> Any proprietary templates, presets, or editing methodologies used by Make My Vid in the editing process remain the intellectual property of Make My Vid and are not transferred to the client.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Third-Party Materials</h5>
          <p className="mb-3">
            Clients are solely responsible for ensuring that any third-party content (such as music, stock footage, or trademarked logos) included in their raw materials has been properly licensed. Make My Vid will not be liable for copyright infringement claims arising from client-provided content.
          </p>
        </div>

        {/* 11. Our Responsibility */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Alert01Icon size={28} /> 11. Our Responsibility
        </h2>
        <p style={darkText} className="mb-3">
          At Make My Vid, we commit to delivering high-quality video services that meet the agreed project specifications. However, our responsibilities are subject to clear boundaries.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Our Commitments</h5>
          <p className="mb-2">We are responsible for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Delivering professional editing and production services as per the project brief agreed with the client.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Ensuring the secure handling of all client-provided files.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Meeting agreed delivery timelines, subject to timely client cooperation and the limitations outlined in Section 4 (Service Availability).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Maintaining confidentiality regarding all project files and client data.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Limitations of Responsibility</h5>
          <p className="mb-2">We are not responsible for issues that fall outside our reasonable control, including but not limited to:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Content Inaccuracies:</strong> Errors, omissions, or factual inaccuracies caused by incomplete, misleading, or incorrect client-provided materials.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Delays Due to Client Inaction:</strong> Project delays caused by late submission of footage, missing assets, unclear instructions, or delayed feedback/approvals.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Copyright and Licensing Issues:</strong> Claims or disputes arising from unlicensed music, footage, images, or other third-party content provided by the client.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Technical Limitations of Provided Assets:</strong> Reduced quality in the final output caused by poor-quality raw footage, corrupted files, or incompatible formats.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Limitation of Liability</h5>
          <p className="mb-2">
            Our total liability, whether arising from breach of contract, negligence, or any other cause, will not exceed the total fees paid by the client for the specific project in dispute.
          </p>
          <p className="mb-2">We will not be liable for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Loss of profits, revenue, or business opportunities.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Indirect, incidental, or consequential damages.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Reputational damage caused by client misuse or misrepresentation of deliverables.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Industry Standard Disclaimer</h5>
          <p className="mb-3">
            While we make every effort to meet creative and technical expectations, video production and editing involve subjective judgment. Differences in creative taste or artistic preference are not considered grounds for liability, provided the project deliverables materially match the agreed brief.
          </p>
        </div>

        {/* 12. Data Protection and Privacy */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <DatabaseIcon size={28} /> 12. Data Protection and Privacy
        </h2>
        <p style={darkText} className="mb-3">
          At Make My Vid, protecting your personal information and creative content is a top priority. We comply with applicable data protection regulations and implement strict security measures to ensure your data is safe at every stage of interaction.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Our Privacy Policy</h5>
          <p className="mb-3">
            All personal data is collected, stored, and processed in accordance with our Privacy Policy, which forms an integral part of these Terms of Service. By using our services, you acknowledge and agree to the practices described in our Privacy Policy.
          </p>

          <h5 className="fw-medium mb-2">b) Secure Handling of Client Files</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              All video, audio, and project-related files provided to us are handled with strict confidentiality.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Files are stored on secure servers or trusted third-party cloud providers with appropriate safeguards.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We use encryption, firewalls, and access controls to protect against unauthorised access.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Limited Access</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Only authorised staff and contractors who require access for project delivery will be able to handle client files.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              All staff are trained in data protection practices and confidentiality obligations.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Retention and Deletion</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Project files are retained only for the duration specified in our Privacy Policy (see Section 7: Retention of Your Information).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Unless otherwise agreed, files will be securely deleted after the retention period has expired.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Clients may request early deletion of their files at any time, subject to verification and confirmation.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">e) International Transfers</h5>
          <p className="mb-3">
            As we serve both Indian and international clients, data may be transferred outside your home country. Where this occurs, we ensure safeguards such as contractual protections and compliance with GDPR/DPDP requirements.
          </p>
        </div>

        {/* 13. Compliance with Law */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <SafeIcon size={28} /> 13. Compliance with Law
        </h2>
        <p style={darkText} className="mb-3">
          Make My Vid is committed to operating in full compliance with applicable laws and regulations across the jurisdictions we serve.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Indian Law</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We comply with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 (DPDP Act) for all Indian clients.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We also comply with tax, financial, and consumer protection laws as required under Indian regulations.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Copyright and Intellectual Property Laws</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We respect intellectual property rights and ensure our services are delivered in compliance with copyright law.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Clients are responsible for securing necessary licences for third-party content they provide (such as music, stock footage, or branding assets).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Make My Vid will not knowingly use unlicensed or unlawful materials.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) International Standards</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              For international clients, we comply with recognised global standards, including the General Data Protection Regulation (GDPR) in the European Union and the UK GDPR in the United Kingdom.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Where international data transfers occur, we apply the required safeguards (such as Standard Contractual Clauses).
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Statutory Rights</h5>
          <p className="mb-3">
            Nothing in these Terms limits your statutory rights under applicable consumer or data protection laws. If there is a conflict between these Terms and your legal rights, your statutory rights will always prevail.
          </p>
        </div>

        {/* 14. Governing Law and Dispute Resolution */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <GameIcon size={28} /> 14. Governing Law and Dispute Resolution
        </h2>
        <p style={darkText} className="mb-3">
          These Terms of Service, along with any disputes or claims arising from or in connection with them, shall be governed and interpreted in accordance with the laws of India, without regard to conflict of law principles.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Jurisdiction</h5>
          <p className="mb-3">
            The courts located in Mumbai, Maharashtra, India, shall have exclusive jurisdiction over any disputes, claims, or proceedings relating to these Terms or the services provided by Make My Vid. By using our services, you agree to submit to the jurisdiction of these courts.
          </p>

          <h5 className="fw-medium mb-2">b) Internal Resolution Process</h5>
          <p className="mb-2">Before escalating a dispute, we encourage clients to first attempt to resolve issues directly with us:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You may submit complaints or concerns by email at info@makemyvid.io.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We will acknowledge receipt of your complaint within 5 business days.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Our team will investigate the issue and aim to provide a resolution within 30 days, depending on complexity.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Alternative Dispute Resolution (ADR)</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If a dispute cannot be resolved through our internal resolution process, we may recommend using an independent arbitration or mediation service.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              ADR helps resolve disputes faster and more cost-effectively than traditional court proceedings.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Participation in ADR will always require mutual agreement between Make My Vid and the client.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Escalation to Legal Remedies</h5>
          <p className="mb-2">
            If ADR fails or is not chosen, disputes will be pursued in the competent courts of Mumbai, Maharashtra. All proceedings will be conducted in English.
          </p>

          <h5 className="fw-medium mb-2">e) International Clients</h5>
          <p className="mb-3">
            For international clients, these Terms remain governed by the laws of India, and any disputes shall still fall under the jurisdiction of Mumbai courts. If required by law, we may also comply with dispute resolution mechanisms applicable in the client's home jurisdiction, but this does not override the governing law clause above.
          </p>
        </div>

        {/* 15. Changes to Terms */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <RefreshCwIcon size={28} /> 15. Changes to Terms
        </h2>
        <p style={darkText} className="mb-3">
          We may update or amend these Terms of Service from time to time to reflect changes in our business practices, services, technology, or applicable legal and regulatory requirements.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Reasons for Changes</h5>
          <p className="mb-2">These updates may occur when:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We introduce new features, tools, or services.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We modify our pricing, payment methods, or refund policies.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              There are changes in applicable laws or regulations that require updates.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We enhance our security measures or data protection practices.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We refine our business model or service structure to improve client experience.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) How We Will Notify You</h5>
          <p className="mb-2">
            <strong>Minor Updates:</strong> For clarifications or administrative adjustments, we will update the "Effective Date" at the top of this document and publish the revised Terms on our website.
          </p>
          <p className="mb-2">
            <strong>Significant Changes:</strong> For material updates (e.g., major changes in service scope, user obligations, or data handling practices), we will notify you in advance by:
          </p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Sending an email to the address associated with your account.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Posting a notice within your account dashboard or on our website.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In certain cases, requesting your renewed consent.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Acceptance of Updated Terms</h5>
          <p className="mb-2">
            By continuing to use our services after updates have been posted, you agree to the revised Terms.
          </p>
          <p className="mb-3">
            If you do not agree to the updated Terms, you must discontinue use of our services and may request account closure by contacting us at info@makemyvid.io.
          </p>
        </div>

        {/* 16. Contact and Support */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <HelpCircleIcon size={28} /> 16. Contact and Support
        </h2>
        <p style={darkText} className="mb-3">
          We want our clients to feel supported throughout their journey with Make My Vid. If you have any questions, concerns, or require technical assistance, you can reach us using the details below:
        </p>

        <div className="ps-3" style={darkText}>
          <p className="mb-2">
            <Mail01Icon size={18} className="me-2" /> <strong>Email (Primary):</strong> info@makemyvid.io
          </p>
          <p className="mb-2">
            <AiPhone01Icon size={18} className="me-2" /> <strong>Phone (India):</strong> +91 79774 84292
          </p>
          <p className="mb-2">
            <AiPhone01Icon size={18} className="me-2" /> <strong>Phone (UK enquiries):</strong> +44 75425 50969
          </p>
          <p className="mb-3">
            <MapPinIcon size={18} className="me-2" /> <strong>Office Address:</strong> 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
          </p>

          <h5 className="fw-medium mb-2">Support Availability</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Our support team is available Monday – Saturday, 10:00 AM to 7:00 PM IST.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Queries are generally responded to within 24–48 hours (business days).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Priority support is available for ongoing projects with tight deadlines.
            </li>
          </ul>
        </div>

        {/* 17. Non-Excludable Liability */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Alert01Icon size={28} /> 17. Non-Excludable Liability
        </h2>
        <p style={darkText} className="mb-3">
          Nothing in these Terms excludes, limits, or attempts to exclude or limit liability where it would be unlawful to do so.
        </p>

        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">Specifically:</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Death or Personal Injury:</strong> We do not exclude or limit liability for death or personal injury caused by our negligence.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Fraud or Misrepresentation:</strong> We do not exclude liability for fraud or fraudulent misrepresentation.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              <strong>Mandatory Legal Obligations:</strong> Any rights you have under applicable consumer protection, data protection, or other laws will always apply, regardless of what is written in these Terms.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">Limitation of Other Liabilities</h5>
          <p className="mb-3">
            Other than the non-excludable liabilities listed above, our total liability to you in respect of any claim will be limited to the total fees paid by you for the specific project or service giving rise to the claim.
          </p>
        </div>

        {/* Website Terms of Use */}
        <h1
          className="fw-bold fs-2 mt-5 pt-5 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Globe02Icon size={30} /> Make My Vid – Website Terms of Use
        </h1>
        <p className="text-muted mb-4">Effective Date: 05/09/2025</p>

        {/* Website Terms Section 1 */}
        <h2
          className="fs-4 fw-semibold mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <LockIcon size={28} /> 1. Acceptance of Terms
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Binding Agreement</h5>
          <p className="mb-3">
            By visiting, browsing, or otherwise using the Make My Vid website (the "Site"), you confirm that you have read, understood, and agreed to be bound by these Website Terms of Use ("Terms"). These Terms constitute a legally binding agreement between you (the "User") and Make My Vid regarding your access to and use of the Site.
          </p>

          <h5 className="fw-medium mb-2">b) Applicability</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              These Terms apply to all visitors, whether you are simply browsing the Site or using it to request services, submit project details, or interact with our team.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              In addition to these Terms, your use of our services is also governed by our Terms of Service, Privacy Policy, and Cookie Policy, which together form the complete agreement between you and Make My Vid.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Updates to Terms</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We may revise these Terms periodically to reflect changes in law, technology, or our business practices.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Any updates will be posted on this page with a new "Effective Date."
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Continued use of the Site after such updates means you accept and agree to the revised Terms.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) If You Do Not Agree</h5>
          <p className="mb-2">If you do not agree with these Terms, you must:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Immediately stop using the Site.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Refrain from accessing or interacting with any of its features.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 2 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Building01Icon size={28} /> 2. Who We Are
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Company Overview</h5>
          <p className="mb-3">
            Make My Vid is a creative services company specialising in pre-production, video production, and post-production editing solutions. We work with businesses, agencies, creators, and individuals to deliver high-quality video content tailored to their needs.
          </p>

          <h5 className="fw-medium mb-2">b) Registered Entity</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Business Name: Make My Vid
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Primary Location: Mumbai, Maharashtra, India
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We operate both in India and internationally, serving clients across multiple industries and markets.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Our Services</h5>
          <p className="mb-2">Through our Site, you can learn about, request, or access services such as:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Video editing and post-production.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Motion graphics and animation.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Sound design, audio mixing, and subtitles.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Colour correction and grading.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              End-to-end project management for creative video content.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">d) Ownership of the Site</h5>
          <p className="mb-3">
            The Site, including its design, structure, layout, and all associated intellectual property, is owned and operated exclusively by Make My Vid.
          </p>

          <h5 className="fw-medium mb-2">e) Contact Information</h5>
          <p className="mb-2">If you need assistance or wish to reach us, you can contact us via:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Email: info@makemyvid.io
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              India: +91 79774 84292
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              UK Enquiries: +44 75425 50969
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Office Address: 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
            </li>
          </ul>
        </div>

        {/* Website Terms Section 3 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Settings01Icon size={28} /> 3. Use of the Site
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Lawful Use Only</h5>
          <p className="mb-3">
            By accessing or using the Make My Vid website (the "Site"), you agree to use it solely for lawful purposes. You must not engage in any activity that violates applicable laws, infringes the rights of others, or restricts or inhibits anyone else's use of the Site.
          </p>

          <h5 className="fw-medium mb-2">b) Prohibited Behaviour</h5>
          <p className="mb-2">Prohibited behaviour includes (but is not limited to):</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Misusing the Site for fraudulent, illegal, or harmful activities.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Attempting to hack, bypass, or reverse engineer any part of the Site, its code, or security measures.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Uploading or distributing viruses, malware, or malicious code that could damage or disrupt the Site or its users.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Harvesting data, scraping content, or engaging in automated access without authorisation.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Copying, redistributing, or reproducing Site content without our written permission.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Using the Site in a way that could impair its functionality, overload servers, or interfere with our systems.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Consequences of Misuse</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If you engage in prohibited behaviour, we may suspend or permanently terminate your access to the Site.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We may also pursue legal action, including reporting unlawful activities to law enforcement authorities.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 4 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CopyrightIcon size={28} /> 4. Intellectual Property
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Ownership of Content</h5>
          <p className="mb-3">
            All materials available on the Site—including text, graphics, images, logos, videos, software, and design elements—are the intellectual property of Make My Vid or our licensors. These works are protected under copyright, trademark, and intellectual property laws.
          </p>

          <h5 className="fw-medium mb-2">b) Permitted Use</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You may view, download, or print content from the Site for your personal, non-commercial use only.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You may share links to our Site on third-party platforms (e.g., social media) provided you do not misrepresent or modify the content.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Restricted Use</h5>
          <p className="mb-2">You may not:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Copy, reproduce, republish, sell, rent, or exploit any part of the Site without prior written permission from Make My Vid.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Remove, obscure, or alter any copyright, trademark, or proprietary notices displayed on the Site.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Use Site content for commercial purposes without an explicit licence or agreement.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 5 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <File01Icon size={28} /> 5. User-Generated Content
        </h2>
        <div className="ps-3" style={darkText}>
          <p className="mb-3">
            From time to time, the Site may allow users to upload, post, or share content (such as comments, testimonials, or portfolio submissions).
          </p>

          <h5 className="fw-medium mb-2">a) Your Responsibilities</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You must ensure that any content you submit is accurate, lawful, and does not infringe on third-party rights (such as copyright, trademarks, or privacy rights).
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You agree not to upload content that is offensive, defamatory, obscene, discriminatory, or otherwise inappropriate.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Licence to Make My Vid</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              By submitting content, you grant Make My Vid a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, adapt, and promote that content on our Site and in marketing materials.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You retain ownership of your content, but we may continue to use it for legitimate business purposes even if you later delete it from the Site.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Our Rights</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We reserve the right to review, moderate, or remove any user-generated content at our sole discretion.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We are not obligated to monitor content but may do so to ensure compliance with these Terms.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 6 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <CircleIcon size={28} /> 6. Accuracy of Information
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Our Responsibility</h5>
          <p className="mb-3">
            We take reasonable care to ensure that information presented on the Site is accurate, current, and reliable. This includes details about our services, pricing ranges, timelines, and company information.
          </p>

          <h5 className="fw-medium mb-2">b) Limitations</h5>
          <p className="mb-2">However, we do not guarantee that:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              All Site information will be error-free, complete, or fully up-to-date at all times.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The Site will always be free from typographical errors, omissions, or technical inaccuracies.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Third-party information displayed on the Site (such as external links, embedded content, or testimonials) will always be correct or reliable.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Changes Without Notice</h5>
          <p className="mb-3">
            Information on the Site is subject to change without prior notice, including services offered, features, or content. We may update, remove, or modify Site content at our discretion without liability.
          </p>
        </div>

        {/* Website Terms Section 7 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Globe02Icon size={28} /> 7. Links to Third-Party Websites
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) External Links</h5>
          <p className="mb-3">
            The Site may contain links to third-party websites, services, or platforms (such as cloud storage services, payment gateways, or social media channels). These links are provided for convenience only.
          </p>

          <h5 className="fw-medium mb-2">b) No Endorsement</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The presence of a third-party link does not imply endorsement, sponsorship, or recommendation by Make My Vid.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We do not control and are not responsible for the content, products, or services available on external websites.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) User Responsibility</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You access third-party websites at your own risk.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              You are responsible for reviewing and complying with the terms of use and privacy policies of those external websites.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 8 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Clock01Icon size={28} /> 8. Availability of the Site
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Access and Uptime</h5>
          <p className="mb-3">
            We aim to ensure the Site is available and functional at all times. However, we cannot guarantee uninterrupted or error-free access.
          </p>

          <h5 className="fw-medium mb-2">b) Maintenance and Upgrades</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We may suspend or restrict access to the Site for maintenance, updates, or improvements.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Where possible, we will provide advance notice, but this may not always be feasible (e.g., urgent security updates).
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) No Liability for Downtime</h5>
          <p className="mb-3">
            We are not liable for any loss, damage, or inconvenience caused by temporary unavailability or reduced functionality of the Site. Access may also be affected by factors outside our control, such as internet outages, hosting provider downtime, or force majeure events.
          </p>
        </div>

        {/* Website Terms Section 9 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <Alert01Icon size={28} /> 9. Limitation of Liability
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) General Disclaimer</h5>
          <p className="mb-2">To the fullest extent permitted by law:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              The Site and its content are provided on an "as is" and "as available" basis without warranties of any kind.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              We disclaim liability for any direct, indirect, incidental, or consequential losses arising from your use of (or inability to use) the Site.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) Specific Exclusions</h5>
          <p className="mb-2">We are not responsible for:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Errors, omissions, or inaccuracies in Site content.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Malware, viruses, or harmful components that may affect your device.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Unauthorised access to or use of your data by third parties.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Reliance placed on information obtained from the Site.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) Non-Excludable Liability</h5>
          <p className="mb-2">Nothing in these Terms excludes or limits liability where it would be unlawful to do so, including:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Death or personal injury caused by negligence.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Fraud or fraudulent misrepresentation.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Rights you are entitled to under consumer protection or data protection laws.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 10 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <DatabaseIcon size={28} /> 10. Privacy and Cookies
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Privacy Policy</h5>
          <p className="mb-3">
            Your use of the Site is also governed by our Privacy Policy, which explains how we collect, process, and protect your personal data. By using the Site, you consent to our handling of your data in line with that policy.
          </p>

          <h5 className="fw-medium mb-2">b) Cookie Policy</h5>
          <p className="mb-3">
            We use cookies and similar technologies to improve Site performance, analyse usage, and personalise your experience. Details of how cookies are used and how you can manage them are set out in our Cookie Policy.
          </p>

          <h5 className="fw-medium mb-2">c) User Responsibility</h5>
          <p className="mb-3">
            It is your responsibility to review both the Privacy Policy and Cookie Policy regularly to stay informed about how your data is collected and used.
          </p>
        </div>

        {/* Website Terms Section 11 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <RefreshCwIcon size={28} /> 11. Changes to These Terms
        </h2>
        <div className="ps-3" style={darkText}>
          <h5 className="fw-medium mb-2">a) Right to Update</h5>
          <p className="mb-2">We may revise or update these Website Terms of Use from time to time to reflect:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Changes in our business operations, services, or features available on the Site.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Updates required by new legal, regulatory, or security requirements.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Enhancements in technology or improvements to the Site's design and functionality.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Adjustments to clarify provisions, correct errors, or reflect feedback from users.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">b) How Updates Are Communicated</h5>
          <p className="mb-2">
            <strong>Minor Changes:</strong> Administrative or editorial updates (such as formatting or clarifications) will be published directly on this page with a new "Effective Date."
          </p>
          <p className="mb-2">
            <strong>Significant Changes:</strong> For substantial updates that materially affect your rights or obligations (e.g., changes in acceptable use, limitations of liability, or dispute resolution processes), we may provide additional notice, which could include:
          </p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              A prominent notice on our website.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              An email notification if you have an active account or subscription with us.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              A request for renewed acceptance (e.g., ticking a box or clicking "I Agree") before continuing to use certain features.
            </li>
          </ul>

          <h5 className="fw-medium mb-2 mt-4">c) User Responsibility</h5>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              It is your responsibility to check this page regularly to stay informed of updates.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              By continuing to access or use the Site after new Terms are published, you acknowledge and agree to be bound by the revised Terms.
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              If you do not agree with any changes, you must discontinue use of the Site immediately.
            </li>
          </ul>
        </div>

        {/* Website Terms Section 12 */}
        <h2
          className="fs-4 fw-semibold mt-5 pt-3 mb-3 d-flex align-items-center gap-2"
          style={headingColor}
        >
          <HelpCircleIcon size={28} /> 12. Contact Us
        </h2>
        <div className="ps-3" style={darkText}>
          <p className="mb-2">If you have any questions about these Terms or the Site, you can contact us:</p>
          <ul className="list-unstyled ps-4">
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Email: info@makemyvid.io
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              India: +91 79774 84292
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              UK enquiries: +44 75425 50969
            </li>
            <li className="position-relative ps-4 mb-2">
              <span className="position-absolute start-0" style={{ color: '#1B3C2C' }}>•</span>
              Office Address: 11, Star Trade Centre, Chamunda Circle, Sodawala Lane, Borivali West, Mumbai 400092
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default TermsAndConditions;
