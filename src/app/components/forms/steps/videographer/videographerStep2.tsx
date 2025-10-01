"use client";
import React from "react";
import { Country, City } from "country-state-city";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
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

const VideographerStep2: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  // --- HOOKS MOVED INSIDE THE COMPONENT ---
  // State for skills and categories
  const [allSkills, setAllSkills] = React.useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState<boolean>(true);
  const [skillError, setSkillError] = React.useState<string | null>(null);
  const [skillQuery, setSkillQuery] = React.useState("");
  const [skillOpen, setSkillOpen] = React.useState(false);
  
  // State to store the videographer categories fetched from the API
  const [videographerSuperpowers, setVideographerSuperpowers] = React.useState<string[]>([]);

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

  // Effect to fetch categories when the component mounts
  React.useEffect(() => {
    fetch('http://localhost:8000/api/v1/category/getallcategorys')
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
  }, []); // Empty dependency array ensures this runs only once on mount

  const { full_name = "", superpowers = [], portfolio_links = ["", ""], rate_amount = "", rate_currency = "INR", skill_tags = [], country = "", city = "", coordinates = { lat: "", lng: "" } } = formData || {};
  const list: string[] = videographerSuperpowers;

  // State for the superpower selection dropdown
  const [spQuery, setSpQuery] = React.useState("");
  const [spOpen, setSpOpen] = React.useState(false);

  const spFiltered: string[] = (list || []).filter(
    (s: string) => !(superpowers || []).includes(s) && s.toLowerCase().includes(spQuery.toLowerCase())
  );

  const addSuperpower = (skill: string) => {
    if ((superpowers || []).length >= 3) return;
    setFormData((prev) => ({ ...prev, superpowers: [...(prev.superpowers || []), skill] }));
    setSpQuery("");
    setSpOpen(false);
  };

  const removeSuperpower = (skill: string) => {
    setFormData((prev) => ({ ...prev, superpowers: (prev.superpowers || []).filter((x: string) => x !== skill) }));
  };
  
  const addSkillTag = (tag: string) => {
    if (tag && !(skill_tags || []).includes(tag)) {
        setFormData((prev) => ({ ...prev, skill_tags: [...(prev.skill_tags || []), tag] }));
    }
  };

  const removeSkillTag = (tagToRemove: string) => {
    setFormData((prev) => ({...prev, skill_tags: prev.skill_tags.filter((tag: string) => tag !== tagToRemove)}));
  };
  
  const handlePortfolioChange = (index: number, value: string) => {
    const updated = [...portfolio_links];
    updated[index] = value;
    setFormData(prev => ({ ...prev, portfolio_links: updated }));
  };

  const handlePortfolioBlur = (index: number, value: string) => {
     if (value && !isYouTubeUrl(value)) {
        console.error("Only YouTube links are accepted.");
        const updated = [...portfolio_links];
        updated[index] = ""; // Clear the invalid link
        setFormData(prev => ({...prev, portfolio_links: updated}));
     }
  };

  // Validation for location specific to videographer
  const isLocationValid = !!country && !!city && !!coordinates?.lat && !!coordinates?.lng;

  return (
    <div>
      <h4 className="mb-2">Hi, I am {full_name || "[Your Name]"}</h4>
      <p className="mb-1">My Superpowers are*:</p>
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

      {/* Input with dropdown for selecting superpowers */}
      <div className="mt-2" style={{ position: "relative" }}>
        <input
          type="text"
          className="form-control"
          placeholder={(superpowers || []).length >= 3 ? "You have reached the 3 category limit" : "Type to search categories"}
          value={spQuery}
          onChange={(e) => { setSpQuery(e.target.value); setSpOpen(true); }}
          onFocus={() => setSpOpen(true)}
          onBlur={() => setTimeout(() => setSpOpen(false), 200)}
          disabled={(superpowers || []).length >= 3}
        />
        {spOpen && spFiltered.length > 0 && (
          <div className="border bg-white mt-1 rounded shadow-sm" style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 240, overflowY: "auto" }}>
            {spFiltered.map((s: string) => (
              <button
                type="button"
                key={s}
                className="dropdown-item w-100 text-start"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addSuperpower(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <small className="text-muted d-block mt-1">Selected {(superpowers || []).length}/3</small>
      </div>

      {/* Location details */}
      <div className="mt-4">
        <h5>Location details*</h5>
        <div className="row">
          <div className="col-md-4">
            <div className="input-group-meta position-relative mb-25">
              <label>Country*</label>
              <select
                className="form-control"
                value={country}
                onChange={(e) => setFormData((prev) => ({ 
                    ...prev, 
                    country: e.target.value, 
                    city: "", // Reset city on country change
                    coordinates: { lat: "", lng: "" } // Reset coordinates as well
                }))}
              >
                <option value="">Select Country</option>
                {Country.getAllCountries().map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group-meta position-relative mb-25">
              <label>City*</label>
              <select
                className="form-control"
                value={city}
                onChange={(e) => {
                  const cityName = e.target.value;
                  const cities = country ? City.getCitiesOfCountry(country) : [];
                  const selectedCity = cities?.find(c => c.name === cityName);

                  setFormData((prev) => ({
                    ...prev,
                    city: cityName,
                    coordinates: {
                      lat: selectedCity?.latitude || "",
                      lng: selectedCity?.longitude || "",
                    },
                  }));
                }}
                disabled={!country}
              >
                <option value="">Select City</option>
                {country && (City.getCitiesOfCountry(country) || []).map((ct) => (
                  <option key={`${ct.name}-${ct.latitude}`} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="input-group-meta position-relative mb-25">
              <label>Map coordinates*</label>
              <input
                type="text"
                className="form-control"
                placeholder="Auto-filled from city"
                value={coordinates?.lat && coordinates?.lng ? `${coordinates.lat}, ${coordinates.lng}` : ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
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
          <input
            type="text"
            className="form-control mt-2"
            placeholder={isLoadingSkills ? "Loading skills..." : (skill_tags || []).length >= 15 ? "Maximum skills reached" : "Type to search skills"}
            value={skillQuery}
            onChange={(e) => {
              setSkillQuery(e.target.value);
              setSkillOpen(true);
            }}
            onFocus={() => setSkillOpen(true)}
            onBlur={() => setTimeout(() => setSkillOpen(false), 150)}
            disabled={isLoadingSkills || !!skillError || (skill_tags || []).length >= 15}
          />

          {skillOpen && allSkills.filter(s => !(skill_tags || []).includes(s) && s.toLowerCase().includes(skillQuery.toLowerCase())).length > 0 && (
            <div
              className="border bg-white mt-1 rounded shadow-sm"
              style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 220, overflowY: "auto" }}
            >
              {allSkills
                .filter(s => !(skill_tags || []).includes(s) && s.toLowerCase().includes(skillQuery.toLowerCase()))
                .map((s: string) => (
                  <button
                    type="button"
                    key={s}
                    className="dropdown-item w-100 text-start"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if ((skill_tags || []).length < 15) {
                        addSkillTag(s);
                        setSkillQuery("");
                        setSkillOpen(false);
                      }
                    }}
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>
        {skillError && <small className="text-danger d-block mt-1">{skillError}</small>}
        <small className="text-muted d-block mt-1">Selected {(skill_tags || []).length}/15 skills</small>
      </div>
      
      {/* Portfolio (YouTube links only) */}
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
          onClick={() => setFormData((prev) => ({ ...prev, portfolio_links: [...(prev.portfolio_links || []), ""] }))}
        >
          + Add more
        </button>
        <small className="d-block mt-1">Minimum one valid YouTube link is mandatory.</small>
      </div>

      {/* Rate section */}
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Rate Amount*</label>
            <input
              type="number"
              className="form-control"
              min={0}
              step={1}
              value={rate_amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, rate_amount: e.target.value }))}
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group-meta position-relative mb-25">
            <label>Currency*</label>
            <select
              className="form-control"
              value={rate_currency}
              onChange={(e) => setFormData((prev) => ({ ...prev, rate_currency: e.target.value }))}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn-one" onClick={prevStep}>Previous</button>
        <button
          type="button"
          className="btn-one"
          onClick={() => nextStep({})}
          disabled={(superpowers || []).length === 0 || (superpowers || []).length > 3 || !(portfolio_links || []).some((l: string) => isYouTubeUrl(l)) || !rate_amount || !isLocationValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideographerStep2;
