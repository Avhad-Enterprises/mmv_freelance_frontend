
"use client"
import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import avatar from '@/assets/dashboard/images/avatar_04.jpg';
import icon from '@/assets/dashboard/images/icon/icon_16.svg';
import blankAvatar from '@/assets/dashboard/images/usericon.jpg';
import CountrySelect from '../candidate/country-select';
import CitySelect from '../candidate/city-select';
import StateSelect from '../candidate/state-select';
import DashboardHeader from '../candidate/dashboard-header';
import { getLoggedInUser } from '@/utils/jwt';
import { makePostRequest } from '@/utils/api';
import { toast } from 'react-hot-toast';

// props type 
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

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
  is_active?: boolean;
  created_at?: string;
  previous_works?: {
    title: string;
    url: string;
    description: string;
  }[];
};

const EmployProfileArea = ({ setIsOpenSidebar }: IProps) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.profile_picture) {
      setProfilePic(userData.profile_picture);
    }
  }, [userData]);

  const handleDeleteProfilePic = () => {
    setProfilePic(null);
  };


  useEffect(() => {
    const fetchUser = async () => {
      const decoded = getLoggedInUser();
      const userId = decoded?.user_id;

      if (!userId) {
        console.error("No user_id found in token");
        toast.error("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const res = await makePostRequest("users/get_user_by_id", {
          user_id: userId,
        });

        console.log("API response:", res.data);

        if (res.data?.data) {
          setUserData(res.data.data);
          setSelectedCountry(res.data.data.country);
          setSelectedCity(res.data.data.city);
          setSelectedState(res.data.data.state);
        } else {
          console.error("No user data found in response");
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

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

        <h2 className="main-title">Profile</h2>

        <div className="bg-white card-box border-20">
          <div className="user-avatar-setting d-flex align-items-center mb-30">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image
                src={profilePic || blankAvatar}
                alt="avatar"
                fill
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />

            </div>

            <div className="upload-btn position-relative tran3s ms-4 me-3">
              Upload new photo
              <input type="file" id="uploadImg" name="uploadImg" placeholder="" />
            </div>
            <button className="delete-btn tran3s" onClick={handleDeleteProfilePic}>
              Delete
            </button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Name*</label>
                <input
                  type="text"
                  value={
                    `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim()
                  }
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
            {/* <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Website*</label>
                <input type="text" placeholder="http://somename.come" />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Founded Date*</label>
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
            {/* <div className="col-md-6">
            {/* <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Company Size*</label>
                <input type="text" placeholder="700" />
              </div>
            </div> */}
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Phone Number*</label>
                <input type="tel" value={userData?.phone_number} placeholder="+880 01723801729" />
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Category*</label>
                <input type="text" placeholder="Account, Finance, Marketing" />
              </div>
            </div> */}
          </div>
          <div className="dash-input-wrapper">
            <label htmlFor="">About Company*</label>
            <textarea className="size-lg"
              value={userData?.bio}
              placeholder="Write something interesting about you...."></textarea>
            <div className="alert-text">Brief description for your company. URLs are hyperlinked.</div>
          </div>
        </div>

        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Previous Work</h4>
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">Network 1</label>
            {userData?.previous_works?.length ? (
              userData.previous_works.map((work, index) => (
                <div key={index} className="dash-input-wrapper mb-20">
                  <div className='row'>
                    <div className="col-md-6">
                      <label>Title</label>
                      <input type="text" value={work.title} readOnly />
                    </div>
                    <div className="col-md-6">
                      <label>Link</label>
                      <input type="text" value={work.url} readOnly />
                    </div>
                    <div className="col-md-12">
                      <label>Description</label>
                      <textarea className="size-lg"
                        value={work.description} readOnly
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No previous works found.</p>
            )}
          </div>
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">Network 2</label>
            <input type="text" placeholder="https://twitter.com/FIFAcom" />
          </div>
          <a href="#" className="dash-btn-one"><i className="bi bi-plus"></i> Add more link</a>
        </div>

        <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Address & Location</h4>
          <div className="row">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Address Line 1*</label>
                <input type="text"
                  value={userData?.address_line_first}
                  placeholder="Cowrasta, Chandana, Gazipur Sadar" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Address Line 2*</label>
                <input type="text"
                  value={userData?.address_line_second}
                  placeholder="Cowrasta, Chandana, Gazipur Sadar" />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Country*</label>
                <CountrySelect
                  value={selectedCountry}
                  onChange={(val) => setSelectedCountry(val)} />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">State*</label>
                <StateSelect
                  value={selectedState}
                  onChange={(val) => setSelectedState(val)}
                />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">City*</label>
                <CitySelect
                  value={selectedCity}
                  onChange={(val) => setSelectedCity(val)}
                />
                <label htmlFor="">Zip Code*</label>
                <input type="number"
                  value={userData?.pincode}
                  placeholder="1708" />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Zip Code*</label>
                <input type="number"
                  value={userData?.pincode}
                  placeholder="1708" />
              </div>
            </div>
            {/* <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Map Location*</label>
                <div className="position-relative">
                  <input type="text" placeholder="XC23+6XC, Moiran, N105" />
                  <button className="location-pin tran3s">
                    <Image src={icon} alt="icon" className="lazy-img m-auto" />
                  </button>
                </div>
                <div className="map-frame mt-30">
                  <div className="gmap_canvas h-100 w-100">
                    <iframe className="gmap_iframe h-100 w-100" src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* <div className="bg-white card-box border-20 mt-40">
          <h4 className="dash-title-three">Members</h4>
          <div className="dash-input-wrapper">
            <label htmlFor="">Add & Remove Member</label>
          </div>
          <div className="accordion dash-accordion-one" id="accordionOne">
            <div className="accordion-item">
              <div className="accordion-header" id="headingOne">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                  Add Member 1
                </button>
              </div>
              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionOne">
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="dash-input-wrapper mb-30 md-mb-10">
                        <label htmlFor="">Name*</label>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <div className="dash-input-wrapper mb-30">
                        <input type="text" placeholder="Product Designer (Google)" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="dash-input-wrapper mb-30 md-mb-10">
                        <label htmlFor="">Designation*</label>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <div className="dash-input-wrapper mb-30">
                        <input type="text" placeholder="Account Manager" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="dash-input-wrapper mb-30 md-mb-10">
                        <label htmlFor="">Email*</label>
                      </div>
                    </div>
                    <div className="col-lg-10">
                      <div className="dash-input-wrapper mb-30">
                        <input type="email" placeholder="newmmwber@gmail.com" />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mb-20">
                    <a href="#" className="dash-btn-one">Remove</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#" className="dash-btn-one"><i className="bi bi-plus"></i> Add Another Member</a>
        </div> */}


        <div className="button-group d-inline-flex align-items-center mt-30">
          <a href="#" className="dash-btn-two tran3s me-3">Save</a>
          <a href="#" className="dash-cancel-btn tran3s">Cancel</a>
        </div>
      </div>
    </div>
  );
};

export default EmployProfileArea;