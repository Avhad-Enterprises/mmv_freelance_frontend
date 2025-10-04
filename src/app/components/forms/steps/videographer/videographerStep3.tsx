"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Country, City } from "country-state-city";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const videographerStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, clearErrors, watch } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [selectedIdDocument, setSelectedIdDocument] = useState<File | null>(null);
  const note =
    "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // File validation functions
  const validateProfilePhoto = (file: File | null): boolean | string => {
    if (!file) return "Profile photo is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid image.";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB."; // 5MB limit for profile photos
    return true;
  };

  const validateIdDocument = (file: File | null): boolean | string => {
    if (!file) return "ID document is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid document.";
    if (file.size > 10 * 1024 * 1024) return "File size must be less than 10MB."; // 10MB limit for documents
    return true;
  };

  const onSubmit = (data: any) => {
    // Include the selected files in the data
    const submissionData = {
      ...data,
      profile_photo: selectedProfilePhoto,
      id_document: selectedIdDocument
    };
    nextStep(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-3">Phone Number & OTP Verification*</h4>
      <div className="row">
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input
              type="tel"
              className="form-control"
              {...register("phone_number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
              onChange={() => clearErrors("phone_number")}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>
        {/* <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>OTP*</label>
            <input
              type="text"
              className="form-control"
              value={formData.otp || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, otp: e.target.value }))}
              placeholder="Enter OTP"
            />
          </div>
        </div> */}
      </div>

      <h4 className="mb-2">Upload Profile Photo*</h4>
      <small className="d-block mb-2">{note}</small>
      <input
        type="file"
        accept="image/*"
        {...register("profile_photo", {
          validate: (value) => validateProfilePhoto(value?.[0] || selectedProfilePhoto)
        })}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setSelectedProfilePhoto(file);
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

      <div className="mt-3">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control mb-2"
              {...register("id_type", { required: "ID type is required" })}
              onChange={() => clearErrors("id_type")}
            >
              <option value="">Select ID Type*</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
            {errors.id_type && (
              <div className="error">{String(errors.id_type.message)}</div>
            )}
          </div>
          <div className="col-md-6">
            <input
              type="file"
              accept="image/*,.pdf"
              {...register("id_document", {
                validate: (value) => validateIdDocument(value?.[0] || selectedIdDocument)
              })}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedIdDocument(file);
                clearErrors("id_document");
              }}
            />
            {selectedIdDocument && (
              <small className="text-success d-block mt-1">
                Selected: {selectedIdDocument.name} ({(selectedIdDocument.size / 1024).toFixed(1)} KB)
              </small>
            )}
            {errors.id_document && (
              <div className="error">{String(errors.id_document.message)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Location Details*</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Country*</label>
              <select
                className="form-control"
                {...register("country", {
                  required: "Country is required",
                  onChange: (e) => {
                    const countryCode = e.target.value;
                    setValue("city", "");
                    setValue("coordinates", { lat: "", lng: "" });
                    clearErrors("country");
                  }
                })}
              >
                <option value="">Select Country</option>
                {Country.getAllCountries().map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <div className="error">{String(errors.country.message)}</div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>City*</label>
              <select
                className="form-control"
                {...register("city", {
                  required: "City is required",
                  onChange: (e) => {
                    const cityName = e.target.value;
                    const cities = watch("country") ? City.getCitiesOfCountry(watch("country")) : [];
                    const selectedCity = cities?.find(c => c.name === cityName);

                    setValue("coordinates", {
                      lat: selectedCity?.latitude || "",
                      lng: selectedCity?.longitude || "",
                    });
                    clearErrors("city");
                  }
                })}
                disabled={!watch("country")}
              >
                <option value="">Select City</option>
                {watch("country") && (City.getCitiesOfCountry(watch("country")) || []).map((ct) => (
                  <option key={`${ct.name}-${ct.latitude}`} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div className="error">{String(errors.city.message)}</div>
              )}
            </div>
          </div>
        </div>
        <div className="input-group-meta position-relative mt-2 mb-25">
            <label>Full Address*</label>
            <textarea
                className="form-control"
                placeholder="e.g., 123 Main St, Anytown, State, 12345"
                {...register("full_address", {
                  required: "Full address is required",
                  onChange: () => clearErrors("full_address")
                })}
                rows={3}
            />
            {errors.full_address && (
              <div className="error">{String(errors.full_address.message)}</div>
            )}
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>
          Previous
        </button>
        <button
          type="submit"
          className="btn-one"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default videographerStep3;


