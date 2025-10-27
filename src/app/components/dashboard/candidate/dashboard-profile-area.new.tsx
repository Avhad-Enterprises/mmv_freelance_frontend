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
    return { ...profileData, ...Object.values(tempChanges).reduce((acc, changes) => ({ ...acc, ...changes }), {}) };
  }, [profileData, tempChanges]);

  // State for editing
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData | null>(null);

  // Helper function to check if a section is in edit mode
  const isEditModeFor = (section: string) => editingSection === section;

  // Handle edit button click
  const handleEdit = useCallback((section: string) => {
    setEditingSection(section);
    setEditedData(displayData ? { ...displayData } : null);
  }, [displayData]);

  // Handle save button click
  const handleSave = useCallback(async (section: string) => {
    if (!editedData) return;

    setSaving(true);
    try {
      // Here you would typically make an API call to save the data
      // For now, we'll just update the local state
      setTempChanges(prev => ({
        ...prev,
        [section]: editedData
      }));
      setEditingSection(null);
      setEditedData(null);
      toast.success('Changes saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }, [editedData]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setEditedData(null);
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof ProfileData, value: any) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  // Initialize profile data
  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProfileData: ProfileData = {
      full_name: "John Doe",
      email: "john.doe@example.com",
      phone_number: "1234567890",
      bio: "Experienced freelancer",
      address_line_first: "123 Main St",
      address_line_second: "",
      city: "New York",
      state: "NY",
      country: "US",
      pincode: "10001",
      skills: ["React", "TypeScript"],
      services: [],
      previous_works: [],
      rate_amount: 50,
      currency: "USD"
    };
    setProfileData(mockProfileData);
  }, []);

  return (
    <>
      <style>{floatingButtonStyle}</style>
      <DashboardHeader />

      <div className="row">
        <div className="col-lg-12">
          {/* Services & Rates Section */}
          {(profileData?.rate_amount || isEditModeFor("rates")) && (
            <InfoSection title="Services & Rates" sectionKey="rates" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
              <div className="row mb-3">
                <div className="col-md-4"><strong>Hourly Rate:</strong></div>
                <div className="col-md-8">
                  {isEditModeFor("rates") ? (
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={editedData?.rate_amount || ''}
                        onChange={(e) => handleInputChange('rate_amount', parseFloat(e.target.value) || 0)}
                      />
                      <span className="input-group-text">/hr</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#244034' }}>
                      ₹ {displayData?.rate_amount}/hr
                    </span>
                  )}
                </div>
              </div>
            </InfoSection>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardProfileArea;