import React from "react";
import { useForm } from "react-hook-form";

const Step2: React.FC<{ 
  nextStep: (data: any) => void; 
  prevStep: () => void;
  formData: any;
  skills: string[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  availableSkills: string[];
  addSkill: () => void;
  removeSkill: (skill: string) => void;
  fetchSkill: (query: string) => void;
}> = ({ 
  nextStep, 
  prevStep, 
  formData, 
  skills, 
  skillInput, 
  setSkillInput, 
  availableSkills, 
  addSkill, 
  removeSkill, 
  fetchSkill 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData });

  const onSubmit = (data: any) => {
    nextStep({ ...data, skill: skills });
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
              placeholder="e.g. Senior Full Stack Developer" 
              className="form-control"
              {...register("profile_title", { required: "Profile title is required" })}
            />
            {errors.profile_title && (
              <div className="error">{String(errors.profile_title.message)}</div>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Category*</label>
            <select 
              className="form-control" 
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_development">Mobile Development</option>
              <option value="ui_ux">UI/UX Design</option>
              <option value="data_science">Data Science</option>
              <option value="devops">DevOps</option>
            </select>
            {errors.category && (
              <div className="error">{String(errors.category.message)}</div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Skills*</label>
            <div className="skill-input-container">
              <input
                type="text"
                placeholder="Add your skills (e.g. React, Node.js)"
                className="form-control"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  fetchSkill(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button 
                type="button" 
                className="btn-add-skill" 
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            {availableSkills.length > 0 && (
              <div className="skill-suggestions">
                {availableSkills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-suggestion"
                    onClick={() => {
                      setSkillInput(skill);
                      setAvailableSkills([]);
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
            <div className="skill-tags">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="remove-skill"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
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
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            {errors.experience_level && (
              <div className="error">{String(errors.experience_level.message)}</div>
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
            <label>Hourly Rate (USD)*</label>
            <input 
              type="number" 
              placeholder="e.g. 25" 
              className="form-control"
              {...register("hourly_rate", { 
                required: "Hourly rate is required",
                min: {
                  value: 5,
                  message: "Minimum hourly rate is $5"
                }
              })}
            />
            {errors.hourly_rate && (
              <div className="error">{String(errors.hourly_rate.message)}</div>
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
    </form>
  );
};

export default Step2;