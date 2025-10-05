"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Country, City } from "country-state-city";
// 1. Import the server action
import { geocodeAddress } from "@/lib/actions/latlongaction"; // Adjust path if needed

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const VideoEditorStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }, // We don't need `isValid` if submitting triggers all validations
    setValue,
    clearErrors,
    watch,
    setError // Import setError to display API errors
  } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [selectedIdDocument, setSelectedIdDocument] = useState<File | null>(null);
  // 2. Add loading and error states for the geocoding process
  const [isGeocoding, setIsGeocoding] = useState(false);
  const note = "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // File validation functions (no changes here)
  const validateProfilePhoto = (file: File | null): boolean | string => {
    if (!file) return "Profile photo is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid image.";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB.";
    return true;
  };
  const validateIdDocument = (file: File | null): boolean | string => {
    if (!file) return "ID document is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid document.";
    if (file.size > 10 * 1024 * 1024) return "File size must be less than 10MB.";
    return true;
  };

  // 3. Update the onSubmit handler to be async and call the server action
  const onSubmit = async (data: any) => {
    setIsGeocoding(true);
    clearErrors("address"); // Clear previous geocoding errors

    // Combine address parts for a more accurate geocoding query
    const countryName = Country.getCountryByCode(data.country)?.name || '';
    const fullAddress = `${data.address}, ${data.city}, ${countryName}`;
    
    // Call the server action
    const geocodeResult = await geocodeAddress(fullAddress);

    if (geocodeResult.error) {
      // If the API returns an error, display it on the address field
      setError("address", {
        type: "manual",
        message: geocodeResult.error
      });
      setIsGeocoding(false);
      return; // Stop the submission process
    }

    // If successful, combine all data and proceed
    const submissionData = {
      ...data,
      profile_photo: selectedProfilePhoto,
      id_document: selectedIdDocument,
      // Add the retrieved coordinates to the submission data
      coordinates: {
        lat: geocodeResult.data?.lat,
        lng: geocodeResult.data?.lng,
      },
      // Optionally save the API-formatted address
      formatted_address: geocodeResult.data?.formatted_address
    };

    nextStep(submissionData);
    setIsGeocoding(false); // This line may not be reached if nextStep unmounts the component
  };

  // Watch for country changes
  const selectedCountry = watch("country");

  return (
    // Pass the new onSubmit handler to the form
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Phone Number, Profile Photo, ID Verification sections (no changes) */}
      <h4 className="mb-3">Phone Number</h4>
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
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>
      </div>

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

      <div className="mt-3">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control mb-2"
              {...register("id_type", { required: "ID type is required" })}
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
                setValue("id_document", e.target.files);
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
                    setValue("city", ""); // Reset city on country change
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
                  // 4. We can remove the logic that sets coordinates here,
                  // as it will be handled on submit with the full address.
                })}
                disabled={!selectedCountry}
              >
                <option value="">Select City</option>
                {selectedCountry && (City.getCitiesOfCountry(selectedCountry) || []).map((ct) => (
                  <option key={`${ct.name}-${ct.stateCode}`} value={ct.name}>
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
          <label>Address*</label>
          <textarea
            className="form-control"
            placeholder="e.g., 123 Main St, Anytown"
            {...register("address", {
              required: "Address is required",
            })}
            rows={3}
          />
          {/* This will now show validation errors AND geocoding API errors */}
          {errors.address && (
            <div className="error">{String(errors.address.message)}</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep} disabled={isGeocoding}>
          Previous
        </button>
        <button
          type="submit"
          className="btn-one"
          // 5. Disable the button and show a loading message during the API call
          disabled={isGeocoding}
        >
          {isGeocoding ? "Verifying Address..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default VideoEditorStep3;