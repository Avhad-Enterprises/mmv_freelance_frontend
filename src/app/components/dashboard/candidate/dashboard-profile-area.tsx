"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import avatar from "@/assets/dashboard/images/avatar_02.jpg";
import DashboardHeader from "./dashboard-header";
import { makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type Certification = {
  name: string;
  issued_by: string;
  year: string;
};

type Education = {
  degree: string;
  institution: string;
  year_of_completion: string;
};

type Experience = {
  company: string;
  role: string;
  duration: string;
};

type Service = {
  title: string;
  rate: string;
  currency: string;
};

type PreviousWork = {
  title: string;
  description: string;
  url: string;
};

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

const DashboardProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const decodedToken = useDecodedToken();
  const [formData, setFormData] = useState<FormData>({
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
  });

  useEffect(() => {
    if (decodedToken?.user_id) {
      fetchUserData(decodedToken.user_id);
    }
  }, [decodedToken?.user_id]);

  const fetchUserData = async (id: number) => {
    try {
      const res = await makePostRequest("users/get_user_by_id", { user_id: id });
      const data = res.data?.data;

      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        bio: data.bio || "",
        address_line_first: data.address_line_first || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pincode: data.pincode || "",
        skill: Array.isArray(data.skill) ? data.skill : [],
        certification: Array.isArray(data.certification) ? data.certification : [],
        education: Array.isArray(data.education) ? data.education : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        services: Array.isArray(data.services) ? data.services : [],
        previous_works: Array.isArray(data.previous_works) ? data.previous_works : [],
      });
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: keyof FormData, index: number, key: string, value: string) => {
    const updated = [...(formData[field] as any[])];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    handleChange(field, updated);
  };

  const handleAddMore = (field: keyof FormData, emptyItem: any) => {
    handleChange(field, [...(formData[field] as any[]), emptyItem]);
  };

  const handleDelete = (field: keyof FormData, index: number) => {
    const updated = [...(formData[field] as any[])];
    updated.splice(index, 1);
    handleChange(field, updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        user_id: decodedToken?.user_id,
        skill: JSON.stringify(formData.skill),
        certification: JSON.stringify(formData.certification),
        education: JSON.stringify(formData.education),
        experience: JSON.stringify(formData.experience),
        services: JSON.stringify(formData.services),
        previous_works: JSON.stringify(formData.previous_works),
      };

      await makePostRequest("users/update_user_by_id", payload);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  const renderVerticalInputGroup = (
    label: string,
    field: keyof FormData,
    keys: string[],
    placeholders: string[]
  ) => (
    <div className="bg-white card-box border-20 mt-30">
      <h4 className="dash-title-three">{label}</h4>
      {(formData[field] as any[]).map((item, index) => (
        <div key={index} className="dash-input-wrapper mb-30">
          <div className="vertical-input-group">
            {keys.map((key, i) => (
              <div className="mb-3" key={i}>
                <label>{placeholders[i] || key}</label>
                <input
                  type="text"
                  placeholder={placeholders[i] || key}
                  className="form-control"
                  value={item[key] || ""}
                  onChange={(e) => handleArrayChange(field, index, key, e.target.value)}
                />
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDelete(field, index)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => handleAddMore(field, keys.reduce((acc, key) => ({ ...acc, [key]: "" }), {}))}
        className="dash-btn-two tran3s me-3"
      >
        Add More {label}
      </button>
    </div>
  );

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">My Profile</h2>

        {/* Basic Info */}
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Basic Information</h4>
          <div className="user-avatar-setting d-flex align-items-center mb-30">
            <Image src={avatar} alt="avatar" className="lazy-img user-img" />
            <div className="upload-btn position-relative tran3s ms-4 me-3">
              Upload new photo
              <input type="file" />
            </div>
            <button className="delete-btn tran3s">Delete</button>
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
            />
          </div>

          <div className="dash-input-wrapper mb-30">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.skill.join(", ")}
              onChange={(e) =>
                handleChange("skill", e.target.value.split(",").map((s) => s.trim()))
              }
            />
          </div>
        </div>

        {/* Dynamic Tabs */}
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

        {/* Address Section */}
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
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>Country*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>City*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>Zip Code*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>State*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="button-group d-inline-flex align-items-center mt-30">
          <button onClick={handleSubmit} className="dash-btn-two tran3s me-3">
            Save Changes
          </button>
          <button className="dash-cancel-btn tran3s">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileArea;
