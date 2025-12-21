"use client";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  formData: any;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

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

  const [allSkills, setAllSkills] = React.useState<string[]>([]);
  const [videographerSuperpowers, setVideographerSuperpowers] = React.useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState<boolean>(true);
  const [skillError, setSkillError] = React.useState<string | null>(null);
  const [isOtherSkillModalOpen, setIsOtherSkillModalOpen] = React.useState(false);
  const [customSkill, setCustomSkill] = React.useState("");
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = React.useState(false);
  const skillsDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/skills`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const skillNames: string[] = result.data.map((skill: any) => skill.skill_name);
          const uniqueSkillNames = [...new Set(skillNames)];
          setAllSkills(uniqueSkillNames);
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

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setIsSkillsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    first_name = "",
    last_name = "",
    superpowers = [],
    portfolio_links = ["", ""],
    rate_amount = "100",
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

  const modalHeaderStyle: React.CSSProperties = { marginBottom: '15px' };
  const modalFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  };

  return (
    <>
      {/* Custom Skill Modal */}
      {isOtherSkillModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h5 style={modalHeaderStyle}>Add a Custom Skill</h5>
            <div className="input-group-meta position-relative uniform-height">
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
        <h4 className="mb-4">Hi, I am {first_name && last_name ? `${first_name} ${last_name}` : "[Your Name]"}</h4>

        {/* Skills */}
        <div className="mt-4" ref={skillsDropdownRef}>
          <label>Skills*</label>
          <div className="input-group-meta position-relative uniform-height">
            <button
              type="button"
              className="form-control text-start d-flex align-items-center justify-content-between"
              style={{ height: '60px', minHeight: '60px' }}
              onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
              disabled={isLoadingSkills || !!skillError || (skill_tags || []).length >= 15}
            >
              <span>
                {isLoadingSkills
                  ? "Loading skills..."
                  : (skill_tags || []).length >= 15
                    ? "Maximum skills reached"
                    : "Select skills"}
              </span>
              {isSkillsDropdownOpen && (
                <span
                  style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSkillsDropdownOpen(false);
                  }}
                >
                  ×
                </span>
              )}
            </button>
            {isSkillsDropdownOpen && (
              <div
                className="position-absolute w-100 bg-white border rounded shadow-sm"
                style={{
                  top: '100%',
                  left: 0,
                  zIndex: 1000,
                  maxHeight: '250px',
                  overflowY: 'auto',
                  marginTop: '4px'
                }}
              >
                {allSkills
                  .filter(s => !(skill_tags || []).includes(s))
                  .map((skill: string) => (
                    <div
                      key={skill}
                      className="px-3 py-2 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if ((skill_tags || []).length < 15) {
                          addSkillTag(skill);
                        }
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      {skill}
                    </div>
                  ))}
                <div
                  className="px-3 py-2 cursor-pointer border-top"
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => {
                    setIsOtherSkillModalOpen(true);
                    setIsSkillsDropdownOpen(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Other...
                </div>
              </div>
            )}
          </div>
          {skillError && <small className="text-danger d-block mt-1">{skillError}</small>}
          {errors.skill_tags && <div className="text-danger mt-1">{String(errors.skill_tags.message)}</div>}
          <div className="d-flex flex-wrap gap-2 mt-2">
            {(skill_tags || []).map((s: string) => (
              <span key={s} className="badge bg-success d-flex align-items-center">
                {s}
                <button
                  type="button"
                  className="btn btn-sm btn-link text-white p-0 ms-1"
                  onClick={() => removeSkillTag(s)}
                  style={{ textDecoration: 'none', lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Superpowers */}
        <div className="mt-4">
          <label>My Superpowers are*</label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {(superpowers || []).map((s: string) => (
              <span key={s} className="badge bg-success d-flex align-items-center" style={{ gap: 6 }}>
                {s}
                <button
                  type="button"
                  className="btn btn-sm btn-link text-white p-0 m-0"
                  onClick={() => removeSuperpower(s)}
                  aria-label={`Remove ${s}`}
                  style={{ textDecoration: 'none', lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="input-group-meta position-relative uniform-height">
            <select
              className="form-control"
              style={{ height: '60px', minHeight: '60px' }}
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
          </div>
          <small className="text-primary d-block mt-1">Selected {(superpowers || []).length}/3</small>
          {errors.superpowers && <div className="text-danger mt-1">{String(errors.superpowers.message)}</div>}
        </div>

        {/* Portfolio */}
        <div className="mt-4">
          <label>Portfolio (YouTube links only)*</label>
          {portfolio_links.map((link: string, idx: number) => (
            <div key={idx} className="input-group-meta position-relative mb-2 uniform-height">
              <input
                type="url"
                className={`form-control ${link && !isYouTubeUrl(link) ? 'is-invalid' : ''}`}
                style={{ height: '60px', minHeight: '60px' }}
                placeholder="https://www.youtube.com/..."
                title="Please enter a valid URL"
                value={link}
                onChange={(e) => handlePortfolioChange(idx, e.target.value)}
                onBlur={(e) => handlePortfolioBlur(idx, e.target.value)}
              />
            </div>
          ))}
          {(watch("portfolio_links") || ["", ""]).length < 10 && (
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
            >
              + Add more
            </button>
          )}
          <small className="text-primary d-block mt-1">At least one valid YouTube link is required. Maximum 10 links allowed.</small>
          {errors.portfolio_links && <div className="text-danger mt-1">{String(errors.portfolio_links.message)}</div>}
        </div>

        {/* Rate Fields */}
        <div className="row mt-4">
          <div className="col-md-6">
            <label>Rate Amount per Hour*</label>
            <div className="input-group-meta position-relative uniform-height">
              <input
                type="number"
                className="form-control"
                style={{ height: '60px', minHeight: '60px' }}
                min={0}
                max={10000}
                step={1}
                {...register("rate_amount", {
                  required: "Rate amount is required",
                  min: { value: 0, message: "Rate cannot be negative" },
                  max: { value: 10000, message: "Rate cannot exceed 10,000" },
                  onChange: () => clearErrors("rate_amount")
                })}
                placeholder="Enter amount per hour (max 10,000)"
              />
            </div>
            {errors.rate_amount && (
              <div className="text-danger">{String(errors.rate_amount.message)}</div>
            )}
          </div>
          <div className="col-md-6">
            <label>Currency*</label>
            <div className="input-group-meta position-relative uniform-height">
              <select
                className="form-control"
                style={{ height: '60px', minHeight: '60px' }}
                {...register("rate_currency", {
                  required: "Currency is required",
                  onChange: () => clearErrors("rate_currency")
                })}
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
                <option value="CAD">CAD (C$) - Canadian Dollar</option>
                <option value="CHF">CHF (Fr) - Swiss Franc</option>
                <option value="CNY">CNY (¥) - Chinese Yuan</option>
                <option value="NZD">NZD (NZ$) - New Zealand Dollar</option>
                <option value="SGD">SGD (S$) - Singapore Dollar</option>
                <option value="HKD">HKD (HK$) - Hong Kong Dollar</option>
                <option value="KRW">KRW (₩) - South Korean Won</option>
                <option value="SEK">SEK (kr) - Swedish Krona</option>
                <option value="NOK">NOK (kr) - Norwegian Krone</option>
                <option value="DKK">DKK (kr) - Danish Krone</option>
                <option value="MXN">MXN ($) - Mexican Peso</option>
                <option value="BRL">BRL (R$) - Brazilian Real</option>
                <option value="ZAR">ZAR (R) - South African Rand</option>
                <option value="RUB">RUB (₽) - Russian Ruble</option>
                <option value="TRY">TRY (₺) - Turkish Lira</option>
                <option value="AED">AED (د.إ) - UAE Dirham</option>
                <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                <option value="MYR">MYR (RM) - Malaysian Ringgit</option>
                <option value="THB">THB (฿) - Thai Baht</option>
                <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
                <option value="PHP">PHP (₱) - Philippine Peso</option>
                <option value="PLN">PLN (zł) - Polish Zloty</option>
                <option value="CZK">CZK (Kč) - Czech Koruna</option>
                <option value="ILS">ILS (₪) - Israeli Shekel</option>
              </select>
            </div>
            {errors.rate_currency && (
              <div className="text-danger">{String(errors.rate_currency.message)}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="row">
          <div className="col-6">
            <button type="button" className="btn-one w-100 mt-30" onClick={prevStep}>Previous</button>
          </div>
          <div className="col-6">
            <button type="submit" className="btn-one w-100 mt-30">Next</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default VideographerStep2;