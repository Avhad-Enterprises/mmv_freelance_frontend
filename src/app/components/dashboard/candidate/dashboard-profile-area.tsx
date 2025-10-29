"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardHeader from "./dashboard-header-minus";
import toast from "react-hot-toast";
import { Country, State, City } from 'country-state-city';
import _ from 'lodash'; // Using lodash for deep object comparison
import { useSidebar } from "@/context/SidebarContext";

type IProps = {
  // No props needed, using context
};

type Service = { title: string; rate: string; currency: string };
type PreviousWork = { title: string; description: string; url: string };

type ProfileData = {
  full_name: string;
  email: string;
  phone_number: string;
  bio: string;
  address_line_first: string;
  address_line_second: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  skills: string[];
  services: Service[];
  previous_works: PreviousWork[];
  skill_tags?: string[];
  superpowers?: string[];
  languages?: string[];
  availability?: string;
  experience_level?: string;
  role?: string;
  rate_amount?: number;
  currency?: string;
  short_description?: string;
  portfolio_links?: string[];
};

// Component is defined outside to prevent re-creation on render
const InfoRow = ({ label, value, field, editMode, editedData, handleInputChange }: {
  label: string;
  value?: string | number;
  field?: keyof ProfileData;
  editMode: boolean;
  editedData?: ProfileData | null;
  handleInputChange?: (field: keyof ProfileData, value: any) => void;
}) => {
  if (!editMode) {
    if (!value) return null;
    return (
      <div className="row mb-3">
        <div className="col-md-4">
          <strong>{label}:</strong>
        </div>
        <div className="col-md-8">{value}</div>
      </div>
    );
  }

  // Edit mode
  if (!field || !editedData || !handleInputChange) return null;

  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">
          <strong>{label}:</strong>
        </label>
      </div>
      <div className="col-md-8">
        <input
          type={field === 'email' ? 'email' : field === 'phone_number' ? 'tel' : 'text'}
          className="form-control"
          value={(editedData[field] as string | number) || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          pattern={field === 'phone_number' ? '[0-9]{10}' : undefined}
          title={field === 'phone_number' ? 'Please enter a 10-digit phone number' : undefined}
          required={field === 'email' || field === 'phone_number'}
        />
      </div>
    </div>
  );
};

// ## REFACTOR 1: ENHANCED INFOSECTION COMPONENT ##
// This component now includes its own Edit/Save/Cancel buttons, controlled
// by the parent component. This modularizes the UI and logic.
const InfoSection = ({ title, sectionKey, children, editingSection, onEdit, onSave, onCancel, isSaving }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
    editingSection: string | null;
    onEdit: (section: string) => void;
    onSave: (section: string) => void;
    onCancel: () => void;
    isSaving: boolean;
}) => {
    const isEditingThisSection = editingSection === sectionKey;

    return (
        <div className="bg-white card-box border-20 mt-30">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="dash-title-three">{title}</h4>
                <div>
                    {!editingSection ? (
                        <button className="dash-btn-two" style={{ minWidth: '100px', padding: '8px 16px' }} onClick={() => onEdit(sectionKey)}>
                            Edit
                        </button>
                    ) : isEditingThisSection && (
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" style={{ minWidth: '100px', padding: '8px 16px' }} onClick={() => onSave(sectionKey)} disabled={isSaving}>
                                {isSaving ? 'Saving Draft...' : 'Save Draft'}
                            </button>
                            <button className="btn btn-secondary" style={{ minWidth: '100px', padding: '8px 16px' }} onClick={onCancel} disabled={isSaving}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};


// Add animation styles
const floatingButtonStyle = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const DashboardProfileArea = ({}: IProps) => {
  const { setIsOpenSidebar } = useSidebar();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [tempChanges, setTempChanges] = useState<{ [section: string]: Partial<ProfileData> }>({});
  
  // Compute the displayed data by merging profile data with temporary changes
  const displayData = useMemo(() => {
    if (!profileData) return null;
    
    // Combine all temporary changes
    const allChanges = Object.values(tempChanges).reduce((acc, sectionChanges) => ({
      ...acc,
      ...sectionChanges
    }), {});

    // Return merged data
    return {
      ...profileData,
      ...allChanges
    };
  }, [profileData, tempChanges]);
  // ## REFACTOR 2: REPLACED editMode with editingSection ##
  // This state tracks which specific section is being edited (e.g., 'basicInfo', 'skills').
  // A null value means no section is in edit mode.
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");

  // Dropdown options
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [allSuperpowers, setAllSuperpowers] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(true);
  const [isLoadingSuperpowers, setIsLoadingSuperpowers] = useState<boolean>(true);

  // Location states
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Selected location ISO codes for dropdowns
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  // Static options
  const availableLanguages = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati", "Punjabi", "Malayalam", "Urdu", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic"];
  const availabilityOptions = ["full-time", "part-time", "contract", "freelance", "unavailable"];
  const experienceLevels = ["beginner", "intermediate", "expert", "professional"];

  // Utility to safely parse arrays from stringified JSON
  const safeArray = <T,>(val: any, fallback: T[] = []): T[] => {
    try {
      if (Array.isArray(val)) return val as T[];
      if (typeof val === "string" && val.trim().startsWith("[")) {
        return JSON.parse(val) as T[];
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/skills`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const skillNames: string[] = result.data.map((skill: any) => skill.skill_name);
          // Remove duplicates from the skills array
          const uniqueSkillNames = [...new Set(skillNames)];
          setAllSkills(uniqueSkillNames);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        toast.error("Could not load skills");
      } finally {
        setIsLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  // Fetch superpowers/categories from API
  useEffect(() => {
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const categories = data?.data || [];
        const editorCategories = categories
          .filter((cat: any) => cat.category_type === 'editor' && cat.is_active)
          .map((cat: any) => cat.category_name);
        setAllSuperpowers(editorCategories);
      })
      .catch(err => console.error('Error fetching categories:', err))
      .finally(() => setIsLoadingSuperpowers(false));
  }, []);

  // Initialize countries and manage location dropdown dependencies
  useEffect(() => setCountries(Country.getAllCountries()), []);
  useEffect(() => {
    if (selectedCountryCode) setStates(State.getStatesOfCountry(selectedCountryCode));
    else setStates([]);
    setSelectedStateCode("");
    setCities([]);
  }, [selectedCountryCode]);
  useEffect(() => {
    if (selectedCountryCode && selectedStateCode) setCities(City.getCitiesOfState(selectedCountryCode, selectedStateCode));
    else setCities([]);
  }, [selectedCountryCode, selectedStateCode]);


  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch basic user info
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
      });
      
      if (!userRes.ok) throw new Error('Failed to fetch user data');
      const userResponse = await userRes.json();
      
      if (!userResponse.success) throw new Error('Failed to fetch user data');
      
      const { user, userType: type } = userResponse.data;
      setUserType(type);

      // Fetch role-specific profile data
      let profileEndpoint = '';
      if (type === 'videographer') {
        profileEndpoint = '/api/v1/videographers/profile';
      } else if (type === 'video_editor') {
        profileEndpoint = '/api/v1/videoeditors/profile';
      } else {
        // Fallback for other freelancer types
        profileEndpoint = '/api/v1/freelancer-profiles/me';
      }

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${profileEndpoint}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }
      });

      let profile = null;
      if (profileRes.ok) {
        const profileResponse = await profileRes.json();
        if (profileResponse.success) {
          profile = profileResponse.data?.profile || profileResponse.data;
        }
      }

      const countryObj = Country.getCountryByCode(user.country);
      const stateObj = countryObj ? State.getStatesOfCountry(countryObj.isoCode).find(s => s.name === user.state) : null;
      
      const data: ProfileData = {
        full_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        phone_number: user.phone_number || "",
        bio: user.bio || profile?.short_description || "",
        address_line_first: user.address_line_first || profile?.address || "",
        address_line_second: user.address_line_second || "",
        city: user.city || "",
        state: stateObj?.isoCode || "",
        country: user.country || "",
        pincode: user.pincode || "",
        skills: safeArray<string>(profile?.skills),
        superpowers: safeArray<string>(profile?.superpowers),
        languages: safeArray<string>(profile?.languages),
        portfolio_links: safeArray<string>(profile?.portfolio_links),
        availability: profile?.availability,
        experience_level: profile?.experience_level,
        role: profile?.role,
        rate_amount: profile?.rate_amount,
        currency: profile?.currency || "INR",
        short_description: profile?.short_description,
        // These are not directly used but part of the type
        services: [], 
        previous_works: [],
        skill_tags: [],
      };
      setProfileData(data);
      setEditedData(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation

      if (countryObj) setSelectedCountryCode(countryObj.isoCode);
      if (stateObj) setSelectedStateCode(stateObj.isoCode);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUserProfile(); }, [fetchUserProfile]);

  const handleEdit = useCallback((section: string) => {
    setEditedData(JSON.parse(JSON.stringify(profileData))); // Reset changes on new edit
    if (profileData?.country) setSelectedCountryCode(profileData.country);
    if (profileData?.state) setSelectedStateCode(profileData.state);
    setEditingSection(section);
  }, [profileData]);

  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setEditedData(profileData);
  }, [profileData]);

  const handleInputChange = useCallback((field: keyof ProfileData, value: any) => {
    // Only strip non-numeric characters for phone number during typing
    if (field === 'phone_number') {
      value = value.replace(/\D/g, '').slice(0, 10); // Limit to 10 digits
    }
    
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);
  
  const handleArrayChange = useCallback((field: keyof ProfileData, value: string[]) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const addPortfolioLink = useCallback(() => {
    setEditedData(prev => {
      if (!prev) return null;
      const currentLinks = prev.portfolio_links || [];
      return { ...prev, portfolio_links: [...currentLinks, ""] };
    });
  }, []);

  const updatePortfolioLink = useCallback((index: number, value: string) => {
    setEditedData(prev => {
      if (!prev || !prev.portfolio_links) return prev;
      const newLinks = [...prev.portfolio_links];
      newLinks[index] = value;
      return { ...prev, portfolio_links: newLinks };
    });
  }, []);

  const removePortfolioLink = useCallback((index: number) => {
    setEditedData(prev => {
      if (!prev || !prev.portfolio_links) return prev;
      const newLinks = prev.portfolio_links.filter((_, i) => i !== index);
      return { ...prev, portfolio_links: newLinks };
    });
  }, []);

  // ## REFACTOR 3: UTILITY TO FIND CHANGED FIELDS ##
  // This function compares the original and edited data objects and returns
  // an object containing only the key-value pairs that have been modified.
  const getChangedFields = (original: ProfileData, edited: ProfileData): Partial<ProfileData> => {
      const changes: Partial<ProfileData> = {};
      (Object.keys(edited) as Array<keyof ProfileData>).forEach(key => {
          const originalValue = original[key];
          const editedValue = edited[key];

          if (!_.isEqual(originalValue, editedValue)) {
              (changes as any)[key] = editedValue;
          }
      });
      return changes;
  };
  
  // ## REFACTOR 4: GENERIC, DYNAMIC SAVE HANDLER ##
  // This single function handles saving for any section. It determines which fields
  // have changed and constructs lean payloads for the API calls.
  const handleSave = (section: string) => {
    if (!editedData || !profileData) return;
    setSaving(true);

    // Validate email and phone if they've been changed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editedData.email !== profileData.email && !emailRegex.test(editedData.email)) {
      toast.error('Please enter a valid email address');
      setSaving(false);
      return;
    }

    if (editedData.phone_number !== profileData.phone_number) {
      const numericPhone = editedData.phone_number.replace(/\D/g, '');
      if (numericPhone.length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        setSaving(false);
        return;
      }
    }

    const changes = getChangedFields(profileData, editedData);
    
    if (Object.keys(changes).length === 0) {
        toast.success("No changes to save as draft.");
        setEditingSection(null);
        setSaving(false);
        return;
    }

    // Store changes temporarily
    setTempChanges(prev => ({
        ...prev,
        [section]: changes
    }));

    toast.success("Changes saved as draft!");
    setEditingSection(null);
    setSaving(false);
};

  const saveAllChanges = async () => {
    if (!profileData) return;
    setSaving(true);

    try {
        // Combine all temporary changes
        const allChanges = Object.values(tempChanges).reduce((acc, sectionChanges) => ({
            ...acc,
            ...sectionChanges
        }), {});

        // Split changes into user and profile payloads
        const userFields: (keyof ProfileData)[] = ['full_name', 'email', 'phone_number', 'bio', 'address_line_first', 'address_line_second', 'city', 'state', 'country', 'pincode'];
        const profileFields: (keyof ProfileData)[] = ['availability', 'experience_level', 'rate_amount', 'currency', 'skills', 'superpowers', 'languages', 'portfolio_links', 'short_description', 'role'];

        const userPayload: { [key: string]: any } = {};
        const profilePayload: { [key: string]: any } = {};

        // Populate payloads
        for (const key in allChanges) {
            const typedKey = key as keyof ProfileData;
            if (userFields.includes(typedKey)) {
                userPayload[typedKey] = allChanges[typedKey];
            }
            if (profileFields.includes(typedKey)) {
                profilePayload[typedKey] = allChanges[typedKey];
            }
        }

        // Handle special fields
        if (userPayload.full_name) {
            const nameParts = userPayload.full_name.split(' ');
            userPayload.first_name = nameParts[0] || "";
            userPayload.last_name = nameParts.slice(1).join(' ') || "";
            delete userPayload.full_name;
        }
        if (userPayload.country) {
            userPayload.country = Country.getCountryByCode(userPayload.country)?.name || '';
        }
        if (userPayload.state) {
            userPayload.state = State.getStateByCodeAndCountry(userPayload.state, profileData.country)?.name || '';
        }

        // Make API calls
        if (Object.keys(userPayload).length > 0) {
const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(userPayload)
            });
            if (!userRes.ok) {
                const errorBody = await userRes.json();
                throw new Error(errorBody.message || 'Failed to update user data');
            }
        }

        const freelancerTypes = ["freelancer", "video_editor", "videographer"];
        if (userType && freelancerTypes.includes(userType) && Object.keys(profilePayload).length > 0) {
            let profileEndpoint = '';
            if (userType === 'videographer') {
                profileEndpoint = '/api/v1/videographers/profile';
            } else if (userType === 'video_editor') {
                profileEndpoint = '/api/v1/videoeditors/profile';
            } else {
                // Fallback for other freelancer types
                profileEndpoint = '/api/v1/freelancer-profiles/me';
            }

            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${profileEndpoint}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(profilePayload)
            });
            if (!profileRes.ok) {
                const errorBody = await profileRes.json();
                throw new Error(errorBody.message || 'Failed to update profile data');
            }
        }

        toast.success("All changes saved successfully!");
        setTempChanges({}); // Clear temporary changes
        await fetchUserProfile();

    } catch (err: any) {
        console.error("Failed to save all changes:", err);
        toast.error(err.message || "Failed to save changes");
    } finally {
        setSaving(false);
    }
  };

  const isEditModeFor = (section: string) => editingSection === section;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatingButtonStyle }} />
      <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader />
        {/* header end */}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="main-title">My Profile</h2>
        </div>
        {Object.keys(tempChanges).length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <button 
              className="dash-btn-two btn-lg" 
              onClick={saveAllChanges}
              disabled={saving}
              style={{ 
                minWidth: '200px', 
                padding: '12px 24px',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {saving ? 'Saving All Changes...' : 'Save All Changes'}
            </button>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        )}

        {!loading && profileData && editedData && displayData && (
          <>
            <InfoSection title="Basic Information" sectionKey="basicInfo" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
              {/* {!isEditModeFor("basicInfo") && userType && (
                <div className="mb-4">
                  <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    {userType.replace(/_/g, ' ')}
                  </span>
                </div>
              )} */}
              
              <InfoRow label="Full Name" value={displayData.full_name} field="full_name" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange}/>
              <InfoRow label="Email" value={displayData.email} field="email" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} />
              <InfoRow label="Phone Number" value={displayData.phone_number} field="phone_number" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} />

              {(profileData.availability || isEditModeFor("basicInfo")) && (
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Availability:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <select className="form-select" value={editedData.availability || ''} onChange={(e) => handleInputChange('availability', e.target.value)}>
                        <option value="">Select availability</option>
                        {availabilityOptions.map(option => (
                          <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}</option>
                        ))}
                      </select>
                    ) : (displayData.availability)}
                  </div>
                </div>
              )}

              {(profileData.experience_level || isEditModeFor("basicInfo")) && (
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Experience Level:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <select className="form-select" value={editedData.experience_level || ''} onChange={(e) => handleInputChange('experience_level', e.target.value)}>
                        <option value="">Select experience level</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                        ))}
                      </select>
                    ) : (displayData.experience_level)}
                  </div>
                </div>
              )}

              {(profileData.bio || isEditModeFor("basicInfo")) && (
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Bio:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <textarea className="form-control" rows={4} value={editedData.bio || ''}
                        onChange={(e) => {
                          handleInputChange('bio', e.target.value);
                          handleInputChange('short_description', e.target.value);
                        }}
                      />
                    ) : (<p style={{ whiteSpace: 'pre-wrap' }}>{displayData.bio}</p>)}
                  </div>
                </div>
              )}
            </InfoSection>
            
            <InfoSection title="Skills & Expertise" sectionKey="skills" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
              <div className="row mb-3">
                <div className="col-md-4"><strong>Skills:</strong></div>
                <div className="col-md-8">
                  {isEditModeFor("skills") ? (
                    <div>
                      <select className="form-select" disabled={isLoadingSkills} onChange={(e) => {
                          const skill = e.target.value;
                          if (skill && !editedData.skills.includes(skill)) {
                              handleArrayChange('skills', [...editedData.skills, skill]);
                          }
                      }}>
                          <option value="">Add a skill...</option>
                          {allSkills.map(skill => (<option key={skill} value={skill}>{skill}</option>))}
                      </select>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {editedData.skills.map((skill, idx) => (
                          <span key={idx} className="badge bg-secondary" style={{ fontSize: '13px', padding: '6px 12px' }}>
                            {skill}
                            <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: '10px' }}
                              onClick={() => handleArrayChange('skills', editedData.skills.filter((_, i) => i !== idx))}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {displayData.skills.map((skill: string, idx: number) => (<span key={idx} className="badge bg-secondary">{skill}</span>))}
                    </div>
                  )}
                </div>
              </div>
              {(profileData.superpowers || isEditModeFor("skills")) && (
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Superpowers:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("skills") ? (
                      <div>
                        <select className="form-select" disabled={isLoadingSuperpowers}
                            onChange={(e) => {
                                const superpower = e.target.value;
                                if (superpower && !(editedData.superpowers || []).includes(superpower)) {
                                    handleArrayChange('superpowers', [...(editedData.superpowers || []), superpower]);
                                }
                            }}>
                            <option value="">Add a superpower...</option>
                            {allSuperpowers.map(power => (<option key={power} value={power}>{power}</option>))}
                        </select>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {(editedData.superpowers || []).map((power, idx) => (
                            <span key={idx} className="badge bg-success" style={{ fontSize: '13px', padding: '6px 12px' }}>
                              {power}
                              <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: '10px' }}
                                onClick={() => handleArrayChange('superpowers', (editedData.superpowers || []).filter((_, i) => i !== idx))}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {(displayData.superpowers || []).map((power: string, idx: number) => (<span key={idx} className="badge bg-success">{power}</span>))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(profileData.languages || isEditModeFor("skills")) && (
                  <div className="row mb-3">
                      <div className="col-md-4"><strong>Languages:</strong></div>
                      <div className="col-md-8">
                          {isEditModeFor("skills") ? (
                              <div>
                                  <select className="form-select"
                                      onChange={(e) => {
                                          const lang = e.target.value;
                                          if (lang && !(editedData.languages || []).includes(lang)) {
                                              handleArrayChange('languages', [...(editedData.languages || []), lang]);
                                          }
                                      }}>
                                      <option value="">Add a language...</option>
                                      {availableLanguages.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
                                  </select>
                                  <div className="d-flex flex-wrap gap-2 mt-2">
                                      {(editedData.languages || []).map((lang, idx) => (
                                          <span key={idx} className="badge bg-info text-dark" style={{ fontSize: '13px', padding: '6px 12px' }}>
                                              {lang}
                                              <button type="button" className="btn-close ms-2" style={{ fontSize: '10px' }}
                                                  onClick={() => handleArrayChange('languages', (editedData.languages || []).filter((_, i) => i !== idx))}
                                              />
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          ) : ((displayData.languages || []).join(', '))}
                      </div>
                  </div>
              )}
            </InfoSection>

            {(profileData.rate_amount || isEditModeFor("rates")) && (
              <InfoSection title="Services & Rates" sectionKey="rates" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Hourly Rate:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("rates") ? (
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input type="number" className="form-control" value={editedData.rate_amount || ''}
                          onChange={(e) => handleInputChange('rate_amount', parseFloat(e.target.value) || 0)} />
                        <span className="input-group-text">/hr</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#244034' }}>
                        ₹ {displayData.rate_amount}/hr
                      </span>
                    )}
                  </div>
                </div>
              </InfoSection>
            )}

            {(profileData.portfolio_links?.length || isEditModeFor("portfolio")) && (
              <InfoSection title="Portfolio" sectionKey="portfolio" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                {isEditModeFor("portfolio") ? (
                  <div>
                    {(editedData.portfolio_links || []).map((link, index) => (
                      <div key={index} className="input-group mb-3">
                        <input type="url" className="form-control" value={link} placeholder="https://example.com"
                          onChange={(e) => updatePortfolioLink(index, e.target.value)} />
                        <button className="btn btn-outline-danger" type="button" onClick={() => removePortfolioLink(index)}>Remove</button>
                      </div>
                    ))}
                    <button className="btn btn-outline-primary" type="button" onClick={addPortfolioLink}>+ Add Portfolio Link</button>
                  </div>
                ) : (
                  (displayData.portfolio_links || []).map((link: string, index: number) => (
                    <div key={index} className="mb-2"><a href={link} target="_blank" rel="noopener noreferrer">View Link {index + 1}</a></div>
                  ))
                )}
              </InfoSection>
            )}

            <InfoSection title="Address & Location" sectionKey="address" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
              <InfoRow label="Address Line 1" value={profileData.address_line_first} field="address_line_first" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />
              <InfoRow label="Address Line 2" value={profileData.address_line_second} field="address_line_second" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />
              
              <div className="row mb-3">
                <div className="col-md-4"><strong>Country:</strong></div>
                <div className="col-md-8">
                  {isEditModeFor("address") ? (
                    <select className="form-select" value={editedData.country || ''} onChange={(e) => {
                        handleInputChange('country', e.target.value);
                        setSelectedCountryCode(e.target.value);
                        handleInputChange('state', '');
                        handleInputChange('city', '');
                    }}>
                      <option value="">Select Country</option>
                      {countries.map(country => (
                          <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                      ))}
                    </select>
                  ) : (Country.getCountryByCode(displayData.country)?.name)}
                </div>
              </div>

              {(isEditModeFor("address") || displayData.state) && (
                <div className="row mb-3">
                  <div className="col-md-4"><strong>State:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select className="form-select" value={editedData.state || ''} onChange={(e) => {
                          handleInputChange('state', e.target.value);
                          setSelectedStateCode(e.target.value);
                          handleInputChange('city', '');
                      }} disabled={!editedData.country}>
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                        ))}
                      </select>
                    ) : (State.getStateByCodeAndCountry(displayData.state, displayData.country)?.name)}
                  </div>
                </div>
              )}

              <div className="row mb-3">
                <div className="col-md-4"><strong>City:</strong></div>
                <div className="col-md-8">
                  {isEditModeFor("address") ? (
                    <select className="form-select" value={editedData.city || ''} onChange={(e) => handleInputChange('city', e.target.value)} disabled={!editedData.state}>
                      <option value="">Select City</option>
                      {cities.map(city => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  ) : (displayData.city)}
                </div>
              </div>
              
              <InfoRow label="Zip/Pin Code" value={displayData.pincode} field="pincode" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />
            </InfoSection>

          </>
        )}
      </div>
    </div>
    </>
  );
};

export default DashboardProfileArea;