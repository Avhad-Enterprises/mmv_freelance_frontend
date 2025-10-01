"use client";
import React from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const FreelancerStep3: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  const note =
    "Upload your original profile photo only. If fake images are detected, your profile will be de-activated immediately.";

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
              placeholder="Enter phone number"
            />
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
        }}
      />

      <div className="mt-3">
        <h5>ID Verification*</h5>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control mb-2"
              value={formData.id_type || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, id_type: e.target.value }))}
            >
              <option value="">Select ID Type*</option>
              <option value="passport">Passport</option>
              <option value="driving_license">Driving License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>
          <div className="col-md-6">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFormData((prev) => ({ ...prev, id_document: e.target.files?.[0] || "" }))}
            />
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
          disabled={!formData.phone_number || !formData.profile_photo || !formData.id_type || !formData.id_document}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FreelancerStep3;


