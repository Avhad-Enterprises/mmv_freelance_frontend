"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
};

const ClientStep1: React.FC<Props> = ({ formData, nextStep }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch 
  } = useForm({ 
    defaultValues: formData,
    mode: 'onChange' // Real-time validation
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password field for comparison
  const password = watch("password");

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* First Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>First Name*</label>
            <input 
              type="text" 
              placeholder="Enter your first name" 
              className="form-control" 
              {...register("first_name", { required: "First Name is required" })}
            />
            {errors.first_name && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.first_name.message)}
              </div>
            )}
          </div>
        </div>

        {/* Last Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Last Name*</label>
            <input 
              type="text" 
              placeholder="Enter your last name" 
              className="form-control" 
              {...register("last_name", { required: "Last Name is required" })}
            />
            {errors.last_name && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.last_name.message)}
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input 
              type="email" 
              placeholder="james@example.com" 
              className="form-control"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.email.message)}
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Password*</label>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password" 
              className="form-control"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            <span 
              className="placeholder_icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '80%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            >
              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
            {errors.password && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.password.message)}
              </div>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Confirm Password*</label>
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password" 
              className="form-control"
              {...register("confirm_password", { 
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
            />
            <span 
              className="placeholder_icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                top: '80%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            >
              <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
            {errors.confirm_password && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.confirm_password.message)}
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="col-1To'0">
          <button 
            type="submit" 
            className="btn-one tran3s w-100 mt-30"
            disabled={!isValid}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientStep1;