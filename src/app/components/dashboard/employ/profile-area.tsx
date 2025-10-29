"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { Country, State, City } from 'country-state-city';
import _ from 'lodash';
import { useSidebar } from "@/context/SidebarContext";
import DashboardHeader from "../candidate/dashboard-header";
import { authCookies } from "@/utils/cookies";

type IProps = {};

type ProfileData = {
  // Basic User Info
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  phone_verified: boolean;
  email_verified: boolean;
  bio: string;
  address_line_first: string;
  address_line_second: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  // Client Profile Info
  company_name?: string;
  industry?: string;
  website?: string;
  social_links?: string[];
  company_size?: string;
  tax_id?: string;
  business_documents?: string[];
  work_arrangement?: string;
  project_frequency?: string;
  hiring_preferences?: string;
  payment_method?: any;
};

const InfoRow = ({ label, value, field, editMode, editedData, handleInputChange, type = 'text', required = false }: {
  label: string;
  value?: string | number | null;
  field?: keyof ProfileData;
  editMode: boolean;
  editedData?: ProfileData | null;
  handleInputChange?: (field: keyof ProfileData, value: any) => void;
  type?: string;
  required?: boolean;
}) => {
  if (!editMode) {
    if (value === undefined || value === null || value === "") return null;
    return (
      <div className="row mb-3">
        <div className="col-md-4">
          <strong>{label}:</strong>
        </div>
        <div className="col-md-8">{value}</div>
      </div>
    );
  }

  if (!field || !editedData || !handleInputChange) return null;

  return (
    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">
          <strong>{label}:</strong>
          {required && <span className="text-danger">*</span>}
        </label>
      </div>
      <div className="col-md-8">
        <input
          type={type}
          className="form-control"
          value={(editedData[field] as string | number) || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          required={required}
        />
      </div>
    </div>
  );
};

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

  const displayData = useMemo(() => {
    if (!profileData) return null;

    const allChanges = Object.values(tempChanges).reduce((acc, sectionChanges) => ({
      ...acc,
      ...sectionChanges
    }), {});

    return {
      ...profileData,
      ...allChanges
    };
  }, [profileData, tempChanges]);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>("");

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];
  const industries = ["film_production", "ad_agency", "marketing", "events", "real_estate", "education", "e_commerce", "technology", "entertainment", "corporate", "other"];
  const workArrangementOptions = [
    { value: "remote", label: "Remote" },
    { value: "on_site", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ];
  const projectFrequencyOptions = [
    { value: "one_time", label: "One-time Project" },
    { value: "occasional", label: "Occasional Projects" },
    { value: "ongoing", label: "Ongoing Projects" },
  ];
  const hiringPreferencesOptions = [
    { value: "individuals", label: "Individual Freelancers" },
    { value: "agencies", label: "Agencies Only" },
    { value: "both", label: "Both Individuals and Agencies" },
  ];

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
      // Use the new CLIENT profile endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/profile`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${authCookies.getToken()}`, 
          'Content-Type': 'application/json' 
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch profile');
      
      const response = await res.json();
      
      if (response.success && response.data) {
        const { user, profile, userType: type } = response.data;
        setUserType(type);

        const countryObj = Country.getAllCountries().find(c => c.name === user.country || c.isoCode === user.country);
        const stateObj = countryObj ? State.getStatesOfCountry(countryObj.isoCode).find(s => s.name === user.state || s.isoCode === user.state) : null;

        const data: ProfileData = {
          // Basic Info
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          phone_verified: user.phone_verified || false,
          email_verified: user.email_verified || false,
          bio: user.bio || "",

          // Company Info
          company_name: profile?.company_name,
          website: profile?.website,
          industry: profile?.industry,
          company_size: profile?.company_size,
          social_links: safeArray<string>(profile?.social_links),
          
          // Work Preferences
          work_arrangement: profile?.work_arrangement,
          project_frequency: profile?.project_frequency,
          hiring_preferences: profile?.hiring_preferences,
          payment_method: profile?.payment_method,

          // Address
          address_line_first: user.address_line_first || "",
          address_line_second: user.address_line_second || "",
          city: user.city || "",
          state: stateObj?.isoCode || "",
          country: countryObj?.isoCode || "",
          pincode: user.pincode || "",
          tax_id: profile?.tax_id,
          business_documents: safeArray<string>(profile?.business_documents),
        };
        
        setProfileData(data);
        setEditedData(JSON.parse(JSON.stringify(data)));

        if (countryObj) setSelectedCountryCode(countryObj.isoCode);
        if (stateObj) setSelectedStateCode(stateObj.isoCode);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchUserProfile(); }, [fetchUserProfile]);

  const handleEdit = useCallback((section: string) => {
    setEditedData(JSON.parse(JSON.stringify(profileData)));
    if (profileData?.country) setSelectedCountryCode(profileData.country);
    if (profileData?.state) setSelectedStateCode(profileData.state);
    setEditingSection(section);
  }, [profileData]);

  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setEditedData(profileData);
    setTempChanges(prev => {
      const newTempChanges = { ...prev };
      if (editingSection) {
        delete newTempChanges[editingSection];
      }
      return newTempChanges;
    });
  }, [profileData, editingSection]);

  const handleInputChange = useCallback((field: keyof ProfileData, value: any) => {
    if (field === 'phone_number' || field === 'tax_id') {
      value = value.replace(/\D/g, '');
    }
    if (field === 'phone_number') {
      value = value.slice(0, 10);
    }

    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const addSocialLink = useCallback(() => {
    setEditedData(prev => {
      if (!prev) return null;
      const currentLinks = prev.social_links || [];
      return { ...prev, social_links: [...currentLinks, ""] };
    });
  }, []);

  const updateSocialLink = useCallback((index: number, value: string) => {
    setEditedData(prev => {
      if (!prev || !prev.social_links) return prev;
      const newLinks = [...prev.social_links];
      newLinks[index] = value;
      return { ...prev, social_links: newLinks };
    });
  }, []);

  const removeSocialLink = useCallback((index: number) => {
    setEditedData(prev => {
      if (!prev || !prev.social_links) return prev;
      const newLinks = prev.social_links.filter((_, i) => i !== index);
      return { ...prev, social_links: newLinks };
    });
  }, []);

  const getChangedFields = (original: ProfileData, edited: ProfileData): Partial<ProfileData> => {
    const changes = {} as Partial<ProfileData>;
    (Object.keys(edited) as Array<keyof ProfileData>).forEach(key => {
      const originalValue = original[key];
      const editedValue = edited[key];

      if (!_.isEqual(originalValue, editedValue)) {
        (changes as any)[key] = editedValue;
      }
    });
    return changes;
  };

  const handleSave = (section: string) => {
    if (!editedData || !profileData) return;
    setSaving(true);

    const changes = getChangedFields(profileData, editedData);

    if (Object.keys(changes).length === 0) {
      toast.success("No changes to save as draft.");
      setEditingSection(null);
      setSaving(false);
      return;
    }

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
      const allChanges = Object.values(tempChanges).reduce((acc, sectionChanges) => ({
        ...acc,
        ...sectionChanges
      }), {});
      
      if (Object.keys(allChanges).length === 0) {
        toast.error("No changes to save.");
        setSaving(false);
        return;
      }

      // Create unified payload for the clients/profile endpoint
      const unifiedPayload: { [key: string]: any } = {};

      // Populate unified payload with all changes
      for (const key in allChanges) {
        const typedKey = key as keyof ProfileData;
        unifiedPayload[typedKey] = (allChanges as any)[typedKey];
      }

      // Handle special field mappings
      if (unifiedPayload.country) {
        unifiedPayload.country = Country.getCountryByCode(unifiedPayload.country)?.name || '';
      }
      if (unifiedPayload.state && profileData.country) {
        unifiedPayload.state = State.getStateByCodeAndCountry(unifiedPayload.state, profileData.country)?.name || '';
      }

      // Make unified API call for clients
      if (userType === 'CLIENT' && Object.keys(unifiedPayload).length > 0) {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients/profile`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${authCookies.getToken()}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(unifiedPayload)
        });
        if (!profileRes.ok) {
          const errorBody = await profileRes.json();
          throw new Error(errorBody.message || 'Failed to update client profile data');
        }
      }

      toast.success("All changes saved successfully!");
      setTempChanges({});
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
          <DashboardHeader />
          
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
                <InfoRow label="First Name" value={displayData.first_name} field="first_name" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} required={true} />
                <InfoRow label="Last Name" value={displayData.last_name} field="last_name" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} required={true} />
                <InfoRow label="Email" value={displayData.email} field="email" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} type="email" required={true} />
                <InfoRow label="Phone Number" value={displayData.phone_number} field="phone_number" editMode={isEditModeFor("basicInfo")} editedData={editedData} handleInputChange={handleInputChange} type="tel" required={false} />
              </InfoSection>

              <InfoSection title="Company Information" sectionKey="companyInfo" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                <InfoRow label="Company Name" value={displayData.company_name} field="company_name" editMode={isEditModeFor("companyInfo")} editedData={editedData} handleInputChange={handleInputChange} required={true} />
                {(profileData.industry || isEditModeFor("companyInfo")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Industry:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("companyInfo") ? (
                        <select className="form-select" value={editedData.industry || ''} onChange={(e) => handleInputChange('industry', e.target.value)} required={true}>
                          <option value="">Select Industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                          ))}
                        </select>
                      ) : (displayData.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                    </div>
                  </div>
                )}
                <InfoRow label="Website" value={displayData.website} field="website" editMode={isEditModeFor("companyInfo")} editedData={editedData} handleInputChange={handleInputChange} type="url" />

                {(profileData.bio || isEditModeFor("companyInfo")) && (
                    <div className="row mb-3">
                        <div className="col-md-4"><strong>Company Description:</strong></div>
                        <div className="col-md-8">
                        {isEditModeFor("companyInfo") ? (
                            <textarea className="form-control" rows={4} value={editedData.bio || ''}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            />
                        ) : (<p style={{ whiteSpace: 'pre-wrap' }}>{displayData.bio}</p>)}
                        </div>
                    </div>
                )}

                {(profileData.company_size || isEditModeFor("companyInfo")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Company Size:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("companyInfo") ? (
                        <select className="form-select" value={editedData.company_size || ''} onChange={(e) => handleInputChange('company_size', e.target.value)} required={true}>
                          <option value="">Select Company Size</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      ) : (displayData.company_size)}
                    </div>
                  </div>
                )}

                {(profileData.social_links || isEditModeFor("companyInfo")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Social Links:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("companyInfo") ? (
                        <div>
                          {(editedData.social_links || []).map((link, index) => (
                            <div key={index} className="d-flex mb-2">
                              <input
                                type="url"
                                className="form-control me-2"
                                value={link}
                                onChange={(e) => updateSocialLink(index, e.target.value)}
                                placeholder="https://..."
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeSocialLink(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={addSocialLink}
                          >
                            Add Social Link
                          </button>
                        </div>
                      ) : (
                        <div>
                          {displayData.social_links && displayData.social_links.length > 0 ? (
                            displayData.social_links.map((link, index) => (
                              <div key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                              </div>
                            ))
                          ) : 'No social links provided'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </InfoSection>

              <InfoSection title="Work Preferences" sectionKey="workPreferences" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                {(profileData.work_arrangement || isEditModeFor("workPreferences")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Work Arrangement:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("workPreferences") ? (
                        <select className="form-select" value={editedData.work_arrangement || ''} onChange={(e) => handleInputChange('work_arrangement', e.target.value)} required={true}>
                          <option value="">Select Work Arrangement</option>
                          {workArrangementOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (workArrangementOptions.find(opt => opt.value === displayData.work_arrangement)?.label || 'Not provided')}
                    </div>
                  </div>
                )}
                {(profileData.project_frequency || isEditModeFor("workPreferences")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Project Frequency:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("workPreferences") ? (
                        <select className="form-select" value={editedData.project_frequency || ''} onChange={(e) => handleInputChange('project_frequency', e.target.value)} required={true}>
                          <option value="">Select Project Frequency</option>
                          {projectFrequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (projectFrequencyOptions.find(opt => opt.value === displayData.project_frequency)?.label || 'Not provided')}
                    </div>
                  </div>
                )}
                {(profileData.hiring_preferences || isEditModeFor("workPreferences")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Hiring Preferences:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("workPreferences") ? (
                        <select className="form-select" value={editedData.hiring_preferences || ''} onChange={(e) => handleInputChange('hiring_preferences', e.target.value)} required={true}>
                          <option value="">Select Hiring Preference</option>
                          {hiringPreferencesOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : (hiringPreferencesOptions.find(opt => opt.value === displayData.hiring_preferences)?.label || 'Not provided')}
                    </div>
                  </div>
                )}
              </InfoSection>

              <InfoSection title="Contact & Billing" sectionKey="address" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                <InfoRow label="Address" value={displayData.address_line_first} field="address_line_first" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Country:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select className="form-select" value={editedData.country || ''} onChange={(e) => {
                        handleInputChange('country', e.target.value);
                        setSelectedCountryCode(e.target.value);
                        handleInputChange('state', '');
                        handleInputChange('city', '');
                      }} required={true}>
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                        ))}
                      </select>
                    ) : (Country.getCountryByCode(profileData.country)?.name || 'Not provided')}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4"><strong>State:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select className="form-select" value={editedData.state || ''} onChange={(e) => {
                        handleInputChange('state', e.target.value);
                        setSelectedStateCode(e.target.value);
                        handleInputChange('city', '');
                      }} disabled={!editedData.country} required={true}>
                        <option value="">Select State</option>
                        {states.map(state => (
                          <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                        ))}
                      </select>
                    ) : (State.getStateByCodeAndCountry(profileData.state, profileData.country)?.name || 'Not provided')}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4"><strong>City:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select className="form-select" value={editedData.city || ''} onChange={(e) => handleInputChange('city', e.target.value)} disabled={!editedData.state} required={true}>
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city.name} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    ) : (profileData.city || 'Not provided')}
                  </div>
                </div>
                <InfoRow label="Zip/Pin Code" value={displayData.pincode} field="pincode" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />
                <InfoRow label="Tax ID" value={displayData.tax_id} field="tax_id" editMode={isEditModeFor("address")} editedData={editedData} handleInputChange={handleInputChange} />

                {(profileData.business_documents || isEditModeFor("address")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Business Documents:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("address") ? (
                        <input
                          type="text"
                          className="form-control"
                          value={(editedData.business_documents || []).join(', ')}
                          onChange={(e) => handleInputChange('business_documents', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          placeholder="document1.pdf, document2.pdf"
                        />
                      ) : (
                        displayData.business_documents && displayData.business_documents.length > 0
                          ? displayData.business_documents.join(', ')
                          : 'No documents provided'
                      )}
                    </div>
                  </div>
                )}

                {(profileData.payment_method || isEditModeFor("address")) && (
                  <div className="row mb-3">
                    <div className="col-md-4"><strong>Payment Method:</strong></div>
                    <div className="col-md-8">
                      {isEditModeFor("address") ? (
                        <select className="form-select" value={editedData.payment_method || ''} onChange={(e) => handleInputChange('payment_method', e.target.value)}>
                          <option value="">Select Payment Method</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe</option>
                          <option value="check">Check</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (displayData.payment_method || 'Not specified')}
                    </div>
                  </div>
                )}
              </InfoSection>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardProfileArea;