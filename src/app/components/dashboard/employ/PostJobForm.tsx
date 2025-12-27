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
      // Inject defaults for removed UI fields
      video_length: initialFormData.video_length,
      project_format: initialFormData.project_format,
      preferred_video_style: initialFormData.preferred_video_style,
      audio_voiceover: initialFormData.audio_voiceover,
      audio_description: initialFormData.audio_description,
      meta_title: initialFormData.meta_title,
      meta_description: initialFormData.meta_description,

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
                <label>Project Category</label>
                <select className="form-control" {...register("project_category")}
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
                <label>Project Type</label>
                <select className="form-control" {...register("projects_type")}>
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
                      maxLength={8}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.value.length > 8) {
                          target.value = target.value.slice(0, 8);
                        }
                      }}
                      {...register("budget", {
                        required: "Budget is required",
                        min: { value: 1, message: "Budget must be greater than 0" },
                        max: { value: 99999999, message: "Budget cannot exceed 8 digits" }
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
                <input
                  type="date"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  {...register("deadline", { required: "Deadline is required" })}
                />
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
                <div className="tags-input-container p-3 border rounded bg-light">
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag-chip badge rounded-pill d-inline-flex align-items-center" style={{ backgroundColor: '#e8f5e9', color: '#31795a', border: '1px solid #31795a', padding: '8px 12px', fontSize: '14px' }}>
                        {tag}
                        <button type="button" className="btn-close ms-2" style={{ fontSize: '0.65em' }} onClick={() => handleRemoveTag(index)}></button>
                      </span>
                    ))}
                  </div>
                  <div className="d-flex">
                    <input type="text" className="form-control" placeholder="Type tag and press Enter..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} />
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

            {/* Reference Links */}
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

            {/* Additional Notes */}
            <div className="col-12">
              <div className="input-group-meta position-relative mb-25">
                <label>Additional Notes</label>
                <textarea placeholder="Please deliver high quality work" className="form-control" rows={3} {...register("additional_notes")} />
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