"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Country } from "country-state-city";

interface ReviewSectionProps {
  title: string;
  data: Record<string, any>;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, data }) => (
  <div className="col-12">
    <div className="input-group-meta position-relative mb-25">
      <h4 className="mb-3">{title}</h4>
      <div className="review-data">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="review-item mb-2">
            <strong>{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</strong>
            <span className="ms-2">
              {Array.isArray(value)
                ? value.join(', ')
                : value === null || value === undefined
                  ? 'Not provided'
                  : String(value)
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getCountryName = (isoCode: string) => {
  const country = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return country ? country.name : isoCode;
};

type Props = {
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void>;
};

const ClientFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmitRegistration = async () => {
    // Validate checkboxes
    if (!termsAccepted) {
      toast.error('Please accept the Terms and Conditions to continue');
      return;
    }

    if (!privacyAccepted) {
      toast.error('Please accept the Privacy Policy to continue');
      return;
    }

    console.log('Initial formData received by Review component:', formData);

    const loadingToast = toast.loading('Submitting registration...');
    try {
      const formDataToSend = new FormData();

      // Basic Information
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('account_type', 'client');

      // Company Information
      if (formData.company_name) formDataToSend.append('company_name', formData.company_name);
      if (formData.company_description) formDataToSend.append('company_description', formData.company_description);
      if (formData.industry) formDataToSend.append('industry', formData.industry);
      if (formData.website) formDataToSend.append('company_website', formData.website);
      if (formData.social_links) formDataToSend.append('social_links', formData.social_links);
      if (formData.company_size) formDataToSend.append('company_size', formData.company_size);

      const requiredServices = Array.isArray(formData.required_services) && formData.required_services.length > 0
        ? formData.required_services
        : (formData.required_services ? [formData.required_services] : ['General Services']);
      formDataToSend.append('required_services', JSON.stringify(requiredServices));

      // Contact Details
      if (formData.phone_number) formDataToSend.append('phone_number', formData.phone_number);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.state) formDataToSend.append('state', formData.state);
      if (formData.country) formDataToSend.append('country', formData.country);
      if (formData.zip_code) formDataToSend.append('zip_code', formData.zip_code);
      if (formData.pincode) formDataToSend.append('pincode', formData.pincode);
      if (formData.tax_id) formDataToSend.append('tax_id', formData.tax_id);

      // Latitude and Longitude
      if (formData.coordinates && formData.coordinates.lat && formData.coordinates.lng) {
        formDataToSend.append('latitude', String(formData.coordinates.lat));
        formDataToSend.append('longitude', String(formData.coordinates.lng));
      }

      // Work Preferences
      if (formData.work_arrangement) formDataToSend.append('work_arrangement', formData.work_arrangement);
      if (formData.project_frequency) formDataToSend.append('project_frequency', formData.project_frequency);
      if (formData.hiring_preferences) formDataToSend.append('hiring_preferences', formData.hiring_preferences);

      // Project Information
      if (formData.project_title) formDataToSend.append('project_title', formData.project_title);
      if (formData.project_description) formDataToSend.append('project_description', formData.project_description);
      if (formData.project_category) formDataToSend.append('project_category', formData.project_category);
      if (formData.project_budget) formDataToSend.append('project_budget', formData.project_budget);
      if (formData.project_timeline) formDataToSend.append('project_timeline', formData.project_timeline);

      // Terms and Privacy - ALWAYS send as boolean
      formDataToSend.append('terms_accepted', String(termsAccepted));
      formDataToSend.append('privacy_policy_accepted', String(privacyAccepted));

      // Business Document
      if (formData.business_document && formData.business_document instanceof File && formData.business_document.size > 0) {
        if (formData.business_document.name !== 'Unknown.pdf' && formData.business_document.name !== 'blob') {
          formDataToSend.append('business_document', formData.business_document);
          console.log(`✅ Business document attached: ${formData.business_document.name} (${formData.business_document.size} bytes)`);
        } else {
          console.warn('⚠️ Invalid business document detected, skipping upload');
        }
      }

      // Profile photo upload
      if (formData.profile_photo) {
        formDataToSend.append('profile_picture', formData.profile_photo as File);
      }
      
      console.log('Client form data being sent to API:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/client`, {
        method: 'POST',
        headers: {
          'x-test-mode': 'true',
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      await handleRegister(data);
      toast.success('Registration completed successfully!', { id: loadingToast });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(
        error.message || 'Registration failed. Please try again.',
        { id: loadingToast }
      );
    }
  };

  const sections = {
    "Basic Information": {
      full_name: formData.full_name,
      email: formData.email,
    },
    "Company Information": {
      company_name: formData.company_name,
      industry: formData.industry,
      website: formData.website,
      social_links: formData.social_links,
      company_size: formData.company_size,
      "Required Services": formData.required_services,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      country: formData.country
        ? `${getCountryName(formData.country)} (${formData.country})`
        : 'Not provided',
      tax_id: formData.tax_id || "Not provided",
    },
    "Work Preferences": {
      work_arrangement: formData.work_arrangement,
      project_frequency: formData.project_frequency,
      hiring_preferences: formData.hiring_preferences,
    },
  };

  return (
    <div className="final-review">
      <div className="row">
        <div className="col-12">
          <h3 className="text-center mb-4">Review Your Information</h3>
          <p className="text-center mb-4">Please review your information carefully before submitting</p>
        </div>

        {Object.entries(sections).map(([title, data]) => (
          <ReviewSection key={title} title={title} data={data} />
        ))}

        {/* Terms and Privacy Policy Checkboxes */}
        <div className="col-12 mt-4">
          <div className="agreement-checkbox">
            <div className="mb-3">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms-checkbox">
                I accept the <a href="http://localhost:3000/terms-condition" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                <span className="required-mark">*</span>
              </label>
            </div>

            <div>
              <input
                type="checkbox"
                id="privacy-checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
              />
              <label htmlFor="privacy-checkbox">
                I accept the <a href="http://localhost:3000/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <span className="required-mark">*</span>
              </label>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn-one"
            onClick={prevStep}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-one"
            onClick={handleSubmitRegistration}
            disabled={!termsAccepted || !privacyAccepted}
          >
            Submit Registration
          </button>
        </div>
      </div>

      <style jsx>{`
        .review-data {
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #f8f9fa;
        }
        .review-item {
          padding: 8px 0;
          border-bottom: 1px dashed #e0e0e0;
        }
        .review-item:last-child {
          border-bottom: none;
        }
        .required-mark {
          color: #dc3545;
          margin-left: 4px;
        }
        .btn-one:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ClientFinalReview;