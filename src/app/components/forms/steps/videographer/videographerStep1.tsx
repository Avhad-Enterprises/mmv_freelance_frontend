// steps/videographer/VideographerStep1.tsx
"use client";
import React from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
};

// Only videographerBaseSkills are needed here
const videographerBaseSkills = [
  "Reel videographer",
  "Corporate Interview / Talking‑Head Videographer",
  "Documentary Field Cameraperson",
  "Wedding Cinematographer",
  "Event / Conference Coverage",
  "Commercial Product Shooter",
  "Music Video / Performance DP",
  "Sports & Action Videographer",
  "Aerial / Drone Operator",
  "Real‑Estate & Architecture Videographer",
  "Fashion & Beauty Cinematographer",
  "Live‑Streaming / Multi‑Cam Operator",
  "Nature & Wildlife Cameraperson",
  "Time-lapse",
  "360º / VR Videographer",
];

const videographerStep1: React.FC<Props> = ({ formData, setFormData, nextStep }) => {
  // 'role' state is no longer needed as 'account_type' from MultiStepRegisterForm dictates this.
  // We explicitly use 'base_skills' from formData for videographer skills.
  const { username = "", full_name = "", email = "", password = "", base_skills = [] } = formData || {};

  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Simple validations
  const emailValid = !!email && /.+@.+\..+/.test(email);
  const passwordValid = !!password && password.length >= 6;
  const nameValid = !!full_name && full_name.trim().length >= 2;

  // Filter based only on videographerBaseSkills
  const filtered: string[] = (videographerBaseSkills || []).filter(
    (s: string) => !base_skills.includes(s) && s.toLowerCase().includes(query.toLowerCase())
  );

  const addSkill = (skill: string) => {
    if (base_skills.length >= 15) return;
    setFormData((prev) => ({ ...prev, base_skills: [...(prev.base_skills || []), skill] }));
    setQuery("");
    setOpen(false);
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, base_skills: (prev.base_skills || []).filter((x: string) => x !== skill) }));
  };

  return (
    <div>
      <h4 className="mb-3">Register as a Videographer</h4> {/* Updated title */}

      {/* Removed the "I am Videographer / Video Editor" buttons */}
    <div className="input-group-meta position-relative mb-25">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your full name"
          value={username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
        />
        
      </div>
      <div className="input-group-meta position-relative mb-25">
        <label>Full Name*</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your full name"
          value={full_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
        />
        {!nameValid && (
          <small className="text-danger">Full name is required</small>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
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

      {/* Skills section - always visible for videographer */}
      <div className="mb-3" style={{ position: "relative" }}>
        <label>Select up to 15 skills*</label>

        {/* Selected chips */}
        <div className="d-flex flex-wrap gap-2 mt-2">
          {base_skills.map((s: string) => (
            <span key={s} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
              {s}
              <button
                type="button"
                className="btn btn-sm btn-link text-white p-0 m-0"
                onClick={() => removeSkill(s)}
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Input with dropdown */}
        <input
          type="text"
          className="form-control mt-2"
          placeholder={base_skills.length >= 15 ? "You reached the 15 skills limit" : "Type to search skills"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          disabled={base_skills.length >= 15}
        />

        {open && filtered.length > 0 && (
          <div
            className="border bg-white mt-1 rounded"
            style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 220, overflowY: "auto" }}
          >
            {filtered.map((s: string) => (
              <button
                type="button"
                key={s}
                className="dropdown-item w-100 text-start"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addSkill(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <small className="text-muted d-block mt-1">Selected {base_skills.length}/15</small>
      </div>

      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn-one"
          onClick={() => nextStep({})}
          disabled={!nameValid || !emailValid || !passwordValid || base_skills.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default videographerStep1;