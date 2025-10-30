"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const VideographerStep4: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      ...formData,
      languages: formData.languages || [], // Ensure languages is an array
    },
    mode: 'onChange'
  });

  const availableLanguages = [
    "English", "Hindi", "Marathi", "Gujarati", "Bengali", "Telugu", "Tamil",
    "Kannada", "Malayalam", "Punjabi", "Urdu", "Sanskrit", "Spanish", "French",
    "German", "Chinese", "Japanese", "Korean", "Arabic", "Russian"
  ];

  const languages = watch("languages");

  // Register the 'languages' field and its validation rules.
  React.useEffect(() => {
    register("languages", {
      validate: (value) => (value && value.length > 0) || "At least one language is required",
    });
  }, [register]);

  const addLanguage = (lang: string) => {
    if (lang && !languages.includes(lang)) {
      const newLanguages = [...languages, lang];
      setValue("languages", newLanguages, { shouldValidate: true });
    }
  };

  const removeLanguage = (lang: string) => {
    const newLanguages = languages.filter((x: string) => x !== lang);
    setValue("languages", newLanguages, { shouldValidate: true });
  };

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Short Description */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Short description about yourself*</label>
            <textarea
              className="form-control"
              style={{ minHeight: '120px' }}
              placeholder="Tell us about your experience and skills..."
              {...register("short_description", {
                required: "Short description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters long"
                },
              })}
            />
            {errors.short_description && (
              <div className="error" style={{ color: 'red', marginTop: '5px' }}>
                {String(errors.short_description.message)}
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        {/* HIGHLIGHT: 'uniform-height' class has been removed from here */}
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Availability*</label>
            <select
              className="form-control"
              style={{ height: '60px', minHeight: '60px' }}
              {...register("availability", { required: "Availability is required" })}
            >
              <option value="">Select Availability</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
              <option value="flexible">Flexible</option>
              <option value="on-demand">On-Demand</option>
            </select>
            {errors.availability && (
              <div className="error" style={{ color: 'red', marginTop: '5px' }}>
                {String(errors.availability.message)}
              </div>
            )}
          </div>
        </div>

        {/* Languages Spoken */}
        {/* HIGHLIGHT: 'uniform-height' class has been removed from here */}
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Languages Spoken*</label>
            <select
              className="form-control"
              style={{ height: '60px', minHeight: '60px' }}
              onChange={(e) => {
                addLanguage(e.target.value);
                e.target.value = ""; // Reset dropdown after selection
              }}
            >
              <option value="">Add a language...</option>
              {availableLanguages
                .filter(lang => !languages.includes(lang)) // Hide already selected languages
                .map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
            
            {/* Display selected languages as tags */}
            <div className="d-flex flex-wrap gap-2 mt-2">
              {languages.map((lang: string) => (
                <span key={lang} className="badge bg-success d-flex align-items-center" style={{ gap: 6, padding: '0.5em 0.75em' }}>
                  {lang}
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-white p-0 m-0 fw-bold"
                    style={{ fontSize: '16px', lineHeight: 1, textDecoration: 'none' }}
                    onClick={() => removeLanguage(lang)}
                    aria-label={`Remove ${lang}`}
                    title={`Remove ${lang}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {errors.languages && (
              <div className="error" style={{ color: 'red', marginTop: '5px' }}>
                {String(errors.languages.message)}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="col-6">
          <button type="button" className="btn-one tran3s w-100 mt-30" onClick={prevStep}>
            Previous
          </button>
        </div>
        <div className="col-6">
          <button type="submit" className="btn-one tran3s w-100 mt-30" disabled={!isValid}>
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default VideographerStep4;