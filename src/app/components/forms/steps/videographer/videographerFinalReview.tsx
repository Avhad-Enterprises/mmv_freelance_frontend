"use client";
import React from "react";
import toast from "react-hot-toast";
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
  const data = formData as any;

  const handleSubmit = async () => {
    const loadingToast = toast.loading('Submitting registration...');
    try {
      const fd = new FormData();

      // Basic Information (required)
      fd.append('full_name', data.full_name || '');
      fd.append('profile_title', data.full_name || ''); // Use full_name for profile title
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
      if (data.phone_number) fd.append('phone_number', data.phone_number);
      if (data.city) fd.append('city', data.city);
      if (data.country) fd.append('country', data.country);
      if (data.full_address) {
        fd.append('full_address', data.full_address);
      }
      
      // *** FIX: Append latitude and longitude from Step 3 ***
      if (data.coordinates && data.coordinates.lat && data.coordinates.lng) {
        fd.append('latitude', String(data.coordinates.lat));
        fd.append('longitude', String(data.coordinates.lng));
      }

      // ID Verification
      if (data.id_type) fd.append('id_type', data.id_type);
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
      if (data.short_description) fd.append('short_description', data.short_description);

      // Extra fields
      if (data.role) fd.append('role', data.role);
      if (Array.isArray(data.superpowers)) fd.append('superpowers', JSON.stringify(data.superpowers));
      if (Array.isArray(data.skill_tags)) fd.append('skill_tags', JSON.stringify(data.skill_tags));

      // Submit
      const response = await fetch('http://localhost:8000/api/v1/auth/register/videographer', {
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
      full_name: data.full_name,
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

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>
          Previous
        </button>
        <button
          type="button"
          className="btn-one"
          onClick={handleSubmit}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
};

export default VideographerFinalReview;