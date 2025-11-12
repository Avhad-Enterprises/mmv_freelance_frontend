"use client";
import React from "react";
import toast from "react-hot-toast";
import { Country } from "country-state-city";
import { VideoEditorFormData } from "../../MultiStepRegisterForm";

// Define the FormData interface for type safety
interface FormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  base_skills?: string[];
  experience_level?: string;
  portfolio_links?: string[];
  rate_amount?: number;
  rate_currency?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  country?: string;
  pincode?: string;
  coordinates?: { lat: number; lng: number };
  id_type?: string;
  id_document?: File | File[] | null;
  profile_photo?: File | null;
  availability?: string;
  languages?: string[];
  short_description?: string;
  role?: string;
  superpowers?: string[];
  skill_tags?: string[];
}

type Props = {
  formData: VideoEditorFormData;
  prevStep: () => void;
  handleRegister: (data: VideoEditorFormData) => Promise<void>;
};

const getCountryName = (isoCode: string): string => {
  const country = Country.getAllCountries().find(c => c.isoCode === isoCode);
  return country ? country.name : isoCode;
};

const VideoEditorFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState<boolean>(false);
  
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
  
      fd.append('first_name', formData.first_name || '');
      fd.append('last_name', formData.last_name || '');
      fd.append('profile_title', `${formData.first_name || ''} ${formData.last_name || ''}`.trim());
      fd.append('email', formData.email || '');
      fd.append('password', formData.password || '');
      fd.append('account_type', 'videoEditor');      
      const skills: string[] = Array.isArray(formData.base_skills) ? formData.base_skills : [];
      fd.append('skills', JSON.stringify(skills));

      if (formData.experience_level) fd.append('experience_level', formData.experience_level);

      const portfolioLinks: string[] = (formData.portfolio_links || []).filter((l: string) => !!l);
      if (portfolioLinks.length > 0) fd.append('portfolio_links', JSON.stringify(portfolioLinks));
      
      if (formData.rate_amount) fd.append('rate_amount', String(formData.rate_amount));

      if (formData.phone_number) fd.append('phone_number', formData.phone_number);
      if (formData.address) fd.append('street_address', formData.address);
      if (formData.city) fd.append('city', formData.city);
      if (formData.country) fd.append('country', formData.country);
      if (formData.pincode) fd.append('pincode', formData.pincode);

      if (formData.coordinates && formData.coordinates.lat && formData.coordinates.lng) {
        fd.append('latitude', String(formData.coordinates.lat));
        fd.append('longitude', String(formData.coordinates.lng));
      }

      if (formData.id_type) fd.append('id_type', formData.id_type);
      if (formData.id_document) {
        const file = Array.isArray(formData.id_document) ? formData.id_document[0] : formData.id_document;
        if (file) fd.append('id_document', file);
      }

      if (formData.profile_photo) {
        fd.append('profile_photo', formData.profile_photo);
      }

      if (formData.availability) fd.append('availability', formData.availability);
      if (Array.isArray(formData.languages) && formData.languages.length > 0) {
        fd.append('languages', JSON.stringify(formData.languages));
      }
      if (formData.short_description) fd.append('short_description', formData.short_description);

      if (formData.role) fd.append('role', formData.role);
      if (Array.isArray(formData.superpowers)) fd.append('superpowers', JSON.stringify(formData.superpowers));
      if (Array.isArray(formData.skill_tags)) fd.append('skill_tags', JSON.stringify(formData.skill_tags));

      fd.append('terms_accepted', String(termsAccepted));
      fd.append('privacy_policy_accepted', String(privacyAccepted));

      // Debug: Log all form data being sent
      console.log('=== VIDEO EDITOR REGISTRATION PAYLOAD ===');
      for (let [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.log('=========================================');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register/videoeditor`, {
        method: 'POST',
        headers: {
          'x-test-mode': 'true',
        },
        body: fd,
      });

      const respData = await response.json();
      console.log('API Response:', respData);
      
      if (!response.ok) {
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

  const sections: Record<string, Record<string, string | string[] | undefined>> = {
    Basic: {
      role: formData.role,
      first_name: formData.first_name,
      last_name: formData.last_name,
      base_skills: formData.base_skills,
    },
    "Superpowers & Location": {
      superpowers: formData.superpowers,
      address: formData.address,
      city: formData.city,
      country: formData.country ? `${getCountryName(formData.country)} (${formData.country})` : undefined,
      pincode: formData.pincode,
      skill_tags: formData.skill_tags,
      rate: formData.rate_amount ? `${formData.rate_currency} ${formData.rate_amount}` : undefined,
    },
    Portfolio: {
      links: (formData.portfolio_links || []).filter((l: string) => !!l),
    },
    Verification: {
      phone_number: formData.phone_number,
      id_type: formData.id_type,
    },
    About: {
      short_description: formData.short_description,
      availability: formData.availability,
      languages: formData.languages,
    },
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

      {/* --- REVISED CHECKBOX SECTION --- */}
      <div className="col-12 mt-4">
        {/* Terms and Conditions */}
        <div className="d-flex align-items-center mb-3">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="me-2"
            style={{ width: '20px', height: '20px', cursor: 'pointer' }} // Changed size here
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
            style={{ width: '20px', height: '20px', cursor: 'pointer' }} // Changed size here
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
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorFinalReview;