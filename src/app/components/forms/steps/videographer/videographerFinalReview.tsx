"use client";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void> | void;
};

const videographerFinalReview: React.FC<Props> = ({ formData, prevStep, handleRegister }) => {
  const data = formData as any;

  const handleSubmit = async () => {
    const loadingToast = toast.loading('Submitting registration...');
    try {
      const fd = new FormData();

      // Basic Information (required)
      fd.append('username', data.username || '');
      fd.append('first_name', data.first_name || data.full_name?.split(' ')?.[0] || '');
      fd.append('last_name', data.last_name || data.full_name?.split(' ')?.slice(1).join(' ') || '');
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

      // Contact & Location (always included for videographer)
      if (data.phone_number) fd.append('phone_number', data.phone_number);
      if (data.city) fd.append('city', data.city);
      if (data.country) fd.append('country', data.country);
      if (data.coordinates?.lat || data.coordinates?.lng) {
        fd.append('street_address', `${data.coordinates?.lat || ''},${data.coordinates?.lng || ''}`);
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
      // Assuming 'role' will be set to 'videographer' in previous steps
      if (data.role) fd.append('role', data.role);
      if (Array.isArray(data.superpowers)) fd.append('superpowers', JSON.stringify(data.superpowers));
      if (Array.isArray(data.skill_tags)) fd.append('skill_tags', JSON.stringify(data.skill_tags));

      // Submit
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
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
      role: data.role, // This will reflect 'videographer' if set in form data
      full_name: data.full_name,
      base_skills: data.base_skills,
    },
    "Superpowers & Location": {
      superpowers: data.superpowers,
      // Removed the conditional check `data.role === "videographer"` as this component is specifically for videographers
      city: data.city,
      country: data.country,
      coordinates: `${data.coordinates?.lat || ""}${data.coordinates?.lat && data.coordinates?.lng ? ", " : ""}${data.coordinates?.lng || ""}`,
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
              .filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)) // Also filter empty arrays
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

export default videographerFinalReview;