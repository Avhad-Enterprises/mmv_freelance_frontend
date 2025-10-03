"use client";
import React from "react";
import { Country, City } from "country-state-city";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const VideoEditorStep3: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  const note =
    "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  const { country = "" } = formData;

  // State to track which fields have been touched/interacted with
  const [touched, setTouched] = React.useState({
    phone: false,
    profile_photo: false,
    id_type: false,
    id_document: false,
    country: false,
    city: false,
    pincode: false,
    address: false, // Added
  });

  // Validation
  const phoneValid = !!formData.phone_number && /^[0-9]{10}$/.test(formData.phone_number);
  const profilePhotoValid = !!formData.profile_photo;
  const idTypeValid = !!formData.id_type;
  const idDocumentValid = !!formData.id_document;
  const countryValid = !!formData.country;
  const cityValid = !!formData.city;
  const pincodeValid = !!formData.pincode && /^\d{5,6}$/.test(formData.pincode);
  const addressValid = !!formData.address && formData.address.trim() !== ""; // Added

  const isFormValid = phoneValid && profilePhotoValid && idTypeValid && idDocumentValid && countryValid && cityValid && pincodeValid && addressValid; // Added addressValid

  return (
    <div>
      <h4 className="mb-3">Phone Number Verification*</h4>
      <div className="input-group-meta position-relative mb-25">
        <label>Phone Number*</label>
        <input
          type="tel"
          className="form-control"
          value={formData.phone_number || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
          onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
          placeholder="Enter 10-digit phone number"
          maxLength={10}
        />
        {touched.phone && formData.phone_number && !phoneValid && (
          <small className="text-danger">Phone number must be exactly 10 digits</small>
        )}
      </div>

      <h4 className="mb-3 mt-4">Location Details*</h4>
      <div className="row">
        <div className="col-md-4">
          <div className="input-group-meta position-relative mb-25">
            <label>Country*</label>
            <select
              className="form-control"
              value={formData.country || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  country: e.target.value,
                  city: "", // Reset city when country changes
                  coordinates: { lat: "", lng: "" }
                }));
                setTouched(prev => ({ ...prev, country: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, country: true }))}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
            {touched.country && !countryValid && <small className="text-danger">Country is required</small>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group-meta position-relative mb-25">
            <label>City*</label>
            <select
              className="form-control"
              value={formData.city || ""}
              disabled={!country}
              onChange={(e) => {
                const cityName = e.target.value;
                const cities = country ? City.getCitiesOfCountry(country) : [];
                const selectedCity = cities?.find(c => c.name === cityName);
                setFormData((prev) => ({
                  ...prev,
                  city: cityName,
                  coordinates: {
                    lat: selectedCity?.latitude || "",
                    lng: selectedCity?.longitude || "",
                  },
                }));
                setTouched(prev => ({ ...prev, city: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
            >
              <option value="">Select City</option>
              {country && (City.getCitiesOfCountry(country) || []).map((ct) => (
                <option key={`${ct.name}-${ct.latitude}`} value={ct.name}>{ct.name}</option>
              ))}
            </select>
            {touched.city && !cityValid && <small className="text-danger">City is required</small>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-group-meta position-relative mb-25">
            <label>Pincode*</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Pincode"
              value={formData.pincode || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
              onBlur={() => setTouched(prev => ({ ...prev, pincode: true }))}
              maxLength={6}
            />
            {touched.pincode && !pincodeValid && <small className="text-danger">A valid 5-6 digit pincode is required</small>}
          </div>
        </div>
        {/* New Address Field */}
        <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
                <label>Address*</label>
                <textarea
                    className="form-control"
                    placeholder="Enter your full address"
                    value={formData.address || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                    rows={3}
                />
                {touched.address && !addressValid && <small className="text-danger">Address is required</small>}
            </div>
        </div>
      </div>

      <h4 className="mb-2 mt-4">Upload Profile Photo*</h4>
      <small className="d-block mb-2">{note}</small>
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          setFormData((prev) => ({ ...prev, profile_photo: file }));
          setTouched(prev => ({ ...prev, profile_photo: true }));
        }}
        onBlur={() => setTouched(prev => ({ ...prev, profile_photo: true }))}
      />
      {touched.profile_photo && !profilePhotoValid && (
        <small className="text-danger d-block mt-1">Profile photo is required</small>
      )}

      <div className="mt-4">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control mb-2"
              value={formData.id_type || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, id_type: e.target.value }));
                setTouched(prev => ({ ...prev, id_type: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, id_type: true }))}
            >
              <option value="">Select ID Type*</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
            {touched.id_type && !idTypeValid && (
              <small className="text-danger d-block">ID type is required</small>
            )}
          </div>
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              accept="image/*,.pdf"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, id_document: e.target.files?.[0] || null }));
                setTouched(prev => ({ ...prev, id_document: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, id_document: true }))}
            />
            {touched.id_document && !idDocumentValid && (
              <small className="text-danger d-block mt-1">ID document is required</small>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>
          Previous
        </button>
        <button
          type="button"
          className="btn-one"
          onClick={() => nextStep({})}
          disabled={!isFormValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoEditorStep3;