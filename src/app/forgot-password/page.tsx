"use client";
import React, { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ErrorMsg from "../components/common/error-msg";
import { makePostRequest } from "@/utils/api";

type IForgotFormData = {
  email: string;
};

const emailResolver: Resolver<IForgotFormData> = async (values) => {
  const errors: any = {};
  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required.",
    };
  }
  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

const SendResetLinkForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForgotFormData>({ resolver: emailResolver });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IForgotFormData) => {
    setLoading(true);
    try {
      await makePostRequest("users/forgot-password", data);
      toast.success("Check your registered email for the reset link.");
      alert("Reset link sent successfully!"); // 👈 ab direct yahi pe alert
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
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
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Email Address*</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  {...register("email")}
                  className="form-control styled-input"
                />
                <div className="help-block with-errors">
                  <ErrorMsg msg={errors.email?.message || ""} />
                </div>
              </div>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn-eleven fw-500 tran3s d-block mt-20 w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .styled-input {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        .styled-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          outline: none;
        }
        label {
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default SendResetLinkForm;
