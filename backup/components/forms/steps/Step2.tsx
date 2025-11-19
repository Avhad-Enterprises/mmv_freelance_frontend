"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import MultipleSelectionField from './MultipleSelectionField';
import { ALL_SKILLS } from '@/data/all-skills';

const Step2: React.FC<{ 
  nextStep: (data: any) => void; 
  prevStep: () => void;
  formData: any;
}> = ({ 
  nextStep, 
  prevStep, 
  formData 
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ 
    defaultValues: formData 
  });

  // Local state for skills selection
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>(formData.skills || []);

  // Sync local state with form state on change
  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
    setValue('skills', skills);
  };

  // Ensure local state is submitted
  const onSubmit = (data: any) => {
    nextStep({ ...data, skills: selectedSkills });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Profile Title */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Profile Title*</label>
            <input 
              type="text" 
              placeholder="e.g. Professional Video Editor & Cinematographer" 
              className="form-control"
              {...register("profile_title", { required: "Profile title is required" })}
            />
            {errors.profile_title && (
              <div className="error">{errors.profile_title.message as string}</div>
            )}
          </div>
        </div>

        {/* Skills (single box, multi-select) */}
        <div className="col-12">
          <MultipleSelectionField
            label="Skills"
            options={ALL_SKILLS}
            selectedItems={selectedSkills}
            onChange={handleSkillsChange}
            required={true}
            error={errors.skills?.message as string}
            placeholder="Search and select your skills"
          />
        </div>

        {/* Experience Level */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Experience Level*</label>
            <select 
              className="form-control"
              {...register("experience_level", { required: "Experience level is required" })}
            >
              <option value="">Select Experience Level</option>
              <option value="entry">Entry Level (0-2 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="expert">Expert (5-8 years)</option>
              <option value="master">Master (8+ years)</option>
            </select>
            {errors.experience_level && (
              <div className="error">{errors.experience_level.message as string}</div>
            )}
          </div>
        </div>

        {/* Portfolio Links */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Portfolio Links</label>
            <input 
              type="text" 
              placeholder="https://your-portfolio.com" 
              className="form-control"
              {...register("portfolio_links")}
            />
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Hourly Rate (INR)*</label>
            <input 
              type="number" 
              placeholder="e.g. 500" 
              className="form-control"
              min="0"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value < "0") {
                  e.target.value = "0";
                }
              }}
              {...register("hourly_rate", { 
                required: "Hourly rate is required",
                min: { value: 100, message: "Minimum rate is ₹100/hour" },
                max: { value: 10000, message: "Maximum rate is ₹10,000/hour" }
              })}
            />
            {errors.hourly_rate && (
              <div className="error">{errors.hourly_rate.message as string}</div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="col-12 d-flex justify-content-between">
          <button 
            type="button" 
            className="btn-one"
            onClick={prevStep}
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="btn-one"
          >
            Next
          </button>
        </div>
      </div>

      <style jsx>{`
        .error {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </form>
  );
};

export default Step2;