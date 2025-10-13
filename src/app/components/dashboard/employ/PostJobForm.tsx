'use client';

import React, { useState, useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { makePostRequest, makeGetRequest } from '@/utils/api';
import type { NewProjectPayload } from '@/types/project';
import MultipleSelectionField from './MultipleSelectionField';

interface IProps {
  onBackToList: () => void;
}

// Initial form data matching the API payload structure
const initialFormData: NewProjectPayload = {
  project_title: '',
  project_category: 'Video Editing',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  project_description: '',
  budget: 500,
  tags: '[]', // API expects a stringified array
  skills_required: [],
  reference_links: [],
  additional_notes: '',
  projects_type: 'Video Editing',
  project_format: 'MP4',
  audio_voiceover: 'None',
  audio_description: 'Client will provide licensed background music.',
  video_length: 600,
  preferred_video_style: 'Vlog / Lifestyle',
  url: '',
  meta_title: '',
  meta_description: '',
};

// Helper function to generate a URL-friendly slug from a title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

const PostJobForm: FC<IProps> = ({ onBackToList }) => {
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm({
    defaultValues: initialFormData,
    mode: 'onChange'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ userId: number; clientId: number } | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [referenceLinks, setReferenceLinks] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meResponse = await makeGetRequest("/users/me");
        const userId = meResponse.data?.data?.user?.user_id;
        const clientId = meResponse.data?.data?.profile?.client_id;
        if (userId && clientId) {
          setCurrentUser({ userId, clientId });
        } else {
          setError("Could not retrieve user details. Please log in again.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error(err);
      }
    };
    fetchUserData();
  }, []);

  const onSubmit = async (data: any) => {
    if (!currentUser) {
      setError("User data is not available. Cannot post job.");
      return;
    }
    setLoading(true);
    setError(null);

    const finalUrl = data.url && data.url.trim()
      ? data.url.trim()
      : `${generateSlug(data.project_title)}-${Date.now()}`;

    const validReferenceLinks = referenceLinks.filter(link => link.trim() !== '');

    const payload = {
      ...data,
      url: finalUrl,
      skills_required: selectedSkills,
      reference_links: validReferenceLinks,
      tags: JSON.stringify(tags), // Use the state array for tags
      client_id: currentUser.clientId,
      created_by: currentUser.userId,
      is_active: 1,
    };

    try {
      await makePostRequest("/projectsTask/insertprojects_task", payload);
      toast.success("Job posted successfully!");
      setTimeout(() => {
        onBackToList();
      }, 1500);
    } catch (err: unknown) {
      let message = "An error occurred while posting the job.";
      if (err instanceof Error) {
        const errorResponse = (err as any).response?.data;
        message = errorResponse?.Message || err.message;
      }
      setError(message);
      toast.error(message);
      console.error("Failed to post job:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Reference Links
  const addReferenceLink = () => setReferenceLinks([...referenceLinks, '']);
  const updateReferenceLink = (index: number, value: string) => {
    const newLinks = [...referenceLinks];
    newLinks[index] = value;
    setReferenceLinks(newLinks);
  };
  const removeReferenceLink = (index: number) => {
    if (referenceLinks.length > 1) {
      setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
    }
  };

  // Handlers for Dynamic Tags
  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setCurrentTag(''); // Clear the input field
  };
  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleAddTag();
    }
  };

  return (
    <div className="bg-white card-box border-20">
      <h2 className="main-title mb-30">Post a New Job</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Project Title */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Title*</label>
              <input type="text" placeholder="Enter project title" className="form-control"
                {...register("project_title", { required: "Project title is required" })}
              />
              {errors.project_title && <div className="error">{String(errors.project_title.message)}</div>}
            </div>
          </div>

          {/* Project Category & Type */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Category*</label>
              <select className="form-control" {...register("project_category", { required: "Category is required" })}>
                <option value="Video Editing">Video Editing</option>
                <option value="Animation">Animation</option>
                <option value="Motion Graphics">Motion Graphics</option>
              </select>
              {errors.project_category && <div className="error">{String(errors.project_category.message)}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Type*</label>
              <select className="form-control" {...register("projects_type", { required: "Project type is required" })}>
                <option value="Video Editing">Video Editing</option>
                <option value="Commercial">Commercial</option>
                <option value="Social Media">Social Media</option>
              </select>
              {errors.projects_type && <div className="error">{String(errors.projects_type.message)}</div>}
            </div>
          </div>

          {/* Budget & Deadline */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Budget ($)*</label>
              <input type="number" placeholder="Enter budget amount" className="form-control"
                {...register("budget", {
                  required: "Budget is required",
                  min: { value: 1, message: "Budget must be greater than 0" }
                })}
              />
              {errors.budget && <div className="error">{String(errors.budget.message)}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Deadline*</label>
              <input type="date" className="form-control" {...register("deadline", { required: "Deadline is required" })} />
              {errors.deadline && <div className="error">{String(errors.deadline.message)}</div>}
            </div>
          </div>

          {/* Project Description */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Description*</label>
              <textarea placeholder="Describe your project requirements in detail" className="form-control" rows={4}
                {...register("project_description", { required: "Description is required" })}
              />
              {errors.project_description && <div className="error">{String(errors.project_description.message)}</div>}
            </div>
          </div>

          {/* Dynamic Tags Input */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Tags</label>
              <div className="tags-input-container p-2 border rounded">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-chip badge bg-light text-dark me-2 mb-2">
                    {tag}
                    <button type="button" className="btn-close ms-2" style={{ fontSize: '0.65em' }} onClick={() => handleRemoveTag(index)}></button>
                  </span>
                ))}
                <div className="d-flex">
                  <input type="text" className="form-control" placeholder="Add a tag..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
                  <button type="button" className="btn btn-primary ms-2" onClick={handleAddTag}>+</button>
                </div>
              </div>
              <small style={{ color: "blue", display: 'block', marginTop: '5px' }}>Press Enter or click '+' to add a tag.</small>
            </div>
          </div>

          {/* Skills Required */}
          <div className="col-12">
            <MultipleSelectionField
              label="Skills Required*"
              options={["Video Editing", "Color Grading", "Sound Design", "Motion Graphics", "Animation", "VFX", "Adobe Premiere Pro", "Adobe After Effects", "Final Cut Pro", "DaVinci Resolve", "Avid Media Composer", "Cinema 4D", "Blender", "Adobe Audition"]}
              selectedItems={selectedSkills}
              onChange={(skills) => { setSelectedSkills(skills); setValue('skills_required', skills, { shouldValidate: true }); }}
              required={true}
              error={errors.skills_required?.message as string}
            />
          </div>

          {/* Video Length & Format */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Video Length (seconds)*</label>
              <input type="number" placeholder="e.g., 300 for 5 minutes" className="form-control"
                {...register("video_length", { required: "Video length is required", min: { value: 1, message: "Length must be > 0" } })}
              />
              {errors.video_length && <div className="error">{String(errors.video_length.message)}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Final Format*</label>
              <select className="form-control" {...register("project_format", { required: "Format is required" })}>
                <option value="MP4">MP4</option>
                <option value="MOV">MOV</option>
                <option value="ProRes">ProRes</option>
              </select>
              {errors.project_format && <div className="error">{String(errors.project_format.message)}</div>}
            </div>
          </div>

          {/* Preferred Style & Voiceover */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Preferred Video Style*</label>
              <select className="form-control" {...register("preferred_video_style", { required: "Video style is required" })}>
                <option value="Professional">Professional</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Vlog / Lifestyle">Vlog / Lifestyle</option>
              </select>
              {errors.preferred_video_style && <div className="error">{String(errors.preferred_video_style.message)}</div>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Voiceover Language*</label>
              <input type="text" placeholder="e.g., English, Spanish, or None" className="form-control"
                {...register("audio_voiceover", { required: "Voiceover info is required" })}
              />
              {errors.audio_voiceover && <div className="error">{String(errors.audio_voiceover.message)}</div>}
            </div>
          </div>

          {/* Audio & Reference Links */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Audio Requirements*</label>
              <textarea placeholder="Narration needed, background music, etc." className="form-control" rows={3}
                {...register("audio_description", { required: "Audio description is required" })}
              />
              {errors.audio_description && <div className="error">{String(errors.audio_description.message)}</div>}
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Reference Links</label>
              {referenceLinks.map((link, index) => (
                <div key={index} className="d-flex align-items-center mb-10">
                  <input type="url" placeholder="https://example.com/reference1" className="form-control" value={link} onChange={(e) => updateReferenceLink(index, e.target.value)} />
                  {referenceLinks.length > 1 && <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => removeReferenceLink(index)}>-</button>}
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={addReferenceLink}>+ Add Another Link</button>
            </div>
          </div>

          {/* Additional Notes & Meta Info */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Additional Notes</label>
              <textarea placeholder="Please deliver high quality work" className="form-control" rows={3} {...register("additional_notes")} />
            </div>
          </div>
          <div className="col-12"><h4 className="dash-title-three pt-30 mb-20">Meta Information (Optional)</h4></div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>URL Slug</label>
              <input type="text" placeholder="auto-generated if empty" className="form-control" {...register("url")} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Meta Title</label>
              <input type="text" placeholder="SEO-friendly title" className="form-control" {...register("meta_title")} />
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Meta Description</label>
              <textarea placeholder="Brief description for search engines" className="form-control" rows={2} {...register("meta_description")} />
            </div>
          </div>

          {/* Error & Action Buttons */}
          {error && <div className="col-12"><div className="alert alert-danger my-3">{error}</div></div>}
          <div className="col-12 d-flex justify-content-between mt-30">
            <button type="button" className="btn-one" onClick={onBackToList} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-one" disabled={loading}>{loading ? "Submitting..." : "Post Job"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;