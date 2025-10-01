"use client";
import React, { useState, useEffect } from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
};

// Define a type for the skill object received from the API
type Skill = {
  skill_id: number;
  skill_name: string;
};

const VideoEditorStep1: React.FC<Props> = ({ formData, setFormData, nextStep }) => {
  const { username = "", first_name = "", last_name = "", email = "", password = "" } = formData || {};

  // UI State
  const [showPassword, setShowPassword] = useState(false);

  // Simple validations
  const emailValid = !!email && /.+@.+\..+/.test(email);
  const passwordValid = !!password && password.length >= 6;
  const firstNameValid = !!first_name && first_name.trim().length >= 2;
  const lastNameValid = !!last_name && last_name.trim().length >= 2;

  return (
    <div>

      <div className="input-group-meta position-relative mb-25">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
        />
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>First Name*</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your first name"
          value={first_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
        />
        {!firstNameValid && (
          <small className="text-danger">First name is required</small>
        )}
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>Last Name*</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your last name"
          value={last_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
        />
        {!lastNameValid && (
          <small className="text-danger">Last name is required</small>
        )}
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>Email*</label>
        <input
          type="email"
          className="form-control"
          placeholder="james@example.com"
          value={email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
        {!emailValid && (
          <small className="text-danger">Valid email is required</small>
        )}
      </div>

      <div className="input-group-meta position-relative mb-25">
        <label>Password*</label>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        />
        <span
          className="placeholder_icon"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: 'absolute', right: '15px', top: '80%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          aria-label="Toggle password visibility"
        >
          <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </span>
        {!passwordValid && (
          <small className="text-danger">Password must be at least 6 characters</small>
        )}
      </div>



      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn-one"
          onClick={() => nextStep({})}
          disabled={!firstNameValid || !lastNameValid || !emailValid || !passwordValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoEditorStep1;