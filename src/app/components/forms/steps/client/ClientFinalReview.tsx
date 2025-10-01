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

const ClientFinalReview: React.FC<{
  formData: any;
  prevStep: () => void;
  handleRegister: (data: any) => Promise<void>;
}> = ({
  formData,
  prevStep,
  handleRegister
}) => {
  const handleSubmitRegistration = async () => {
    console.log(formData);
    const loadingToast = toast.loading('Submitting registration...');
    try {
      // Create FormData for potential file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      formDataToSend.append('username', formData.username);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('account_type', 'client');
      
      // Company Information
      if (formData.company_name) formDataToSend.append('company_name', formData.company_name);
      if (formData.industry) formDataToSend.append('industry', formData.industry);
      if (formData.website) formDataToSend.append('website', formData.website);
      if (formData.social_links) formDataToSend.append('social_links', formData.social_links);
      if (formData.company_size) formDataToSend.append('company_size', formData.company_size);
      
      // Transform services_required to required_services - ensure it's an array with at least 1 element
      const requiredServices = Array.isArray(formData.services_required) && formData.services_required.length > 0 
        ? formData.services_required 
        : (formData.services_required ? [formData.services_required] : ['General Services']);
      formDataToSend.append('required_services', JSON.stringify(requiredServices));
      
      // Budget fields
      if (formData.budget_min) formDataToSend.append('budget_min', formData.budget_min.toString());
      if (formData.budget_max) formDataToSend.append('budget_max', formData.budget_max.toString());
      
      // Contact Details
      if (formData.phone_number) formDataToSend.append('phone_number', formData.phone_number);
      if (formData.address) formDataToSend.append('address', formData.address);
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.country) formDataToSend.append('country', formData.country);
      if (formData.pincode) formDataToSend.append('pincode', formData.pincode);
      if (formData.tax_id) formDataToSend.append('tax_id', formData.tax_id);
      
      // Work Preferences
      if (formData.work_arrangement) formDataToSend.append('work_arrangement', formData.work_arrangement);
      if (formData.project_frequency) formDataToSend.append('project_frequency', formData.project_frequency);
      if (formData.hiring_preferences) formDataToSend.append('hiring_preferences', formData.hiring_preferences);
      if (formData.expected_start_date) formDataToSend.append('expected_start_date', formData.expected_start_date);
      if (formData.project_duration) formDataToSend.append('project_duration', formData.project_duration);
      
      // Additional client fields - ensure they're arrays with at least 1 element
      const requiredSkills = Array.isArray(formData.required_skills) && formData.required_skills.length > 0 
        ? formData.required_skills 
        : (formData.required_skills ? [formData.required_skills] : ['General Skills']);
      formDataToSend.append('required_skills', JSON.stringify(requiredSkills));
      
      if (formData.required_editor_proficiencies && Array.isArray(formData.required_editor_proficiencies) && formData.required_editor_proficiencies.length > 0) {
        formDataToSend.append('required_editor_proficiencies', JSON.stringify(formData.required_editor_proficiencies));
      }
      
      if (formData.required_videographer_proficiencies && Array.isArray(formData.required_videographer_proficiencies) && formData.required_videographer_proficiencies.length > 0) {
        formDataToSend.append('required_videographer_proficiencies', JSON.stringify(formData.required_videographer_proficiencies));
      }
      
      // Add file uploads if they exist (for business documents)
      if (formData.business_documents && formData.business_documents.length > 0) {
        formData.business_documents.forEach((file: File) => {
          formDataToSend.append('business_documents', file);
        });
      }

      // Debug: Log the form data being sent
      console.log('Client form data being sent:');
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
    "Company Information": {
      company_name: formData.company_name,
      industry: formData.industry,
      website: formData.website,
      social_links: formData.social_links,
      company_size: formData.company_size,
      services_required: formData.services_required,
      budget_min: formData.budget_min,
      budget_max: formData.budget_max,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      pincode: formData.pincode,
      tax_id: formData.tax_id || "Not provided",
    },
    "Work Preferences": {
      work_arrangement: formData.work_arrangement,
      project_frequency: formData.project_frequency,
      hiring_preferences: formData.hiring_preferences,
      expected_start_date: formData.expected_start_date || "Flexible",
      project_duration: formData.project_duration || "Flexible",
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
            onClick={handleSubmitRegistration}
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

export default ClientFinalReview;