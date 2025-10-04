"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
};

const VideographerStep1: React.FC<Props> = ({ formData, nextStep }) => {
  const { register, handleSubmit, formState: { errors, isValid }, clearErrors } = useForm({ 
    defaultValues: formData,
    mode: 'onChange' // Real-time validation
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Full Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Full Name*</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="form-control"
              {...register("full_name", { required: "Full Name is required" })}
              onChange={() => clearErrors("full_name")}
            />
            {errors.full_name && (
              <div className="error">{String(errors.full_name.message)}</div>
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
              onChange={() => clearErrors("email")}
            />
            {errors.email && (
              <div className="error">{String(errors.email.message)}</div>
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
              onChange={() => clearErrors("password")}
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
              <div className="error">{String(errors.password.message)}</div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <div className="col-12">
          <button type="submit" className="btn-one tran3s w-100 mt-30">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideographerStep1;