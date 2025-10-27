"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ForgotPasswordForm from "./ForgotPasswordForm"; // Step 1 Form
import ResetPasswordForm from "./ResetPasswordForm"; // Step 2 Form

// API base URL from your project
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

const ForgotPasswordArea: React.FC = () => {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for a token in the URL on page load
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // If token exists, pre-fill it and jump to the reset step
      setFormData({ token: token });
      setStep("reset");
    }
  }, [searchParams]);

  // Step 1: Handle the initial email request
  const handleRequestSubmit = async (data: { email: string }) => {
    setLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      const response = await fetch(`${API_URL}/users/password-reset-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      const result = await response.json();
      toast.dismiss(toastId);

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset link");
      }

      // Per your API, always show success to prevent email enumeration
      toast.success(result.message || "If the email exists, a link has been sent.");
      setFormData({ email: data.email });
      setStep("reset"); // Move to the next step

    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle the final password reset
  const handleResetSubmit = async (data: any) => {
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    const { token, newPassword, confirmPassword } = data;

    try {
      const response = await fetch(`${API_URL}/users/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });

      const result = await response.json();
      toast.dismiss(toastId);

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      toast.success(result.message || "Password reset successfully!");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login"); // Adjust your login route
      }, 2000);

    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="registration-section pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 m-auto">
            <div className="form-wrapper-one">
              <div className="title-area text-center mb-50 lg-mb-40">
                <h2>
                  {step === 'request' ? 'Forgot Password?' : 'Set New Password'}
                </h2>
                <p className="fs-20 tx-dark">
                  {step === 'request'
                    ? 'Enter your email to get a reset link.'
                    : 'Enter the token from your email and a new password.'}
                </p>
              </div>

              {/* Render the correct form based on the step */}
              {step === "request" ? (
                <ForgotPasswordForm 
                  formData={formData} 
                  nextStep={handleRequestSubmit} 
                  isLoading={loading}
                />
              ) : (
                <ResetPasswordForm 
                  formData={formData} 
                  nextStep={handleResetSubmit} 
                  isLoading={loading}
                />
              )}

              {/* Back to login link */}
              <div className="d-flex align-items-center justify-content-center mt-30">
                <p className="fs-16 tx-dark m0">
                  Remember your password?{' '}
                  <a href="/login" className="fw-500 tx-dark">
                    Login
                  </a>
                </p>
              </div>

              {/* Button to switch back to request form */}
              {step === "reset" && (
                <div className="text-center mt-20">
                  <button 
                    onClick={() => setStep("request")}
                    className="btn-link"
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
                  >
                    Send token again?
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordArea;