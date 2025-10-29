"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMsg from "@/app/components/common/error-msg";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type IFormData = { newPassword: string; confirmPassword: string };

const schema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters")
    .label("New Password"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .label("Confirm Password"),
});

const ResetPasswordArea = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passwordReset, setPasswordReset] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [tokenValid, setTokenValid] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token from URL query parameters
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setTokenValid(false);
      toast.error("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: IFormData) => {
    if (isSubmitting || !tokenValid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPasswordReset(true);
        reset();
        toast.success("Password reset successfully! You can now log in with your new password.");

        // Redirect to login page after a delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenValid) {
    return (
      <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="container">
          <div className="user-data-form">
            <div className="form-wrapper m-auto">
              <div className="text-center">
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '3rem' }}></i>
                <h2 className="mt-3">Invalid Reset Link</h2>
                <p className="fs-20 color-dark">
                  This password reset link is invalid or has expired.
                  Please request a new password reset.
                </p>
                <div className="mt-30">
                  <Link href="/forgot-password" className="btn-eleven fw-500 tran3s d-block">
                    Request New Reset Link
                  </Link>
                </div>
                <p className="text-center mt-30">
                  <Link href="/" className="color-dark">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="container">
        <div className="user-data-form">
          <div className="form-wrapper m-auto">
            <div className="text-center">
              <h2>Reset Your Password</h2>
              <p className="fs-20 color-dark">
                {passwordReset
                  ? "Your password has been reset successfully"
                  : "Enter your new password below"
                }
              </p>
            </div>

            {!passwordReset ? (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-40 lg-mt-30">
                <div className="row">
                  <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                      <label>New Password*</label>
                      <input
                        type="password"
                        placeholder="Enter new password (min 6 characters)"
                        {...register("newPassword")}
                        name="newPassword"
                      />
                      <div className="help-block with-errors">
                        <ErrorMsg msg={errors.newPassword?.message!} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                      <label>Confirm New Password*</label>
                      <input
                        type="password"
                        placeholder="Confirm your new password"
                        {...register("confirmPassword")}
                        name="confirmPassword"
                      />
                      <div className="help-block with-errors">
                        <ErrorMsg msg={errors.confirmPassword?.message!} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-eleven fw-500 tran3s d-block mt-20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Resetting Password..." : "Reset Password"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center mt-40">
                <div className="success-message mb-30">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3">Password Reset Successful!</h4>
                  <p className="color-dark">
                    Your password has been changed successfully.
                    You will be redirected to the login page shortly.
                  </p>
                </div>
                <p className="mt-30">
                  <Link href="/" className="btn-eleven fw-500 tran3s d-block">
                    Go to Login
                  </Link>
                </p>
              </div>
            )}

            <p className="text-center mt-30">
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

export default ResetPasswordArea;