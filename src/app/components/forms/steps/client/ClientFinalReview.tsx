"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Country } from "country-state-city";

type Props = {
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void>;
};

const getCountryName = (isoCode: string) => {
  const country = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return country ? country.name : isoCode;
};

const ClientFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmitRegistration = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the Terms and Conditions to continue");
      return;
    }

    if (!privacyAccepted) {
      toast.error("Please accept the Privacy Policy to continue");
      return;
    }

    console.log("Initial formData received by Review component:", formData);

    const loadingToast = toast.loading("Submitting registration...");
    try {
      const formDataToSend = new FormData();

      // Basic Information
      formDataToSend.append("first_name", formData.first_name || "");
      formDataToSend.append("last_name", formData.last_name || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("password", formData.password || "");
      formDataToSend.append("account_type", "client");

      // Company Information
      if (formData.company_name) formDataToSend.append("company_name", formData.company_name);
      if (formData.company_description) formDataToSend.append("company_description", formData.company_description);
      if (formData.industry) formDataToSend.append("industry", formData.industry);
      if (formData.website) formDataToSend.append("company_website", formData.website);
      if (formData.social_links) formDataToSend.append("social_links", JSON.stringify(formData.social_links));
      if (formData.company_size) formDataToSend.append("company_size", formData.company_size);

      const requiredServices = Array.isArray(formData.required_services) && formData.required_services.length > 0
        ? formData.required_services
        : formData.required_services ? [formData.required_services] : ["General Services"];
      formDataToSend.append("required_services", JSON.stringify(requiredServices));

      // Contact Details
      if (formData.phone_number) formDataToSend.append("phone_number", formData.phone_number);
      if (formData.address) formDataToSend.append("address", formData.address);
      if (formData.city) formDataToSend.append("city", formData.city);
      if (formData.state) formDataToSend.append("state", formData.state);
      if (formData.country) formDataToSend.append("country", formData.country);
      if (formData.zip_code) formDataToSend.append("zip_code", formData.zip_code);
      if (formData.pincode) formDataToSend.append("pincode", formData.pincode);
      if (formData.tax_id) formDataToSend.append("tax_id", formData.tax_id);

      // Latitude and Longitude
      if (formData.coordinates && formData.coordinates.lat && formData.coordinates.lng) {
        formDataToSend.append("latitude", String(formData.coordinates.lat));
        formDataToSend.append("longitude", String(formData.coordinates.lng));
      }

      // Work Preferences
      if (formData.work_arrangement) formDataToSend.append("work_arrangement", formData.work_arrangement);
      if (formData.project_frequency) formDataToSend.append("project_frequency", formData.project_frequency);
      if (formData.hiring_preferences) formDataToSend.append("hiring_preferences", formData.hiring_preferences);

      // Project Information
      if (formData.project_title) formDataToSend.append("project_title", formData.project_title);
      if (formData.project_description) formDataToSend.append("project_description", formData.project_description);
      if (formData.project_category) formDataToSend.append("project_category", formData.project_category);
      if (formData.project_budget) formDataToSend.append("project_budget", String(formData.project_budget));
      if (formData.project_timeline) formDataToSend.append("project_timeline", formData.project_timeline);

      // Terms and Privacy
      formDataToSend.append("terms_accepted", String(termsAccepted));
      formDataToSend.append("privacy_policy_accepted", String(privacyAccepted));

      // Business Document
      if (formData.business_document && formData.business_document instanceof File && formData.business_document.size > 0) {
        if (formData.business_document.name !== "Unknown.pdf" && formData.business_document.name !== "blob") {
          formDataToSend.append("business_document", formData.business_document);
          console.log(`✅ Business document attached: ${formData.business_document.name} (${formData.business_document.size} bytes)`);
        } else {
          console.warn("⚠️ Invalid business document detected, skipping upload");
        }
      }

      // Profile photo upload
      if (formData.profile_photo) {
        formDataToSend.append("profile_picture", formData.profile_photo as File);
      }

      console.log("Client form data being sent to API:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/client`, {
        method: "POST",
        headers: {
          "x-test-mode": "true",
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await handleRegister(data);
      toast.success("Registration completed successfully!", { id: loadingToast });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.", { id: loadingToast });
    }
  };

  const sections: Record<string, Record<string, string | string[] | undefined>> = {
    "Basic Information": {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    },
    "Company Information": {
      company_name: formData.company_name,
      company_description: formData.company_description,
      industry: formData.industry,
      website: formData.website,
      social_links: Array.isArray(formData.social_links) ? formData.social_links : undefined,
      company_size: formData.company_size,
      required_services: Array.isArray(formData.required_services) ? formData.required_services : formData.required_services ? [formData.required_services] : undefined,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country ? `${getCountryName(formData.country)} (${formData.country})` : undefined,
      zip_code: formData.zip_code,
      pincode: formData.pincode,
      tax_id: formData.tax_id,
    },
    "Work Preferences": {
      work_arrangement: formData.work_arrangement,
      project_frequency: formData.project_frequency,
      hiring_preferences: formData.hiring_preferences,
    },
    // "Project Information": {
    //   project_title: formData.project_title,
    //   project_description: formData.project_description,
    //   project_category: formData.project_category,
    //   project_budget: formData.project_budget ? String(formData.project_budget) : undefined,
    //   project_timeline: formData.project_timeline,
    // },
  };

  return (
    <div className="row">
      <h4 className="mb-25">Final Review</h4>
      <p className="mb-25">Please review your information carefully before submitting.</p>
      {Object.entries(sections).map(([title, values]) => (
        <div key={title} className="col-12 mb-25">
          <h5 className="mb-2">{title}</h5>
          <div className="p-3 border rounded">
            {Object.entries(values)
              .filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
              .map(([k, v]) => (
                <div key={k} className="mb-1">
                  <strong>
                    {k
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    :
                  </strong>
                  <span className="ms-2">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Checkbox Section */}
      <div className="col-12 mt-4">
        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="me-2"
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="terms-checkbox" style={{ cursor: "pointer" }}>
            I accept the{" "}
            <a href="http://localhost:3000/terms-condition" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
        </div>
        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="privacy-checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="me-2"
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="privacy-checkbox" style={{ cursor: "pointer" }}>
            I accept the{" "}
            <a href="http://localhost:3000/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <span style={{ color: "#dc3545", marginLeft: "4px" }}>*</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="col-12 d-flex justify-content-between mt-30">
        <button type="button" className="btn-one tran3s" onClick={prevStep}>
          Previous
        </button>
        <button
          type="button"
          className="btn-one tran3s"
          onClick={handleSubmitRegistration}
          disabled={!termsAccepted || !privacyAccepted}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
};

export default ClientFinalReview;