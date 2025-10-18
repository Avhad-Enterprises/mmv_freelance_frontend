"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep4: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Work Arrangement */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Preferred Work Arrangement*</label>
            <select
              className="form-control"
              {...register("work_arrangement", { required: "Work arrangement is required" })}
            >
              <option value="">Select Work Arrangement</option>
              <option value="remote">Remote</option>
              <option value="on_site">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.work_arrangement && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.work_arrangement.message)}
              </div>
            )}
          </div>
        </div>

        {/* Project Frequency */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Project Frequency*</label>
            <select
              className="form-control"
              {...register("project_frequency", { required: "Project frequency is required" })}
            >
              <option value="">Select Project Frequency</option>
              <option value="one_time">One-time Project</option>
              <option value="occasional">Occasional Projects</option>
              <option value="ongoing">Ongoing Projects</option>
            </select>
            {errors.project_frequency && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.project_frequency.message)}
              </div>
            )}
          </div>
        </div>

        {/* Hiring Preferences */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Hiring Preferences*</label>
            <select
              className="form-control"
              {...register("hiring_preferences", { required: "Hiring preference is required" })}
            >
              <option value="">Select Hiring Preference</option>
              <option value="individuals">Individual Freelancers</option>
              <option value="agencies">Agencies Only</option>
              <option value="both">Both Individuals and Agencies</option>
            </select>
            {errors.hiring_preferences && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.hiring_preferences.message)}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="col-12 d-flex justify-content-between mt-40">
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

export default ClientStep4;