"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep5: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, watch, formState: { errors, isValid }, clearErrors } = useForm({ 
    defaultValues: formData,
    mode: 'onChange'
  });
  const paymentMethod = watch("payment_method");

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
              onChange={() => clearErrors("payment_method")}
            >
              <option value="">Select Payment Method</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
            </select>
            {errors.payment_method && (
              <div className="error">{String(errors.payment_method.message)}</div>
            )}
          </div>
        </div>

        {/* Credit/Debit Card Details */}
        {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
          <>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Card Number*</label>
                <input 
                  type="text" 
                  placeholder="Enter card number"
                  className="form-control"
                  {...register("card_number", { 
                    required: "Card number is required",
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: "Please enter a valid 16-digit card number"
                    }
                  })}
                  onChange={() => clearErrors("card_number")}
                />
                {errors.card_number && (
                  <div className="error">{String(errors.card_number.message)}</div>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className="input-group-meta position-relative mb-25">
                <label>Expiry Date*</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="form-control"
                  {...register("card_expiry", { 
                    required: "Expiry date is required",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: "Please enter a valid expiry date (MM/YY)"
                    }
                  })}
                  onChange={() => clearErrors("card_expiry")}
                />
                {errors.card_expiry && (
                  <div className="error">{String(errors.card_expiry.message)}</div>
                )}
              </div>
            </div>

            <div className="col-6">
              <div className="input-group-meta position-relative mb-25">
                <label>CVV*</label>
                <input 
                  type="text" 
                  placeholder="CVV"
                  className="form-control"
                  {...register("card_cvv", { 
                    required: "CVV is required",
                    pattern: {
                      value: /^[0-9]{3,4}$/,
                      message: "Please enter a valid CVV"
                    }
                  })}
                  onChange={() => clearErrors("card_cvv")}
                />
                {errors.card_cvv && (
                  <div className="error">{String(errors.card_cvv.message)}</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* PayPal Email */}
        {paymentMethod === "paypal" && (
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>PayPal Email*</label>
              <input 
                type="email" 
                placeholder="Enter your PayPal email"
                className="form-control"
                {...register("paypal_email", { 
                  required: "PayPal email is required",
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
        )}

        {/* UPI ID */}
        {paymentMethod === "upi" && (
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>UPI ID*</label>
              <input 
                type="text" 
                placeholder="Enter your UPI ID"
                className="form-control"
                {...register("upi_id", { 
                  required: "UPI ID is required",
                  pattern: {
                    value: /^[\w.-]+@[\w.-]+$/,
                    message: "Please enter a valid UPI ID"
                  }
                })}
              />
              {errors.upi_id && (
                <div className="error">{String(errors.upi_id.message)}</div>
              )}
            </div>
          </div>
        )}

        {/* Bank Transfer Details */}
        {paymentMethod === "bank_transfer" && (
          <>
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Account Holder Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter account holder name"
                  className="form-control"
                  {...register("account_name", { 
                    required: "Account holder name is required"
                  })}
                />
                {errors.account_name && (
                  <div className="error">{String(errors.account_name.message)}</div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Bank Name*</label>
                <input 
                  type="text" 
                  placeholder="Enter bank name"
                  className="form-control"
                  {...register("bank_name", { 
                    required: "Bank name is required"
                  })}
                />
                {errors.bank_name && (
                  <div className="error">{String(errors.bank_name.message)}</div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Account Number*</label>
                <input 
                  type="text" 
                  placeholder="Enter account number"
                  className="form-control"
                  {...register("account_number", { 
                    required: "Account number is required"
                  })}
                />
                {errors.account_number && (
                  <div className="error">{String(errors.account_number.message)}</div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>SWIFT/IBAN Code*</label>
                <input 
                  type="text" 
                  placeholder="Enter SWIFT/IBAN code"
                  className="form-control"
                  {...register("swift_iban", { 
                    required: "SWIFT/IBAN code is required"
                  })}
                />
                {errors.swift_iban && (
                  <div className="error">{String(errors.swift_iban.message)}</div>
                )}
              </div>
            </div>
          </>
        )}

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

export default ClientStep5;