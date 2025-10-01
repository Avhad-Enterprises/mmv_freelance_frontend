"use client";
import React from "react";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const FreelancerStep4: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  return (
    <div>
      <h4 className="mb-3">Short description about yourself*</h4>
      <div className="input-group-meta position-relative mb-25">
        <label>Short description</label>
        <textarea
          className="form-control"
          rows={4}
          value={formData.short_description || ""}
          onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
        />
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
              <option value="">Select</option>
              <option value="part_time">Part-time</option>
              <option value="full_time">Full-time</option>
              <option value="flexible">Flexible</option>
              <option value="on_demand">On-Demand</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Languages Spoken*</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type a language and press Enter"
              onKeyDown={(e) => {
                if ((e as any).key === "Enter") {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) {
                    setFormData((prev) => ({ ...prev, languages: [...(prev.languages || []), val] }));
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
            />
            <div className="d-flex flex-wrap gap-2 mt-2">
              {(formData.languages || []).map((t: string) => (
                <span key={t} className="badge bg-secondary">
                  {t}
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-white"
                    onClick={() => setFormData((prev) => ({ ...prev, languages: prev.languages.filter((x: string) => x !== t) }))}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
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
          disabled={!formData.short_description || !formData.availability}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FreelancerStep4;


