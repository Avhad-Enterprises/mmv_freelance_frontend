import React from "react";

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
  const sections = {
    "Basic Information": {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    },
    "Professional Details": {
      profile_title: formData.profile_title,
      technical_skills: formData.technical_skills,
      software_skills: formData.software_skills,
      editor_proficiency: formData.editor_proficiency,
      videographer_proficiency: formData.videographer_proficiency,
      content_types: formData.content_types,
      experience_level: formData.experience_level,
      portfolio_links: formData.portfolio_links,
      hourly_rate: `$${formData.hourly_rate}/hr`,
    },
    "Contact Details": {
      phone_number: formData.phone_number,
      location: formData.location,
      country: formData.country,
    },
    "Work Preferences": {
      availability: formData.availability,
      work_type: formData.work_type,
      hours_per_week: formData.hours_per_week,
      timezone: formData.timezone,
      languages: formData.languages,
    },
    "Payment Information": {
      payment_method: formData.payment_method,
      account_name: formData.account_name,
      bank_name: formData.bank_name,
      account_number: "****" + formData.account_number?.slice(-4),
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
            onClick={() => handleRegister(formData)}
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