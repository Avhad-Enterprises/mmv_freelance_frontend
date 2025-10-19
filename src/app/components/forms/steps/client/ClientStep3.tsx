"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { geocodeAddress } from "@/lib/actions/latlongaction"; // Adjust path if needed
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, clearErrors, setError } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(formData?.countryCodeForPhone || "in");
  const [countryCode, setCountryCode] = useState(formData?.countryDialCode || "+91");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [businessDocUrl, setBusinessDocUrl] = useState<string | null>(null);

  const note = "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  useEffect(() => {
    return () => {
      if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);
      if (businessDocUrl) URL.revokeObjectURL(businessDocUrl);
    };
  }, [profilePhotoUrl, businessDocUrl]);

  const validateBusinessDocument = (file: File | null): boolean | string => {
    if (!file) return true;
    if (file.size > 10 * 1024 * 1024) return 'File size must be less than 10MB.';
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.type)) return 'Invalid file type. Only PDF files are supported.';
    return true;
  };

  const validateProfilePhoto = (file: File | null): boolean | string => {
    if (!file) return "Profile photo is required";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB.";
    return true;
  };

  const onSubmit = async (data: any) => {
    setIsGeocoding(true);
    clearErrors("address");
    const countryName = Country.getCountryByCode(data.country)?.name || '';
    const fullAddress = `${data.address}, ${data.city}, ${data.state}, ${countryName}`;
    
    try {
      const geocodeResult = await geocodeAddress(fullAddress);
      if (geocodeResult.error) {
        setError("address", { type: "manual", message: geocodeResult.error });
        setIsGeocoding(false);
        return;
      }
      
      const submissionData = {
        ...data,
        business_document: selectedFile,
        profile_photo: selectedProfilePhoto,
        countryCodeForPhone: selectedCountry,
        countryDialCode: countryCode,
        coordinates: {
          lat: geocodeResult.data?.lat,
          lng: geocodeResult.data?.lng,
        },
        formatted_address: geocodeResult.data?.formatted_address
      };
      nextStep(submissionData);

    } catch (error) {
      setError("address", { type: "manual", message: "Failed to verify address. Please try again." });
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Phone Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <div className="phone-input-wrapper">
              <div className="country-code-selector">
                <PhoneInput
                  country={selectedCountry}
                  value={countryCode}
                  onChange={(value, country: any) => {
                    setSelectedCountry(country.countryCode);
                    setCountryCode("+" + country.dialCode);
                  }}
                  containerClass="country-code-container"
                  inputClass="country-code-input"
                  buttonClass="country-code-button"
                  specialLabel=""
                  enableSearch={true}
                  searchPlaceholder="Search country..."
                />
              </div>
              <input 
                type="tel" 
                placeholder="Enter your phone number"
                className="form-control phone-number-input"
                {...register("phone_number", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{7,15}$/,
                    message: "Please enter a valid phone number"
                  }
                })}
              />
            </div>
            {errors.phone_number && (
              <div className="error" style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>

        {/* Upload Profile Photo */}
        <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
                <label>Upload Profile Photo*</label>
                <small className="d-block mb-2" style={{ color: "blue" }}>{note}</small>
                <input
                    type="file"
                    accept="image/*"
                    className="form-control pt-4"
                    {...register("profile_photo", {
                        validate: () => validateProfilePhoto(selectedProfilePhoto)
                    })}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedProfilePhoto(file);
                        setValue("profile_photo", e.target.files, { shouldValidate: true });
                        if (file) {
                            clearErrors("profile_photo");
                        }
                        if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);
                        setProfilePhotoUrl(file ? URL.createObjectURL(file) : null);
                    }}
                />
                {selectedProfilePhoto && (
                    <small className="text-success d-block mt-1">
                        Selected: {selectedProfilePhoto.name} ({(selectedProfilePhoto.size / 1024).toFixed(1)} KB)
                    </small>
                )}
                {profilePhotoUrl && (
                    <a href={profilePhotoUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
                        Preview Photo
                    </a>
                )}
                {errors.profile_photo && (
                    <div className="error" style={{ color: 'red' }}>{String(errors.profile_photo.message)}</div>
                )}
            </div>
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
            />
            {errors.address && (
              <div className="error" style={{ color: 'red' }}>{String(errors.address.message)}</div>
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
                onChange: () => {
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
              <div className="error" style={{ color: 'red' }}>{String(errors.country.message)}</div>
            )}
          </div>
        </div>

        {/* State */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>State</label>
            <select 
              className="form-control"
              {...register("state", { 
                onChange: () => setValue("city", "")
              })}
            >
              <option value="">Select State</option>
              {watch("country") && State.getStatesOfCountry(watch("country"))?.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="error" style={{ color: 'red' }}>{String(errors.state.message)}</div>
            )}
          </div>
        </div>

        {/* City */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>City</label>
            <select 
              className="form-control"
              {...register("city")}
            >
              <option value="">Select City</option>
              {watch("country") && watch("state") && (() => {
                const cities = City.getCitiesOfState(watch("country"), watch("state"));
                if (cities.length > 0) {
                  return cities.map((city) => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ));
                }
                const stateName = State.getStateByCodeAndCountry(watch("state"), watch("country"))?.name;
                if (stateName) {
                    return <option key={stateName} value={stateName}>{stateName}</option>;
                }
                return null;
              })()}
            </select>
            {errors.city && (
              <div className="error" style={{ color: 'red' }}>{String(errors.city.message)}</div>
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
                  value: /^[a-zA-Z0-9\s-]{3,10}$/,
                  message: "Please enter a valid pincode/ZIP code"
                }
              })}
            />
            {errors.pincode && (
              <div className="error" style={{ color: 'red' }}>{String(errors.pincode.message)}</div>
            )}
          </div>
        </div>
        
        {/* Business Documents */}
        <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
                <label>Business Registration Documents (Optional)</label>
                <input
                    type="file"
                    className="form-control pt-4"
                    accept=".pdf"
                    {...register("business_document", {
                        validate: (value) => validateBusinessDocument(value?.[0])
                    })}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setSelectedFile(file);
                        setValue("business_document", e.target.files, { shouldValidate: true });
                        if (businessDocUrl) URL.revokeObjectURL(businessDocUrl);
                        setBusinessDocUrl(file ? URL.createObjectURL(file) : null);
                    }}
                />
                <small style={{ color: "blue" }}>
                    Accepted format: PDF (Max 10MB)
                </small>
                {selectedFile && (
                    <small className="text-success d-block mt-1">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </small>
                )}
                {businessDocUrl && (
                    <a href={businessDocUrl} target="_blank" rel="noopener noreferrer" className="preview-link">
                        Preview Document
                    </a>
                )}
                {errors.business_document && (
                    <div className="error" style={{ color: 'red' }}>{String(errors.business_document.message)}</div>
                )}
            </div>
        </div>

        {/* Navigation Buttons */}
        <div className="col-12 d-flex justify-content-between mt-40">
          <button
            type="button"
            className="btn-one"
            onClick={prevStep}
            disabled={isGeocoding}
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="btn-one"
            disabled={isGeocoding}
          >
            {isGeocoding ? "Verifying Address..." : "Next"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientStep3;

// Styles (unchanged from your original)
if (typeof document !== 'undefined') {
  const styleId = 'client-step3-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
    .phone-input-wrapper { display: flex; gap: 10px; align-items: stretch; width: 100%; }
    .country-code-selector { flex: 0 0 160px; position: relative; }
    .country-code-container { width: 100%; position: relative; }
    .country-code-input { width: 100% !important; height: 58px !important; background-color: var(--bg-white) !important; border: 2px solid #E3E3E3 !important; border-radius: 8px !important; padding: 0 8px 0 60px !important; font-size: 16px !important; cursor: default !important; text-align: left !important; }
    .country-code-button { position: absolute !important; left: 0 !important; top: 0 !important; height: 58px !important; width: 52px !important; background-color: transparent !important; border-right: 2px solid #E3E3E3 !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
    .country-code-button:focus { outline: none !important; }
    .react-tel-input .selected-flag { padding-left: 12px !important; width: 52px !important; }
    .phone-number-input { flex: 1; height: 58px !important; background-color: var(--bg-white); border: 2px solid #E3E3E3; border-radius: 8px; padding: 0 15px; font-size: 16px; }
    .react-tel-input .country-list { width: 350px !important; max-height: 400px !important; border-radius: 8px; border: 2px solid #E3E3E3; margin-top: 5px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); z-index: 999; }
    .react-tel-input .search { position: sticky; top: 0; z-index: 10; background-color: var(--bg-white, #fff); }
    .react-tel-input .search-box { width: calc(100% - 20px) !important; margin: 10px !important; padding: 10px 10px 10px 40px !important; border: 2px solid #E3E3E3 !important; border-radius: 6px !important; font-family: inherit !important; font-size: 15px !important; }
    .react-tel-input .search-emoji { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); z-index: 1; pointer-events: none; }
    .react-tel-input .country-list .country { padding: 10px !important; display: flex !important; align-items: center !important; font-family: inherit !important; font-size: 15px !important; }
    .react-tel-input .country-list .country:hover { background-color: #f5f5f5 !important; }
    .preview-link { display: inline-block; font-size: 14px; font-weight: 600; color: #007bff; background-color: transparent; border: 2px solid #007bff; padding: 8px 14px; border-radius: 8px; margin-top: 10px; text-decoration: none !important; cursor: pointer; transition: all 0.2s ease; }
    .preview-link:hover { background-color: #007bff; color: #fff !important; text-decoration: none !important; }
    input[type="file"].pt-4 { padding-top: 1rem !important; }
    `;
    document.head.appendChild(style);
  }
}