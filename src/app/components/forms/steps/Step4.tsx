import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MultipleSelectionField from "./MultipleSelectionField";
import { languages } from "./languagesList";

const Step4: React.FC<{ nextStep: (data: any) => void; prevStep: () => void; formData: any }> = ({ nextStep, prevStep, formData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues: formData });
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(formData?.languages || []);

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Availability */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Availability*</label>
            <select 
              className="form-control"
              {...register("availability", { required: "Availability is required" })}
            >
              <option value="">Select Availability</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="flexible">Flexible</option>
              <option value="on_demand">On-Demand</option>
            </select>
            {errors.availability && (
              <div className="error">{String(errors.availability.message)}</div>
            )}
          </div>
        </div>

        {/* Hours per week */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Hours per Week*</label>
            <select 
              className="form-control"
              {...register("hours_per_week", { required: "Hours per week is required" })}
            >
              <option value="">Select Hours</option>
              <option value="less_than_20">Less than 20 hours</option>
              <option value="20_30">20-30 hours</option>
              <option value="30_40">30-40 hours</option>
              <option value="more_than_40">More than 40 hours</option>
            </select>
            {errors.hours_per_week && (
              <div className="error">{String(errors.hours_per_week.message)}</div>
            )}
          </div>
        </div>

        {/* Work Type */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Work Type*</label>
            <select 
              className="form-control"
              {...register("work_type", { required: "Work type is required" })}
            >
              <option value="">Select Work Type</option>
              <option value="remote">Remote Only</option>
              <option value="on_site">On-Site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.work_type && (
              <div className="error">{String(errors.work_type.message)}</div>
            )}
          </div>
        </div>

        {/* Preferred Time Zone */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Preferred Time Zone*</label>
            <select 
              className="form-control"
              {...register("timezone", { required: "Time zone is required" })}
            >
              <option value="">Select Time Zone</option>
              <option value="UTC-12">UTC-12</option>
              <option value="UTC-11">UTC-11</option>
              {/* Add more time zones */}
              <option value="UTC+12">UTC+12</option>
            </select>
            {errors.timezone && (
              <div className="error">{String(errors.timezone.message)}</div>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="col-12">
          <MultipleSelectionField
            label="Languages"
            options={languages}
            selectedItems={selectedLanguages}
            onChange={(langs) => {
              setSelectedLanguages(langs);
              setValue('languages', langs);
            }}
            required={true}
            error={errors.languages?.message as string}
            placeholder="Search and select languages you know"
          />
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
    </form>
  );
};

export default Step4;