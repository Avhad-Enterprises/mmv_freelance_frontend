"use client";
import React, { useState } from "react";
import { makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { useRouter } from "next/navigation";

const DeleteAccountModal = () => {
  const decoded = useDecodedToken();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!decoded?.user_id) return;
    setLoading(true);
    try {
      await makePostRequest("users/soft_delete_user", { user_id: Number(decoded.user_id) });

      localStorage.clear(); //clear token & data
      router.push("/"); // redirect to home
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex={-1}
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header border-0">
            <h5 className="modal-title" id="deleteModalLabel">
              Delete Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <p>
              Are you sure you want to delete your account? <br />
              This action cannot be undone.
            </p>
          </div>

          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
