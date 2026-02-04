"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import DashboardHeader from "./dashboard-header-minus";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import _ from "lodash"; // Using lodash for deep object comparison
import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext";
import { authCookies } from "@/utils/cookies";
import { validatePortfolioLinks } from "@/utils/validation";

type IProps = {
  // No props needed, using context
};

type Service = { title: string; rate: string; currency: string };
type PreviousWork = { title: string; description: string; url: string };

type ProfileData = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  bio: string;
  address: string;
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
  // Additional videographer-specific fields
  username?: string;
  website?: string;
  profile_title?: string;
  base_skills?: string[];
  work_type?: string;
  hours_per_week?: string;
  hire_count?: number;
  total_earnings?: number;
  time_spent?: number;
  projects_applied?: number[];
  projects_completed?: number[];
  // Additional fields from unified API
  email_notifications?: boolean;
  phone_verified?: boolean;
  email_verified?: boolean;
  software_skills?: string[];
  certification?: any;
  education?: any;
  id_type?: string;
  id_document_url?: string;
  kyc_verified?: boolean;
  aadhaar_verification?: boolean;
  payment_method?: any;
  bank_account_info?: any;
};

// Component is defined outside to prevent re-creation on render
const InfoRow = ({
  label,
  value,
  field,
  editMode,
  editedData,
  handleInputChange,
  type = "text",
}: {
  label: string;
  value?: string | number;
  field?: keyof ProfileData;
  editMode: boolean;
  editedData?: ProfileData | null;
  handleInputChange?: (field: keyof ProfileData, value: any) => void;
  type?: string;
}) => {
  if (!editMode) {
    return (
      <div className="row mb-3">
        <div className="col-md-4">
          <strong>{label}:</strong>
        </div>
        <div className="col-md-8">
          {value || (
            <span style={{ color: "#999", fontStyle: "italic" }}>
              Not provided
            </span>
          )}
        </div>
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
          type={
            field === "email"
              ? "email"
              : field === "phone_number"
                ? "tel"
                : field === "website"
                  ? "url"
                  : type
          }
          className="form-control"
          value={(editedData[field] as string | number) || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          pattern={
            field === "phone_number"
              ? "[0-9]{10}"
              : field === "website"
                ? "https?://.+"
                : undefined
          }
          title={
            field === "phone_number"
              ? "Please enter a 10-digit phone number"
              : field === "website"
                ? "Please enter a valid URL (e.g., https://example.com)"
                : undefined
          }
          required={field === "email" || field === "phone_number"}
          disabled={field === "email"}
        />
      </div>
    </div>
  );
};

// ## REFACTOR 1: ENHANCED INFOSECTION COMPONENT ##
// This component now includes its own Edit/Save/Cancel buttons, controlled
// by the parent component. This modularizes the UI and logic.
const InfoSection = ({
  title,
  sectionKey,
  children,
  editingSection,
  onEdit,
  onSave,
  onCancel,
  isSaving,
}: {
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
      <div
        className="d-flex justify-content-between align-items-center flex-wrap mb-4"
        style={{ gap: "1rem" }}
      >
        <h4 className="dash-title-three">{title}</h4>
        <div className="mt-3 mt-sm-0">
          {!editingSection ? (
            <button
              className="dash-btn-two"
              style={{ minWidth: "100px", padding: "8px 16px" }}
              onClick={() => onEdit(sectionKey)}
            >
              Edit
            </button>
          ) : (
            isEditingThisSection && (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success"
                  style={{ minWidth: "100px", padding: "8px 16px" }}
                  onClick={() => onSave(sectionKey)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Draft..." : "Save Draft"}
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ minWidth: "100px", padding: "8px 16px" }}
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            )
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
  const { currentRole } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [tempChanges, setTempChanges] = useState<{
    [section: string]: Partial<ProfileData>;
  }>({});

  // Compute the displayed data by merging profile data with temporary changes
  const displayData = useMemo(() => {
    if (!profileData) return null;

    // Combine all temporary changes
    const allChanges = Object.values(tempChanges).reduce(
      (acc, sectionChanges) => ({
        ...acc,
        ...sectionChanges,
      }),
      {},
    );

    // Return merged data
    return {
      ...profileData,
      ...allChanges,
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
  const [isLoadingSuperpowers, setIsLoadingSuperpowers] =
    useState<boolean>(true);

  // Location states
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Selected location ISO codes for dropdowns
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  // Static options
  const availableLanguages = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Bengali",
    "Gujarati",
    "Punjabi",
    "Malayalam",
    "Urdu",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Arabic",
  ];
  const availabilityOptions = [
    "full-time",
    "part-time",
    "contract",
    "freelance",
    "unavailable",
  ];
  const experienceLevels = ["entry", "intermediate", "expert", "master"];

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/skills`,
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const skillNames: string[] = result.data.map(
            (skill: any) => skill.skill_name,
          );
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
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const categories = data?.data || [];
        const editorCategories = categories
          .filter((cat: any) => cat.category_type === "editor" && cat.is_active)
          .map((cat: any) => cat.category_name);
        setAllSuperpowers(editorCategories);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setIsLoadingSuperpowers(false));
  }, []);

  // Initialize countries and manage location dropdown dependencies
  useEffect(() => setCountries(Country.getAllCountries()), []);
  useEffect(() => {
    if (selectedCountryCode)
      setStates(State.getStatesOfCountry(selectedCountryCode));
    else setStates([]);
    setSelectedStateCode("");
    setCities([]);
  }, [selectedCountryCode]);
  useEffect(() => {
    if (selectedCountryCode && selectedStateCode)
      setCities(City.getCitiesOfState(selectedCountryCode, selectedStateCode));
    else setCities([]);
  }, [selectedCountryCode, selectedStateCode]);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Determine the API endpoint based on user role
      let endpoint = "";
      if (currentRole === "Video Editor") {
        endpoint = "videoeditors/profile";
      } else if (currentRole === "Videographer") {
        endpoint = "videographers/profile";
      } else {
        // Default to videoeditors for backward compatibility
        endpoint = "videoeditors/profile";
      }

      // Use the unified role-specific endpoint that returns both user and profile data
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${endpoint}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authCookies.getToken()}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!profileRes.ok) {
        const errorData = await profileRes.json();
        throw new Error(errorData.message || "Failed to fetch profile data");
      }

      const profileResponse = await profileRes.json();

      if (!profileResponse.success) {
        throw new Error(
          profileResponse.message || "Failed to fetch profile data",
        );
      }

      const { user, profile, userType: type } = profileResponse.data;
      setUserType(type);

      // Get country and state objects for location dropdowns
      // Handle both name-based (unified API) and code-based country/state values
      let countryObj;
      if (user.country) {
        // Try to find by name first (unified API returns names)
        const allCountries = Country.getAllCountries();
        countryObj = allCountries.find(
          (c) => c.name.toLowerCase() === user.country.toLowerCase(),
        );
        // If not found by name, try by code
        if (!countryObj) {
          countryObj = Country.getCountryByCode(user.country);
        }
      }

      let stateObj;
      if (countryObj && user.state) {
        // Try to find state by name first
        const statesOfCountry = State.getStatesOfCountry(countryObj.isoCode);
        stateObj = statesOfCountry.find(
          (s) => s.name.toLowerCase() === user.state.toLowerCase(),
        );
        // If not found by name, try by code
        if (!stateObj) {
          stateObj = State.getStateByCodeAndCountry(
            user.state,
            countryObj.isoCode,
          );
        }
      }

      const data: ProfileData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || user.phone || "", // Unified API uses 'phone_number', fallback to 'phone'
        bio: user.bio || profile?.short_description || "",
        address: user.address || "",
        city: user.city || "",
        state: stateObj?.isoCode || "",
        country: countryObj?.isoCode || "",
        pincode: user.pincode || user.zip_code || "", // Unified API uses 'pincode', fallback to 'zip_code'
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
        // Additional videographer-specific fields
        username: user.username,
        website: user.website,
        profile_title: profile?.profile_title,
        skill_tags: safeArray<string>(profile?.skill_tags),
        base_skills: safeArray<string>(profile?.base_skills),
        work_type: profile?.work_type,
        hours_per_week: profile?.hours_per_week,
        hire_count: profile?.hire_count,
        total_earnings: profile?.total_earnings,
        time_spent: profile?.time_spent,
        projects_applied: safeArray<number>(profile?.projects_applied),
        projects_completed: safeArray<number>(profile?.projects_completed),
        // Additional fields from unified API
        email_notifications: user.email_notifications,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        software_skills: safeArray<string>(profile?.software_skills),
        certification: profile?.certification,
        education: profile?.education,
        id_type: profile?.id_type,
        id_document_url: profile?.id_document_url,
        kyc_verified: profile?.kyc_verified,
        aadhaar_verification: profile?.aadhaar_verification,
        payment_method: profile?.payment_method,
        bank_account_info: profile?.bank_account_info,
        // These are not directly used but part of the type
        services: [],
        previous_works: [],
      };

      setProfileData(data);
      setEditedData(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation

      if (countryObj) setSelectedCountryCode(countryObj.isoCode);
      if (stateObj) setSelectedStateCode(stateObj.isoCode);
    } catch (err: any) {
      console.error("Failed to fetch user profile", err);
      toast.error(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    void fetchUserProfile();
  }, [fetchUserProfile]);

  const handleEdit = useCallback(
    (section: string) => {
      setEditedData(JSON.parse(JSON.stringify(profileData))); // Reset changes on new edit
      if (profileData?.country) setSelectedCountryCode(profileData.country);
      if (profileData?.state) setSelectedStateCode(profileData.state);
      setEditingSection(section);
    },
    [profileData],
  );

  const handleCancel = useCallback(() => {
    setEditingSection(null);
    setEditedData(profileData);
  }, [profileData]);

  const handleInputChange = useCallback(
    (field: keyof ProfileData, value: any) => {
      // Only strip non-numeric characters for phone number during typing
      if (field === "phone_number") {
        value = value.replace(/\D/g, "").slice(0, 10); // Limit to 10 digits
      }

      // Only allow numeric input for pincode and limit to 6 digits
      if (field === "pincode") {
        value = value.replace(/\D/g, "").slice(0, 6); // Limit to 6 digits
      }

      setEditedData((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    [],
  );

  const handleArrayChange = useCallback(
    (field: keyof ProfileData, value: string[]) => {
      setEditedData((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    [],
  );

  const addPortfolioLink = useCallback(() => {
    setEditedData((prev) => {
      if (!prev) return null;
      const currentLinks = prev.portfolio_links || [];
      return { ...prev, portfolio_links: [...currentLinks, ""] };
    });
  }, []);

  const updatePortfolioLink = useCallback((index: number, value: string) => {
    setEditedData((prev) => {
      if (!prev || !prev.portfolio_links) return prev;
      const newLinks = [...prev.portfolio_links];
      newLinks[index] = value;
      return { ...prev, portfolio_links: newLinks };
    });
  }, []);

  const removePortfolioLink = useCallback((index: number) => {
    setEditedData((prev) => {
      if (!prev || !prev.portfolio_links) return prev;
      const newLinks = prev.portfolio_links.filter((_, i) => i !== index);
      return { ...prev, portfolio_links: newLinks };
    });
  }, []);

  // ## REFACTOR 3: UTILITY TO FIND CHANGED FIELDS ##
  // This function compares the original and edited data objects and returns
  // an object containing only the key-value pairs that have been modified.
  const getChangedFields = (
    original: ProfileData,
    edited: ProfileData,
  ): Partial<ProfileData> => {
    const changes: Partial<ProfileData> = {};
    (Object.keys(edited) as Array<keyof ProfileData>).forEach((key) => {
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
    if (
      editedData.email !== profileData.email &&
      !emailRegex.test(editedData.email)
    ) {
      toast.error("Please enter a valid email address");
      setSaving(false);
      return;
    }

    if (editedData.phone_number !== profileData.phone_number) {
      const numericPhone = editedData.phone_number.replace(/\D/g, "");
      if (numericPhone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits");
        setSaving(false);
        return;
      }
    }

    // Validate website URL if it's been changed and is not empty
    if (editedData.website !== profileData.website && editedData.website) {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;
      if (!urlRegex.test(editedData.website)) {
        toast.error(
          "Please enter a valid website URL (e.g., https://example.com)",
        );
        setSaving(false);
        return;
      }
    }

    // Validate portfolio links if they've been changed
    if (editedData.portfolio_links && editedData.portfolio_links.length > 0) {
      const nonEmptyLinks = editedData.portfolio_links.filter(
        (link: string) => link && link.trim().length > 0,
      );

      if (nonEmptyLinks.length > 0) {
        const validation = validatePortfolioLinks(
          editedData.portfolio_links,
          true,
        );

        if (!validation.hasValidYouTubeLink) {
          toast.error(
            "At least one valid YouTube link is required in your portfolio.",
          );
          setSaving(false);
          return;
        }

        // Check for any invalid links
        const firstErrorIndex = validation.errors.findIndex(
          (e) => e !== undefined,
        );
        if (firstErrorIndex !== -1 && validation.errors[firstErrorIndex]) {
          toast.error(validation.errors[firstErrorIndex] as string);
          setSaving(false);
          return;
        }
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
    setTempChanges((prev) => ({
      ...prev,
      [section]: changes,
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
      const allChanges = Object.values(tempChanges).reduce(
        (acc, sectionChanges) => ({
          ...acc,
          ...sectionChanges,
        }),
        {},
      );

      // Combine all changes into a single unified payload for video editors
      const unifiedPayload: { [key: string]: any } = {};

      // Populate unified payload with all changes
      for (const key in allChanges) {
        const typedKey = key as keyof ProfileData;
        unifiedPayload[typedKey] = allChanges[typedKey];
      }

      // Handle special field mappings
      // Phone number field is already phone_number, no mapping needed
      // The API expects phone_number field

      if (unifiedPayload.country) {
        unifiedPayload.country =
          Country.getCountryByCode(unifiedPayload.country)?.name || "";
      }
      if (unifiedPayload.state) {
        unifiedPayload.state =
          State.getStateByCodeAndCountry(
            unifiedPayload.state,
            profileData.country,
          )?.name || "";
      }

      // Make unified API call based on user type
      let endpoint = "";
      if (userType === "VIDEO_EDITOR") {
        endpoint = "videoeditors/profile";
      } else if (userType === "VIDEOGRAPHER") {
        endpoint = "videographers/profile";
      }

      if (endpoint && Object.keys(unifiedPayload).length > 0) {
        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${endpoint}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${authCookies.getToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(unifiedPayload),
          },
        );
        if (!profileRes.ok) {
          const errorBody = await profileRes.json();
          throw new Error(errorBody.message || "Failed to update profile data");
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
            <>
              <button
                className="dash-btn-two btn-lg"
                onClick={saveAllChanges}
                disabled={saving}
                style={{
                  position: "fixed",
                  bottom: "1rem",
                  right: "1rem",
                  zIndex: 1000,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "90px",
                  animation: "slideUp 0.3s ease-out",
                  minWidth: "200px",
                  padding: "12px 24px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                {saving ? "Saving All Changes..." : "Save All Changes"}
              </button>

              {/* Custom CSS for mobile responsiveness */}
              <style jsx>{`
                .dash-btn-two {
                  border-radius: 90px !important;
                }
                @media (max-width: 768px) {
                  .dash-btn-two {
                    min-width: 160px !important;
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                    bottom: 1rem !important;
                    right: 1rem !important;
                    left: 1rem !important;
                    width: calc(100% - 2rem) !important;
                  }
                }

                @media (max-width: 480px) {
                  .dash-btn-two {
                    min-width: 140px !important;
                    padding: 8px 12px !important;
                    font-size: 0.8rem !important;
                    bottom: 0.5rem !important;
                    right: 0.5rem !important;
                    left: 0.5rem !important;
                    width: calc(100% - 1rem) !important;
                  }
                }

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
              `}</style>
            </>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && profileData && editedData && displayData && (
            <>
              <InfoSection
                title="Basic Information"
                sectionKey="basicInfo"
                editingSection={editingSection}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={saving}
              >
                {/* {!isEditModeFor("basicInfo") && userType && (
                <div className="mb-4">
                  <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
                    {userType.replace(/_/g, ' ')}
                  </span>
                </div>
              )} */}

                <InfoRow
                  label="First Name"
                  value={displayData.first_name}
                  field="first_name"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />
                <InfoRow
                  label="Last Name"
                  value={displayData.last_name}
                  field="last_name"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />
                <InfoRow
                  label="Email"
                  value={displayData.email}
                  field="email"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />
                <InfoRow
                  label="Phone Number"
                  value={displayData.phone_number}
                  field="phone_number"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />

                <InfoRow
                  label="Website"
                  value={displayData.website}
                  field="website"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />

                <InfoRow
                  label="Profile Title"
                  value={displayData.profile_title}
                  field="profile_title"
                  editMode={isEditModeFor("basicInfo")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Availability:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <select
                        className="form-select"
                        value={editedData.availability || ""}
                        onChange={(e) =>
                          handleInputChange("availability", e.target.value)
                        }
                      >
                        <option value="">Select availability</option>
                        {availabilityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() +
                              option.slice(1).replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    ) : (
                      displayData.availability || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Experience Level:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <select
                        className="form-select"
                        value={editedData.experience_level || ""}
                        onChange={(e) =>
                          handleInputChange("experience_level", e.target.value)
                        }
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      displayData.experience_level || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Bio:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("basicInfo") ? (
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editedData.bio || ""}
                        onChange={(e) => {
                          handleInputChange("bio", e.target.value);
                          handleInputChange(
                            "short_description",
                            e.target.value,
                          );
                        }}
                      />
                    ) : displayData.bio ? (
                      <p style={{ whiteSpace: "pre-wrap" }}>
                        {displayData.bio}
                      </p>
                    ) : (
                      <span style={{ color: "#999", fontStyle: "italic" }}>
                        Not provided
                      </span>
                    )}
                  </div>
                </div>
              </InfoSection>

              <InfoSection
                title="Skills & Expertise"
                sectionKey="skills"
                editingSection={editingSection}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={saving}
              >
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Skills:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("skills") ? (
                      <div>
                        <select
                          className="form-select"
                          disabled={isLoadingSkills}
                          onChange={(e) => {
                            const skill = e.target.value;
                            if (skill && !editedData.skills.includes(skill)) {
                              handleArrayChange("skills", [
                                ...editedData.skills,
                                skill,
                              ]);
                            }
                          }}
                        >
                          <option value="">Add a skill...</option>
                          {allSkills.map((skill) => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {editedData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="badge bg-secondary d-flex align-items-center"
                              style={{ gap: 6, padding: "0.5em 0.75em" }}
                            >
                              {skill}
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-white p-0 m-0 fw-bold"
                                style={{
                                  fontSize: "16px",
                                  lineHeight: 1,
                                  textDecoration: "none",
                                }}
                                onClick={() =>
                                  handleArrayChange(
                                    "skills",
                                    editedData.skills.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  )
                                }
                                aria-label={`Remove ${skill}`}
                                title={`Remove ${skill}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {displayData.skills && displayData.skills.length > 0 ? (
                          displayData.skills.map(
                            (skill: string, idx: number) => (
                              <span key={idx} className="badge bg-secondary">
                                {skill}
                              </span>
                            ),
                          )
                        ) : (
                          <span style={{ color: "#999", fontStyle: "italic" }}>
                            Not provided
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Superpowers:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("skills") ? (
                      <div>
                        <select
                          className="form-select"
                          disabled={isLoadingSuperpowers}
                          onChange={(e) => {
                            const superpower = e.target.value;
                            if (
                              superpower &&
                              !(editedData.superpowers || []).includes(
                                superpower,
                              )
                            ) {
                              handleArrayChange("superpowers", [
                                ...(editedData.superpowers || []),
                                superpower,
                              ]);
                            }
                          }}
                        >
                          <option value="">Add a superpower...</option>
                          {allSuperpowers.map((power) => (
                            <option key={power} value={power}>
                              {power}
                            </option>
                          ))}
                        </select>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {(editedData.superpowers || []).map((power, idx) => (
                            <span
                              key={idx}
                              className="badge bg-success d-flex align-items-center"
                              style={{ gap: 6, padding: "0.5em 0.75em" }}
                            >
                              {power}
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-white p-0 m-0 fw-bold"
                                style={{
                                  fontSize: "16px",
                                  lineHeight: 1,
                                  textDecoration: "none",
                                }}
                                onClick={() =>
                                  handleArrayChange(
                                    "superpowers",
                                    (editedData.superpowers || []).filter(
                                      (_, i) => i !== idx,
                                    ),
                                  )
                                }
                                aria-label={`Remove ${power}`}
                                title={`Remove ${power}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {displayData.superpowers &&
                        displayData.superpowers.length > 0 ? (
                          displayData.superpowers.map(
                            (power: string, idx: number) => (
                              <span key={idx} className="badge bg-success">
                                {power}
                              </span>
                            ),
                          )
                        ) : (
                          <span style={{ color: "#999", fontStyle: "italic" }}>
                            Not provided
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Languages:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("skills") ? (
                      <div>
                        <select
                          className="form-select"
                          onChange={(e) => {
                            const lang = e.target.value;
                            if (
                              lang &&
                              !(editedData.languages || []).includes(lang)
                            ) {
                              handleArrayChange("languages", [
                                ...(editedData.languages || []),
                                lang,
                              ]);
                            }
                          }}
                        >
                          <option value="">Add a language...</option>
                          {availableLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {(editedData.languages || []).map((lang, idx) => (
                            <span
                              key={idx}
                              className="badge bg-info text-dark d-flex align-items-center"
                              style={{ gap: 6, padding: "0.5em 0.75em" }}
                            >
                              {lang}
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-dark p-0 m-0 fw-bold"
                                style={{
                                  fontSize: "16px",
                                  lineHeight: 1,
                                  textDecoration: "none",
                                }}
                                onClick={() =>
                                  handleArrayChange(
                                    "languages",
                                    (editedData.languages || []).filter(
                                      (_, i) => i !== idx,
                                    ),
                                  )
                                }
                                aria-label={`Remove ${lang}`}
                                title={`Remove ${lang}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : displayData.languages &&
                      displayData.languages.length > 0 ? (
                      (displayData.languages || []).join(", ")
                    ) : (
                      <span style={{ color: "#999", fontStyle: "italic" }}>
                        Not provided
                      </span>
                    )}
                  </div>
                </div>
              </InfoSection>

              <InfoSection
                title="Services & Rates"
                sectionKey="rates"
                editingSection={editingSection}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={saving}
              >
                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Hourly Rate:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("rates") ? (
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          value={editedData.rate_amount || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "rate_amount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                        />
                        <span className="input-group-text">/hr</span>
                      </div>
                    ) : displayData.rate_amount ? (
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#244034",
                        }}
                      >
                        ₹ {displayData.rate_amount}/hr
                      </span>
                    ) : (
                      <span style={{ color: "#999", fontStyle: "italic" }}>
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Work Type:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("rates") ? (
                      <select
                        className="form-select"
                        value={editedData.work_type || ""}
                        onChange={(e) =>
                          handleInputChange("work_type", e.target.value)
                        }
                      >
                        <option value="">Select work type</option>
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    ) : (
                      displayData.work_type || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Hours per Week:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("rates") ? (
                      <select
                        className="form-select"
                        value={editedData.hours_per_week || ""}
                        onChange={(e) =>
                          handleInputChange("hours_per_week", e.target.value)
                        }
                      >
                        <option value="">Select hours per week</option>
                        <option value="10_20">10-20 hours</option>
                        <option value="20_30">20-30 hours</option>
                        <option value="30_40">30-40 hours</option>
                        <option value="full_time">Full time</option>
                      </select>
                    ) : (
                      displayData.hours_per_week || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>
              </InfoSection>

              <InfoSection
                title="Portfolio"
                sectionKey="portfolio"
                editingSection={editingSection}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={saving}
              >
                {isEditModeFor("portfolio") ? (
                  <div>
                    {(editedData.portfolio_links || []).map((link, index) => (
                      <div key={index} className="input-group mb-3">
                        <input
                          type="url"
                          className="form-control"
                          value={link}
                          placeholder="https://youtube.com/watch?v=..."
                          onChange={(e) =>
                            updatePortfolioLink(index, e.target.value)
                          }
                        />
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => removePortfolioLink(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={addPortfolioLink}
                    >
                      + Add Portfolio Link
                    </button>
                  </div>
                ) : displayData.portfolio_links &&
                  displayData.portfolio_links.length > 0 ? (
                  (displayData.portfolio_links || []).map(
                    (link: string, index: number) => (
                      <div key={index} className="mb-2">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Link {index + 1}
                        </a>
                      </div>
                    ),
                  )
                ) : (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    Not provided
                  </span>
                )}
              </InfoSection>

              {((profileData.hire_count !== undefined &&
                profileData.hire_count > 0) ||
                (profileData.total_earnings !== undefined &&
                  profileData.total_earnings > 0) ||
                (profileData.time_spent !== undefined &&
                  profileData.time_spent > 0) ||
                (profileData.projects_completed &&
                  profileData.projects_completed.length > 0) ||
                (profileData.projects_applied &&
                  profileData.projects_applied.length > 0)) && (
                <InfoSection
                  title="Statistics"
                  sectionKey="statistics"
                  editingSection={editingSection}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isSaving={saving}
                >
                  <div className="row">
                    {profileData.hire_count !== undefined &&
                      profileData.hire_count > 0 && (
                        <div className="col-md-6 mb-3">
                          <div className="text-center p-3 bg-light rounded">
                            <h3 className="text-primary mb-1">
                              {displayData.hire_count}
                            </h3>
                            <p className="mb-0 text-muted">Total Hires</p>
                          </div>
                        </div>
                      )}

                    {profileData.total_earnings !== undefined &&
                      profileData.total_earnings > 0 && (
                        <div className="col-md-6 mb-3">
                          <div className="text-center p-3 bg-success rounded text-white">
                            <h3 className="mb-1">
                              ₹{displayData.total_earnings?.toLocaleString()}
                            </h3>
                            <p className="mb-0">Total Earnings</p>
                          </div>
                        </div>
                      )}

                    {profileData.time_spent !== undefined &&
                      profileData.time_spent > 0 && (
                        <div className="col-md-6 mb-3">
                          <div className="text-center p-3 bg-info rounded text-white">
                            <h3 className="mb-1">
                              {Math.round((displayData.time_spent || 0) / 60)}h
                            </h3>
                            <p className="mb-0">Time Spent</p>
                          </div>
                        </div>
                      )}

                    {profileData.projects_completed &&
                      profileData.projects_completed.length > 0 && (
                        <div className="col-md-6 mb-3">
                          <div className="text-center p-3 bg-warning rounded">
                            <h3 className="text-dark mb-1">
                              {displayData.projects_completed?.length}
                            </h3>
                            <p className="mb-0 text-dark">Projects Completed</p>
                          </div>
                        </div>
                      )}

                    {profileData.projects_applied &&
                      profileData.projects_applied.length > 0 && (
                        <div className="col-md-6 mb-3">
                          <div className="text-center p-3 bg-secondary rounded text-white">
                            <h3 className="mb-1">
                              {displayData.projects_applied?.length}
                            </h3>
                            <p className="mb-0">Projects Applied</p>
                          </div>
                        </div>
                      )}
                  </div>
                </InfoSection>
              )}

              <InfoSection
                title="Address & Location"
                sectionKey="address"
                editingSection={editingSection}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={saving}
              >
                <InfoRow
                  label="Address"
                  value={profileData.address}
                  field="address"
                  editMode={isEditModeFor("address")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>Country:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select
                        className="form-select"
                        value={editedData.country || ""}
                        onChange={(e) => {
                          handleInputChange("country", e.target.value);
                          setSelectedCountryCode(e.target.value);
                          handleInputChange("state", "");
                          handleInputChange("city", "");
                        }}
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      Country.getCountryByCode(displayData.country)?.name || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>State:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select
                        className="form-select"
                        value={editedData.state || ""}
                        onChange={(e) => {
                          handleInputChange("state", e.target.value);
                          setSelectedStateCode(e.target.value);
                          handleInputChange("city", "");
                        }}
                        disabled={!editedData.country}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      State.getStateByCodeAndCountry(
                        displayData.state,
                        displayData.country,
                      )?.name || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <strong>City:</strong>
                  </div>
                  <div className="col-md-8">
                    {isEditModeFor("address") ? (
                      <select
                        className="form-select"
                        value={editedData.city || ""}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        disabled={!editedData.state}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      displayData.city || (
                        <span style={{ color: "#999", fontStyle: "italic" }}>
                          Not provided
                        </span>
                      )
                    )}
                  </div>
                </div>

                <InfoRow
                  label="Zip/Pin Code"
                  value={displayData.pincode}
                  field="pincode"
                  editMode={isEditModeFor("address")}
                  editedData={editedData}
                  handleInputChange={handleInputChange}
                />
              </InfoSection>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardProfileArea;
