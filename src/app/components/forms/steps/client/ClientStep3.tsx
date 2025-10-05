"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, clearErrors } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);

  const note = "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // File validation function
  const validateBusinessDocument = (file: File | null): boolean | string => {
    if (!file) return true; // Optional field
    
    if (file.size === 0) {
      return 'Selected file is empty. Please choose a valid document.';
    }

    if (file.name === 'Unknown.pdf' || file.name === 'blob') {
      return 'File selection failed. Please try selecting the file again.';
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB.';
    }

    return true;
  };

  const validateProfilePhoto = (file: File | null): boolean | string => {
    if (!file) return "Profile photo is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid image.";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB.";
    return true;
  };

  const onSubmit = (data: any) => {
    // Include the selected file in the data
    const submissionData = {
      ...data,
      business_document: selectedFile, // Use singular form
      profile_photo: selectedProfilePhoto
    };

    nextStep(submissionData);
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
              onChange={() => clearErrors("phone_number")}
            />
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>

        {/* Upload Profile Photo */}
        <div className="col-12">
          <h4 className="mb-2">Upload Profile Photo*</h4>
          <small className="d-block mb-2" style={{ color: "blue" }}>{note}</small>
          <input
            type="file"
            accept="image/*"
            {...register("profile_photo", {
              validate: (value) => validateProfilePhoto(value?.[0] || selectedProfilePhoto)
            })}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedProfilePhoto(file);
              setValue("profile_photo", e.target.files);
              clearErrors("profile_photo");
            }}
          />
          {selectedProfilePhoto && (
            <small className="text-success d-block mt-1">
              Selected: {selectedProfilePhoto.name} ({(selectedProfilePhoto.size / 1024).toFixed(1)} KB)
            </small>
          )}
          {errors.profile_photo && (
            <div className="error">{String(errors.profile_photo.message)}</div>
          )}
        </div>

        {/* Address */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Address*</label>
            <textarea 
              placeholder="Enter your complete address" 
              className="form-control"
              rows={3}
              {...register("address", { required: "Address is required" })}
              onChange={() => clearErrors("address")}
            />
            {errors.address && (
              <div className="error">{String(errors.address.message)}</div>
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
                  clearErrors("country");
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
            <label>State*</label>
            <select 
              className="form-control"
              {...register("state", { 
                required: "State is required",
                onChange: (e) => {
                  setValue("city", "");
                  clearErrors("state");
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
              onChange={() => clearErrors("city")}
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

        {/* Pincode/ZIP Code */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Pincode/ZIP Code*</label>
            <input 
              type="text" 
              placeholder="Enter your pincode/ZIP code" 
              className="form-control"
              {...register("pincode", { 
                required: "Pincode/ZIP code is required",
                pattern: {
                  value: /^[0-9]{5,6}$/,
                  message: "Please enter a valid pincode/ZIP code"
                }
              })}
              onChange={() => clearErrors("pincode")}
            />
            {errors.pincode && (
              <div className="error">{String(errors.pincode.message)}</div>
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
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              {...register("business_document", { 
                validate: (value) => {
                  if (!value || value.length === 0) return true; // Optional
                  const file = value[0];
                  return validateBusinessDocument(file);
                }
              })}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedFile(file);
                clearErrors("business_document");
              }}
            />
            <small style={{ color: "blue" }}>
              Upload business registration documents. This will be mandatory before your first payout.
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </small>
            {selectedFile && (
              <small className="text-success d-block mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </small>
            )}
            {errors.business_document && (
              <div className="error">{String(errors.business_document.message)}</div>
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
            <small style={{ color: "blue" }}>
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