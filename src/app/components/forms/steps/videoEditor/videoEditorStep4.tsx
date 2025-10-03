"use client";
import React from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const videoEditorStep4: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  const [languageQuery, setLanguageQuery] = React.useState("");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

  // Common languages list
  const availableLanguages = [
    "English", "Hindi", "Marathi", "Gujarati", "Bengali", "Telugu", "Tamil", 
    "Kannada", "Malayalam", "Punjabi", "Urdu", "Sanskrit", "Spanish", "French", 
    "German", "Chinese", "Japanese", "Korean", "Arabic", "Russian"
  ];

  // Validation
  const shortDescriptionValid = !!formData.short_description && formData.short_description.trim().length >= 10;
  const availabilityValid = !!formData.availability;
  const languagesValid = !!(formData.languages && formData.languages.length > 0);

  return (
    <div>
      <h4 className="mb-3">Short description about yourself*</h4>
      <div className="input-group-meta position-relative mb-25">
        <label>Short description (minimum 10 characters)*</label>
        <textarea
          className="form-control"
          rows={4}
          value={formData.short_description || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
          placeholder="Tell us about your experience and skills..."
        />
        {formData.short_description && !shortDescriptionValid && (
          <small className="text-danger">Description must be at least 10 characters long</small>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Availability*</label>
            <select
              className="form-control"
              value={formData.availability || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value }))}
            >
              <option value="">Select Availability</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
              <option value="flexible">Flexible</option>
              <option value="on-demand">On-Demand</option>
            </select>
            {!availabilityValid && (
              <small className="text-danger">Availability is required</small>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Languages Spoken*</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Type to search languages"
                value={languageQuery}
                onChange={(e) => {
                  setLanguageQuery(e.target.value);
                  setIsLanguageDropdownOpen(true);
                }}
                onFocus={() => setIsLanguageDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsLanguageDropdownOpen(false), 150)}
              />
              {isLanguageDropdownOpen && (
                <div
                  className="border bg-white mt-1 rounded shadow-sm"
                  style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 200, overflowY: "auto" }}
                >
                  {availableLanguages
                    .filter(lang => 
                      lang.toLowerCase().includes(languageQuery.toLowerCase()) &&
                      !(formData.languages || []).includes(lang)
                    )
                    .map(lang => (
                      <button
                        key={lang}
                        type="button"
                        className="dropdown-item w-100 text-start"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            languages: [...(prev.languages || []), lang]
                          }));
                          setLanguageQuery("");
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                </div>
              )}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {(formData.languages || []).map((lang: string) => (
                <span key={lang} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
                  {lang}
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-white p-0 m-0"
                    onClick={() => setFormData((prev) => ({ 
                      ...prev, 
                      languages: prev.languages.filter((x: string) => x !== lang)
                    }))}
                    style={{textDecoration: 'none', lineHeight: 1}}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {!languagesValid && (
              <small className="text-danger">At least one language is required</small>
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
          disabled={!shortDescriptionValid || !availabilityValid || !languagesValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default videoEditorStep4;


