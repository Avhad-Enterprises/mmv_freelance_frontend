import React from "react";
import { useForm } from "react-hook-form";

const Step5: React.FC<{ nextStep: (data: any) => void; prevStep: () => void; formData: any }> = ({ nextStep, prevStep, formData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData });

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Payment Method */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Payment Method*</label>
            <select 
              className="form-control"
              {...register("payment_method", { required: "Payment method is required" })}
            >
              <option value="">Select Payment Method</option>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="upi">UPI</option>
            </select>
            {errors.payment_method && (
              <div className="error">{String(errors.payment_method.message)}</div>
            )}
          </div>
        </div>

        {/* Bank Account Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Account Holder Name*</label>
            <input 
              type="text" 
              placeholder="Enter account holder name"
              className="form-control"
              {...register("account_name", { 
                required: "Account holder name is required",
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name should only contain letters"
                }
              })}
            />
            {errors.account_name && (
              <div className="error">{String(errors.account_name.message)}</div>
            )}
          </div>
        </div>

        {/* Bank Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Bank Name*</label>
            <input 
              type="text" 
              placeholder="Enter bank name"
              className="form-control"
              {...register("bank_name", { required: "Bank name is required" })}
            />
            {errors.bank_name && (
              <div className="error">{String(errors.bank_name.message)}</div>
            )}
          </div>
        </div>

        {/* Account Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Account Number*</label>
            <input 
              type="text" 
              placeholder="Enter account number"
              className="form-control"
              {...register("account_number", { 
                required: "Account number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid account number"
                }
              })}
            />
            {errors.account_number && (
              <div className="error">{String(errors.account_number.message)}</div>
            )}
          </div>
        </div>

        {/* SWIFT/BIC Code */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>SWIFT/BIC Code</label>
            <input 
              type="text" 
              placeholder="Enter SWIFT/BIC code"
              className="form-control"
              {...register("swift_code", {
                pattern: {
                  value: /^[A-Z0-9]{8,11}$/,
                  message: "Please enter a valid SWIFT/BIC code"
                }
              })}
            />
            {errors.swift_code && (
              <div className="error">{String(errors.swift_code.message)}</div>
            )}
          </div>
        </div>

        {/* PayPal Email */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>PayPal Email</label>
            <input 
              type="email" 
              placeholder="Enter PayPal email"
              className="form-control"
              {...register("paypal_email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              })}
            />
            {errors.paypal_email && (
              <div className="error">{String(errors.paypal_email.message)}</div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="col-12 d-flex justify-content-between">
          <button 
            type="button" 
            className="btn-one"
            onClick={prevStep}
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="btn-one"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step5;