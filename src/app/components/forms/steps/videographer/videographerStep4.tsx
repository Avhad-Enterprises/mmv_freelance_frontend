"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const videographerStep4: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, clearErrors, watch } = useForm({
    defaultValues: formData,
    mode: 'onSubmit'
  });

  // Register languages array with validation
  React.useEffect(() => {
    register("languages", {
      validate: (value) => {
        const langs = value || [];
        return langs.length > 0 || "At least one language is required";
      }
    });
  }, [register]);

  const [languageQuery, setLanguageQuery] = React.useState("");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

  // Common languages list with focus on Indian and international languages
  const availableLanguages = [
    "English", "Hindi", "Marathi", "Gujarati", "Bengali", "Telugu", "Tamil", 
    "Kannada", "Malayalam", "Punjabi", "Urdu", "Sanskrit", "Spanish", "French", 
    "German", "Chinese", "Japanese", "Korean", "Arabic", "Russian"
  ];

  const { languages = [] } = watch() || formData;

  const addLanguage = (lang: string) => {
    if (lang && !languages.includes(lang)) {
      const currentLanguages = watch("languages") || [];
      const newLanguages = [...currentLanguages, lang];
      setValue("languages", newLanguages);
      clearErrors("languages");
    }
  };

  const removeLanguage = (langToRemove: string) => {
    const currentLanguages = watch("languages") || [];
    const newLanguages = currentLanguages.filter((lang: string) => lang !== langToRemove);
    setValue("languages", newLanguages);
    clearErrors("languages");
  };

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-3">Short description about yourself*</h4>
      <div className="input-group-meta position-relative mb-25">
        <label>Short description</label>
        <textarea
          className="form-control"
          rows={4}
          {...register("short_description", {
            required: "Short description is required",
            onChange: () => clearErrors("short_description")
          })}
        />
        {errors.short_description && (
          <div className="error">{String(errors.short_description.message)}</div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Availability*</label>
            <select
              className="form-control"
              {...register("availability", {
                required: "Availability is required",
                onChange: () => clearErrors("availability")
              })}
            >
              <option value="">Select</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
              <option value="flexible">Flexible</option>
              <option value="on-demand">On-Demand</option>
            </select>
            {errors.availability && (
              <div className="error">{String(errors.availability.message)}</div>
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
                      !languages.includes(lang)
                    )
                    .map(lang => (
                      <button
                        key={lang}
                        type="button"
                        className="dropdown-item w-100 text-start"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          addLanguage(lang);
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
              {languages.map((lang: string) => (
                <span key={lang} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
                  {lang}
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-white p-0 m-0"
                    onClick={() => removeLanguage(lang)}
                    style={{textDecoration: 'none', lineHeight: 1}}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.languages && (
              <div className="error">{String(errors.languages.message)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>
          Previous
        </button>
        <button
          type="submit"
          className="btn-one"
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default videographerStep4;


