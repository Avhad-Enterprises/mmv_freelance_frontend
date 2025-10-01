"use client";
import React from "react";
// Assuming you might still need these for other parts, but they aren't used in this snippet.
// import { Country, State, City } from "country-state-city";

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

const VideoEditorStep2: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  // State for skills and categories
  const [allSkills, setAllSkills] = React.useState<string[]>([]);
  const [editorSuperpowers, setEditorSuperpowers] = React.useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = React.useState<boolean>(true);
  const [skillError, setSkillError] = React.useState<string | null>(null);
  const [skillQuery, setSkillQuery] = React.useState("");
  const [skillOpen, setSkillOpen] = React.useState(false);

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
    first_name = "",
    last_name = "", 
    superpowers = [], 
    portfolio_links = ["", "", ""], 
    rate_amount = "", 
    rate_currency = "INR", 
    skill_tags = []
  } = formData || {};
  const list: string[] = editorSuperpowers;

  // Skills management functions
  const removeSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, base_skills: (prev.base_skills || []).filter((x: string) => x !== skill) }));
  };

  // State for the superpower selection dropdown
  const [spQuery, setSpQuery] = React.useState("");
  const [spOpen, setSpOpen] = React.useState(false);
  
  // Filter available superpowers based on search query and what's already selected
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
        // Instead of alert(), you could show an error message in the UI
        console.error("Only YouTube links are accepted.");
        const updated = [...portfolio_links];
        updated[index] = ""; // Clear the invalid link
        setFormData(prev => ({...prev, portfolio_links: updated}));
     }
  };

  // --- RENDER ---
  return (
    <div>
      <h4 className="mb-2">Hi, I am {`${first_name} ${last_name}` || "[Your Name]"}</h4>

      <div className="mt-3">
        <h5>Skills*</h5>
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder={isLoadingSkills ? "Loading skills..." : "Type to search and select skills"}
            value={skillQuery}
            onChange={(e) => {
              setSkillQuery(e.target.value);
              setSkillOpen(true);
            }}
            onFocus={() => setSkillOpen(true)}
            onBlur={() => setTimeout(() => setSkillOpen(false), 150)}
            disabled={isLoadingSkills || !!skillError}
          />

          {skillOpen && allSkills.filter(s => !skill_tags.includes(s) && s.toLowerCase().includes(skillQuery.toLowerCase())).length > 0 && (
            <div
              className="border bg-white mt-1 rounded shadow-sm"
              style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 220, overflowY: "auto" }}
            >
              {allSkills
                .filter(s => !skill_tags.includes(s) && s.toLowerCase().includes(skillQuery.toLowerCase()))
                .map((s: string) => (
                  <button
                    type="button"
                    key={s}
                    className="dropdown-item w-100 text-start"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      addSkillTag(s);
                      setSkillQuery("");
                      setSkillOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>
        {skillError && <small className="text-danger d-block mt-1">{skillError}</small>}
        
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
          onBlur={() => setTimeout(() => setSpOpen(false), 200)} // Increased delay for better click handling
          disabled={(superpowers || []).length >= 3}
        />
        {spOpen && spFiltered.length > 0 && (
          <div className="border bg-white mt-1 rounded shadow-sm" style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 240, overflowY: "auto" }}>
            {spFiltered.map((s: string) => (
              <button
                type="button"
                key={s}
                className="dropdown-item w-100 text-start"
                onMouseDown={(e) => e.preventDefault()} // Prevents blur event from firing before click
                onClick={() => addSuperpower(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <small className="text-muted d-block mt-1">Selected {(superpowers || []).length}/3</small>
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
          onClick={() => setFormData((prev) => ({ ...prev, portfolio_links: [...(prev.portfolio_links || []), ""] }))}
        >
          + Add more
        </button>
        <small className="d-block mt-1">Minimum one valid YouTube link is mandatory.</small>
      </div>

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
          disabled={(superpowers || []).length === 0 || (superpowers || []).length > 3 || !(portfolio_links || []).some((l: string) => isYouTubeUrl(l)) || !rate_amount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoEditorStep2;
