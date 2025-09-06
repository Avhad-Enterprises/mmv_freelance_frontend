import React, { useState } from "react";
import toast from "react-hot-toast";
import { makePostRequest } from "@/utils/api";
import decode from "@/hooks/useDecodedToken";

const ChangePasswordArea = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = decode(); // Assuming this returns { user_id: "2", ... }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New and confirm passwords do not match");
      return;
    }

    try {
      const payload = {
        user_id: user?.user_id,
        oldPassword,
        newPassword,
        confirmPassword,
      };

      await makePostRequest("users/change-password", payload);
      toast.success("Password changed successfully");

      // Optional: Reset fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Error changing password");
    }
  };

  return (
    <div className="mt-45">
      <div className="position-relative">
        <h2 className="main-title">Change Password</h2>

        <div className="bg-white card-box border-20">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>Old Password*</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>New Password*</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>Confirm Password*</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center">
              <button type="submit" className="dash-btn-two tran3s rounded-3">
                Save & Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordArea;
