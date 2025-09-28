"use client";
import React from "react";
import Image from "next/image";
import icon from "@/assets/dashboard/images/icon/icon_22.svg";
import { useRouter } from "next/navigation";

const LogoutModal = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear token / user data from storage
    localStorage.removeItem("token"); // example
    // Redirect to login or homepage
    router.push("/");
  };

  return (
    <div
      className="modal fade"
      id="logoutModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-4">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <Image src={icon} alt="icon" className="lazy-img m-auto mb-3" />
          <h2>Are you sure?</h2>
          <p>You will be logged out of your account.</p>
          <div className="d-flex justify-content-center gap-3 pt-3">
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              data-bs-dismiss="modal"
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
