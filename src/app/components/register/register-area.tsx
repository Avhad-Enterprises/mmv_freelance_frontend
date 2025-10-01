// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import MultiStepRegisterForm from "../forms/MultiStepRegisterForm";
// import LoadingSpinner from "../common/loading-spinner";
// import google from "@/assets/images/icon/google.png";
// import facebook from "@/assets/images/icon/facebook.png";

// const RegisterArea = () => {
//   const [activeTab, setActiveTab] = useState<"candidate" | "employer">("candidate");
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
//       <div className="container">
//         <div className="user-data-form">
//           <div className="text-center">
//             <h2>Create Account</h2>
//           </div>
//           <div className="form-wrapper m-auto">
//             <ul className="nav nav-tabs border-0 w-100 mt-30" role="tablist">
//               <li className="nav-item" role="presentation">
//                 <button
//                   className={`nav-link ${activeTab === "candidate" ? "active" : ""}`}
//                   onClick={() => setActiveTab("candidate")}
//                   data-bs-toggle="tab"
//                   data-bs-target="#fc1"
//                   role="tab"
//                   aria-selected={activeTab === "candidate"}
//                   tabIndex={-1}
//                 >
//                   Freelancer
//                 </button>
//               </li>
//               <li className="nav-item" role="presentation">
//                 <button
//                   className={`nav-link ${activeTab === "employer" ? "active" : ""}`}
//                   onClick={() => setActiveTab("employer")}
//                   data-bs-toggle="tab"
//                   data-bs-target="#fc2"
//                   role="tab"
//                   aria-selected={activeTab === "employer"}
//                   tabIndex={-1}
//                 >
//                   Client
//                 </button>
//               </li>
//             </ul>
//             <div className="tab-content mt-40">
//               <MultiStepRegisterForm accountType={activeTab === "candidate" ? "freelancer" : "client"} />
//             </div>
//           </div>

//           <div className="d-flex align-items-center mt-30 mb-10">
//             <div className="line"></div>
//             <span className="pe-3 ps-3">OR</span>
//             <div className="line"></div>
//           </div>
//           <div className="row">
//             <div className="col-sm-6">
//               <a
//                 href="coming-soon"
//                 className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
//               >
//                 <Image src={google} alt="google-img" />
//                 <span className="ps-2">Signup with Google</span>
//               </a>
//             </div>
//             <div className="col-sm-6">
//               <a
//                 href="coming-soon"
//                 className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
//               >
//                 <Image src={facebook} alt="facebook-img" />
//                 <span className="ps-2">Signup with Facebook</span>
//               </a>
//             </div>
//           </div>
//           <p className="text-center mt-10">
//             Have an account?{" "}
//             <a
//               href="#"
//               className="fw-500"
//               data-bs-toggle="modal"
//               data-bs-target="#loginModal"
//             >
//               Sign In
//             </a>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RegisterArea;



"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import MultiStepRegisterForm from "../forms/MultiStepRegisterForm";
import LoadingSpinner from "../common/loading-spinner";
import google from "@/assets/images/icon/google.png";
import facebook from "@/assets/images/icon/facebook.png";

type AccountType = "videoEditor" | "videographer" | "client";

// Define a unique class name prefix to avoid conflicts
const CLASS_PREFIX = "register-role-btn";

// Generate the CSS rules as a string
const customButtonCss = `
  .${CLASS_PREFIX} {
    min-width: 120px;
    margin: 0 5px;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
    outline: none;
    box-shadow: none;

    /* Inactive state styles */
    background-color: transparent;
    color: #6B7280; /* Neutral grey text */
    border: 1px solid #D1D5DB; /* Light grey border */
  }

  .${CLASS_PREFIX}:hover {
    color: #1f413a; /* Dark green text on hover */
    background-color: rgba(31, 65, 58, 0.1); /* Light green background tint on hover */
    border-color: #1f413a; /* Dark green border on hover */
  }

  .${CLASS_PREFIX}.active-green {
    /* Active state styles - your dark green */
    background-color: #1f413a;
    color: #ffffff;
    border-color: #1f413a;
  }

  .${CLASS_PREFIX}.active-green:hover,
  .${CLASS_PREFIX}.active-green:focus {
    background-color: #2a584e; /* Slightly darker green on hover/focus */
    border-color: #2a584e;
    color: #ffffff;
    box-shadow: 0 0 0 0.25rem rgba(31, 65, 58, 0.5); /* Custom focus ring color */
  }

  /* Ensure no default Bootstrap focus/active outline if 'btn' class is still used elsewhere */
  .${CLASS_PREFIX}:focus,
  .${CLASS_PREFIX}.focus {
    outline: none !important;
    box-shadow: none !important; /* Or a custom one as defined above */
  }
`;

const RegisterArea = () => {
  const [activeTab, setActiveTab] = useState<AccountType>("videoEditor");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Effect to inject the custom CSS into the document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customButtonCss;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []); // Empty dependency array means this runs once on mount and unmount

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Helper function to render a role button
  const renderRoleButton = (role: AccountType, label: string) => (
    <button
      // Apply our custom class for base styling and conditional class for active state
      className={`${CLASS_PREFIX} ${activeTab === role ? "active-green" : ""}`}
      onClick={() => setActiveTab(role)}
    >
      {label}
    </button>
  );

  return (
    <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="text-center">
            <h2>Create Account</h2>
          </div>
          <div className="form-wrapper m-auto">
            <div
              className="d-flex justify-content-center align-items-center mt-30"
              style={{ flexWrap: 'nowrap' }} // Explicitly prevent wrapping
            >
              {renderRoleButton("videoEditor", "Video Editor")}
              {renderRoleButton("videographer", "Videographer")}
              {renderRoleButton("client", "Client")}
            </div>

            <div className="tab-content mt-40">
              <MultiStepRegisterForm accountType={activeTab} />
            </div>
          </div>

          <div className="d-flex align-items-center mt-30 mb-10">
            <div className="line"></div>
            <span className="pe-3 ps-3">OR</span>
            <div className="line"></div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <a
                href="coming-soon"
                className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
              >
                <Image src={google} alt="google-img" />
                <span className="ps-2">Signup with Google</span>
              </a>
            </div>
            <div className="col-sm-6">
              <a
                href="coming-soon"
                className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
              >
                <Image src={facebook} alt="facebook-img" />
                <span className="ps-2">Signup with Facebook</span>
              </a>
            </div>
          </div>
          <p className="text-center mt-10">
            Have an account?{" "}
            <a
              href="#"
              className="fw-500"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterArea;