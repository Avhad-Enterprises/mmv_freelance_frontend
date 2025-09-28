import React from "react";
import { useForm } from "react-hook-form";

const Step3: React.FC<{ nextStep: (data: any) => void; prevStep: () => void; formData: any }> = ({ nextStep, prevStep, formData }) => {
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
            <label>Location*</label>
            <input 
              type="text" 
              placeholder="City, Country" 
              className="form-control"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <div className="error">{String(errors.location.message)}</div>
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

        {/* ID Type */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>ID Type*</label>
            <select 
              className="form-control"
              {...register("id_type", { required: "ID type is required" })}
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
            {errors.id_type && (
              <div className="error">{String(errors.id_type.message)}</div>
            )}
          </div>
        </div>

        {/* ID Upload */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>ID Document Upload*</label>
            <input 
              type="file" 
              className="form-control"
              accept="image/*,.pdf"
              {...register("id_document", { required: "ID document is required" })}
            />
            <small className="text-muted">Upload a clear photo/scan of your ID (Max 5MB)</small>
            {errors.id_document && (
              <div className="error">{String(errors.id_document.message)}</div>
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

export default Step3;