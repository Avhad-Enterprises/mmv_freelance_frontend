'use client';

import React, { useState, useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import { makePostRequest, makeGetRequest } from '@/utils/api';
import type { NewProjectPayload } from '@/types/project';
import MultipleSelectionField from './MultipleSelectionField';

interface IProps {
  onBackToList: () => void;
}

const initialFormData: NewProjectPayload = {
  project_title: '',
  project_category: 'Video Editing',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  project_description: '',
  budget: 500,
  skills_required: [],
  reference_links: [],
  additional_notes: '',
  projects_type: 'Video',
  project_format: 'MP4',
  audio_voiceover: 'No',
  audio_description: 'Client will provide licensed background music.',
  video_length: 600,
  preferred_video_style: 'Vlog / Lifestyle',
  url: '',
  meta_title: '',
  meta_description: '',
};

// Helper function to generate URL slug
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
      client_id: currentUser.clientId,
      created_by: currentUser.userId,
      editor_id: 0,
      is_active: 1,
    };

    try {
      await makePostRequest("/projectsTask/insertprojects_task", payload);
      toast.success("Job posted successfully!"); // Replaced alert with toast
      // Adding a small delay to allow user to see the toast before navigating
      setTimeout(() => {
        onBackToList();
      }, 1500);
    } catch (err: unknown) {
      let message = "An error occurred while posting the job.";
      if (err instanceof Error) {
        const errorResponse = (err as any).response?.data;
        if (errorResponse?.Message === "URL already registered") {
          message = "This URL slug is already taken. Please use a different one or leave it empty for auto-generation.";
        } else {
          message = errorResponse?.Message || err.message;
        }
      }
      setError(message);
      toast.error(message); // Optionally show an error toast
      console.error("Failed to post job:", err);
    } finally {
      setLoading(false);
    }
  };

  const addReferenceLink = () => {
    setReferenceLinks([...referenceLinks, '']);
  };

  const updateReferenceLink = (index: number, value: string) => {
    const newLinks = [...referenceLinks];
    newLinks[index] = value;
    setReferenceLinks(newLinks);
  };

  const removeReferenceLink = (index: number) => {
    if (referenceLinks.length > 1) {
      const newLinks = referenceLinks.filter((_, i) => i !== index);
      setReferenceLinks(newLinks);
    }
  };

  return (
    <div className="bg-white card-box border-20">
      {/* Toaster component to render the notifications */}
      
      <h2 className="main-title mb-30">Post a New Job</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Project Title */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Title*</label>
              <input
                type="text"
                placeholder="Enter project title"
                className="form-control"
                {...register("project_title", { required: "Project title is required" })}
                onChange={() => clearErrors("project_title")}
              />
              {errors.project_title && (
                <div className="error">{String(errors.project_title.message)}</div>
              )}
            </div>
          </div>

          {/* Project Category */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Category*</label>
              <select
                className="form-control"
                {...register("project_category", { required: "Category is required" })}
                onChange={() => clearErrors("project_category")}
              >
                <option value="Video Editing">Video Editing</option>
                <option value="Animation">Animation</option>
                <option value="Motion Graphics">Motion Graphics</option>
                <option value="Video Production">Video Production</option>
                <option value="Color Grading">Color Grading</option>
                <option value="Sound Design">Sound Design</option>
                <option value="VFX">VFX</option>
              </select>
              {errors.project_category && (
                <div className="error">{String(errors.project_category.message)}</div>
              )}
            </div>
          </div>

          {/* Project Type */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Type*</label>
              <select
                className="form-control"
                {...register("projects_type", { required: "Project type is required" })}
                onChange={() => clearErrors("projects_type")}
              >
                <option value="Video">Video</option>
                <option value="Animation">Animation</option>
                <option value="Short Film">Short Film</option>
                <option value="Documentary">Documentary</option>
                <option value="Commercial">Commercial</option>
                <option value="Social Media">Social Media</option>
              </select>
              {errors.projects_type && (
                <div className="error">{String(errors.projects_type.message)}</div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Budget ($)*</label>
              <input
                type="number"
                placeholder="Enter budget amount"
                className="form-control"
                {...register("budget", {
                  required: "Budget is required",
                  min: { value: 1, message: "Budget must be greater than 0" }
                })}
                onChange={() => clearErrors("budget")}
              />
              {errors.budget && (
                <div className="error">{String(errors.budget.message)}</div>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Deadline*</label>
              <input
                type="date"
                className="form-control"
                {...register("deadline", { required: "Deadline is required" })}
                onChange={() => clearErrors("deadline")}
              />
              {errors.deadline && (
                <div className="error">{String(errors.deadline.message)}</div>
              )}
            </div>
          </div>

          {/* Project Description */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Project Description*</label>
              <textarea
                placeholder="Describe your project requirements in detail"
                className="form-control"
                rows={4}
                {...register("project_description", { required: "Description is required" })}
                onChange={() => clearErrors("project_description")}
              />
              {errors.project_description && (
                <div className="error">{String(errors.project_description.message)}</div>
              )}
            </div>
          </div>

          {/* Skills Required */}
          <div className="col-12">
            <MultipleSelectionField
              label="Skills Required"
              options={[
                "Video Editing", "Color Grading", "Sound Design", "Motion Graphics",
                "Animation", "VFX", "Adobe Premiere Pro", "Adobe After Effects",
                "Final Cut Pro", "DaVinci Resolve", "Avid Media Composer",
                "Cinema 4D", "Blender", "Adobe Audition"
              ]}
              selectedItems={selectedSkills}
              onChange={(skills) => {
                setSelectedSkills(skills);
                setValue('skills_required', skills);
                clearErrors('skills_required');
              }}
              required={true}
              error={errors.skills_required?.message as string}
            />
          </div>

          {/* Video Length */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Video Length (seconds)*</label>
              <input
                type="number"
                placeholder="e.g., 600 for 10 minutes"
                className="form-control"
                {...register("video_length", {
                  required: "Video length is required",
                  min: { value: 1, message: "Video length must be greater than 0" }
                })}
                onChange={() => clearErrors("video_length")}
              />
              {errors.video_length && (
                <div className="error">{String(errors.video_length.message)}</div>
              )}
            </div>
          </div>

          {/* Project Format */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Final Format*</label>
              <select
                className="form-control"
                {...register("project_format", { required: "Format is required" })}
                onChange={() => clearErrors("project_format")}
              >
                <option value="MP4">MP4</option>
                <option value="MOV">MOV</option>
                <option value="AVI">AVI</option>
                <option value="ProRes">ProRes</option>
                <option value="H.264">H.264</option>
                <option value="H.265">H.265</option>
              </select>
              {errors.project_format && (
                <div className="error">{String(errors.project_format.message)}</div>
              )}
            </div>
          </div>

          {/* Preferred Video Style */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Preferred Video Style*</label>
              <select
                className="form-control"
                {...register("preferred_video_style", { required: "Video style is required" })}
                onChange={() => clearErrors("preferred_video_style")}
              >
                <option value="Vlog / Lifestyle">Vlog / Lifestyle</option>
                <option value="Corporate">Corporate</option>
                <option value="Cinematic">Cinematic</option>
                <option value="Documentary">Documentary</option>
                <option value="Fast-paced / Dynamic">Fast-paced / Dynamic</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Creative / Artistic">Creative / Artistic</option>
              </select>
              {errors.preferred_video_style && (
                <div className="error">{String(errors.preferred_video_style.message)}</div>
              )}
            </div>
          </div>

          {/* Audio Voiceover */}
          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Voiceover Required?*</label>
              <select
                className="form-control"
                {...register("audio_voiceover", { required: "Voiceover preference is required" })}
                onChange={() => clearErrors("audio_voiceover")}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              {errors.audio_voiceover && (
                <div className="error">{String(errors.audio_voiceover.message)}</div>
              )}
            </div>
          </div>

          {/* Audio Description */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Audio Requirements*</label>
              <textarea
                placeholder="Describe audio requirements, music preferences, etc."
                className="form-control"
                rows={3}
                {...register("audio_description", { required: "Audio description is required" })}
                onChange={() => clearErrors("audio_description")}
              />
              {errors.audio_description && (
                <div className="error">{String(errors.audio_description.message)}</div>
              )}
            </div>
          </div>

          {/* Reference Links */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Reference Links</label>
              {referenceLinks.map((link, index) => (
                <div key={index} className="d-flex align-items-center mb-10">
                  <input
                    type="url"
                    placeholder="https://example.com/video"
                    className="form-control"
                    value={link}
                    onChange={(e) => updateReferenceLink(index, e.target.value)}
                  />
                  {referenceLinks.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => removeReferenceLink(index)}
                      style={{ lineHeight: 1, padding: '0.25rem 0.5rem' }}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={addReferenceLink}
              >
                + Add Another Link
              </button>
              <small style={{ color: "blue", display: 'block', marginTop: '5px' }}>
                Provide links to videos or content that inspire the style you're looking for
              </small>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Additional Notes</label>
              <textarea
                placeholder="Any other important information..."
                className="form-control"
                rows={3}
                {...register("additional_notes")}
              />
            </div>
          </div>

          {/* Meta Information Section */}
          <div className="col-12">
            <h4 className="dash-title-three pt-30 mb-20">Meta Information (Optional)</h4>
          </div>

          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>URL Slug</label>
              <input
                type="text"
                placeholder="my-awesome-project (leave empty for auto-generation)"
                className="form-control"
                {...register("url")}
              />
              <small style={{ color: "#888" }}>
                Leave empty to auto-generate from project title
              </small>
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-group-meta position-relative mb-25">
              <label>Meta Title</label>
              <input
                type="text"
                placeholder="SEO-friendly title"
                className="form-control"
                {...register("meta_title")}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Meta Description</label>
              <textarea
                placeholder="Brief description for SEO purposes"
                className="form-control"
                rows={2}
                {...register("meta_description")}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="col-12">
              <div className="alert alert-danger my-3">{error}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="col-12 d-flex justify-content-between mt-30">
            <button
              type="button"
              className="btn-one"
              onClick={onBackToList}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-one"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Post Job"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;