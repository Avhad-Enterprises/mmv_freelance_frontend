"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "@/app/components/common/error-msg";
import toast from "react-hot-toast";
import Link from "next/link";

type IFormData = { email: string };

const schema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format").label("Email"),
});

const ForgotPasswordArea = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: IFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/password-reset-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailSent(true);
        reset();
        toast.success("If the email exists, a password reset link has been sent");
      } else {
        toast.error(result.message || "Failed to send reset email");
      }
    } catch (error: any) {
      console.error("Error requesting password reset:", error);
      toast.error("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="form-wrapper m-auto">
            <div className="text-center">
              <h2>Forgot Password</h2>
              <p className="fs-20 color-dark">
                {emailSent
                  ? "Check your email for password reset instructions"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-40 lg-mt-30">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                      <label>Email*</label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        name="email"
                      />
                      <div className="help-block with-errors">
                        <ErrorMsg msg={errors.email?.message!} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-eleven fw-500 tran3s d-block mt-20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center mt-40">
                <div className="success-message mb-30">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3">Email Sent!</h4>
                  <p className="color-dark">
                    We've sent a password reset link to your email address.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <button
                  onClick={() => setEmailSent(false)}
                  className="btn-eleven fw-500 tran3s d-block mt-20"
                >
                  Send Another Email
                </button>
              </div>
            )}

            <p className="text-center mt-30">
              Remember your password?{" "}
              <Link href="/" className="color-dark">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordArea;