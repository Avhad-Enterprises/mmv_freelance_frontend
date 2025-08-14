"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import StateSelect from "../candidate/state-select";
import CitySelect from "../candidate/city-select";
import CountrySelect from "../candidate/country-select";
import NiceSelect from "@/ui/nice-select";
import { makeGetRequest, makePostRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/utils/jwt";
import { toast } from "react-hot-toast";
import { link } from "fs";

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  client_id?: number;
  project_title: string;
  project_description: string;
  project_category: string;
  projects_type: string;
  budget: string;
  skills_required: string[];
  deadline: string;
  additional_notes: string;
  project_format: string;
  audio_voiceover: string;
  video_length: string;
  preferred_video_style: string;
  reference_links: string[];
  is_active: number;
  url: string;
  meta_title: string;
  meta_description: string;
  created_by?: number;
  // experience?: string;
  // address?: string;
  // country?: string;
  // city?: string;
  // state?: string;
};

const SubmitJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [formData, setFormData] = useState<FormData>({
    project_title: "",
    project_description: "",
    project_category: "Designer",
    projects_type: "Full time",
    budget: "",
    skills_required: [],
    deadline: "",
    additional_notes: "",
    project_format: "",
    audio_voiceover: "",
    video_length: "",
    preferred_video_style: "",
    reference_links: [],
    is_active: 0, //By Default 0
    url: "",
    meta_title: "",
    meta_description: "",
    // experience: "",
    // address: "",
    // country: "",
    // city: "",
    // state: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [availableskill, setAvailableSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [allCategories, setAllCategories] = useState<{ value: string, label: string }[]>([]);


  const addSkill = async () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill || skills.includes(trimmedSkill)) return;

    // If the input exactly matches an available skill, just add it
    if (availableskill.includes(trimmedSkill)) {
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setFormData((prev) => ({ ...prev, skills_required: newSkills }));
      // setValue("skill", newSkills);
      setSkillInput("");
      setAvailableSkills([]);
      return;
    }

    try {
      const response = await makePostRequest("tags/insertskill", {
        skill_name: trimmedSkill,
        created_by: userId,
      });
      console.log("Insert skill response", response);

      if (response.data?.message === "Skill already exists" || response?.data) {
        const newSkills = [...skills, trimmedSkill];
        setSkills(newSkills);
        setFormData((prev) => ({ ...prev, skills_required: newSkills }));
      }
      setSkillInput("");
      setAvailableSkills([]);
    } catch (error) {
      console.error("Failed to insert skill:", error);
    }
  };

  const fetchSkill = async (query: string) => {
    try {
      const response = await makeGetRequest(`tags/getallskill`);
      const fetchedSkills = Array.isArray(response.data?.data) ? response.data.data : [];
      const skillNames = fetchedSkills
        .map((skill: any) => skill.skill_name)
        .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()));
      setAvailableSkills(skillNames);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setAvailableSkills([]);
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setFormData((prev) => ({ ...prev, skills_required: newSkills }));
    // setValue("skill", newSkills);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await makeGetRequest(`category/getallcategorys`);
        const categories = response.data?.data || []; // adjust based on your API response shape

        // Map to `NiceSelect` option format
        const formatted = categories.map((cat: any) => ({
          value: cat.name, // adjust based on your DB field
          label: cat.name,
        }));

        setAllCategories(formatted);

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);



  // Fetch user ID on mount
  useEffect(() => {
    const decoded = getLoggedInUser();
    if (decoded?.user_id) {
      setUserId(decoded.user_id);
      setFormData((prev) => ({ ...prev, client_id: decoded.user_id, created_by: decoded.user_id }));
    } else {
      toast.error("Please log in to post a Project.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If title or description changes, always auto-update SEO fields:
      if (name === "project_title" || name === "project_description") {
        const rawTitle = name === "project_title" ? value : prev.project_title;
        const rawDescription = name === "project_description" ? value : prev.project_description;

        // Always generate SEO fields from raw
        updated.url = rawTitle
          ?.toLowerCase()
          ?.trim()
          ?.replace(/[^\w\s-]/g, "")
          ?.replace(/\s+/g, "-")
          ?.slice(0, 100);

        updated.meta_title = rawTitle?.slice(0, 60);

        const cleanDescription = rawDescription?.replace(/<[^>]+>/g, "").trim();
        updated.meta_description = cleanDescription?.slice(0, 160);
      }

      return updated;
    });
  };


  const handleCategory = (item: { value: string; label: string }) => {
    setFormData((prev) => ({ ...prev, project_category: item.value }));
  };

  const handleJobType = (item: { value: string; label: string }) => {
    setFormData((prev) => ({ ...prev, is_active: item.value === "Inactive" ? 0 : 1, }));
  };

  const handleReferenceLinkAdd = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const link = textarea.value.trim();
      if (link && !formData.reference_links.includes(link)) {
        setFormData(prev => ({
          ...prev,
          reference_links: [...prev.reference_links, link],
        }));
        textarea.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please log in to post a Project.");
      return;
    }

    // Required Fields / Basic validation
    if (!formData.project_title || !formData.project_description || !formData.budget) {
      toast.error("Please fill in all required fields (Title, Description, Salary).");
      return;
    }

    if (!formData.skills_required.length) {
      toast.error("Please add at least one skill.");
      return;
    }

    let formattedDeadline = "";
    if (formData.deadline) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.deadline)) {
        toast.error("Please enter a valid deadline date (YYYY-MM-DD).");
        return;
      }
      const [year, month, day] = formData.deadline.split("-");
      formattedDeadline = `${day}/${month}/${year}`;
    } else {
      toast.error("Please select a deadline date.");
      return;
    }

    const payload = {
      client_id: formData.client_id,
      project_title: formData.project_title,
      project_description: formData.project_description,
      project_category: formData.project_category,
      projects_type: formData.projects_type,
      budget: parseFloat(formData.budget) || 0,
      skills_required: formData.skills_required,
      deadline: formData.deadline,
      additional_notes: formData.additional_notes,
      project_format: formData.project_format,
      audio_voiceover: formData.audio_voiceover,
      video_length: parseInt(formData.video_length) || 0,
      preferred_video_style: formData.preferred_video_style,
      reference_links: formData.reference_links,
      is_active: formData.is_active,
      url: formData.url,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      created_by: formData.created_by,
      // experience: formData.experience || null,
      // address: formData.address || null,
      // country: formData.country || null,
      // city: formData.city || null,
      // state: formData.state || null,
    };

    setLoading(true);
    try {
      console.log("Submitting deadline:", formattedDeadline);
      console.log("Submitting Project data:", payload);
      const response = await makePostRequest("projectsTask/insertprojects_task", payload);
      console.log("API response:", response);

      if (response.data.success || response.data.message === "inserted") {
        toast.success("🎉 Project posted successfully!");

        setFormData({
          project_title: "",
          project_description: "",
          project_category: "Designer",
          projects_type: "Full time",
          budget: "",
          skills_required: [],
          deadline: "",
          additional_notes: "",
          project_format: "",
          audio_voiceover: "",
          video_length: "",
          preferred_video_style: "",
          reference_links: [],
          is_active: 0,
          url: "",
          meta_title: "",
          meta_description: "",
          // experience: "",
          // address: "",
          // country: "",
          // city: "",
          // state: "",
          client_id: userId,
          created_by: userId
        });

        router.push("/dashboard/employ-dashboard/jobs");

      } else {
        toast.error(response.data?.message || "Failed to post Project. Invalid data.");
      }
    } catch (err: any) {
      console.error("Error posting Project:", err);
      toast.error(err.response?.data?.message || err.message || "Error posting Project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Add a New Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="bg-white card-box border-20 mb-50 p-5">
            <h4 className="dash-title-three">Project Details</h4>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="project_title">Title*</label>
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                placeholder="Ex: Product Designer"
                
              />
            </div>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="project_description">Description</label>
              <textarea
                className="size-lg"
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                placeholder="Write about the Project in details..."
                required
              ></textarea>
            </div>
            <div className="row align-items-end">
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Category</label>
                  <NiceSelect
                    options={allCategories}
                    defaultCurrent={-1}
                    onChange={handleCategory}
                    name="Job Category"
                  />
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Type</label>
                  <NiceSelect
                    options={[
                      { value: "Full time", label: "Full time" },
                      { value: "Part time", label: "Part time" },
                      { value: "Hourly-Contract", label: "Hourly-Contract" },
                      { value: "Fixed-Price", label: "Fixed-Price" },
                    ]}
                    defaultCurrent={0}
                    onChange={handleJobType}
                    name="Job Type"
                  />
                </div>
              </div> */}
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="project_format">Project Format</label>
                  <input
                    type="text"
                    name="project_format"
                    value={formData.project_format}
                    onChange={handleInputChange}
                    placeholder="Ex: MP4"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Budget</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="10000"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">Statu*s</label>
                  <NiceSelect
                    options={[
                      { value: "0", label: "Inactive" },
                      { value: "1", label: "Active" },
                    ]}
                    defaultCurrent={0}
                    onChange={handleJobType}
                    name="Status"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="deadline">Deadline*</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white card-box border-20 mb-50 p-5">
            <h4 className="dash-title-three">Skills*</h4>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Skills</label>
              <input
                type="text"
                placeholder="Type skill and press Enter"
                value={skillInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillInput(value);
                  fetchSkill(value);  // 🔑 live query
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(); // fallback add
                  }
                }}
              />
              {availableskill.length > 0 && (
                <div style={{
                  position: "relative",
                  background: "#fff",
                  border: "1px solid #ccc",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 10,
                }}>
                  {availableskill.map((skill) => (
                    <div
                      key={skill}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => {
                        if (!skills.includes(skill)) {
                          const newSkills = [...skills, skill];
                          setSkills(newSkills);
                          // setValue("skill", newSkills);
                        }
                        setSkillInput("");
                        setAvailableSkills([]);
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "10px" }}>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-block",
                      background: "#eee",
                      padding: "5px 10px",
                      marginRight: "5px",
                      borderRadius: "15px",
                    }}
                  >
                    {skill}{" "}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      style={{ marginLeft: "5px" }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              <div className="skill-input-data d-flex align-items-center flex-wrap">
                {formData.skills_required.map((skill, index) => (
                  <button key={index} type="button">{skill}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white card-box border-20 mb-50 p-5">
            <h4 className="dash-title-three">Reference Link</h4>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Reference Link</label>
              <textarea
                placeholder="Add Reference Links (one per line, press Enter to add)"
                onKeyDown={handleReferenceLinkAdd}
                rows={3}
              ></textarea>
              <div className="skill-input-data d-flex align-items-center flex-wrap">
                {formData.reference_links.map((link, index) => (
                  <button key={index} type="button">{link}</button>
                ))}
              </div>
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="additional_notes">Additional Notes</label>
              <textarea
                className="size-lg"
                name="additional_notes"
                value={formData.additional_notes}
                onChange={handleInputChange}
                placeholder="Write about the additonal notes in details..."
                required
              ></textarea>
            </div>
          </div>

          <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">SEO</h4>
            <div className="row align-items-end">
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">URL*</label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="url"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="project_format">Meta Title*</label>
                  <input
                    type="text"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Enter Meta Title here"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Meta Description*</label>
              <textarea
                className="size-lg"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                placeholder="Write about the meta description in details..."
                required
              ></textarea>
            </div>


            {/* <div className="dash-input-wrapper mb-30">
              <label htmlFor="experience">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="E.g., 2 years"
              />
            </div> */}

            {/* <h4 className="dash-title-three pt-50 lg-pt-30">Address & Location</h4>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Cowrasta, Chandana, Gazipur Sadar"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">Country</label>
                  <CountrySelect
                    onChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">City</label>
                  <CitySelect
                    onChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, city: value }))
                    }
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="dash-input-wrapper mb-25">
                  <label htmlFor="">State</label>
                  <StateSelect
                    onChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, state: value }))
                    }
                  />
                </div>
              </div>
            </div> */}
          </div>

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              type="submit"
              className="dash-btn-two tran3s me-3"
              disabled={loading || !userId}
            >
              {loading ? "Submitting..." : "Post Project"}
            </button>
            <a href="#" className="dash-cancel-btn tran3s">
              Cancel
            </a>
          </div>
        </form>
      </div >
    </div >
  );
};

export default SubmitJobArea;
