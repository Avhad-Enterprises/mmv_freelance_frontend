"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Client-specific steps
import ClientStep1 from "./steps/client/ClientStep1";
import ClientStep2 from "./steps/client/ClientStep2";
import ClientStep3 from "./steps/client/ClientStep3";
import ClientStep4 from "./steps/client/ClientStep4";
import ClientFinalReview from "./steps/client/ClientFinalReview";

// Video Editor specific steps
import VideoEditorStep1 from "./steps/videoEditor/videoEditorStep1";
import VideoEditorStep2 from "./steps/videoEditor/videoEditorStep2";
import VideoEditorStep3 from "./steps/videoEditor/videoEditorStep3";
import VideoEditorStep4 from "./steps/videoEditor/videoEditorStep4";
import VideoEditorFinalReview from "./steps/videoEditor/videoEditorFinalReview";

// Videographer specific steps
import VideographerStep1 from "./steps/videographer/videographerStep1";
import VideographerStep2 from "./steps/videographer/videographerStep2";
import VideographerStep3 from "./steps/videographer/videographerStep3";
import VideographerStep4 from "./steps/videographer/videographerStep4";
import VideographerFinalReview from "./steps/videographer/videographerFinalReview";

// =========================================================
// Type Definitions
// =========================================================

export interface MultiStepRegisterFormProps {
  accountType: "client" | "videoEditor" | "videographer";
}

// Common interface for fields that appear across different account types
interface FormDataCommon {
  full_name: string; // Changed from username
  email: string;
  password: string;
  phone_number: string;
  id_type: string;
  id_document: File | null;
  profile_photo: File | null;
  otp: string;
  short_description: string;
  account_type: MultiStepRegisterFormProps['accountType'];
}

interface FreelancerCommonFields {
  base_skills: string[];
  superpowers: string[];
  skill_tags: string[];
  portfolio_links: string[];
  rate_amount: string;
  rate_currency: string;
  availability: "Part-time" | "Full-time" | "Flexible" | "On-Demand" | "";
  languages: string[];
}

export interface VideoEditorFormData extends FormDataCommon, FreelancerCommonFields {
  account_type: "videoEditor";
  address: string; // Added
  city: string; // Added
  country: string; // Added
  pincode: string; // Added
  coordinates: { lat: string; lng: string }; // Added
}

export interface VideographerFormData extends FormDataCommon, FreelancerCommonFields {
  account_type: "videographer";
  address: string; // Added
  city: string;
  country: string;
  coordinates: { lat: string; lng: string };
}

export interface ClientFormData extends FormDataCommon {
  account_type: "client";
  company_name: string;
  industry: string;
  website: string;
  social_links: string[];
  company_size: "1-10" | "11-50" | "51-200" | "200+" | "";
  services_required: string[];
  address: string;
  state: string;
  pincode: string;
  profile_photo: File | null;
  work_arrangement: "Remote" | "On-site" | "Hybrid" | "";
  project_frequency: "One-time" | "Occasional" | "Ongoing" | "";
  hiring_preferences: string[];
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  required_services: string[];
  required_editor_proficiencies: string[];
  required_videographer_proficiencies: string[];
  expected_start_date: string;
  project_duration: string;
  payment_method: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  paypal_email: string;
  upi_id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  swift_iban: string;
  business_document: File | null;
  tax_id: string;
  city: string;
  country: string;
  coordinates: { lat: string; lng: string };
}

export type AllFormData = VideoEditorFormData | VideographerFormData | ClientFormData;

// =========================================================
// Prop Interfaces for Child Step Components
// =========================================================

export type SetFormData<T extends AllFormData> = (updater: (prev: T) => T) => void;
export type NextStep<T extends AllFormData> = (data: Partial<T>) => void;
export type HandleRegister<T extends AllFormData> = (data: T) => Promise<void>;
export type PrevStep = () => void;

type FreelancerStepComponentProps<T extends AllFormData> = {
  formData: T;
  setFormData: SetFormData<T>;
  nextStep: NextStep<T>;
  prevStep: PrevStep;
};

export interface ClientStepProps {
  nextStep: (data: any) => void;
  formData: any;
  prevStep?: () => void;
}

export interface ClientFinalReviewProps {
  formData: ClientFormData;
  prevStep: PrevStep;
  handleRegister: HandleRegister<ClientFormData>;
}

export interface VideoEditorStep1Props extends Omit<FreelancerStepComponentProps<VideoEditorFormData>, 'prevStep'> {}
export interface VideoEditorStep2Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorStep3Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorStep4Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorFinalReviewProps extends Pick<FreelancerStepComponentProps<VideoEditorFormData>, 'formData' | 'prevStep'> {
  handleRegister: HandleRegister<VideoEditorFormData>;
}

export interface VideographerStep1Props extends Omit<FreelancerStepComponentProps<VideographerFormData>, 'prevStep'> {}
export interface VideographerStep2Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerStep3Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerStep4Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerFinalReviewProps extends Pick<FreelancerStepComponentProps<VideographerFormData>, 'formData' | 'prevStep'> {
  handleRegister: HandleRegister<VideographerFormData>;
}

// =========================================================
// Main Component
// =========================================================

const MultiStepRegisterForm: React.FC<MultiStepRegisterFormProps> = ({ accountType }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  const [previousAccountType, setPreviousAccountType] = useState(accountType);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const getInitialFormState = (currentAccountType: MultiStepRegisterFormProps['accountType']): AllFormData => {
    const baseCommon: Omit<FormDataCommon, 'account_type'> = {
      full_name: "", // Changed from username
      email: "",
      password: "",
      phone_number: "",
      id_type: "",
      id_document: null,
      profile_photo: null,
      otp: "",
      short_description: "",
    };

    const freelancerCommon: FreelancerCommonFields = {
      base_skills: [],
      superpowers: [],
      skill_tags: [],
      portfolio_links: ["", "", ""],
      rate_amount: "",
      rate_currency: "INR",
      availability: "",
      languages: [],
    };

    if (currentAccountType === "videoEditor") {
      return {
        ...baseCommon,
        ...freelancerCommon,
        account_type: "videoEditor",
        address: "", // Added
        city: "", // Added
        country: "", // Added
        pincode: "", // Added
        coordinates: { lat: "", lng: "" }, // Added
      } as VideoEditorFormData;
    } else if (currentAccountType === "videographer") {
      return {
        ...baseCommon,
        ...freelancerCommon,
        account_type: "videographer",
        address: "", // Added
        city: "",
        country: "",
        coordinates: { lat: "", lng: "" },
      } as VideographerFormData;
    } else { // client
      return {
        ...baseCommon,
        account_type: "client",
        company_name: "",
        industry: "",
        website: "",
        social_links: [],
        company_size: "",
        services_required: [],
        address: "",
        state: "",
        pincode: "",
        profile_photo: null,
        work_arrangement: "",
        project_frequency: "",
        hiring_preferences: [],
        budget_min: 0,
        budget_max: 0,
        required_skills: [],
        required_services: [],
        required_editor_proficiencies: [],
        required_videographer_proficiencies: [],
        expected_start_date: "",
        project_duration: "",
        payment_method: "",
        card_number: "",
        card_expiry: "",
        card_cvv: "",
        paypal_email: "",
        upi_id: "",
        account_name: "",
        bank_name: "",
        account_number: "",
        swift_iban: "",
        business_document: null,
        tax_id: "",
        city: "",
        country: "",
        coordinates: { lat: "", lng: "" },
      } as ClientFormData;
    }
  };

  const [formData, setFormData] = useState<AllFormData>(getInitialFormState(accountType));

  useEffect(() => {
    if (accountType !== previousAccountType) {
      setFormData(getInitialFormState(accountType));
      setStep(1);
      setVisitedSteps(new Set([1]));
      setPreviousAccountType(accountType);
    }
  }, [accountType, previousAccountType]);

  const setFormDataWrapper = <T extends AllFormData>(updater: (prev: T) => T) => {
    setFormData(prev => updater(prev as T));
  };

  const nextStep = <T extends AllFormData>(data: Partial<T>) => {
    setFormData((prev: AllFormData) => ({ ...prev, ...data }));
    setStep((prevStep) => {
      const newStep = prevStep + 1;
      setVisitedSteps(prev => new Set([...prev, newStep]));
      return newStep;
    });
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (targetStep: number) => {
    // Allow going to any step that has been visited
    if (visitedSteps.has(targetStep)) {
      setStep(targetStep);
    }
  };

  const handleRegister = async <T extends AllFormData>(data: T) => {
    try {
      console.log("Form submitted:", data);
      setTimeout(() => {
        router.push("/?login=true");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const renderStep = () => {
    switch (accountType) {
      case "videoEditor":
        const veFormData = formData as VideoEditorFormData;
        const veSetFormData = setFormDataWrapper as SetFormData<VideoEditorFormData>;
        const veNextStep = nextStep as NextStep<VideoEditorFormData>;
        const veHandleRegister = handleRegister as HandleRegister<VideoEditorFormData>;

        switch (step) {
          case 1: return <VideoEditorStep1 formData={veFormData} nextStep={veNextStep} />;
          case 2: return <VideoEditorStep2 formData={veFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 3: return <VideoEditorStep3 formData={veFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 4: return <VideoEditorStep4 formData={veFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 5: return <VideoEditorFinalReview formData={veFormData} prevStep={prevStep} handleRegister={veHandleRegister} />;
          default: return <VideoEditorStep1 formData={veFormData} nextStep={veNextStep} />;
        }
      case "videographer":
        const vgFormData = formData as VideographerFormData;
        const vgSetFormData = setFormDataWrapper as SetFormData<VideographerFormData>;
        const vgNextStep = nextStep as NextStep<VideographerFormData>;
        const vgHandleRegister = handleRegister as HandleRegister<VideographerFormData>;

        switch (step) {
          case 1: return <VideographerStep1 formData={vgFormData} nextStep={vgNextStep} />;
          case 2: return <VideographerStep2 formData={vgFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 3: return <VideographerStep3 formData={vgFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 4: return <VideographerStep4 formData={vgFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 5: return <VideographerFinalReview formData={vgFormData} prevStep={prevStep} handleRegister={vgHandleRegister} />;
          default: return <VideographerStep1 formData={vgFormData} nextStep={vgNextStep} />;
        }
      case "client":
        const clientFormData = formData as ClientFormData;
        const clientNextStep = nextStep as NextStep<ClientFormData>;
        const clientHandleRegister = handleRegister as HandleRegister<ClientFormData>;

        switch (step) {
          case 1: return <ClientStep1 nextStep={clientNextStep} formData={clientFormData} />;
          case 2: return <ClientStep2 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 3: return <ClientStep3 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 4: return <ClientStep4 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 5: return <ClientFinalReview formData={clientFormData} prevStep={prevStep} handleRegister={clientHandleRegister} />;
          default: return <ClientStep1 nextStep={clientNextStep} formData={clientFormData} />;
        }
      default:
        return <div>Invalid account type selected.</div>;
    }
  };

  const totalSteps = 5;

  return (
    <div className="multi-step-form">
      <div className="progress-bar mb-4">
        <div className="progress" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>
      <div className="steps-indicator mb-4">
        <div className="d-flex justify-content-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`step-circle ${visitedSteps.has(index + 1) ? "completed" : ""} ${step === index + 1 ? "active" : ""} ${visitedSteps.has(index + 1) ? "clickable" : ""}`}
              onClick={() => handleStepClick(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
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
        .step-circle.clickable {
          cursor: pointer;
        }
        .step-circle.clickable:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default MultiStepRegisterForm;
