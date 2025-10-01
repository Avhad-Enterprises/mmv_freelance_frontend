"use client";
import React from "react";
import { Country, State, City } from "country-state-city";

type Props = {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  nextStep: (data: Partial<any>) => void;
  prevStep: () => void;
};

const videographerSuperpowers = [
  "Reels & Short-Form Video",
  "Podcast Videography",
  "Smartphone & Mobile-First Videography",
  "Wedding Films",
  "Corporate Interviews & Testimonials",
  "Live-Streaming & Multi-Cam Operator",
  "Product & E-commerce Videography",
  "Fashion & Beauty Cinematography",
  "Real Estate & Architecture Videography",
  "Aerial / Drone Operation",
  "Business & Industrial Videography (Corporate AV, Factory Shoot, Trade Shows)",
  "Commercials & Ad Films (Digital & Broadcast)",
  "Music Videos & Live Performance Coverage",
  "Documentary & Narrative Storytelling",
  "Event & Conference Coverage",
  "360º / VR Videography",
  "Food & Beverage Videography",
  "Travel & Lifestyle Videography",
  "Educational & Explainer Videos",
];

const editorSuperpowers = [
  "YouTube Content Editing",
  "Short-Form & Social Media Ads",
  "Podcast & Interview Editing",
  "Wedding & Personal Event Films",
  "Generative AI Video Editing",
  "Gaming Video Editing",
  "Corporate & Brand Videos",
  "Documentary & Narrative Editing",
  "Event Highlight Reels",
  "Music Video Editing",
  "Motion Graphics & Explainer Videos",
  "VFX & Compositing",
  "Color Grading & Finishing",
  "Educational & eLearning Content",
  "Real Estate & Architectural Videos",
  "Sports Highlights & Analysis",
  "Movie Trailers & Sizzle Reels",
];

function toggleArrayItem(arr: string[], item: string, limit?: number) {
  const exists = arr.includes(item);
  if (exists) return arr.filter((i) => i !== item);
  if (limit && arr.length >= limit) return arr;
  return [...arr, item];
}

const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be");
  } catch {
    return false;
  }
};

const FreelancerStep2: React.FC<Props> = ({ formData, setFormData, nextStep, prevStep }) => {
  const { role = "videographer", full_name = "", superpowers = [], portfolio_links = ["", "", ""], rate_amount = "", rate_currency = "INR" } = formData || {};
  const list: string[] = role === "videographer" ? videographerSuperpowers : editorSuperpowers;

  // Dropdown-like selector state for superpowers (max 3)
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

  return (
    <div>
      <h4 className="mb-2">Hi, I am {full_name || "[Your Name]"}</h4>
      <p className="mb-1">My Superpowers are*:</p>
      <small>(Select any of the 3 categories mentioned below)</small>

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
          placeholder={(superpowers || []).length >= 3 ? "You reached the 3 categories limit" : "Type to search categories"}
          value={spQuery}
          onChange={(e) => { setSpQuery(e.target.value); setSpOpen(true); }}
          onFocus={() => setSpOpen(true)}
          onBlur={() => setTimeout(() => setSpOpen(false), 150)}
          disabled={(superpowers || []).length >= 3}
        />
        {spOpen && spFiltered.length > 0 && (
          <div className="border bg-white mt-1 rounded" style={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 240, overflowY: "auto" }}>
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

      {role === "videographer" && (
        <div className="mt-4">
          <h5>Location details*</h5>
          <div className="row">
            <div className="col-md-4">
              <div className="input-group-meta position-relative mb-25">
                <label>City*</label>
                <select
                  className="form-control"
                  value={formData.city || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  disabled={!formData.country}
                >
                  <option value="">Select City</option>
                  {formData.country && City.getCitiesOfCountry(formData.country).map((ct) => (
                    <option key={`${ct.name}-${ct.latitude}-${ct.longitude}`} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group-meta position-relative mb-25">
                <label>Country*</label>
                <select
                  className="form-control"
                  value={formData.country || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
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
                <label>Map coordinates*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="lat,lng"
                  value={`${formData.coordinates?.lat || ""}${formData.coordinates?.lat && formData.coordinates?.lng ? "," : ""}${formData.coordinates?.lng || ""}`}
                  onChange={(e) => {
                    const [lat, lng] = e.target.value.split(",").map((v) => v.trim());
                    setFormData((prev) => ({ ...prev, coordinates: { lat: lat || "", lng: lng || "" } }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <h5>Skill Tags*</h5>
        <input
          type="text"
          className="form-control"
          placeholder="Type a tag and press Enter"
          onKeyDown={(e) => {
            if ((e as any).key === "Enter") {
              e.preventDefault();
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) {
                setFormData((prev) => ({ ...prev, skill_tags: [...(prev.skill_tags || []), val] }));
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
        <div className="d-flex flex-wrap gap-2 mt-2">
          {(formData.skill_tags || []).map((t: string) => (
            <span key={t} className="badge bg-secondary">
              {t}
              <button
                type="button"
                className="btn btn-sm btn-link text-white"
                onClick={() => setFormData((prev) => ({ ...prev, skill_tags: prev.skill_tags.filter((x: string) => x !== t) }))}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <h5>Portfolio (YouTube links only)*</h5>
        {portfolio_links.map((link: string, idx: number) => (
          <div key={idx} className="input-group-meta position-relative mb-10">
            <input
              type="url"
              className="form-control"
              placeholder="https://www.youtube.com/..."
              value={link}
              onChange={(e) => {
                const updated = [...(formData.portfolio_links || [])];
                updated[idx] = e.target.value;
                setFormData((prev) => ({ ...prev, portfolio_links: updated }));
              }}
              onBlur={(e) => {
                if (e.target.value && !isYouTubeUrl(e.target.value)) {
                  alert("Only YouTube links are accepted.");
                  const updated = [...(formData.portfolio_links || [])];
                  updated[idx] = "";
                  setFormData((prev) => ({ ...prev, portfolio_links: updated }));
                }
              }}
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
        <small className="d-block mt-1">Minimum one YouTube link is mandatory.</small>
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
          disabled={(superpowers || []).length !== 3 || !(portfolio_links || []).some((l: string) => isYouTubeUrl(l)) || !rate_amount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FreelancerStep2;


