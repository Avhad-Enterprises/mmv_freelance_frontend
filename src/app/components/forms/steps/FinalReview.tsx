import React from "react";
import toast from "react-hot-toast";

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
                ? value.length > 0 ? value.join(', ') : ''
                : value != null ? value.toString() : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FinalReview: React.FC<{ 
  formData: any; 
  prevStep: () => void; 
  handleRegister: (data: any) => Promise<void>;
}> = ({ 
  formData, 
  prevStep, 
  handleRegister 
}) => {
  const handleSubmit = async () => {
    const loadingToast = toast.loading('Submitting registration...');
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      formDataToSend.append('username', formData.username);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('account_type', 'freelancer');
      
      // Professional Details
      if (formData.profile_title) formDataToSend.append('profile_title', formData.profile_title);
      
      // Skills - ensure it's an array with at least 1 element
      const skills = Array.isArray(formData.technical_skills) && formData.technical_skills.length > 0 
        ? formData.technical_skills 
        : (formData.technical_skills ? [formData.technical_skills] : ['General Skills']);
      formDataToSend.append('skills', JSON.stringify(skills));
      
      if (formData.experience_level) formDataToSend.append('experience_level', formData.experience_level);
      if (formData.portfolio_links) formDataToSend.append('portfolio_links', formData.portfolio_links);
      if (formData.hourly_rate) formDataToSend.append('hourly_rate', formData.hourly_rate.toString());
      
      // Contact & Location
      if (formData.phone_number) formDataToSend.append('phone_number', formData.phone_number);
      if (formData.location || formData.street_address) formDataToSend.append('street_address', formData.location || formData.street_address);
      if (formData.country) formDataToSend.append('country', formData.country);
      if (formData.state) formDataToSend.append('state', formData.state);
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.zip_code) formDataToSend.append('zip_code', formData.zip_code);
      if (formData.id_type) formDataToSend.append('id_type', formData.id_type);
      
      // Work Preferences
      if (formData.availability) formDataToSend.append('availability', formData.availability);
      
      // Send hours_per_week as string enum values per API documentation
      if (formData.hours_per_week) {
        formDataToSend.append('hours_per_week', formData.hours_per_week);
      }
      
      if (formData.work_type) formDataToSend.append('work_type', formData.work_type);
      
      // Languages - ensure it's an array with at least 1 element
      const languages = Array.isArray(formData.languages) && formData.languages.length > 0 
        ? formData.languages 
        : (formData.languages ? [formData.languages] : ['English']);
      formDataToSend.append('languages', JSON.stringify(languages));
      
      // Add file uploads if they exist
      if (formData.id_document && formData.id_document.length > 0) {
        formDataToSend.append('id_document', formData.id_document[0]);
      }

      // Debug: Log the form data being sent
      console.log('Form data being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'x-test-mode': 'true', // Bypass rate limiting during development
          // Don't set Content-Type header - let browser set it with boundary for FormData
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
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    },
    "Professional Details": {
      profile_title: formData.profile_title,
      skills: formData.technical_skills,
      experience_level: formData.experience_level,
      portfolio_links: formData.portfolio_links,
      hourly_rate: `$${formData.hourly_rate}/hr`,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      street_address: formData.location || formData.street_address,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      zip_code: formData.zip_code,
      id_type: formData.id_type,
    },
    "Work Preferences": {
      availability: formData.availability,
      work_type: formData.work_type,
      hours_per_week: formData.hours_per_week, // Keep original string value for display
      languages: formData.languages,
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

        {/* Navigation Buttons */}
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
            onClick={handleSubmit}
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
      `}</style>
    </div>
  );
};

export default FinalReview;