import React from "react";
import { useForm } from "react-hook-form";
import { Country, State, City } from "country-state-city";

const ClientStep3: React.FC<{
  nextStep: (data: any) => void;
  prevStep: () => void;
  formData: any;
}> = ({
  nextStep,
  prevStep,
  formData
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({ defaultValues: formData });

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        {/* Phone Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Phone Number*</label>
            <input 
              type="tel" 
              placeholder="Enter your phone number"
              className="form-control"
              {...register("phone_number", { 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number"
                }
              })}
            />
            {errors.phone_number && (
              <div className="error">{String(errors.phone_number.message)}</div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Address*</label>
            <textarea 
              placeholder="Enter your complete address" 
              className="form-control"
              rows={3}
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <div className="error">{String(errors.address.message)}</div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Country*</label>
            <select 
              className="form-control"
              {...register("country", { 
                required: "Country is required",
                onChange: (e) => {
                  const countryCode = e.target.value;
                  const states = State.getStatesOfCountry(countryCode);
                  setValue("state", "");
                  setValue("city", "");
                }
              })}
            >
              <option value="">Select Country</option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="error">{String(errors.country.message)}</div>
            )}
          </div>
        </div>

        {/* State */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>State*</label>
            <select 
              className="form-control"
              {...register("state", { 
                required: "State is required",
                onChange: (e) => {
                  setValue("city", "");
                }
              })}
            >
              <option value="">Select State</option>
              {watch("country") && State.getStatesOfCountry(watch("country")).map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="error">{String(errors.state.message)}</div>
            )}
          </div>
        </div>

        {/* City */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>City*</label>
            <select 
              className="form-control"
              {...register("city", { required: "City is required" })}
            >
              <option value="">Select City</option>
              {watch("state") && City.getCitiesOfState(watch("country"), watch("state")).map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <div className="error">{String(errors.city.message)}</div>
            )}
          </div>
        </div>

        {/* Pincode/ZIP Code */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Pincode/ZIP Code*</label>
            <input 
              type="text" 
              placeholder="Enter your pincode/ZIP code" 
              className="form-control"
              {...register("pincode", { 
                required: "Pincode/ZIP code is required",
                pattern: {
                  value: /^[0-9]{5,6}$/,
                  message: "Please enter a valid pincode/ZIP code"
                }
              })}
            />
            {errors.pincode && (
              <div className="error">{String(errors.pincode.message)}</div>
            )}
          </div>
        </div>

        {/* Business Documents */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Business Registration Documents (Optional)</label>
            <input 
              type="file" 
              className="form-control"
              accept=".pdf,.doc,.docx,image/*"
              multiple
              {...register("business_documents")}
            />
            <small className="text-muted">
              Upload business registration documents. This will be mandatory before your first payout.
              Accepted formats: PDF, DOC, DOCX, Images
            </small>
            {errors.business_documents && (
              <div className="error">{String(errors.business_documents.message)}</div>
            )}
          </div>
        </div>

        {/* Tax ID / Business Number */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Tax ID / Business Number (Optional)</label>
            <input 
              type="text" 
              placeholder="Enter your tax ID or business number"
              className="form-control"
              {...register("tax_id")}
            />
            <small className="text-muted">
              This information helps us prepare accurate invoices and tax documents
            </small>
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
    </form>
  );
};

export default ClientStep3;