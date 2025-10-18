"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";
import EmployAside from "@/app/components/dashboard/employ/aside";
import NiceSelect from "@/ui/nice-select";
import { makeGetRequest, makePostRequest, makePutRequest } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { getLoggedInUser } from "@/utils/jwt";
import { toast } from "react-hot-toast";

// Props type
type IProps = {
  // setIsOpenSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  projectsTaskId?: number;
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
};

const EditProjectArea = ({ setIsOpenSidebar }: any) => {
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
    is_active: 0,
    url: "",
    meta_title: "",
    meta_description: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSidebar, setIsOpenSidebarState] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [availableskill, setAvailableSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [allCategories, setAllCategories] = useState<{ value: string; label: string }[]>([]);

  const addSkill = async () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill || formData.skills_required.includes(trimmedSkill)) {
      toast.error("Skill is empty or already added.");
      return;
    }

    if (availableskill.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills_required: [...prev.skills_required, trimmedSkill],
      }));
      setSkillInput("");
      setAvailableSkills([]);
      return;
    }

    try {
      const response = await makePostRequest("tags/insertskill", {
        skill_name: trimmedSkill,
        created_by: userId,
      });
      console.log("Insert skill response:", response);

      if (response.data?.message === "Inserted") {
        setFormData((prev) => ({
          ...prev,
          skills_required: [...prev.skills_required, trimmedSkill],
        }));
        if (response.data?.data?.is_deleted) {
          console.log(`Skill "${trimmedSkill}" inserted but marked as deleted.`);
          toast.error("Skill added, but it may not be usable due to deletion status.");
        }
      } else {
        throw new Error(response.data?.message || "Skill insertion failed.");
      }

      setSkillInput("");
      setAvailableSkills([]);
    } catch (error: any) {
      console.error("Failed to insert skill:", error);
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("already exists")) {
        try {
          const skillData = await makeGetRequest(`skills`);
          const skill = skillData.data?.data?.find((s: any) => s.skill_name.toLowerCase() === trimmedSkill.toLowerCase());
          if (skill) {
            setFormData((prev) => ({
              ...prev,
              skills_required: [...prev.skills_required, trimmedSkill],
            }));
            setSkillInput("");
            setAvailableSkills([]);
          } else {
            toast.error("Skill does not exist.");
          }
        } catch (fetchError) {
          console.error("Failed to fetch skill:", fetchError);
          toast.error("Could not verify existing skill.");
        }
      } else {
        toast.error("Could not add skill: " + errorMessage);
      }
    }
  };

  const fetchSkill = async (query: string) => {
    try {
      const response = await makeGetRequest(`skills`);
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
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((s) => s !== skill),
    }));
  };

  useEffect(() => {
    console.log("projectId:", projectId);
    const fetchCategories = async () => {
      try {
        const response = await makeGetRequest(`categories`);
        const categories = response.data?.data || [];
        const formatted = categories.map((cat: any) => ({
          value: cat.category_name,
          label: cat.category_name,
        }));
        setAllCategories(formatted);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProject = async () => {
      if (!projectId) {
        toast.error("Invalid project ID.");
        router.push("/dashboard/employ-dashboard/jobs");
        return;
      }

      try {
        const response = await makeGetRequest(`projects-tasks/${projectId}`);
        console.log("Api Response:", response);

        const project = response.data?.projects;
        if (project) {
          setFormData({
            projectsTaskId: project.projects_task_id,
            client_id: project.client_id,
            project_title: project.project_title || "",
            project_description: project.project_description || "",
            project_category: project.project_category || "Designer",
            projects_type: project.projects_type,
            budget: project.budget?.toString() || "",
            skills_required: Array.isArray(project.skills_required) ? project.skills_required : [],
            deadline: project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : "",
            additional_notes: project.additional_notes || "",
            project_format: project.project_format || "",
            audio_voiceover: project.audio_voiceover || "",
            video_length: project.video_length?.toString() || "",
            preferred_video_style: project.preferred_video_style || "",
            reference_links: Array.isArray(project.reference_links) ? project.reference_links : [],
            is_active: project.is_active || "0",
            url: project.url || "",
            meta_title: project.meta_title || "",
            meta_description: project.meta_description || "",
            created_by: project.created_by,
          });
        } else {
          toast.error("Project not found.");
          router.push("/dashboard/employ-dashboard/jobs");
        }
      } catch (error: any) {
        console.error("Failed to fetch project:", error);
        toast.error("Error loading project data: " + (error.response?.data?.message || error.message));
        router.push("/dashboard/employ-dashboard/jobs");
      }
    };

    fetchCategories();
    if (projectId) {
      fetchProject();
    }
  }, [projectId, router]);

  useEffect(() => {
    const decoded = getLoggedInUser();
    if (decoded?.user_id) {
      setUserId(decoded.user_id);
      setFormData((prev) => ({ ...prev, client_id: decoded.user_id, created_by: decoded.user_id }));
    } else {
      toast.error("Please log in to edit a Project.");
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "project_title" || name === "project_description") {
        const rawTitle = name === "project_title" ? value : prev.project_title;
        const rawDescription = name === "project_description" ? value : prev.project_description;
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
    setFormData((prev) => ({ ...prev, projects_type: item.value, is_active: parseInt(item.value) }));
  };

  const handleReferenceLinkAdd = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const link = textarea.value.trim();
      if (link && !formData.reference_links.includes(link)) {
        setFormData((prev) => ({
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
      toast.error("Please log in to edit a Project.");
      return;
    }

    if (!projectId) {
      toast.error("Invalid project ID.");
      return;
    }

    if (!formData.project_title || !formData.project_description || !formData.budget) {
      toast.error("Please fill in all required fields (Title, Description, Budget).");
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
      projects_task_id: parseInt(projectId!),
      client_id: formData.client_id,
      project_title: formData.project_title,
      project_description: formData.project_description,
      project_category: formData.project_category,
      projects_type: formData.projects_type,
      budget: parseFloat(formData.budget) || 0,
      skills_required: JSON.stringify(formData.skills_required),
      deadline: formattedDeadline,
      additional_notes: formData.additional_notes,
      project_format: formData.project_format,
      audio_voiceover: formData.audio_voiceover,
      video_length: parseInt(formData.video_length) || 0,
      preferred_video_style: formData.preferred_video_style,
      reference_links: JSON.stringify(formData.reference_links),
      is_active: formData.is_active,
      url: formData.url,
      meta_title: formData.meta_title,
      meta_description: formData.meta_description,
      created_by: formData.created_by,
    };

    setLoading(true);
    try {
      console.log("Updating Project data:", payload);
      const response = await makePutRequest(`projects-tasks/${formData.projectsTaskId}`, payload);
      console.log("API response:", response);

      if (response.data.success) {
        toast.success("🎉 Project updated successfully!");
        router.push("/dashboard/employ-dashboard/jobs");
      } else {
        toast.error(response.data?.message || "Failed to update Project. Invalid data.");
      }
    } catch (err: any) {
      console.error("Error updating Project:", err);
      toast.error(err.response?.data?.message || err.message || "Error updating Project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar || setIsOpenSidebarState} />
        <h2 className="main-title">Edit Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="bg-white card-box border-20 mb-50 p-5">
            <h4 className="dash-title-three">Project Details</h4>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="project_title">Title</label>
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                placeholder="Ex: Product Designer"
                required
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
                    defaultCurrent={allCategories.findIndex((cat) => cat.value === formData.project_category)}
                    onChange={handleCategory}
                    name="Job Category"
                  />
                </div>
              </div>
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
                  <label htmlFor="">Status</label>
                  <NiceSelect
                    options={[
                      { value: "0", label: "Inactive" },
                      { value: "1", label: "Active" },
                    ]}
                    defaultCurrent={formData.is_active}
                    onChange={handleJobType}
                    name="Status"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="deadline">Deadline</label>
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
            <h4 className="dash-title-three">Skills</h4>
            <div className="dash-input-wrapper mb-30">
              <label htmlFor="">Skills</label>
              <input
                type="text"
                placeholder="Type skill and press Enter"
                value={skillInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillInput(value);
                  fetchSkill(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              {availableskill.length > 0 && (
                <div
                  style={{
                    position: "relative",
                    background: "#fff",
                    border: "1px solid #ccc",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 10,
                  }}
                >
                  {availableskill.map((skill) => (
                    <div
                      key={skill}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => {
                        if (!formData.skills_required.includes(skill)) {
                          setFormData((prev) => ({
                            ...prev,
                            skills_required: [...prev.skills_required, skill],
                          }));
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
                {formData.skills_required.map((skill, idx) => (
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
                  <button key={index} type="button">
                    {link}
                  </button>
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
                placeholder="Write about the additional notes in details..."
                required
              ></textarea>
            </div>
          </div>

          <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">SEO</h4>
            <div className="row align-items-end">
              <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                  <label htmlFor="">URL</label>
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
                  <label htmlFor="meta_title">Meta Title</label>
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
              <label htmlFor="">Meta Description</label>
              <textarea
                className="size-lg"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                placeholder="Write about the meta description in details..."
                required
              ></textarea>
            </div>
          </div>

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              type="submit"
              className="dash-btn-two tran3s me-3"
              disabled={loading || !userId}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <a href="/dashboard/employ-dashboard/jobs" className="dash-cancel-btn tran3s">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectArea;