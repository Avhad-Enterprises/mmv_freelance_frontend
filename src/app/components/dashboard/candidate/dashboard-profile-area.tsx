"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import avatar from "@/assets/dashboard/images/avatar_02.jpg";
import DashboardHeader from "./dashboard-header";
import { makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import CityStateCountry from "../../common/country-state-city";
import toast from "react-hot-toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type Certification = { name: string; issued_by: string; year: string };
type Education = { degree: string; institution: string; year_of_completion: string };
type Experience = { company: string; role: string; duration: string };
type Service = { title: string; rate: string; currency: string };
type PreviousWork = { title: string; description: string; url: string };

type FormData = {
  first_name: string;
  last_name: string;
  bio: string;
  address_line_first: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  skill: string[];
  certification: Certification[];
  education: Education[];
  experience: Experience[];
  services: Service[];
  previous_works: PreviousWork[];
};

const emptyForm: FormData = {
  first_name: "",
  last_name: "",
  bio: "",
  address_line_first: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  skill: [],
  certification: [],
  education: [],
  experience: [],
  services: [],
  previous_works: [],
};

const DashboardProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const decodedToken = useDecodedToken();
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Utility: safely parse arrays that might come as JSON strings or arrays
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

  useEffect(() => {
    if (decodedToken?.user_id) {
      void fetchUserData(decodedToken.user_id);
    }
  }, [decodedToken?.user_id]);

  const fetchUserData = async (id: number) => {
    try {
      setLoading(true);
      const res = await makePostRequest("users/get_user_by_id", { user_id: id });
      const data = res?.data?.data || {};

      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        bio: data.bio || "",
        address_line_first: data.address_line_first || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pincode: data.pincode || "",
        skill: safeArray<string>(data.skill),
        certification: safeArray<Certification>(data.certification),
        education: safeArray<Education>(data.education),
        experience: safeArray<Experience>(data.experience),
        services: safeArray<Service>(data.services),
        previous_works: safeArray<PreviousWork>(data.previous_works),
      });
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: keyof FormData,
    index: number,
    key: string,
    value: string
  ) => {
    const list = (formData[field] as any[]).slice();
    list[index] = { ...list[index], [key]: value };
    handleChange(field as any, list as any);
  };

  const handleAddMore = (field: keyof FormData, emptyItem: Record<string, string>) => {
    handleChange(field as any, ([...(formData[field] as any[]), emptyItem] as any) as any);
  };

  const handleDelete = (field: keyof FormData, index: number) => {
    const list = (formData[field] as any[]).slice();
    list.splice(index, 1);
    handleChange(field as any, list as any);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        user_id: decodedToken?.user_id,
        // stringify list fields as backend may expect strings
        skill: JSON.stringify(formData.skill),
        certification: JSON.stringify(formData.certification),
        education: JSON.stringify(formData.education),
        experience: JSON.stringify(formData.experience),
        services: JSON.stringify(formData.services),
        previous_works: JSON.stringify(formData.previous_works),
      };

      await makePostRequest("users/update_user_by_id", payload);
      toast.success("Profile updated successfully", {
        duration: 3000,
        position: "top-center",
      });
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setSaving(false);
    }
  };

  const [editingIndex, setEditingIndex] = useState<{ [key: string]: number | null }>({});
  const [tempItem, setTempItem] = useState<{ [key: string]: any }>({});

  const renderVerticalInputGroup = (
    label: string,
    field: keyof FormData,
    keys: string[],
    placeholders: string[]
  ) => {
    const isEditing = (index: number) => editingIndex[field] === index;
    const isAddingNew = editingIndex[field] === -1;

    const handleEdit = (index: number) => {
      setEditingIndex({ ...editingIndex, [field]: index });
      setTempItem({ ...tempItem, [field]: { ...(formData[field] as any[])[index] } });
    };

    const handleTempSave = () => {
      const index = editingIndex[field];
      if (index === -1) {
        // Adding new item
        handleChange(field as any, [
          ...(formData[field] as any[]),
          tempItem[field]
        ] as any);
        toast.success(`New ${label} entry added`);
      } else if (index !== null) {
        // Editing existing item
        const newList = [...(formData[field] as any[])];
        newList[index] = tempItem[field];
        handleChange(field as any, newList as any);
        toast.success(`${label} entry updated`);
      }
      setEditingIndex({ ...editingIndex, [field]: null });
      setTempItem({ ...tempItem, [field]: {} });
    };

    const handleTempChange = (key: string, value: string) => {
      setTempItem({
        ...tempItem,
        [field]: { ...(tempItem[field] || {}), [key]: value }
      });
    };

    return (
      <div className="bg-white card-box border-20 mt-30">
        <h4 className="dash-title-three">{label}</h4>
        
        {/* List of saved items */}
        {(formData[field] as any[]).map((item, index) => (
          <div key={`${label}-${index}`} className="dash-input-wrapper mb-30">
            <div className="vertical-input-group" style={{
              background: isEditing(index) ? '#f8f9fa' : 'white',
              padding: '15px',
              borderRadius: '8px',
              border: isEditing(index) ? '1px solid #dee2e6' : 'none'
            }}>
              {isEditing(index) ? (
                <>
                  {/* Edit mode */}
                  {keys.map((key, i) => (
                    <div className="mb-3" key={`${label}-${index}-${key}`}>
                      <label>{placeholders[i] || key}</label>
                      <input
                        type="text"
                        placeholder={placeholders[i] || key}
                        className="form-control"
                        value={tempItem[field]?.[key] || ""}
                        onChange={(e) => handleTempChange(key, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="dash-btn-two tran3s"
                      onClick={handleTempSave}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="dash-cancel-btn tran3s"
                      onClick={() => setEditingIndex({ ...editingIndex, [field]: null })}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View mode */}
                  {keys.map((key, i) => (
                    <div className="mb-2" key={`${label}-${index}-${key}`}>
                      <strong>{placeholders[i] || key}:</strong> {item[key] || ""}
                    </div>
                  ))}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="dash-btn-two tran3s"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(field, index)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add new item form */}
        {isAddingNew && (
          <div className="dash-input-wrapper mb-30">
            <div className="vertical-input-group" style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              {keys.map((key, i) => (
                <div className="mb-3" key={`new-${label}-${key}`}>
                  <label>{placeholders[i] || key}</label>
                  <input
                    type="text"
                    placeholder={placeholders[i] || key}
                    className="form-control"
                    value={tempItem[field]?.[key] || ""}
                    onChange={(e) => handleTempChange(key, e.target.value)}
                  />
                </div>
              ))}
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="dash-btn-two tran3s"
                  onClick={handleTempSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="dash-cancel-btn tran3s"
                  onClick={() => {
                    setEditingIndex({ ...editingIndex, [field]: null });
                    setTempItem({ ...tempItem, [field]: {} });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add new button */}
        {!isAddingNew && (
          <button
            onClick={() => {
              setEditingIndex({ ...editingIndex, [field]: -1 });
              setTempItem({ ...tempItem, [field]: {} });
            }}
            className="dash-btn-two tran3s me-3"
            type="button"
          >
            Add New {label}
          </button>
        )}
      </div>
    );
  };

  const clearForm = () => {
    setFormData(emptyForm);
    setEditingIndex({});
    setTempItem({});
    toast.success('Form cleared successfully');
    // Refetch the original data
    if (decodedToken?.user_id) {
      void fetchUserData(decodedToken.user_id);
    }
  };

  const isDisabled = useMemo(() => loading || saving, [loading, saving]);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        {/* Bottom Fixed Save Button Bar */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '10px',
          minWidth: '300px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleSubmit}
            className="dash-btn-two tran3s"
            disabled={isDisabled}
            type="button"
            style={{ minWidth: '120px' }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button 
            className="dash-cancel-btn tran3s" 
            onClick={clearForm}
            type="button"
            style={{ minWidth: '80px' }}
          >
            Cancel
          </button>
        </div>

        <h2 className="main-title">My Profile</h2>

        {/* Basic Info */}
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Basic Information</h4>
          <div className="user-avatar-setting d-flex align-items-center mb-30">
            <Image src={avatar} alt="avatar" className="lazy-img user-img" />
            <div className="upload-btn position-relative tran3s ms-4 me-3">
              Upload new photo
              <input type="file" disabled={isDisabled} />
            </div>
            <button className="delete-btn tran3s" disabled={isDisabled}>
              Delete
            </button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>First Name*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Last Name*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          <div className="dash-input-wrapper mb-30">
            <label>Bio*</label>
            <textarea
              className="size-lg"
              placeholder="Write something interesting about you...."
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              disabled={isDisabled}
            />
          </div>

          <div className="dash-input-wrapper mb-30">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.skill.join(", ")}
              onChange={(e) =>
                handleChange(
                  "skill",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Dynamic Sections */}
        {renderVerticalInputGroup(
          "Certifications",
          "certification",
          ["name", "issued_by", "year"],
          ["Certificate Name", "Issued By", "Year"]
        )}

        {renderVerticalInputGroup(
          "Education",
          "education",
          ["degree", "institution", "year_of_completion"],
          ["Degree", "Institution", "Year of Completion"]
        )}

        {renderVerticalInputGroup(
          "Experience",
          "experience",
          ["company", "role", "duration"],
          ["Company", "Role", "Duration"]
        )}

        {renderVerticalInputGroup(
          "Services",
          "services",
          ["title", "rate", "currency"],
          ["Service Title", "Hourly Rate", "Currency"]
        )}

        {renderVerticalInputGroup(
          "Previous Work",
          "previous_works",
          ["title", "description", "url"],
          ["Project Title", "Description", "URL"]
        )}

        {/* Address Section with CityStateCountry */}
        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Address & Location</h4>
          <div className="row">
            <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label>Address*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address_line_first}
                  onChange={(e) => handleChange("address_line_first", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>

            <CityStateCountry
              country={formData.country}
              state={formData.state}
              city={formData.city}
              onCountryChange={(val) => handleChange("country", val)}
              onStateChange={(val) => handleChange("state", val)}
              onCityChange={(val) => handleChange("city", val)}
              disabled={isDisabled}
            />

            <div className="col-md-6 col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>Zip Code*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileArea;
