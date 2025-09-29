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
    const loadingToast = toast.loading('Submitting registration...');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          account_type: 'client',
        }),
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
      budget_range: formData.budget_range,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      city: formData.city,
      country: formData.country,
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