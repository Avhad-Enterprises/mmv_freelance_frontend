import React, { useEffect, useState } from "react";
import DashboardHeader from "./dashboard-header";
import ChangePasswordArea from "./change-password";
import { makePostRequest } from "../../../../utils/api";
import useDecodedToken from "../../../../hooks/useDecodedToken";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardSettingArea = ({ setIsOpenSidebar }: IProps) => {
  const decodedToken = useDecodedToken();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!decodedToken?.user_id) return;

      try {
        const res = await makePostRequest("users/get_user_by_id", {
          user_id: decodedToken.user_id,
        });

        const user = res.data.data;

        setFormData({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone_number || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [decodedToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decodedToken?.user_id) return;

    try {
      await makePostRequest("users/update_user_by_id", {
        user_id: decodedToken.user_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

        <h2 className="main-title">Account Settings</h2>

        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Edit & Update</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John Doe"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Kabir"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+810 321 889 021"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="">Password</label>
                  <input type="password" disabled placeholder="********" />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button type="submit" className="dash-btn-two tran3s me-3 rounded-3">
                Save
              </button>
              <button type="button" className="dash-cancel-btn tran3s">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* change password area */}
        <ChangePasswordArea />
        {/* change password area */}
      </div>
    </div>
  );
};

export default DashboardSettingArea;
