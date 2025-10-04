"use client";
import React from "react";
import { useForm } from "react-hook-form";
// Assuming you might still need these for other parts, but they aren't used in this snippet.
// import { Country, State, City } from "country-state-city";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

// Utility function to check for a valid YouTube URL.
const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  // A simple regex is more robust for checking YouTube URLs
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

const VideoEditorStep2: React.FC<Props> = ({ formData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, clearErrors, watch } = useForm({
    defaultValues: formData,
    mode: 'onSubmit'
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

  // State for skills and categories (keeping these as they are API-dependent)
  const [allSkills, setAllSkills] = React.useState<string[]>([]);
  const [editorSuperpowers, setEditorSuperpowers] = React.useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState<boolean>(true);
  const [skillError, setSkillError] = React.useState<string | null>(null);

  // Fetch skills from API
  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/tags/getallskill');
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
    fetch('http://localhost:8000/api/v1/category/getallcategorys')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        // Safely access nested data
        const categories = data?.data || [];
        const editorCategories = categories
          .filter((cat: any) => cat.category_type === 'editor' && cat.is_active)
          .map((cat: any) => cat.category_name);
        setEditorSuperpowers(editorCategories);
      })
      .catch(err => console.error('Error fetching editor categories:', err));
  }, []); // Empty dependency array ensures this runs only once on mount

  const { 
    full_name = "",
    superpowers = [], 
    portfolio_links = ["", "", ""], 
    rate_amount = "", 
    rate_currency = "INR", 
    skill_tags = []
  } = watch() || formData;

  // Skills management functions
  const removeSkill = (skill: string) => {
    const currentSkills = watch("skill_tags") || [];
    setValue("skill_tags", currentSkills.filter((x: string) => x !== skill));
  };

  // Filter available superpowers based on what's already selected
  const spFiltered: string[] = (editorSuperpowers || []).filter(
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
    if (tag && !(skill_tags || []).includes(tag)) {
      const currentTags = watch("skill_tags") || [];
      const newTags = [...currentTags, tag];
      setValue("skill_tags", newTags);
      clearErrors("skill_tags");
    }
  };

  const removeSkillTag = (tagToRemove: string) => {
    const currentTags = watch("skill_tags") || [];
    const newTags = currentTags.filter((tag: string) => tag !== tagToRemove);
    setValue("skill_tags", newTags);
    clearErrors("skill_tags");
  };

  const handlePortfolioChange = (index: number, value: string) => {
    const currentLinks = watch("portfolio_links") || ["", "", ""];
    const updated = [...currentLinks];
    updated[index] = value;
    setValue("portfolio_links", updated);
    clearErrors("portfolio_links");
  };

  const handlePortfolioBlur = (index: number, value: string) => {
     if (value && !isYouTubeUrl(value)) {
        console.error("Only YouTube links are accepted.");
        const currentLinks = watch("portfolio_links") || ["", "", ""];
        const updated = [...currentLinks];
        updated[index] = ""; // Clear the invalid link
        setValue("portfolio_links", updated);
     }
  };

  const onSubmit = (data: any) => {
    nextStep(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mb-2">Hi, I am {full_name || "[Your Name]"}</h4>

      <div className="mt-3">
        <h5>Skills*</h5>
        <div className="position-relative">
          <select
            className="form-control"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                addSkillTag(e.target.value);
                e.target.value = ""; // Reset select after selection
              }
            }}
            disabled={isLoadingSkills || !!skillError}
          >
            <option value="">
              {isLoadingSkills ? "Loading skills..." : "Select a skill"}
            </option>
            {allSkills
              .filter(s => !skill_tags.includes(s))
              .map((skill: string) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
          </select>
        </div>
        {skillError && <small className="text-danger d-block mt-1">{skillError}</small>}
        {errors.skill_tags && (
          <div className="error">{String(errors.skill_tags.message)}</div>
        )}
        
        <div className="d-flex flex-wrap gap-2 mt-2">
          {skill_tags.map((t: string) => (
            <span key={t} className="badge bg-success d-flex align-items-center">
              {t}
              <button
                type="button"
                className="btn btn-sm btn-link text-white p-0 ms-1"
                onClick={() => removeSkillTag(t)}
                style={{textDecoration: 'none', lineHeight: 1}}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <h5>My Superpowers are*</h5>
      <small>(Select up to 3 categories that best describe your skills)</small>

      {/* Selected superpowers as chips */}
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

      {/* Dropdown for selecting superpowers */}
      <div className="mt-2">
        <select
          className="form-control"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addSuperpower(e.target.value);
              e.target.value = ""; // Reset select after selection
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
          <div className="error">{String(errors.superpowers.message)}</div>
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
            const currentLinks = watch("portfolio_links") || ["", "", ""];
            setValue("portfolio_links", [...currentLinks, ""]);
            clearErrors("portfolio_links");
          }}
        >
          + Add more
        </button>
        <small className="d-block mt-1">Minimum one valid YouTube link is mandatory.</small>
        {errors.portfolio_links && (
          <div className="error">{String(errors.portfolio_links.message)}</div>
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
              <div className="error">{String(errors.rate_amount.message)}</div>
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
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            {errors.rate_currency && (
              <div className="error">{String(errors.rate_currency.message)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>Previous</button>
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

export default VideoEditorStep2;
