"use client";
import React, { useState, useEffect } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import FinalReview from "./steps/FinalReview";
import ClientStep1 from "./steps/client/ClientStep1";
import ClientStep2 from "./steps/client/ClientStep2";
import ClientStep3 from "./steps/client/ClientStep3";
import ClientStep4 from "./steps/client/ClientStep4";
import ClientFinalReview from "./steps/client/ClientFinalReview";

interface MultiStepRegisterFormProps {
  accountType: "client" | "freelancer";
}

const MultiStepRegisterForm: React.FC<MultiStepRegisterFormProps> = ({ accountType }) => {
  const [step, setStep] = useState(1);
  const [previousAccountType, setPreviousAccountType] = useState(accountType);

  const initialFormState = {
    // Common fields
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    location: "",
    country: "",
    id_type: "",
    id_document: "",
    account_type: accountType,

    // Freelancer specific
    ...(accountType === "freelancer" && {
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
      availability: "",
      work_type: "",
      hours_per_week: "",
      timezone: "",
      languages: [] as string[],
    }),

    // Client specific
    ...(accountType === "client" && {
      company_name: "",
      industry: "",
      website: "",
      social_links: [] as string[],
      company_size: "",
      services_required: [] as string[],
      budget_range: "",
      tax_id: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      work_arrangement: "",
      project_frequency: "",
      hiring_preferences: [] as string[],
      expected_start_date: "",
      project_duration: "",
      payment_method: "",
      account_name: "",
      bank_name: "",
      account_number: "",
      paypal_email: "",
      upi_id: "",
      card_number: "",
      card_expiry: "",
    }),
  };

  const [formData, setFormData] = useState(initialFormState);

  // Reset when accountType changes mid-way
  useEffect(() => {
    if (previousAccountType !== accountType && step > 1) {
      setStep(1);
      setFormData({
        ...initialFormState,
        account_type: accountType,
      });
    }
    setPreviousAccountType(accountType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountType]);

  const nextStep = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleRegister = async (data: typeof formData) => {
    try {
      console.log("Form submitted:", data);
      // API call for registration can go here
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const renderStep = () => {
    if (accountType === "freelancer") {
      switch (step) {
        case 1:
          return <Step1 nextStep={nextStep} formData={formData} />;
        case 2:
          return <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 3:
          return <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 4:
          return <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 5:
          return (
            <FinalReview
              formData={formData}
              prevStep={prevStep}
              handleRegister={handleRegister}
            />
          );
        default:
          return <Step1 nextStep={nextStep} formData={formData} />;
      }
    } else {
      switch (step) {
        case 1:
          return <ClientStep1 nextStep={nextStep} formData={formData} />;
        case 2:
          return <ClientStep2 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 3:
          return <ClientStep3 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 4:
          return <ClientStep4 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
        case 5:
          return (
            <ClientFinalReview
              formData={formData}
              prevStep={prevStep}
              handleRegister={handleRegister}
            />
          );
        default:
          return <ClientStep1 nextStep={nextStep} formData={formData} />;
      }
    }
  };

  const totalSteps = 5;

  return (
    <div className="multi-step-form">
      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div
          className="progress"
          style={{
            width: `${(step / totalSteps) * 100}%`,
          }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="steps-indicator mb-4">
        <div className="d-flex justify-content-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
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
