// "use client";
// import React, { useEffect } from "react";
// import dynamic from "next/dynamic";
// import Header from "@/layouts/headers/header";
// import Wrapper from "@/layouts/wrapper";
// import CompanyBreadcrumb from "../components/common/common-breadcrumb";
// import FooterOne from "@/layouts/footers/footer-one";
// import RegisterArea from "../components/register/register-area";

// const PageTitle = "Register";

// const RegisterPage = () => {
//   useEffect(() => {
//     // Cleanup any lingering modal-backdrop elements and modal-open class
//     const removeBackdropsAndModalOpen = () => {
//       const backdrops = document.querySelectorAll(".modal-backdrop");
//       backdrops.forEach((backdrop) => backdrop.remove());

//       document.body.classList.remove("modal-open"); // Remove modal-open class
//       document.body.style.overflow = ""; // Reset overflow style
//     };

//     removeBackdropsAndModalOpen();

//     // Optional: Clean up on unmount
//     return () => removeBackdropsAndModalOpen();
//   }, []);

//   return (
//     <Wrapper>
//       <div className="main-page-wrapper">
//         {/* header start */}
//         <Header />
//         {/* header end */}

//         {/*breadcrumb start */}
//         <CompanyBreadcrumb
//           title="Register"
//           subtitle="Create an account & Start posting or hiring talents"
//         />
//         {/*breadcrumb end */}

//         {/* register area start */}
//         <RegisterArea/>
//         {/* register area end */}

//         {/* footer start */}
//         <FooterOne />
//         {/* footer end */}
//       </div>
//     </Wrapper>
//   );
// };

// export default RegisterPage;



"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import FooterOne from "@/layouts/footers/footer-one";
import RegisterArea from "../components/register/register-area";

const PageTitle = "Register";

const RegisterPage = () => {
  useEffect(() => {
    const removeBackdropsAndModalOpen = () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };

    removeBackdropsAndModalOpen();
    return () => removeBackdropsAndModalOpen();
  }, []);

  return (
    <Wrapper>
      <div className="paddingTop: '1rem'">
        <Header />
        <RegisterArea />
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default RegisterPage;