"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";
import { geocodeAddress } from "@/lib/actions/latlongaction";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep3: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
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

  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<File | null>(formData?.profile_photo || null);
  const [selectedBusinessDocuments, setSelectedBusinessDocuments] = useState<File[]>(formData?.business_document ? (formData.business_document instanceof FileList ? Array.from(formData.business_document) : Array.isArray(formData.business_document) ? formData.business_document : [formData.business_document]) : []);
  const [selectedCountry, setSelectedCountry] = useState(formData?.countryCodeForPhone || "in");
  const [countryCode, setCountryCode] = useState(formData?.countryDialCode || "+91");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [showBusinessDocPreview, setShowBusinessDocPreview] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [businessDocUrl, setBusinessDocUrl] = useState<string | null>(null);

  const note = "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // Initialize preview URLs for existing files
  useEffect(() => {
    if (selectedProfilePhoto) {
      setProfilePhotoUrl(URL.createObjectURL(selectedProfilePhoto));
    }
    if (selectedBusinessDocuments && selectedBusinessDocuments.length > 0) {
      // For multiple files, we'll show preview for the first one
      setBusinessDocUrl(URL.createObjectURL(selectedBusinessDocuments[0]));
    }
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePhotoUrl) URL.revokeObjectURL(profilePhotoUrl);
      if (businessDocUrl) URL.revokeObjectURL(businessDocUrl);
    };
  }, [profilePhotoUrl, businessDocUrl]);

  // File validation functions
  // --- MODIFIED: File validation functions with type checking ---
  const validateProfilePhoto = (file: File | null): boolean | string => {
    if (!file) return "Profile photo is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid image.";
    if (file.size > 10 * 1024 * 1024) return "File size must be less than 10MB.";
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) return "Invalid file type. Please use JPG, JPEG, PNG, or GIF.";
    // Filename validation: alphanumeric, hyphens, underscores only, no "Unknown.pdf" or "blob"
    const invalidFilenames = ['unknown.pdf', 'blob'];
    if (invalidFilenames.includes(file.name.toLowerCase())) return "Invalid filename. Please rename your file.";
    const filenameRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
    if (!filenameRegex.test(file.name)) return "Filename can only contain letters, numbers, hyphens, and underscores.";
    return true;
  };

  const validateIdDocument = (file: File | null): boolean | string => {
    if (!file) return "ID document is required";
    if (file.size === 0) return "Selected file is empty. Please choose a valid document.";
    if (file.size > 10 * 1024 * 1024) return "File size must be less than 10MB.";
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) return "Invalid file type. Please use JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, or TXT.";
    // Filename validation: alphanumeric, hyphens, underscores only
    const filenameRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
    if (!filenameRegex.test(file.name)) return "Filename can only contain letters, numbers, hyphens, and underscores.";
    return true;
  };

  const validateBusinessDocument = (files: FileList | null): boolean | string => {
    if (!files || files.length === 0) return true; // Optional field
    if (files.length > 5) return "Maximum 5 files allowed.";
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size === 0) return `File "${file.name}" is empty. Please choose a valid document.`;
      if (file.size > 10 * 1024 * 1024) return `File "${file.name}" must be less than 10MB.`;
      if (!allowedTypes.includes(file.type)) return `Invalid file type for "${file.name}". Please use PDF, DOC, DOCX, or TXT.`;
      // Filename validation: alphanumeric, hyphens, underscores only
      const filenameRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
      if (!filenameRegex.test(file.name)) return `Filename "${file.name}" can only contain letters, numbers, hyphens, and underscores.`;
    }
    return true;
  };

  const onSubmit = async (data: any) => {
    // TEMPORARILY DISABLED: Google Maps geocoding due to API quota limits
    // Uncomment when quota is restored
    // Geocoding with automatic fallback - no errors shown to users
    setIsGeocoding(true);
    clearErrors("address");

    const countryName = Country.getCountryByCode(data.country)?.name || '';
    const stateName = State.getStateByCodeAndCountry(data.state, data.country)?.name || '';
    const fullAddressToGeocode = `${data.address}, ${data.city}, ${stateName}, ${countryName}`;

    const geocodeResult = await geocodeAddress(fullAddressToGeocode);

    // The geocoding API now has built-in fallback, so it will never return an error
    // It will use null coordinates if geocoding fails
    const coordinates = geocodeResult.data || { lat: null, lng: null, formatted_address: data.address };

    const submissionData = {
      ...formData,
      ...data,
      phone_number: `${countryCode}${data.phone_number}`, // Combine country code with phone number
      profile_photo: selectedProfilePhoto,
      business_document: selectedBusinessDocuments,
      countryCodeForPhone: selectedCountry,
      countryDialCode: countryCode,
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng,
      },
      formatted_address: coordinates.formatted_address
    };

    nextStep(submissionData);
    setIsGeocoding(false);
  };

  return (
    <>

      {/* Profile Photo Preview Modal */}
      {showProfilePreview && profilePhotoUrl && (
        <div style={modalOverlayStyle} onClick={() => setShowProfilePreview(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h5 style={{ margin: 0 }}>Profile Photo Preview</h5>
              <button
                type="button"
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
                onClick={() => setShowProfilePreview(false)}
              >
                ×
              </button>
            </div>
            <img
              src={profilePhotoUrl}
              alt="Profile Preview"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}

      {/* Business Document Preview Modal */}
      {showBusinessDocPreview && businessDocUrl && selectedBusinessDocuments.length > 0 && (
        <div style={modalOverlayStyle} onClick={() => setShowBusinessDocPreview(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h5 style={{ margin: 0 }}>Business Document Preview (File 1 of {selectedBusinessDocuments.length})</h5>
              <button
                type="button"
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
                onClick={() => setShowBusinessDocPreview(false)}
              >
                ×
              </button>
            </div>
            {selectedBusinessDocuments[0].type === 'application/pdf' ? (
              <embed
                src={businessDocUrl}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '500px',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>This document type cannot be previewed in the browser.</p>
                <p>File: {selectedBusinessDocuments[0].name}</p>
                <p>Type: {selectedBusinessDocuments[0].type}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
                  style={{ height: '60px', minHeight: '60px' }}
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
                <div className="text-danger mt-1">{String(errors.phone_number.message)}</div>
              )}
            </div>
          </div>

          {/* Upload Profile Photo */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Upload Profile Photo*</label>
              <small className="d-block mb-2 text-primary">{note}</small>
              <div className="input-group-meta position-relative uniform-height">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  id="profile-photo-input"
                  className="hidden-file-input"
                  {...register("profile_photo", {
                    validate: (value) => validateProfilePhoto(value?.[0] || selectedProfilePhoto)
                  })}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                      if (!allowedTypes.includes(file.type)) {
                        toast.error('Invalid file type. Please upload a JPG, JPEG, PNG, or GIF file.');
                        e.target.value = '';
                        return;
                      }
                    }
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
                <label
                  htmlFor="profile-photo-input"
                  className={`file-upload-label ${selectedProfilePhoto ? 'file-selected' : ''}`}
                  style={{
                    height: '60px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 15px'
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedProfilePhoto
                      ? `${selectedProfilePhoto.name} (${(selectedProfilePhoto.size / 1024).toFixed(1)} KB)`
                      : "Choose Profile Photo"}
                  </span>
                  {selectedProfilePhoto && (
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowProfilePreview(true);
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '16px',
                          color: '#666'
                        }}
                        title="Preview photo"
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedProfilePhoto(null);
                          setProfilePhotoUrl(null);
                          setValue("profile_photo", null);
                          const input = document.getElementById('profile-photo-input') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '16px',
                          color: '#dc3545'
                        }}
                        title="Remove file"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  )}
                </label>
              </div>
              {errors.profile_photo && (
                <div className="text-danger mt-1">{String(errors.profile_photo.message)}</div>
              )}
            </div>
          </div>

          {/* Business Documents */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Business Registration Documents (Optional)</label>
              <small className="d-block mb-2 text-primary">Accepted formats: PDF, DOC, DOCX, TXT (Max 5 files, 10MB each)</small>
              <div className="input-group-meta position-relative uniform-height">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  id="business-document-input"
                  className="hidden-file-input"
                  {...register("business_document", {
                    validate: (value) => validateBusinessDocument(value || selectedBusinessDocuments)
                  })}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                      for (let i = 0; i < files.length; i++) {
                        if (!allowedTypes.includes(files[i].type)) {
                          toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
                          e.target.value = '';
                          return;
                        }
                      }
                      const fileArray = Array.from(files);
                      console.log(`📄 Business documents selected: ${fileArray.length} file(s)`, fileArray.map(f => f.name));
                      toast.success(`${fileArray.length} business document${fileArray.length > 1 ? 's' : ''} selected successfully`);
                      console.log('🔄 About to set state. Files array:', fileArray, 'Length:', fileArray.length);
                      setSelectedBusinessDocuments(fileArray);
                      setValue("business_document", files);
                      clearErrors("business_document");
                    } else {
                      console.log('⚠️ No files selected');
                      setSelectedBusinessDocuments([]);
                      setValue("business_document", null);
                    }
                  }}
                />
                <label
                  htmlFor="business-document-input"
                  className={`file-upload-label ${selectedBusinessDocuments && selectedBusinessDocuments.length > 0 ? 'file-selected' : ''}`}
                  style={{
                    height: '60px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 15px'
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedBusinessDocuments.length > 0
                      ? `${selectedBusinessDocuments.length} file${selectedBusinessDocuments.length > 1 ? 's' : ''} selected (${selectedBusinessDocuments.reduce((total, file) => total + file.size, 0) / 1024 < 1024 
                          ? `${(selectedBusinessDocuments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(1)} KB`
                          : `${(selectedBusinessDocuments.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(1)} MB`})`
                      : "Choose Business Documents"}
                  </span>
                  {selectedBusinessDocuments.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowBusinessDocPreview(true);
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '16px',
                          color: '#666'
                        }}
                        title="Preview first document"
                      >
                        <i className="fa fa-eye"></i>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedBusinessDocuments([]);
                          setBusinessDocUrl(null);
                          setValue("business_document", null);
                          const input = document.getElementById('business-document-input') as HTMLInputElement;
                          if (input) input.value = '';
                          toast.success('All business documents removed');
                        }}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '16px',
                          color: '#dc3545'
                        }}
                        title="Remove all files"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  )}
                </label>
              </div>
              {errors.business_document && (
                <div className="text-danger mt-1">{String(errors.business_document.message)}</div>
              )}
              
              {/* Display list of selected files */}
              {(() => {
                console.log('🖼️ Rendering file list. selectedBusinessDocuments:', selectedBusinessDocuments, 'Length:', selectedBusinessDocuments.length, 'Should show:', selectedBusinessDocuments.length > 0);
                return null;
              })()}
              {selectedBusinessDocuments.length > 0 ? (
                <div style={{ marginTop: '15px' }}>
                  <div style={{ fontWeight: '500', color: '#555', marginBottom: '10px' }}>
                    Selected Files ({selectedBusinessDocuments.length}):
                  </div>
                  <div style={{ border: '1px solid #dee2e6', borderRadius: '4px', padding: '15px', backgroundColor: '#f8f9fa' }}>
                    {selectedBusinessDocuments.map((file, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: index < selectedBusinessDocuments.length - 1 ? '10px' : '0',
                          paddingBottom: index < selectedBusinessDocuments.length - 1 ? '10px' : '0',
                          borderBottom: index < selectedBusinessDocuments.length - 1 ? '1px solid #dee2e6' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <i className="fa fa-file-text" style={{ color: '#6c757d', marginRight: '10px' }}></i>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', color: '#333' }}>{file.name}</div>
                            <small style={{ color: '#6c757d' }}>
                              {file.size / 1024 < 1024 
                                ? `${(file.size / 1024).toFixed(1)} KB` 
                                : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                              {' • '}
                              {file.type ? file.type.split('/')[1]?.toUpperCase() || 'FILE' : 'FILE'}
                            </small>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            // Remove individual file
                            const newFiles = selectedBusinessDocuments.filter((_, i) => i !== index);
                            setSelectedBusinessDocuments(newFiles);
                            
                            // Update the file input
                            const dt = new DataTransfer();
                            newFiles.forEach(f => dt.items.add(f));
                            setValue("business_document", dt.files.length > 0 ? dt.files : null);
                            
                            if (newFiles.length === 0) {
                              const input = document.getElementById('business-document-input') as HTMLInputElement;
                              if (input) input.value = '';
                            }
                            toast.success(`Removed ${file.name}`);
                          }}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#dc3545',
                            padding: '4px 8px',
                            fontSize: '16px'
                          }}
                          title={`Remove ${file.name}`}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Location Details */}
          <div className="col-12">
            <label>Location Details*</label>
            <div className="row mt-4">
              {/* Country */}
              <div className="col-md-6">
                <div className="input-group-meta position-relative mb-25">
                  <label>Country*</label>
                  <div className="input-group-meta position-relative uniform-height">
                    <select
                      className="form-control"
                      style={{ height: '60px', minHeight: '60px' }}
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
                  </div>
                  {errors.country && (
                    <div className="text-danger mt-1">{String(errors.country.message)}</div>
                  )}
                </div>
              </div>

              {/* State */}
              <div className="col-md-6">
                <div className="input-group-meta position-relative mb-25">
                  <label>State*</label>
                  <div className="input-group-meta position-relative uniform-height">
                    <select
                      className="form-control"
                      style={{ height: '60px', minHeight: '60px' }}
                      {...register("state", {
                        required: "State is required",
                        onChange: (e) => {
                          setValue("city", "");
                          clearErrors("state");
                        }
                      })}
                    >
                      <option value="">Select State</option>
                      {watch("country") && (() => {
                        const states = State.getStatesOfCountry(watch("country"));
                        const countryName = Country.getCountryByCode(watch("country"))?.name;

                        if (states.length === 0 && countryName) {
                          return (
                            <option key={countryName} value={countryName}>
                              {countryName}
                            </option>
                          );
                        }

                        return states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ));
                      })()}
                    </select>
                  </div>
                  {errors.state && (
                    <div className="text-danger mt-1">{String(errors.state.message)}</div>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="col-md-6">
                <div className="input-group-meta position-relative mb-25">
                  <label>City*</label>
                  <div className="input-group-meta position-relative uniform-height">
                    <select
                      className="form-control"
                      style={{ height: '60px', minHeight: '60px' }}
                      {...register("city", {
                        required: "City is required"
                      })}
                      onChange={() => clearErrors("city")}
                    >
                      <option value="">Select City</option>
                      {watch("state") && (() => {
                        const cities = City.getCitiesOfState(watch("country"), watch("state"));
                        const stateName = State.getStateByCodeAndCountry(watch("state"), watch("country"))?.name;
                        const countryName = Country.getCountryByCode(watch("country"))?.name;

                        if (cities.length === 0) {
                          const fallbackName = stateName || countryName;
                          if (fallbackName) {
                            return (
                              <option key={fallbackName} value={fallbackName}>
                                {fallbackName}
                              </option>
                            );
                          }
                        }

                        return cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ));
                      })()}
                    </select>
                  </div>
                  {errors.city && (
                    <div className="text-danger mt-1">{String(errors.city.message)}</div>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="col-md-6">
                <div className="input-group-meta position-relative mb-25">
                  <label>Pincode/ZIP Code*</label>
                  <div className="input-group-meta position-relative uniform-height">
                    <input
                      type="text"
                      className="form-control"
                      style={{ height: '60px', minHeight: '60px' }}
                      placeholder="Enter pincode/ZIP code"
                      maxLength={10}
                      {...register("pincode", {
                        required: "Pincode/ZIP code is required",
                        pattern: {
                          value: /^[a-zA-Z0-9\s-]{3,10}$/,
                          message: "Please enter a valid pincode/ZIP code"
                        }
                      })}
                      onChange={() => clearErrors("pincode")}
                    />
                  </div>
                  {errors.pincode && (
                    <div className="text-danger mt-1">{String(errors.pincode.message)}</div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="col-12">
                <div className="input-group-meta position-relative mb-25">
                  <label>Full Address*</label>
                  <small className="d-block mb-2 text-success">
                    Please provide your full street address for accurate location verification.
                  </small>
                  <div className="input-group-meta position-relative uniform-height">
                    <textarea
                      className="form-control"
                      style={{ 
                        minHeight: '100px',
                        backgroundColor: 'var(--bg-white, #fff)'
                      }}
                      placeholder="e.g., 123 Main St, Anytown, State, 12345"
                      {...register("address", {
                        required: "Full address is required",
                      })}
                      rows={3}
                      onChange={() => clearErrors("address")}
                    />
                  </div>
                  {errors.address && (
                    <div className="text-danger mt-1">{String(errors.address.message)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="col-6">
            <button
              type="button"
              className="btn-one w-100 mt-30"
              onClick={prevStep}
              // disabled={isGeocoding} // Commented out since geocoding is disabled
            >
              Previous
            </button>
          </div>
          <div className="col-6">
            <button
              type="submit"
              className="btn-one w-100 mt-30"
              // disabled={isGeocoding} // Commented out since geocoding is disabled
            >
              {/* {isGeocoding ? "Verifying Address..." : "Next"} // Commented out since geocoding is disabled */}
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

// Modal styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1050,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '700px',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default ClientStep3;

// Styles
if (typeof document !== 'undefined') {
  const styleId = 'client-step3-styles-unique';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
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
        height: 60px !important;
        background-color: var(--bg-white) !important;
        border: 2px solid #E3E3E3 !important;
        border-radius: 8px !important;
        padding: 0 8px 0 60px !important;
        font-size: 16px !important;
        font-family: inherit !important;
        cursor: default !important;
        text-align: left !important;
      }
      .country-code-button {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        height: 60px !important;
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
        height: 60px !important;
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
        font-size: 14px !important;
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
      .hidden-file-input {
        display: none;
      }
      .file-upload-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        background-color: var(--bg-white);
        border: 2px solid #E3E3E3;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        color: #333;
        transition: all 0.2s ease;
        width: 100%;
        font-weight: 400;
      }
      .file-upload-label:hover {
        border-color: #007bff;
        background-color: #f8f9fa;
      }
      .file-upload-label.file-selected {
        border-color: #28a745;
        background-color: #d4edda;
        color: #155724;
      }
      .uniform-height {
        height: 60px;
        min-height: 60px;
      }
    `;
    document.head.appendChild(style);
  }
}