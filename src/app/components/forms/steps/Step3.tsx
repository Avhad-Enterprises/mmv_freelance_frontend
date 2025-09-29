import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

const Step3: React.FC<{ nextStep: (data: any) => void; prevStep: () => void; formData: any }> = ({ nextStep, prevStep, formData }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({ defaultValues: formData });

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

        {/* Address */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Street Address*</label>
            <input 
              type="text" 
              placeholder="Enter your street address" 
              className="form-control"
              {...register("street_address", { required: "Street address is required" })}
            />
            {errors.street_address && (
              <div className="error">{String(errors.street_address.message)}</div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Country*</label>
            <select 
              className="form-control"
              {...register("country", { 
                required: "Country is required",
                onChange: (e) => {
                  const countryCode = e.target.value;
                  const states = State.getStatesOfCountry(countryCode);
                  setValue("state", "");
                  setValue("city", "");
                }
              })}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="error">{String(errors.country.message)}</div>
            )}
          </div>
        </div>

        {/* State */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>State/Province*</label>
            <select 
              className="form-control"
              {...register("state", { 
                required: "State is required",
                onChange: (e) => {
                  setValue("city", "");
                }
              })}
            >
              <option value="">Select State</option>
              {watch("country") && State.getStatesOfCountry(watch("country")).map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="error">{String(errors.state.message)}</div>
            )}
          </div>
        </div>

        {/* City */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>City*</label>
            <select 
              className="form-control"
              {...register("city", { required: "City is required" })}
            >
              <option value="">Select City</option>
              {watch("state") && City.getCitiesOfState(watch("country"), watch("state")).map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <div className="error">{String(errors.city.message)}</div>
            )}
          </div>
        </div>

        {/* Zip/Postal Code */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Zip/Postal Code*</label>
            <input 
              type="text" 
              placeholder="Enter zip/postal code" 
              className="form-control"
              {...register("zip_code", { 
                required: "Zip/Postal code is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit postal code"
                }
              })}
            />
            {errors.zip_code && (
              <div className="error">{String(errors.zip_code.message)}</div>
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
              disabled={!watch("id_type")}
              {...register("id_document", { required: "ID document is required" })}
            />
            <small className="text-muted">
              {!watch("id_type") 
                ? "Please select an ID type first" 
                : "Upload a clear photo/scan of your ID (Max 5MB)"}
            </small>
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