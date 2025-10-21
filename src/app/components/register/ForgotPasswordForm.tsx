"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any; 
  nextStep: (data: { email: string }) => void;
  isLoading: boolean;
};

const ForgotPasswordForm: React.FC<Props> = ({ formData, nextStep, isLoading }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid }, 
  } = useForm({ 
    defaultValues: formData,
    mode: 'onChange'
  });

  const onSubmit = (data: { email: string }) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Email Field */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input 
              type="email" 
              placeholder="Enter your registered email" 
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
              <div className="error" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                {String(errors.email.message)}
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
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;