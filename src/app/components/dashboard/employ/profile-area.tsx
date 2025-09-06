"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import blankAvatar from "@/assets/dashboard/images/usericon.jpg";
import DashboardHeader from "../candidate/dashboard-header";
import { getLoggedInUser } from "@/utils/jwt";
import { makePostRequest } from "@/utils/api";
import { toast } from "react-hot-toast";
import CityStateCountry from "../../common/country-state-city";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type IPreviousWork = {
  title: string;
  url: string;
  description: string;
};

type IUserData = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  profile_picture?: string;
  address_line_first?: string;
  address_line_second?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  bio?: string;
  created_at?: string;
  previous_works: IPreviousWork[];
};

const EmployProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  // controlled states
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [previousWorks, setPreviousWorks] = useState<IPreviousWork[]>([]);

  // populate from API
  useEffect(() => {
    const fetchUser = async () => {
      const decoded = getLoggedInUser();
      const userId = decoded?.user_id;

      if (!userId) {
        toast.error("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const res = await makePostRequest("users/get_user_by_id", {
          user_id: userId,
        });

        if (res.data?.data) {
          const data = res.data.data;
          setUserData(data);

          // fill states
          setProfilePic(data.profile_picture || null);
          setPhone(data.phone_number || "");
          setBio(data.bio || "");
          setAddress1(data.address_line_first || "");
          setAddress2(data.address_line_second || "");
          setPincode(data.pincode || "");
          setSelectedCountry(data.country || "");
          setSelectedCity(data.city || "");
          setSelectedState(data.state || "");
          setPreviousWorks(data.previous_works || []);
        } else {
          toast.error("Failed to load user data.");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // upload image
  const handleUploadProfilePic = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch(
        "http://localhost:8000/api/v1/files/uploadtoaws",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok && data?.url) {
        setProfilePic(data.url);
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error(data?.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePic = () => {
    setProfilePic(null);
    toast.success("Profile picture removed!");
  };

  // previous works change
  const handleWorkChange = (
    index: number,
    field: keyof IPreviousWork,
    value: string
  ) => {
    const updated = [...previousWorks];
    updated[index][field] = value;
    setPreviousWorks(updated);
  };

  const handleAddWork = () => {
    setPreviousWorks([...previousWorks, { title: "", url: "", description: "" }]);
  };

  const handleRemoveWork = (index: number) => {
    const updated = [...previousWorks];
    updated.splice(index, 1);
    setPreviousWorks(updated);
  };

  // save full form
  const handleSave = async () => {
    if (!userData) return;

    try {
      const payload = {
        user_id: userData.user_id,
        profile_picture: profilePic,
        phone_number: phone,
        bio,
        address_line_first: address1,
        address_line_second: address2,
        city: selectedCity,
        state: selectedState,
        country: selectedCountry,
        pincode,
        previous_works: JSON.stringify(previousWorks),
      };

      const res = await makePostRequest("users/update_user_by_id", payload);

      if (res.data?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while saving profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        <h2 className="main-title">Profile</h2>

        {/* Avatar */}
        <div className="bg-white card-box border-20">
          <div className="user-avatar-setting d-flex align-items-center mb-30">
            <div style={{ position: "relative", width: "60px", height: "60px" }}>
              <Image
                src={profilePic || blankAvatar}
                alt="avatar"
                fill
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            </div>

            <div className="upload-btn position-relative tran3s ms-4 me-3">
              {uploading ? "Uploading..." : "Upload new photo"}
              <input type="file" onChange={handleUploadProfilePic} />
            </div>
            <button className="delete-btn tran3s" onClick={handleDeleteProfilePic}>
              Delete
            </button>
          </div>

          {/* Basic Info */}
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Name*</label>
                <input
                  type="text"
                  value={`${userData?.first_name || ""} ${userData?.last_name || ""}`}
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Email</label>
                <input value={userData?.email || ""} readOnly />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Founded Date*</label>
                <input
                  type="date"
                  value={
                    userData?.created_at
                      ? new Date(userData.created_at).toISOString().split("T")[0]
                      : ""
                  }
                  readOnly
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label>Phone Number*</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="dash-input-wrapper">
            <label>About Company*</label>
            <textarea
              className="size-lg"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something interesting about you...."
            />
          </div>
        </div>

        {/* Previous Works */}
        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Previous Work</h4>
          {previousWorks.map((work, index) => (
            <div key={index} className="dash-input-wrapper mb-20">
              <div className="row">
                <div className="col-md-6">
                  <label>Title</label>
                  <input
                    type="text"
                    value={work.title}
                    onChange={(e) => handleWorkChange(index, "title", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Link</label>
                  <input
                    type="text"
                    value={work.url}
                    onChange={(e) => handleWorkChange(index, "url", e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label>Description</label>
                  <textarea
                    className="size-lg"
                    value={work.description}
                    onChange={(e) => handleWorkChange(index, "description", e.target.value)}
                  />
                </div>
                <button onClick={() => handleRemoveWork(index)} className="btn btn-danger mt-2">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleAddWork} className="dash-btn-two tran3s me-3">
            + Add Work
          </button>
        </div>

        {/* Address */}
        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Address & Location</h4>
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-25">
                <label>Address Line 1*</label>
                <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-25">
                <label>Address Line 2*</label>
                <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </div>
            </div>

            <CityStateCountry
              country={selectedCountry}
              state={selectedState}
              city={selectedCity}
              onCountryChange={setSelectedCountry}
              onStateChange={setSelectedState}
              onCityChange={setSelectedCity}
            />

            <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label>Zip Code*</label>
                <input
                  type="number"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="button-group d-inline-flex align-items-center mt-30">
          <button onClick={handleSave} className="dash-btn-two tran3s me-3" disabled={uploading}>
            {uploading ? "Saving..." : "Save"}
          </button>
          <a href="#" className="dash-cancel-btn tran3s">Cancel</a>
        </div>
      </div>
    </div>
  );
};

export default EmployProfileArea;
