"use client";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void> | void;
};

const FreelancerFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState<boolean>(false);
  const data = formData as any;

  const handleSubmit = async () => {
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
      fd.append('username', data.first_name || '');
      fd.append('first_name', data.first_name || '');
      fd.append('last_name', data.last_name || '');
      fd.append('email', data.email || '');
      fd.append('password', data.password || '');
      fd.append('account_type', 'freelancer');

      // Skills from Step 1 (base_skills) + tags as skills
      const skills: string[] = Array.isArray(data.base_skills) ? data.base_skills : [];
      fd.append('skills', JSON.stringify(skills));

      // Experience (optional in our flow)
      if (data.experience_level) fd.append('experience_level', data.experience_level);

      // Portfolio (YouTube only) - send as comma or JSON
      const portfolioLinks: string[] = (data.portfolio_links || []).filter((l: string) => !!l);
      if (portfolioLinks.length > 0) fd.append('portfolio_links', JSON.stringify(portfolioLinks));

      // Rate
      if (data.rate_amount) fd.append('hourly_rate', String(data.rate_amount));

      // Contact & Location (from Step 3, Step 2 videographer location)
      if (data.phone_number) fd.append('phone_number', data.phone_number);
      if (data.city) fd.append('city', data.city);
      if (data.country) fd.append('country', data.country);
      if (data.coordinates?.lat || data.coordinates?.lng) {
        fd.append('latitude', String(data.coordinates?.lat || ''));
        fd.append('longitude', String(data.coordinates?.lng || ''));
      }

      // ID Verification
      if (data.id_type) fd.append('id_type', data.id_type);
      if (data.id_document) {
        // accept File or array
        const file = Array.isArray(data.id_document) ? data.id_document[0] : data.id_document;
        if (file) fd.append('id_document', file as File);
      }

      // Profile photo upload
      if (data.profile_photo) {
        fd.append('profile_picture', data.profile_photo as File);
      }

      // Work Preferences
      if (data.availability) fd.append('availability', data.availability);
      if (Array.isArray(data.languages) && data.languages.length > 0) {
        fd.append('languages', JSON.stringify(data.languages));
      }

      // Extra: Save role/superpowers/tags for server-side mapping if needed
      if (data.role) fd.append('role', data.role);
      if (Array.isArray(data.superpowers)) fd.append('superpowers', JSON.stringify(data.superpowers));
      if (Array.isArray(data.skill_tags)) fd.append('skill_tags', JSON.stringify(data.skill_tags));

      // Submit
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/videoeditor`, {
        method: 'POST',
        headers: {
          'x-test-mode': 'true',
        },
        body: fd,
      });

      const respData = await response.json();
      if (!response.ok) {
        throw new Error(respData.message || 'Registration failed');
      }

      await handleRegister(respData);
      toast.success('Registration completed successfully!', { id: loadingToast });
    } catch (error: any) {
      console.error('Registration error:', error);
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
      city: data.role === "videographer" ? data.city : undefined,
      country: data.role === "videographer" && data.country
        ? `${data.country} (${data.country})`
        : undefined,
      coordinates:
        data.role === "videographer"
          ? `${data.coordinates?.lat || ""}, ${data.coordinates?.lng || ""}`
          : undefined,
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
      <Toaster position="top-right" />
      <h4 className="mb-3">Final Review</h4>
      <p className="mb-4">Please review your information carefully before submitting.</p>
      {Object.entries(sections).map(([title, values]) => (
        <div key={title} className="mb-3">
          <h5 className="mb-2">{title}</h5>
          <div className="p-3 border rounded">
            {Object.entries(values)
              .filter(([, v]) => v !== undefined && v !== null && v !== "")
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
            I accept the <a href="http://localhost:3000/terms-condition" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
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
            I accept the <a href="http://localhost:3000/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
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
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerFinalReview;


