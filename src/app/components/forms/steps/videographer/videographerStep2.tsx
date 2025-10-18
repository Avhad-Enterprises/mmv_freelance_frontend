"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

// Utility function to check for a valid YouTube URL.
const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

const VideographerStep2: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, watch } = useForm({
    defaultValues: formData,
    mode: 'onChange'
  });

  // Register arrays with validation
  React.useEffect(() => {
    register("skill_tags", {
      validate: (value) => {
        const tags = value || [];
        return tags.length > 0 || "At least one skill is required";
      }
    });
    register("superpowers", {
      validate: (value) => {
        const powers = value || [];
        if (powers.length === 0) return "At least 1 superpower is required";
        if (powers.length > 3) return "Maximum 3 superpowers allowed";
        return true;
      }
    });
    register("portfolio_links", {
      validate: (value) => {
        const links = value || [];
        return links.some((l: string) => isYouTubeUrl(l)) || "At least one valid YouTube link is required";
      }
    });
  }, [register]);

  // State for skills and categories
  const [allSkills, setAllSkills] = React.useState<string[]>([]);
  const [videographerSuperpowers, setVideographerSuperpowers] = React.useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState<boolean>(true);
  const [skillError, setSkillError] = React.useState<string | null>(null);
  const [isOtherSkillModalOpen, setIsOtherSkillModalOpen] = React.useState(false);
  const [customSkill, setCustomSkill] = React.useState("");

  // Fetch skills from API
  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('https://api.makemyvid.io/api/v1/skills');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const skillNames = result.data.map((skill: any) => skill.skill_name);
          setAllSkills(skillNames);
        } else {
          throw new Error('Invalid data format from API');
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkillError("Could not load skills. Please try again later.");
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Fetch categories when the component mounts
  React.useEffect(() => {
    fetch('https://api.makemyvid.io/api/v1/categories')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        const categories = data?.data || [];
        const videographerCategories = categories
          .filter((cat: any) => cat.category_type === 'videographer' && cat.is_active)
          .map((cat: any) => cat.category_name);
        setVideographerSuperpowers(videographerCategories);
      })
      .catch(err => console.error('Error fetching videographer categories:', err));
  }, []);

  const { 
    full_name = "",
    superpowers = [], 
    portfolio_links = ["", ""], 
    rate_amount = "", 
    rate_currency = "INR", 
    skill_tags = []
  } = watch() || formData;

  const spFiltered: string[] = (videographerSuperpowers || []).filter(
    (s: string) => !(superpowers || []).includes(s)
  );

  const addSuperpower = (skill: string) => {
    if ((superpowers || []).length >= 3) return;
    const currentSuperpowers = watch("superpowers") || [];
    const newSuperpowers = [...currentSuperpowers, skill];
    setValue("superpowers", newSuperpowers);
    clearErrors("superpowers");
  };

  const removeSuperpower = (skill: string) => {
    const currentSuperpowers = watch("superpowers") || [];
    const newSuperpowers = currentSuperpowers.filter((x: string) => x !== skill);
    setValue("superpowers", newSuperpowers);
    clearErrors("superpowers");
  };

  const addSkillTag = (tag: string) => {
    if (tag && !(skill_tags || []).includes(tag) && (skill_tags || []).length < 15) {
      const currentTags = watch("skill_tags") || [];
      const newTags = [...currentTags, tag];
      setValue("skill_tags", newTags);
      clearErrors("skill_tags");
    }
  };

  const handleAddCustomSkill = () => {
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill) {
      addSkillTag(trimmedSkill);
      if (!allSkills.includes(trimmedSkill)) {
        setAllSkills(prevSkills => [...prevSkills, trimmedSkill]);
      }
      setCustomSkill("");
      setIsOtherSkillModalOpen(false);
    }
  };

  const removeSkillTag = (tagToRemove: string) => {
    const currentTags = watch("skill_tags") || [];
    const newTags = currentTags.filter((tag: string) => tag !== tagToRemove);
    setValue("skill_tags", newTags);
    clearErrors("skill_tags");
  };

  const handlePortfolioChange = (index: number, value: string) => {
    const currentLinks = watch("portfolio_links") || ["", ""];
    const updated = [...currentLinks];
    updated[index] = value;
    setValue("portfolio_links", updated);
    clearErrors("portfolio_links");
  };

  const handlePortfolioBlur = (index: number, value: string) => {
    if (value && !isYouTubeUrl(value)) {
      console.error("Only YouTube links are accepted.");
      const currentLinks = watch("portfolio_links") || ["", ""];
      const updated = [...currentLinks];
      updated[index] = "";
      setValue("portfolio_links", updated);
    }
  };

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  // Inline styles for the modal
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
  };

  const modalHeaderStyle: React.CSSProperties = {
    marginBottom: '15px'
  };

  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  };

  return (
    <>
      {isOtherSkillModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h5 style={modalHeaderStyle}>Add a Custom Skill</h5>
            <div className="input-group-meta position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your skill here"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                autoFocus
              />
            </div>
            <div style={modalFooterStyle}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsOtherSkillModalOpen(false);
                  setCustomSkill("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddCustomSkill}
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-2">Hi, I am {full_name || "[Your Name]"}</h4>

        <div className="mt-3">
          <h5>Skills*</h5>
          <small className="d-block">(Select up to 15 skills that you're proficient in)</small>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {(skill_tags || []).map((s: string) => (
              <span key={s} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
                {s}
                <button
                  type="button"
                  className="btn btn-sm btn-link text-white p-0 m-0"
                  onClick={() => removeSkillTag(s)}
                  aria-label={`Remove ${s}`}
                  style={{textDecoration: 'none', lineHeight: 1}}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="position-relative">
            <select
              className="form-control mt-2"
              value=""
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "other") {
                  setIsOtherSkillModalOpen(true);
                } else if (selectedValue && (skill_tags || []).length < 15) {
                  addSkillTag(selectedValue);
                  e.target.value = "";
                }
              }}
              disabled={isLoadingSkills || !!skillError || (skill_tags || []).length >= 15}
            >
              <option value="">
                {isLoadingSkills ? "Loading skills..." : (skill_tags || []).length >= 15 ? "Maximum skills reached" : "Select a skill"}
              </option>
              {allSkills
                .filter(s => !(skill_tags || []).includes(s))
                .map((skill: string) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              <option value="other">Other...</option>
            </select>
          </div>
          {skillError && <small className="text-danger d-block mt-1">{skillError}</small>}
          <small className="text-muted d-block mt-1">Selected {(skill_tags || []).length}/15 skills</small>
          {errors.skill_tags && (
            <div className="text-danger">{String(errors.skill_tags.message)}</div>
          )}
        </div>

        <h5 className="mt-4">My Superpowers are*</h5>
        <small>(Select up to 3 categories that best describe your skills)</small>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {(superpowers || []).map((s: string) => (
            <span key={s} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
              {s}
              <button
                type="button"
                className="btn btn-sm btn-link text-white p-0 m-0"
                onClick={() => removeSuperpower(s)}
                aria-label={`Remove ${s}`}
                style={{textDecoration: 'none', lineHeight: 1}}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="mt-2">
          <select
            className="form-control"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                addSuperpower(e.target.value);
                e.target.value = "";
              }
            }}
            disabled={(superpowers || []).length >= 3}
          >
            <option value="">
              {(superpowers || []).length >= 3 ? "You have reached the 3 category limit" : "Select a category"}
            </option>
            {spFiltered.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <small className="text-muted d-block mt-1">Selected {(superpowers || []).length}/3</small>
          {errors.superpowers && (
            <div className="text-danger">{String(errors.superpowers.message)}</div>
          )}
        </div>

        <div className="mt-3">
          <h5>Portfolio (YouTube links only)*</h5>
          {portfolio_links.map((link: string, idx: number) => (
            <div key={idx} className="input-group-meta position-relative mb-2">
              <input
                type="url"
                className={`form-control ${link && !isYouTubeUrl(link) ? 'is-invalid' : ''}`}
                placeholder="https://www.youtube.com/..."
                value={link}
                onChange={(e) => handlePortfolioChange(idx, e.target.value)}
                onBlur={(e) => handlePortfolioBlur(idx, e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={() => {
              const currentLinks = watch("portfolio_links") || ["", ""];
              if (currentLinks.length < 10) {
                setValue("portfolio_links", [...currentLinks, ""]);
                clearErrors("portfolio_links");
              }
            }}
            disabled={(watch("portfolio_links") || ["", ""]).length >= 10}
          >
            + Add more
          </button>
          <small className="text-danger d-block mt-1">At least one valid YouTube link is required. Maximum 10 links allowed.</small>
          {errors.portfolio_links && (
            <div className="text-danger">{String(errors.portfolio_links.message)}</div>
          )}
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Rate Amount*</label>
              <input
                type="number"
                className="form-control"
                min={0}
                max={10000}
                step={1}
                {...register("rate_amount", {
                  required: "Rate amount is required",
                  min: { value: 0, message: "Rate cannot be negative" },
                  max: { value: 10000, message: "Rate cannot exceed 10,000" },
                  onChange: () => clearErrors("rate_amount")
                })}
                placeholder="Enter amount (max 10,000)"
              />
              {errors.rate_amount && (
                <div className="text-danger">{String(errors.rate_amount.message)}</div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Currency*</label>
              <select
                className="form-control"
                {...register("rate_currency", {
                  required: "Currency is required",
                  onChange: () => clearErrors("rate_currency")
                })}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="CHF">CHF (Fr)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="NZD">NZD (NZ$)</option>
              </select>
              {errors.rate_currency && (
                <div className="text-danger">{String(errors.rate_currency.message)}</div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn-one" onClick={prevStep}>Previous</button>
          <button type="submit" className="btn-one">Next</button>
        </div>
      </form>
    </>
  );
};

export default VideographerStep2;