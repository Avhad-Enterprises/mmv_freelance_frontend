'use client';

import React, { useState, useEffect, type FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { makePostRequest, makeGetRequest } from '@/utils/api';
import type { NewProjectPayload } from '@/types/project';
import MultipleSelectionField from './MultipleSelectionField';
import { validateURL } from '@/utils/validation';

interface IProps {
  onBackToList: () => void;
}

// Initial form data matching the API payload structure
const initialFormData: NewProjectPayload = {
  project_title: '',
  project_category: '',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  project_description: '',
  budget: 500,
  tags: '[]', // API expects a stringified array
  skills_required: [],
  reference_links: [],
  additional_notes: '',
  projects_type: '',
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
  const [referenceLinkErrors, setReferenceLinkErrors] = useState<(string | undefined)[]>([undefined]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  // Bidding modal states
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [biddingEnabled, setBiddingEnabled] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // New states for dynamic data
  const [categories, setCategories] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [currency, setCurrency] = useState<string>('USD');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch categories and skills from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);

        // Fetch categories
        const categoriesResponse = await makeGetRequest('api/v1/categories');
        if (categoriesResponse.data?.data) {
          const activeCategories = categoriesResponse.data.data
            .filter((cat: any) => cat.is_active)
            .map((cat: any) => cat.category_name);
          setCategories(activeCategories);
        }

        // Fetch skills
        const skillsResponse = await makeGetRequest('api/v1/skills');
        if (skillsResponse.data?.data) {
          const skillNames = skillsResponse.data.data.map((skill: any) => skill.skill_name);
          setSkills(skillNames);
        }
      } catch (err) {
        console.error('Error fetching categories/skills:', err);
        toast.error('Failed to load categories and skills');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const meResponse = await makeGetRequest("api/v1/users/me");
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

    // Store form data and show bidding modal
    setPendingFormData(data);
    setShowBiddingModal(true);
  };

  const handleConfirmPost = async () => {
    if (!pendingFormData || !currentUser) return;

    setLoading(true);
    setError(null);
    setShowBiddingModal(false);

    const finalUrl = pendingFormData.url && pendingFormData.url.trim()
      ? pendingFormData.url.trim()
      : `${generateSlug(pendingFormData.project_title)}-${Date.now()}`;

    // Validate reference links
    const nonEmptyLinks = referenceLinks.filter(link => link.trim() !== '');
    const invalidLinks: string[] = [];
    const validLinks: string[] = [];

    nonEmptyLinks.forEach((link, index) => {
      const validation = validateURL(link, { allowEmpty: false });
      if (!validation.isValid) {
        invalidLinks.push(`Reference link ${index + 1}: ${validation.error}`);
      } else {
        validLinks.push(validation.normalizedURL || link);
      }
    });

    if (invalidLinks.length > 0) {
      setError(invalidLinks.join('; '));
      toast.error('Please fix invalid reference links');
      setLoading(false);
      setPendingFormData(null);
      return;
    }

    const payload = {
      ...pendingFormData,
      url: finalUrl,
      skills_required: selectedSkills,
      reference_links: validLinks,
      tags: JSON.stringify(tags),
      client_id: currentUser.clientId,
      created_by: currentUser.userId,
      is_active: 1,
      bidding_enabled: biddingEnabled, // Add bidding status to payload
      currency: currency, // Add currency to payload
      // Ensure numeric fields are sent as numbers, not strings
      budget: Number(pendingFormData.budget),
      video_length: Number(pendingFormData.video_length),
    };

    try {
      await makePostRequest("api/v1/projects-tasks", payload);
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
      setPendingFormData(null);
      setBiddingEnabled(false); // Reset for next time
    }
  };

  const handleCancelModal = () => {
    setShowBiddingModal(false);
    setPendingFormData(null);
    setBiddingEnabled(false);
  };

  // Handlers for Reference Links
  const addReferenceLink = () => {
    setReferenceLinks([...referenceLinks, '']);
    setReferenceLinkErrors([...referenceLinkErrors, undefined]);
  };

  const updateReferenceLink = (index: number, value: string) => {
    const newLinks = [...referenceLinks];
    newLinks[index] = value;
    setReferenceLinks(newLinks);

    // Validate URL on change
    const newErrors = [...referenceLinkErrors];
    if (value.trim()) {
      const validation = validateURL(value, { allowEmpty: false });
      newErrors[index] = validation.isValid ? undefined : validation.error;
    } else {
      newErrors[index] = undefined; // Empty is okay for reference links
    }
    setReferenceLinkErrors(newErrors);
  };

  const removeReferenceLink = (index: number) => {
    if (referenceLinks.length > 1) {
      setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
      setReferenceLinkErrors(referenceLinkErrors.filter((_, i) => i !== index));
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
    <>
      <div className="bg-white card-box border-20">
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
                <select className="form-control" {...register("project_category", { required: "Category is required" })}
                  disabled={isLoadingData}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
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
              <div className="row">
                <div className="col-md-7">
                  <div className="input-group-meta position-relative mb-25">
                    <label>Budget*</label>
                    <input type="number" placeholder="Enter amount" className="form-control"
                      {...register("budget", {
                        required: "Budget is required",
                        min: { value: 1, message: "Budget must be greater than 0" }
                      })}
                    />
                    {errors.budget && <div className="error">{String(errors.budget.message)}</div>}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="input-group-meta position-relative mb-25">
                    <label>Currency*</label>
                    <select
                      className="form-control"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR ₹</option>
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="JPY">JPY ¥</option>
                      <option value="AUD">AUD $</option>
                      <option value="CAD">CAD $</option>
                      <option value="CHF">CHF Fr</option>
                      <option value="CNY">CNY ¥</option>
                      <option value="SEK">SEK kr</option>
                      <option value="NZD">NZD $</option>
                      <option value="MXN">MXN $</option>
                      <option value="SGD">SGD $</option>
                      <option value="HKD">HKD $</option>
                      <option value="NOK">NOK kr</option>
                      <option value="KRW">KRW ₩</option>
                      <option value="TRY">TRY ₺</option>
                      <option value="RUB">RUB ₽</option>
                      <option value="BRL">BRL R$</option>
                      <option value="ZAR">ZAR R</option>
                      <option value="DKK">DKK kr</option>
                      <option value="PLN">PLN zł</option>
                      <option value="THB">THB ฿</option>
                      <option value="IDR">IDR Rp</option>
                      <option value="HUF">HUF Ft</option>
                      <option value="CZK">CZK Kč</option>
                      <option value="ILS">ILS ₪</option>
                      <option value="CLP">CLP $</option>
                      <option value="PHP">PHP ₱</option>
                      <option value="AED">AED د.إ</option>
                      <option value="COP">COP $</option>
                      <option value="SAR">SAR ﷼</option>
                      <option value="MYR">MYR RM</option>
                      <option value="RON">RON lei</option>
                    </select>
                  </div>
                </div>
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
                    <span key={index} className="tag-chip badge me-2 mb-2" style={{ backgroundColor: '#e8f5e9', color: '#31795a', border: '1px solid #31795a' }}>
                      {tag}
                      <button type="button" className="btn-close ms-2" style={{ fontSize: '0.65em' }} onClick={() => handleRemoveTag(index)}></button>
                    </span>
                  ))}
                  <div className="d-flex">
                    <input type="text" className="form-control" placeholder="Add a tag..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
                    <button type="button" className="dash-btn-two ms-2" style={{ minWidth: '45px', lineHeight: '38px', padding: '0 15px' }} onClick={handleAddTag}>+</button>
                  </div>
                </div>
                <small style={{ color: '#6c757d', display: 'block', marginTop: '5px' }}>Press Enter or click '+' to add a tag.</small>
              </div>
            </div>

            {/* Skills Required */}
            <div className="col-12">
              <MultipleSelectionField
                label="Skills Required*"
                options={skills}
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
                  <div key={index} className="mb-10">
                    <div className="d-flex align-items-center">
                      <input
                        type="url"
                        placeholder="https://example.com/reference1"
                        className={`form-control ${referenceLinkErrors[index] ? 'is-invalid' : ''}`}
                        value={link}
                        onChange={(e) => updateReferenceLink(index, e.target.value)}
                      />
                      {referenceLinks.length > 1 && <button type="button" className="btn btn-outline-danger btn-sm ms-2" onClick={() => removeReferenceLink(index)}>-</button>}
                    </div>
                    {referenceLinkErrors[index] && (
                      <small className="text-danger d-block mt-1">{referenceLinkErrors[index]}</small>
                    )}
                  </div>
                ))}
                <button type="button" className="dash-btn-two mt-2" style={{ minWidth: 'auto', lineHeight: '35px', padding: '0 15px', fontSize: '14px' }} onClick={addReferenceLink}>+ Add Another Link</button>
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
              <button type="button" className="dash-btn-two" style={{ background: '#6c757d' }} onClick={onBackToList} disabled={loading}>Cancel</button>
              <button type="submit" className="dash-btn-two" disabled={loading}>{loading ? "Submitting..." : "Post Job"}</button>
            </div>
          </div>
        </form>
      </div>

      {/* Bidding Confirmation Modal */}
      {showBiddingModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, overflow: 'auto' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enable Bidding</h5>
                <button type="button" className="btn-close" onClick={handleCancelModal}></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Would you like to enable bidding for this job? This allows freelancers to submit proposals with their own pricing.</p>
                <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                  <div>
                    <strong>Bidding Status</strong>
                    <div className="text-muted small">
                      {biddingEnabled ? 'Freelancers can submit custom bids' : 'Fixed price project'}
                    </div>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="biddingToggle"
                      checked={biddingEnabled}
                      onChange={(e) => setBiddingEnabled(e.target.checked)}
                      style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                    />
                    <label className="form-check-label" htmlFor="biddingToggle"></label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelModal}>
                  Cancel
                </button>
                <button type="button" className="dash-btn-two" onClick={handleConfirmPost} disabled={loading}>
                  {loading ? 'Posting...' : 'Confirm & Post Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostJobForm;