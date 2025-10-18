"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { geocodeAddress } from "@/lib/actions/latlongaction";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const VideographerStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue, 
    clearErrors, 
    watch,
    setError
  } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(null);
  const [selectedIdDocument, setSelectedIdDocument] = useState<File | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("in");
  const [countryCode, setCountryCode] = useState("+91");
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Preview URLs
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [idDocumentUrl, setIdDocumentUrl] = useState<string | null>(null);

  const note = "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
      if (idDocumentUrl) {
        URL.revokeObjectURL(idDocumentUrl);
      }
    };
  }, [profilePhotoUrl, idDocumentUrl]);

  // File validation functions
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

  const onSubmit = async (data: any) => {
    setIsGeocoding(true);
    clearErrors("full_address");

    const countryName = Country.getCountryByCode(data.country)?.name || '';
    const stateName = State.getStateByCodeAndCountry(data.state, data.country)?.name || '';
    const fullAddressToGeocode = `${data.full_address}, ${data.city}, ${stateName}, ${countryName}`;
    
    const geocodeResult = await geocodeAddress(fullAddressToGeocode);

    if (geocodeResult.error) {
      setError("full_address", {
        type: "manual",
        message: geocodeResult.error
      });
      setIsGeocoding(false);
      return;
    }

    const submissionData = {
      ...data,
      profile_photo: selectedProfilePhoto,
      id_document: selectedIdDocument,
      coordinates: {
        lat: geocodeResult.data?.lat,
        lng: geocodeResult.data?.lng,
      },
      formatted_address: geocodeResult.data?.formatted_address
    };

    nextStep(submissionData);
    setIsGeocoding(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Phone Number with Country Code */}
      <h4 className="mb-3">Phone Number & OTP Verification*</h4>
      <div className="row">
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
                    clearErrors("phone_number");
                  }}
                  containerClass="country-code-container"
                  inputClass="country-code-input"
                  buttonClass="country-code-button"
                  specialLabel=""
                  inputProps={{
                    readOnly: true,
                  }}
                  enableSearch={true}
                  searchPlaceholder="Search country..."
                  searchNotFound="No country found"
                  disableSearchIcon={false}
                  preferredCountries={['in', 'us', 'gb', 'ca', 'au']}
                />
              </div>
              <input 
                type="tel" 
                placeholder="Enter your phone number"
                className="form-control phone-number-input"
                {...register("phone_number", { 
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number"
                  }
                })}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  e.target.value = value;
                  clearErrors("phone_number");
                }}
              />
            </div>
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Profile Photo */}
      <h4 className="mb-2">Upload Profile Photo*</h4>
      <small className="d-block mb-2" style={{ color: "blue" }}>{note}</small>
      <div className="custom-file-upload">
        <input
          type="file"
          accept="image/*"
          id="profile-photo-input"
          className="hidden-file-input"
          {...register("profile_photo", {
            validate: (value) => validateProfilePhoto(value?.[0] || selectedProfilePhoto)
          })}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedProfilePhoto(file);
            setValue("profile_photo", e.target.files);
            clearErrors("profile_photo");
            
            if (profilePhotoUrl) {
              URL.revokeObjectURL(profilePhotoUrl);
            }
            if (file) {
              setProfilePhotoUrl(URL.createObjectURL(file));
            } else {
              setProfilePhotoUrl(null);
            }
          }}
        />
        <label htmlFor="profile-photo-input" className="file-upload-label">
          {selectedProfilePhoto ? selectedProfilePhoto.name : "Choose Profile Photo"}
        </label>
      </div>
      {selectedProfilePhoto && (
        <small className="text-success d-block mt-1">
          Selected: {selectedProfilePhoto.name} ({(selectedProfilePhoto.size / 1024).toFixed(1)} KB)
        </small>
      )}
      {profilePhotoUrl && (
        <a 
          href={profilePhotoUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="preview-link"
        >
          Preview Photo
        </a>
      )}
      {errors.profile_photo && (
        <div className="error">{String(errors.profile_photo.message)}</div>
      )}

      {/* ID Verification */}
      <div className="mt-3">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>ID Type*</label>
              <select
                className="form-control"
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
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Upload ID Document*</label>
              <div className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  id="id-document-input"
                  className="hidden-file-input"
                  {...register("id_document", {
                    validate: (value) => validateIdDocument(value?.[0] || selectedIdDocument)
                  })}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedIdDocument(file);
                    setValue("id_document", e.target.files);
                    clearErrors("id_document");
                    
                    if (idDocumentUrl) {
                      URL.revokeObjectURL(idDocumentUrl);
                    }
                    if (file) {
                      setIdDocumentUrl(URL.createObjectURL(file));
                    } else {
                      setIdDocumentUrl(null);
                    }
                  }}
                />
                <label htmlFor="id-document-input" className="file-upload-label">
                  {selectedIdDocument ? selectedIdDocument.name : "Choose ID Document"}
                </label>
              </div>
              {selectedIdDocument && (
                <small className="text-success d-block mt-1">
                  Selected: {selectedIdDocument.name} ({(selectedIdDocument.size / 1024).toFixed(1)} KB)
                </small>
              )}
              {idDocumentUrl && (
                <a 
                  href={idDocumentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="preview-link"
                >
                  Preview Document
                </a>
              )}
              {errors.id_document && (
                <div className="error">{String(errors.id_document.message)}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="mt-4">
        <h5>Location Details*</h5>
        <div className="row">
          {/* Country */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Country*</label>
              <select
                className="form-control"
                {...register("country", {
                  required: "Country is required",
                  onChange: (e) => {
                    setValue("state", "");
                    setValue("city", "");
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

          {/* State */}
          <div className="col-md-6">
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
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>City*</label>
              <select
                className="form-control"
                {...register("city", { required: "City is required" })}
                onChange={() => clearErrors("city")}
              >
                <option value="">Select City</option>
                {watch("state") && (() => {
                  const cities = City.getCitiesOfState(watch("country"), watch("state"));
                  const stateName = State.getStateByCodeAndCountry(watch("state"), watch("country"))?.name;
                  
                  // If no cities available, show the state name as an option
                  if (cities.length === 0 && stateName) {
                    return (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    );
                  }
                  
                  // Otherwise show all cities
                  return cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ));
                })()}
              </select>
              {errors.city && (
                <div className="error">{String(errors.city.message)}</div>
              )}
            </div>
          </div>

          {/* Full Address */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Full Address*</label>
              <textarea
                className="form-control"
                placeholder="e.g., 123 Main St, Anytown, State, 12345"
                {...register("full_address", {
                  required: "Full address is required",
                })}
                rows={3}
                onChange={() => clearErrors("full_address")}
              />
              {errors.full_address && (
                <div className="error">{String(errors.full_address.message)}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep} disabled={isGeocoding}>
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
    </form>
  );
};

export default VideographerStep3;

// Add styles to the parent document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .phone-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: stretch;
      width: 100%;
    }
    .country-code-selector {
      flex: 0 0 160px;
      position: relative;
    }
    .country-code-container {
      width: 100%;
      position: relative;
    }
    .country-code-input {
      width: 100% !important;
      height: 58px !important;
      background-color: var(--bg-white) !important;
      border: 2px solid #E3E3E3 !important;
      border-radius: 8px !important;
      padding: 0 8px 0 60px !important;
      font-size: 16px !important;
      cursor: default !important;
      text-align: left !important;
    }
    .country-code-button {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      height: 58px !important;
      width: 52px !important;
      background-color: transparent !important;
      border-right: 2px solid #E3E3E3 !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    .country-code-button .flag {
      transform: scale(1.2);
    }
    .country-code-button:focus {
      outline: none !important;
    }
    .react-tel-input .selected-flag {
      padding-left: 12px !important;
      width: 52px !important;
    }
    .phone-number-input {
      flex: 1;
      height: 58px !important;
      background-color: var(--bg-white);
      border: 2px solid #E3E3E3;
      border-radius: 8px;
      padding: 0 15px;
      font-size: 16px;
    }
    .react-tel-input .country-list {
      width: 350px !important;
      max-height: 400px !important;
      overflow-y: auto;
      border-radius: 8px;
      border: 2px solid #E3E3E3;
      margin-top: 5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 999;
    }
    .react-tel-input .search {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: var(--bg-white, #fff);
    }
    .react-tel-input .search-box {
      width: calc(100% - 20px) !important;
      margin: 10px !important;
      padding: 10px 10px 10px 40px !important; 
      border: 2px solid #E3E3E3 !important;
      border-radius: 6px !important;
      font-family: inherit !important;
      font-size: 15px !important;
    }
    .react-tel-input .search-emoji {
      position: absolute;
      left: 24px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      z-index: 1;
      pointer-events: none;
    }
    .react-tel-input .country-list .country {
      padding: 10px !important;
      display: flex !important;
      align-items: center !important;
      font-family: inherit !important;
      font-size: 15px !important;
    }
    .react-tel-input .country-list .country .country-name {
      margin-left: 10px;
      flex-grow: 1;
    }
    .react-tel-input .country-list .country .dial-code {
      margin-left: 8px;
      color: #888;
    }
    .react-tel-input .country-list .country.highlight,
    .react-tel-input .country-list .country:hover {
      background-color: #f5f5f5 !important;
    }
    .react-tel-input .selected-flag:hover,
    .react-tel-input .selected-flag:focus {
      background-color: transparent !important;
    }

    .preview-link {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      color: #007bff;
      background-color: transparent;
      border: 2px solid #007bff;
      padding: 8px 14px;
      border-radius: 8px;
      margin-top: 10px;
      text-decoration: none !important;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .preview-link:hover {
      background-color: #007bff;
      color: #fff !important;
      text-decoration: none !important;
    }

    input[type="file"].pt-4 {
      padding-top: 1rem !important;
    }

    .hidden-file-input {
      display: none;
    }

    .custom-file-upload {
      margin-bottom: 10px;
    }

    .file-upload-label {
      display: inline-block;
      padding: 12px 20px;
      background-color: var(--bg-white);
      border: 2px solid #E3E3E3;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      color: #333;
      transition: all 0.2s ease;
      width: 100%;
      text-align: center;
      font-weight: 500;
    }

    .file-upload-label:hover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
  `;
  document.head.appendChild(style);
}