"use client";
import React from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const videoEditorStep3: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  const note =
    "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

  // State to track which fields have been touched/interacted with
  const [touched, setTouched] = React.useState({
    phone: false,
    profile_photo: false,
    id_type: false,
    id_document: false
  });

  // Validation
  const phoneValid = !!formData.phone_number && /^[0-9]{10}$/.test(formData.phone_number);
  const profilePhotoValid = !!formData.profile_photo;
  const idTypeValid = !!formData.id_type;
  const idDocumentValid = !!formData.id_document;

  return (
    <div>
      <h4 className="mb-3">Phone Number & OTP Verification*</h4>
      <div className="row">
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input
              type="tel"
              className="form-control"
              value={formData.phone_number || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
              onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
              onFocus={() => setTouched(prev => ({ ...prev, phone: true }))}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {touched.phone && formData.phone_number && !phoneValid && (
              <small className="text-danger">Phone number must be exactly 10 digits</small>
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

      <div className="mt-3">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control mb-2"
              value={formData.id_type || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, id_type: e.target.value }))}
              onBlur={() => setTouched(prev => ({ ...prev, id_type: true }))}
              onFocus={() => setTouched(prev => ({ ...prev, id_type: true }))}
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
              accept="image/*,.pdf"
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, id_document: e.target.files?.[0] || "" }));
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
          disabled={!phoneValid || !profilePhotoValid || !idTypeValid || !idDocumentValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default videoEditorStep3;


