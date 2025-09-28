"use client";
import React, { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import FinalReview from "./steps/FinalReview";

interface MultiStepRegisterFormProps {
  accountType: "client" | "freelancer";
}

const MultiStepRegisterForm: React.FC<MultiStepRegisterFormProps> = ({ accountType }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 data
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    // Step 2 data (for freelancer)
    profile_title: "",
    category: "",
    technical_skills: [] as string[],
    software_skills: [] as string[],
    content_types: [] as string[],
    editor_proficiency: [] as string[],
    videographer_proficiency: [] as string[],
    experience_level: "",
    portfolio_links: "",
    hourly_rate: "",
    // Step 3 data
    phone_number: "",
    location: "",
    country: "",
    id_type: "",
    id_document: "",
    // Step 4 data
    availability: "",
    work_type: "",
    hours_per_week: "",
    timezone: "",
    languages: [] as string[],
    // Additional fields
    account_type: accountType,
  });

  // Removed skill management state since we're using MultipleSelectionField

  const nextStep = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleRegister = async (data: any) => {
    try {
      // Implement your registration logic here
      console.log("Form submitted:", data);
      // You can make an API call here to register the user
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Functions for skill management
  // Removed old skill management functions since we're using MultipleSelectionField

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} formData={formData} />;
      case 2:
        return accountType === "freelancer" ? (
          <Step2
            nextStep={nextStep}
            prevStep={prevStep}
            formData={formData}
            // Using MultipleSelectionField instead of manual skill management
          />
        ) : (
          <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} />
        );
      case 3:
        return accountType === "freelancer" ? (
          <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} />
        ) : (
          <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} />
        );
      case 4:
        return accountType === "freelancer" ? (
          <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} />
        ) : (
          <FinalReview
            formData={formData}
            prevStep={prevStep}
            handleRegister={handleRegister}
          />
        );
      case 5:
        return accountType === "freelancer" ? (
          <FinalReview
            formData={formData}
            prevStep={prevStep}
            handleRegister={handleRegister}
          />
        ) : null;
      default:
        return <Step1 nextStep={nextStep} formData={formData} />;
    }
  };

  return (
    <div className="multi-step-form">
      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div
          className="progress"
          style={{
            width: `${(step / (accountType === "freelancer" ? 5 : 4)) * 100}%`,
          }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="steps-indicator mb-4">
        <div className="d-flex justify-content-between">
          {Array.from({ length: accountType === "freelancer" ? 5 : 4 }).map((_, index) => (
            <div
              key={index}
              className={`step-circle ${step > index ? "completed" : ""} ${
                step === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Form steps */}
      {renderStep()}

      <style jsx>{`
        .progress-bar {
          width: 100%;
          height: 4px;
          background-color: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background-color: #007bff;
          transition: width 0.3s ease;
        }
        .steps-indicator {
          padding: 0 20px;
        }
        .step-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .step-circle.completed {
          background-color: #28a745;
          color: white;
        }
        .step-circle.active {
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default MultiStepRegisterForm;
