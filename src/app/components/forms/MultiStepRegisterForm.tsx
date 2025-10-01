// "use client";
// import React, { useState, useEffect } from "react";
// import Step1 from "./steps/Step1";
// import Step2 from "./steps/Step2";
// import Step3 from "./steps/Step3";
// import Step4 from "./steps/Step4";
// import FinalReview from "./steps/FinalReview";


// // Freelancer-specific new steps
// import FreelancerStep1 from "./steps/FreelancerStep1";
// import FreelancerStep2 from "./steps/FreelancerStep2";
// import FreelancerStep3 from "./steps/FreelancerStep3";
// import FreelancerStep4 from "./steps/FreelancerStep4";
// import FreelancerFinalReview from "./steps/FreelancerFinalReview";
// import ClientStep1 from "./steps/client/ClientStep1";
// import ClientStep2 from "./steps/client/ClientStep2";
// import ClientStep3 from "./steps/client/ClientStep3";
// import ClientStep4 from "./steps/client/ClientStep4";
// import ClientFinalReview from "./steps/client/ClientFinalReview";

// interface MultiStepRegisterFormProps {
//   accountType: "client" | "freelancer";
// }

// const MultiStepRegisterForm: React.FC<MultiStepRegisterFormProps> = ({ accountType }) => {
//   const [step, setStep] = useState(1);
//   const [previousAccountType, setPreviousAccountType] = useState(accountType);

//   const initialFormState = {
//     // Common fields
//     username: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     phone_number: "",
//     location: "",
//     country: "",
//     id_type: "",
//     id_document: "",
//     account_type: accountType,

//     // Freelancer specific
//     ...(accountType === "freelancer" && {
//       // Step 1
//       role: "",
//       full_name: "",
//       base_skills: [] as string[],
//       // Step 2
//       superpowers: [] as string[],
//       city: "",
//       coordinates: { lat: "", lng: "" } as { lat: string; lng: string },
//       skill_tags: [] as string[],
//       portfolio_links: ["", "", ""] as string[],
//       rate_amount: "",
//       rate_currency: "INR",
//       // Step 3
//       profile_photo: null as any,
//       // Step 4
//       short_description: "",
//       availability: "",
//       languages: [] as string[],
//     }),

//     // Client specific
//     ...(accountType === "client" && {
//       company_name: "",
//       industry: "",
//       website: "",
//       social_links: [] as string[],
//       company_size: "",
//       services_required: [] as string[],
//       budget_range: "",
//       tax_id: "",
//       address: "",
//       city: "",
//       state: "",
//       pincode: "",
//       otp: "",
//       profile_logo: null as any,
//       work_arrangement: "",
//       project_frequency: "",
//       hiring_preferences: [] as string[],
//       expected_start_date: "",
//       project_duration: "",
//       payment_method: "",
//       account_name: "",
//       bank_name: "",
//       account_number: "",
//       paypal_email: "",
//       upi_id: "",
//       card_number: "",
//       card_expiry: "",
//     }),
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const setFormDataWrapper = (updater: (prev: any) => any) => setFormData((prev: any) => updater(prev));

//   // Reset when accountType changes mid-way
//   useEffect(() => {
//     if (previousAccountType !== accountType && step > 1) {
//       setStep(1);
//       setFormData({
//         ...initialFormState,
//         account_type: accountType,
//       });
//     }
//     setPreviousAccountType(accountType);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [accountType]);

//   const nextStep = (data: Partial<typeof formData>) => {
//     setFormData((prev) => ({ ...prev, ...data }));
//     setStep((prevStep) => prevStep + 1);
//   };

//   const prevStep = () => {
//     setStep((prevStep) => prevStep - 1);
//   };

//   const handleRegister = async (data: typeof formData) => {
//     try {
//       console.log("Form submitted:", data);
//       // API call for registration can go here
//     } catch (error) {
//       console.error("Registration error:", error);
//     }
//   };

//   const renderStep = () => {
//     if (accountType === "freelancer") {
//       // New freelancer flow using dedicated step files
//       switch (step) {
//         case 1:
//           return <FreelancerStep1 formData={formData} setFormData={setFormDataWrapper} nextStep={nextStep} />;
//         case 2:
//           return <FreelancerStep2 formData={formData} setFormData={setFormDataWrapper} nextStep={nextStep} prevStep={prevStep} />;
//         case 3:
//           return <FreelancerStep3 formData={formData} setFormData={setFormDataWrapper} nextStep={nextStep} prevStep={prevStep} />;
//         case 4:
//           return <FreelancerStep4 formData={formData} setFormData={setFormDataWrapper} nextStep={nextStep} prevStep={prevStep} />;
//         case 5:
//           return <FreelancerFinalReview formData={formData} prevStep={prevStep} handleRegister={handleRegister} />;
//         default:
//           return <FreelancerStep1 formData={formData} setFormData={setFormDataWrapper} nextStep={nextStep} />;
//       }
//     } else {
//       switch (step) {
//         case 1:
//           return <ClientStep1 nextStep={nextStep} formData={formData} />;
//         case 2:
//           return <ClientStep2 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
//         case 3:
//           return <ClientStep3 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
//         case 4:
//           return <ClientStep4 nextStep={nextStep} prevStep={prevStep} formData={formData} />;
//         case 5:
//           return (
//             <ClientFinalReview
//               formData={formData}
//               prevStep={prevStep}
//               handleRegister={handleRegister}
//             />
//           );
//         default:
//           return <ClientStep1 nextStep={nextStep} formData={formData} />;
//       }
//     }
//   };

//   const totalSteps = 5;

//   return (
//     <div className="multi-step-form">
//       {/* Progress bar */}
//       <div className="progress-bar mb-4">
//         <div
//           className="progress"
//           style={{
//             width: `${(step / totalSteps) * 100}%`,
//           }}
//         ></div>
//       </div>

//       {/* Step indicators */}
//       <div className="steps-indicator mb-4">
//         <div className="d-flex justify-content-between">
//           {Array.from({ length: totalSteps }).map((_, index) => (
//             <div
//               key={index}
//               className={`step-circle ${step > index ? "completed" : ""} ${
//                 step === index + 1 ? "active" : ""
//               }`}
//             >
//               {index + 1}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Form steps */}
//       {renderStep()}

//       <style jsx>{`
//         .progress-bar {
//           width: 100%;
//           height: 4px;
//           background-color: #e0e0e0;
//           border-radius: 2px;
//           overflow: hidden;
//         }
//         .progress {
//           height: 100%;
//           background-color: #007bff;
//           transition: width 0.3s ease;
//         }
//         .steps-indicator {
//           padding: 0 20px;
//         }
//         .step-circle {
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           background-color: #e0e0e0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//         }
//         .step-circle.completed {
//           background-color: #28a745;
//           color: white;
//         }
//         .step-circle.active {
//           background-color: #007bff;
//           color: white;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MultiStepRegisterForm;





"use client";
import React, { useState, useEffect } from "react";

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

// Define a common interface for fields that appear across different account types
interface FormDataCommon {
  username: string;
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
  first_name: string;
  last_name: string;
  full_name: string;
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
  // No location details as per prompt for video editors
}

export interface VideographerFormData extends FormDataCommon, FreelancerCommonFields {
  account_type: "videographer";
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
  profile_logo: File | null;
  work_arrangement: "Remote" | "On-site" | "Hybrid" | "";
  project_frequency: "One-time" | "Occasional" | "Ongoing" | "";
  hiring_preferences: string[]; // Changed to string[] as per ClientStep4 use
  budget_min: number; // Added as per ClientStep2
  budget_max: number; // Added as per ClientStep2
  required_skills: string[]; // Added as per ClientStep2
  required_services: string[]; // Added as per ClientStep2
  required_editor_proficiencies: string[]; // Added as per ClientStep2
  required_videographer_proficiencies: string[]; // Added as per ClientStep2
  expected_start_date: string; // Added as per ClientStep4
  project_duration: string; // Added as per ClientStep4
  payment_method: string; // Added as per ClientStep5
  card_number: string; // Added as per ClientStep5
  card_expiry: string; // Added as per ClientStep5
  card_cvv: string; // Added as per ClientStep5
  paypal_email: string; // Added as per ClientStep5
  upi_id: string; // Added as per ClientStep5
  account_name: string; // Added as per ClientStep5
  bank_name: string; // Added as per ClientStep5
  account_number: string; // Added as per ClientStep5
  swift_iban: string; // Added as per ClientStep5
  business_documents: File[] | null; // Added as per ClientStep3
  tax_id: string; // Added as per ClientStep3
  city: string; // Added to ClientFormData for consistency with ClientStep3
  country: string; // Added to ClientFormData for consistency with ClientStep3
}

export type AllFormData = VideoEditorFormData | VideographerFormData | ClientFormData;

// =========================================================
// Prop Interfaces for Child Step Components
// (These need to be imported and used in your individual step files!)
// =========================================================

// Helper types for functions to pass specific formData types
export type SetFormData<T extends AllFormData> = (updater: (prev: T) => T) => void;
export type NextStep<T extends AllFormData> = (data: Partial<T>) => void;
export type HandleRegister<T extends AllFormData> = (data: T) => Promise<void>;

export type PrevStep = () => void;

// Common structure for step props used by freelancer steps
type FreelancerStepComponentProps<T extends AllFormData> = {
  formData: T;
  setFormData: SetFormData<T>;
  nextStep: NextStep<T>;
  prevStep: PrevStep;
};

// Client Steps (using react-hook-form, so props are different)
export interface ClientStepProps {
  nextStep: (data: any) => void;
  formData: any;
  prevStep?: () => void; // Optional for step 1
}

export interface ClientFinalReviewProps {
  formData: ClientFormData;
  prevStep: PrevStep;
  handleRegister: HandleRegister<ClientFormData>;
}

// Video Editor Steps
export interface VideoEditorStep1Props extends Omit<FreelancerStepComponentProps<VideoEditorFormData>, 'prevStep'> {}
export interface VideoEditorStep2Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorStep3Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorStep4Props extends FreelancerStepComponentProps<VideoEditorFormData> {}
export interface VideoEditorFinalReviewProps extends Pick<FreelancerStepComponentProps<VideoEditorFormData>, 'formData' | 'prevStep'> {
  handleRegister: HandleRegister<VideoEditorFormData>;
}

// Videographer Steps
export interface VideographerStep1Props extends Omit<FreelancerStepComponentProps<VideographerFormData>, 'prevStep'> {}
export interface VideographerStep2Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerStep3Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerStep4Props extends FreelancerStepComponentProps<VideographerFormData> {}
export interface VideographerFinalReviewProps extends Pick<FreelancerStepComponentProps<VideographerFormData>, 'formData' | 'prevStep'> {
  handleRegister: HandleRegister<VideographerFormData>;
}

// =========================================================
// Data for selectable skills and superpowers
// =========================================================

export const VIDEOGRAPHER_BASE_SKILLS = [
  "Photography", "Lighting Setup", "Sound Recording", "Camera Operation", "Grip Equipment",
  "Drone Piloting", "Storyboarding", "Directing", "Editing Fundamentals", "Color Correction",
  "Motion Graphics Basic", "Interview Skills", "Live Event Coverage", "Project Management", "Client Communication"
];

export const videoEditor_BASE_SKILLS = [
  "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve", "After Effects", "Audition",
  "Video Compression", "Sound Design", "Color Grading", "Motion Graphics", "VFX Basic",
  "Storytelling", "Pacing", "Script Editing", "Content Strategy", "Platform Optimization"
];

export const VIDEOGRAPHER_SUPERPOWERS = [
  "Reels & Short-Form Video", "Podcast Videography", "Smartphone & Mobile-First Videography",
  "Wedding Films", "Corporate Interviews & Testimonials", "Live-Streaming & Multi-Cam Operator",
  "Product & E-commerce Videography", "Fashion & Beauty Cinematography", "Real Estate & Architecture Videography",
  "Aerial / Drone Operation", "Business & Industrial Videography (Corporate AV, Factory Shoot, Trade Shows)",
  "Commercials & Ad Films (Digital & Broadcast)", "Music Videos & Live Performance Coverage",
  "Documentary & Narrative Storytelling", "Event & Conference Coverage", "360º / VR Videography",
  "Food & Beverage Videography", "Travel & Lifestyle Videography", "Educational & Explainer Videos"
];

export const videoEditor_SUPERPOWERS = [
  "YouTube Content Editing", "Short-Form & Social Media Ads", "Podcast & Interview Editing",
  "Wedding & Personal Event Films", "Generative AI Video Editing", "Gaming Video Editing",
  "Corporate & Brand Videos", "Documentary & Narrative Editing", "Event Highlight Reels",
  "Music Video Editing", "Motion Graphics & Explainer Videos", "VFX & Compositing",
  "Color Grading & Finishing", "Educational & eLearning Content", "Real Estate & Architectural Videos",
  "Sports Highlights & Analysis", "Movie Trailers & Sizzle Reels"
];

// =========================================================
// Main Component
// =========================================================

const MultiStepRegisterForm: React.FC<MultiStepRegisterFormProps> = ({ accountType }) => {
  const [step, setStep] = useState(1);
  const [previousAccountType, setPreviousAccountType] = useState(accountType);

  const getInitialFormState = (currentAccountType: MultiStepRegisterFormProps['accountType']): AllFormData => {
    // Base common fields for all account types
    const baseCommon: FormDataCommon = {
      username: "",
      email: "",
      password: "",
      phone_number: "",
      id_type: "",
      id_document: null,
      profile_photo: null,
      otp: "",
      short_description: "",
      account_type: currentAccountType, // Will be overridden by specific type assertion
    };

    // Freelancer common fields (used by both videoEditor and videographer)
    const freelancerCommon: Omit<FreelancerCommonFields, 'full_name'> = { // full_name will be derived or set
      first_name: "",
      last_name: "",
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
        full_name: "", // Initial empty, can be set from first/last name later
      } as VideoEditorFormData;
    } else if (currentAccountType === "videographer") {
      return {
        ...baseCommon,
        ...freelancerCommon,
        account_type: "videographer",
        full_name: "", // Initial empty, can be set from first/last name later
        city: "", // Specific to videographer
        country: "", // Specific to videographer
        coordinates: { lat: "", lng: "" }, // Specific to videographer
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
        profile_logo: null,
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
        business_documents: null,
        tax_id: "",
        city: "", // Added
        country: "", // Added
      } as ClientFormData;
    }
  };

  const [formData, setFormData] = useState<AllFormData>(getInitialFormState(accountType));

  // Reset form data if account type changes
  useEffect(() => {
    if (accountType !== previousAccountType) {
      setFormData(getInitialFormState(accountType));
      setStep(1);
      setPreviousAccountType(accountType);
    }
  }, [accountType, previousAccountType]);


  // Wrapper for setFormData to safely update the *specific* type of formData
  const setFormDataWrapper = <T extends AllFormData>(updater: (prev: T) => T) => {
    setFormData(prev => updater(prev as T));
  };

  // Advances to the next step, updating form data
  const nextStep = <T extends AllFormData>(data: Partial<T>) => {
    setFormData((prev: AllFormData) => ({ ...prev, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  // Goes back to the previous step
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Handles the final registration submission
  const handleRegister = async <T extends AllFormData>(data: T) => {
    try {
      console.log("Form submitted:", data);
      // TODO: Implement actual API call for registration here
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Renders the current step component based on accountType and step number
  const renderStep = () => {
    switch (accountType) {
      case "videoEditor":
        const veFormData = formData as VideoEditorFormData;
        const veSetFormData = setFormDataWrapper as SetFormData<VideoEditorFormData>;
        const veNextStep = nextStep as NextStep<VideoEditorFormData>;
        const veHandleRegister = handleRegister as HandleRegister<VideoEditorFormData>;

        switch (step) {
          case 1:
            return <VideoEditorStep1 formData={veFormData} setFormData={veSetFormData} nextStep={veNextStep} />;
          case 2:
            return <VideoEditorStep2 formData={veFormData} setFormData={veSetFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 3:
            return <VideoEditorStep3 formData={veFormData} setFormData={veSetFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 4:
            return <VideoEditorStep4 formData={veFormData} setFormData={veSetFormData} nextStep={veNextStep} prevStep={prevStep} />;
          case 5:
            return <VideoEditorFinalReview formData={veFormData} prevStep={prevStep} handleRegister={veHandleRegister} />;
          default:
            return <VideoEditorStep1 formData={veFormData} setFormData={veSetFormData} nextStep={veNextStep} />;
        }
      case "videographer":
        const vgFormData = formData as VideographerFormData;
        const vgSetFormData = setFormDataWrapper as SetFormData<VideographerFormData>;
        const vgNextStep = nextStep as NextStep<VideographerFormData>;
        const vgHandleRegister = handleRegister as HandleRegister<VideographerFormData>;

        switch (step) {
          case 1:
            return <VideographerStep1 formData={vgFormData} setFormData={vgSetFormData} nextStep={vgNextStep} />;
          case 2:
            return <VideographerStep2 formData={vgFormData} setFormData={vgSetFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 3:
            return <VideographerStep3 formData={vgFormData} setFormData={vgSetFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 4:
            return <VideographerStep4 formData={vgFormData} setFormData={vgSetFormData} nextStep={vgNextStep} prevStep={prevStep} />;
          case 5:
            return <VideographerFinalReview formData={vgFormData} prevStep={prevStep} handleRegister={vgHandleRegister} />;
          default:
            return <VideographerStep1 formData={vgFormData} setFormData={vgSetFormData} nextStep={vgNextStep} />;
        }
      case "client":
        const clientFormData = formData as ClientFormData;
        const clientNextStep = nextStep as NextStep<ClientFormData>;
        const clientHandleRegister = handleRegister as HandleRegister<ClientFormData>;

        switch (step) {
          case 1:
            // ClientStep1 only expects `nextStep` and `formData`
            return <ClientStep1 nextStep={clientNextStep} formData={clientFormData} />;
          case 2:
            // ClientStep2 expects `nextStep`, `prevStep`, and `formData`
            return <ClientStep2 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 3:
            // ClientStep3 expects `nextStep`, `prevStep`, and `formData`
            return <ClientStep3 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 4:
            // ClientStep4 expects `nextStep`, `prevStep`, and `formData`
            return <ClientStep4 nextStep={clientNextStep} prevStep={prevStep} formData={clientFormData} />;
          case 5:
            return (
              <ClientFinalReview
                formData={clientFormData}
                prevStep={prevStep}
                handleRegister={clientHandleRegister}
              />
            );
          default:
            return <ClientStep1 nextStep={clientNextStep} formData={clientFormData} />;
        }
      default:
        return <div>Invalid account type selected.</div>;
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