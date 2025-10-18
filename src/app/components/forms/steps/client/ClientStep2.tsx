"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import MultipleSelectionField from "../MultipleSelectionField"; // Assuming this path is correct

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const ClientStep2: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue,
    trigger
  } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  const [selectedServices, setSelectedServices] = useState<string[]>(formData?.required_services || []);

  // Register the custom 'required_services' field and its validation rule
  useEffect(() => {
    register("required_services", {
      validate: (value) => value && value.length > 0 || "Please select at least one service"
    });
  }, [register]);

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Company/Brand Name */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Company/Brand Name*</label>
            <input
              type="text"
              placeholder="Enter your company name"
              className="form-control"
              {...register("company_name", { required: "Company name is required" })}
            />
            {errors.company_name && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.company_name.message)}
              </div>
            )}
          </div>
        </div>

        {/* Industry */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Industry*</label>
            <select
              className="form-control"
              {...register("industry", { required: "Industry is required" })}
            >
              <option value="">Select Industry</option>
              <option value="film">Film</option>
              <option value="ad_agency">Ad Agency</option>
              <option value="events">Events</option>
              <option value="youtube">YouTube</option>
              <option value="corporate">Corporate</option>
              <option value="other">Other</option>
            </select>
            {errors.industry && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.industry.message)}
              </div>
            )}
          </div>
        </div>

        {/* Website/Social Links */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Website / Social Links</label>
            <input
              type="text"
              placeholder="https://your-website.com"
              className="form-control mb-2"
              {...register("website")}
            />
            <input
              type="text"
              placeholder="Social media links"
              className="form-control"
              {...register("social_links")}
            />
          </div>
        </div>

        {/* Company Size */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Company Size*</label>
            <select
              className="form-control"
              {...register("company_size", { required: "Company size is required" })}
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
            {errors.company_size && (
              <div className="error" style={{ color: 'red' }}>
                {String(errors.company_size.message)}
              </div>
            )}
          </div>
        </div>

        {/* Services Required */}
        <div className="col-12">
          <MultipleSelectionField
            label="Services Required*"
            options={[
              "Video Production", "Photography", "Animation", "Motion Graphics",
              "Video Editing", "Sound Design", "Color Grading", "VFX",
              "Live Streaming", "360° Video", "Drone Videography"
            ]}
            selectedItems={selectedServices}
            onChange={(services) => {
              setSelectedServices(services);
              // Update the form value and trigger validation
              setValue('required_services', services, { shouldValidate: true });
            }}
            error={errors.required_services?.message as string}
          />
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

export default ClientStep2;