import React, { useState } from "react";
import toast from "react-hot-toast";
import { authCookies } from "@/utils/cookies";
import { useUser } from "@/context/UserContext";

const ChangePasswordArea = () => {
  const { userData, refreshUserData } = useUser();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user has no password (e.g. OAuth), show "Set Password" instead of "Change Password"
  const isSetPasswordMode = userData && userData.has_password === false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("New and confirm passwords do not match");
      return;
    }

    // Validate minimum length
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    // Only validate old password if in Change Password mode
    if (!isSetPasswordMode && oldPassword.length < 6) {
      toast.error("Current password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const token = authCookies.getToken();
      if (!token) {
        setLoading(false);
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/change-password`;
      let body: any = {
        old_password: oldPassword,
        new_password: newPassword
      };

      if (isSetPasswordMode) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/set-password`;
        body = {
          new_password: newPassword,
          confirm_password: confirmPassword
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isSetPasswordMode ? "Password set successfully!" : "Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Refresh user data so has_password becomes true
        await refreshUserData();
      } else {
        toast.error(data.message || (isSetPasswordMode ? "Failed to set password" : "Failed to change password"));
      }
    } catch (error) {
      console.error("Error password operation:", error);
      toast.error("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-45">
      <div className="position-relative">
        <h2 className="main-title">
          {isSetPasswordMode ? "Set a Password" : "Change Password"}
        </h2>

        {isSetPasswordMode && (
          <p className="mb-4 text-muted">
            You logged in via a social account. Set a password to enable email login.
          </p>
        )}

        <div className="bg-white card-box border-20">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Only show Current Password if NOT in Set Password mode */}
              {!isSetPasswordMode && (
                <div className="col-12">
                  <div className="dash-input-wrapper mb-20">
                    <label>Current Password*</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>
              )}

              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>New Password*</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter your new password (min 6 characters)"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label>Confirm New Password*</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center">
              <button
                type="submit"
                className="dash-btn-two tran3s rounded-3"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isSetPasswordMode ? 'Set Password' : 'Save & Update')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordArea;
