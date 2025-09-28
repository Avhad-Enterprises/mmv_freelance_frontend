import React from "react";
import { useForm } from "react-hook-form";

const ClientStep3: React.FC<{
  nextStep: (data: any) => void;
  prevStep: () => void;
  formData: any;
}> = ({
  nextStep,
  prevStep,
  formData
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData });

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Phone Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input 
              type="tel" 
              placeholder="Enter your phone number"
              className="form-control"
              {...register("phone_number", { 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
            />
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>City*</label>
            <input 
              type="text" 
              placeholder="Enter your city" 
              className="form-control"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <div className="error">{String(errors.city.message)}</div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Country*</label>
            <select 
              className="form-control"
              {...register("country", { required: "Country is required" })}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              {/* Add more countries as needed */}
            </select>
            {errors.country && (
              <div className="error">{String(errors.country.message)}</div>
            )}
          </div>
        </div>

        {/* Business Documents */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Business Registration Documents (Optional)</label>
            <input 
              type="file" 
              className="form-control"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              {...register("business_documents")}
            />
            <small className="text-muted">
              Upload business registration documents. This will be mandatory before your first payout.
              Accepted formats: PDF, DOC, DOCX, Images
            </small>
            {errors.business_documents && (
              <div className="error">{String(errors.business_documents.message)}</div>
            )}
          </div>
        </div>

        {/* Tax ID / Business Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Tax ID / Business Number (Optional)</label>
            <input 
              type="text" 
              placeholder="Enter your tax ID or business number"
              className="form-control"
              {...register("tax_id")}
            />
            <small className="text-muted">
              This information helps us prepare accurate invoices and tax documents
            </small>
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

export default ClientStep3;