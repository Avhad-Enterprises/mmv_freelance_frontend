"use client";
import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Country } from "country-state-city";

type Props = {
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void> | void;
};

const getCountryName = (isoCode: string) => {
  const country = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return country ? country.name : isoCode;
};

const VideographerFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);
  const data = formData as any;

  const handleSubmit = async () => {
    // Validate checkboxes
    if (!termsAccepted) {
      toast.error('Please accept the Terms and Conditions to continue');
      return;
    }

    if (!privacyAccepted) {
      toast.error('Please accept the Privacy Policy to continue');
      return;
    }

    const loadingToast = toast.loading('Submitting registration...');
    try {
      const fd = new FormData();

      // Basic Information (required)
      fd.append('first_name', data.first_name || '');
      fd.append('last_name', data.last_name || '');
      fd.append('profile_title', `${data.first_name || ''} ${data.last_name || ''}`.trim());
      fd.append('email', data.email || '');
      fd.append('password', data.password || '');
      fd.append('account_type', 'freelancer');

      // Skills from Step 1 (base_skills) + tags as skills
      const skills: string[] = Array.isArray(data.base_skills) ? data.base_skills : [];
      fd.append('skills', JSON.stringify(skills));

      // Experience (optional in our flow)
      if (data.experience_level) fd.append('experience_level', data.experience_level);

      // Portfolio (YouTube only)
      const portfolioLinks: string[] = (data.portfolio_links || []).filter((l: string) => !!l);
      if (portfolioLinks.length > 0) fd.append('portfolio_links', JSON.stringify(portfolioLinks));

      // Rate
      if (data.rate_amount) fd.append('rate_amount', String(data.rate_amount));
      if (data.rate_currency) fd.append('rate_currency', data.rate_currency);

      // Contact & Location
      fd.append('phone_number', data.phone_number || '');
      if (data.full_address) fd.append('address', data.full_address);
      if (data.city) fd.append('city', data.city);
      if (data.state) fd.append('state', data.state);
      if (data.country) fd.append('country', data.country);
      if (data.pincode) fd.append('pincode', data.pincode);
      
      // *** FIX: Append latitude and longitude from Step 3 (only if valid) ***
      if (data.coordinates && data.coordinates.lat !== null && data.coordinates.lng !== null) {
        fd.append('latitude', String(data.coordinates.lat));
        fd.append('longitude', String(data.coordinates.lng));
      }

      // ID Verification
      fd.append('id_type', data.id_type || '');
      if (data.id_document) {
        const file = Array.isArray(data.id_document) ? data.id_document[0] : data.id_document;
        if (file) fd.append('id_document', file as File);
      }

      // Profile photo upload
      if (data.profile_photo) {
        fd.append('profile_photo', data.profile_photo as File);
      }

      // Work Preferences
      if (data.availability) fd.append('availability', data.availability);
      if (Array.isArray(data.languages) && data.languages.length > 0) {
        fd.append('languages', JSON.stringify(data.languages));
      }
      if (data.short_description) {
        fd.append('short_description', data.short_description);
        fd.append('bio', data.short_description); // Map short_description to bio for backend
      }

      // Extra fields
      if (data.role) fd.append('role', data.role);
      if (Array.isArray(data.superpowers)) fd.append('superpowers', JSON.stringify(data.superpowers));
      if (Array.isArray(data.skill_tags)) fd.append('skill_tags', JSON.stringify(data.skill_tags));

      // Terms and Privacy - ALWAYS send as boolean
      fd.append('terms_accepted', String(termsAccepted));
      fd.append('privacy_policy_accepted', String(privacyAccepted));

      // Debug: Log all form data being sent
      console.log('=== VIDEOGRAPHER REGISTRATION PAYLOAD ===');
      for (let [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log('==========================================');

      // Submit
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/videographer`,
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-test-mode": "true",
          },
        }
      );

      const respData = response.data;
      console.log('API Response:', respData);
      
      if (response.status !== 200 && response.status !== 201) {
        console.error('Registration failed with status:', response.status);
        console.error('Error details:', respData);
        throw new Error(respData.message || 'Registration failed');
      }

      // Registration successful - show success message and redirect
      console.log('✅ Registration successful!');
      toast.success('Registration completed successfully!', { id: loadingToast });
      setTimeout(() => {
        window.location.href = '/?login=true';
      }, 2000);
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.', { id: loadingToast });
    }
  };

  const sections: Record<string, Record<string, any>> = {
    Basic: {
      role: data.role,
      first_name: data.first_name,
      last_name: data.last_name,
      base_skills: data.base_skills,
    },
    "Superpowers & Location": {
      superpowers: data.superpowers,
      city: data.city,
      country: data.country ? `${getCountryName(data.country)} (${data.country})` : undefined,
      full_address: data.full_address,
      skill_tags: data.skill_tags,
      rate: data.rate_amount ? `${data.rate_currency} ${data.rate_amount}` : undefined,
    },
    Portfolio: {
      links: (data.portfolio_links || []).filter((l: string) => !!l),
    },
    Verification: {
      phone_number: data.phone_number,
      id_type: data.id_type,
    },
    About: {
      short_description: data.short_description,
      availability: data.availability,
      languages: data.languages,
    },
  };

  return (
    <div>
      <h4 className="mb-3">Final Review</h4>
      <p className="mb-4">Please review your information carefully before submitting.</p>
      {Object.entries(sections).map(([title, values]) => (
        <div key={title} className="mb-3">
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

      {/* Terms and Privacy Policy Checkboxes */}
      <div className="col-12 mt-4">
        {/* Terms and Conditions */}
        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="me-2"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="terms-checkbox" style={{ cursor: 'pointer' }}>
            I accept the <a href="https://makemyvid.io/terms-condition" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>Terms and Conditions</a>
            <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
          </label>
        </div>

        {/* Privacy Policy */}
        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="privacy-checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="me-2"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="privacy-checkbox" style={{ cursor: 'pointer' }}>
            I accept the <a href="https://makemyvid.io/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>Privacy Policy</a>
            <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
          </label>
        </div>
      </div>

      <div className="row">
        <div className="col-6">
          <button type="button" className="btn-one w-100 mt-30" onClick={prevStep}>
            Previous
          </button>
        </div>
        <div className="col-6">
          <button
            type="button"
            className="btn-one w-100 mt-30"
            onClick={handleSubmit}
            disabled={!termsAccepted || !privacyAccepted}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideographerFinalReview;

// Add disabled button styling
if (typeof document !== 'undefined') {
  const styleId = 'videographer-final-review-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .btn-one:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }
}