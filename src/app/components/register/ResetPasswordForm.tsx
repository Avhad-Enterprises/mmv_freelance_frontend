"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  isLoading: boolean;
};

const ResetPasswordForm: React.FC<Props> = ({ formData, nextStep, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password field for comparison
  const newPassword = watch("newPassword");

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Token Field */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Reset Token*</label>
            <input
              type="text"
              placeholder="Enter the token from your email"
              className="form-control"
              {...register("token", { required: "Token is required" })}
            />
            {errors.token && (
              <div className="error" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {String(errors.token.message)}
              </div>
            )}
          </div>
        </div>

        {/* New Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>New Password*</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              className="form-control"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                },
                validate: {
                  hasUppercase: (value) => /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
                  hasLowercase: (value) => /[a-z]/.test(value) || "Must contain at least one lowercase letter",
                  hasNumber: (value) => /[0-9]/.test(value) || "Must contain at least one number",
                  hasSpecial: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Must contain at least one special character (!@#$%^&*)"
                }
              })}
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '44px',
                cursor: 'pointer'
              }}
            >
              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
            {errors.newPassword && (
              <div className="error" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {String(errors.newPassword.message)}
              </div>
            )}
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Confirm New Password*</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="form-control"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === newPassword || "Passwords do not match"
              })}
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '44px',
                cursor: 'pointer'
              }}
            >
              <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
            {errors.confirmPassword && (
              <div className="error" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {String(errors.confirmPassword.message)}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn-one tran3s w-100 mt-30"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResetPasswordForm;