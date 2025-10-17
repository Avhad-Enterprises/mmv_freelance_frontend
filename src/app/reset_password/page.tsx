"use client";
import React, { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ErrorMsg from "../components/common/error-msg";
import { makePostRequest } from "@/utils/api";

type IResetFormData = {
  password: string;
  confirmPassword: string;
};

const resetResolver: Resolver<IResetFormData> = async (values) => {
  const errors: any = {};
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required.",
    };
  } else if (!strongPasswordRegex.test(values.password)) {
    errors.password = {
      type: "pattern",
      message:
        "Password must be at least 8 chars, include uppercase, lowercase, number & special character.",
    };
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = {
      type: "required",
      message: "Confirm password is required.",
    };
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = {
      type: "validate",
      message: "Passwords do not match.",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IResetFormData>({ resolver: resetResolver });

  const onSubmit = async (data: IResetFormData) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      await makePostRequest("users/reset-password", {
        token,
        password: data.password,
      });
      toast.success("Password reset successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="auth-card bg-white shadow rounded p-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          <div className="row">
            {/* New Password */}
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>New Password*</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="styled-input"
                  {...register("password")}
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.password?.message || ""} />
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Confirm Password*</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="styled-input"
                  {...register("confirmPassword")}
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.confirmPassword?.message || ""} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <button
                type="submit"
                className="btn-eleven fw-500 tran3s d-block mt-20 w-100"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .styled-input {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 16px;
          height: 50px;
          transition: all 0.3s ease;
        }
        .styled-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          outline: none;
        }
        label {
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 15px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordForm;
