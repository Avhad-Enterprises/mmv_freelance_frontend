"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { makePostRequest } from "@/utils/api";
import view from "@/assets/dashboard/images/icon/icon_18.svg";
import edit from "@/assets/dashboard/images/icon/icon_20.svg";
import delete_icon from "@/assets/dashboard/images/icon/icon_21.svg";
import Link from "next/link";

type Props = {
  id: number;
  favoriteFreelancerId: number;
  onDeleted?: (id: number) => void;
};

const ActionDropdown = ({ id,favoriteFreelancerId, onDeleted }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [userId, setUserId] = useState<number | null>(id);
  // alert(id);

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) setUserId(Number(storedId));
  }, []);

  const handleDelete = async () => {
    alert(userId);
    if (!userId) {
      alert("ID not found.");
      return;
    }

    const payload = {
      id: userId

    };

    try {
      const response = await makePostRequest("api/v1/favorites/remove", payload);

      if (response.status === 200 || response.status === 201) {
        alert("Freelancer removed from favorites!");
        if (onDeleted) onDeleted(favoriteFreelancerId);
      } else {
        alert("Failed to remove favorite.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong.");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a className="dropdown-item" href="#">
            <Image src={view} alt="View icon" className="lazy-img" /> View
          </a>
        </li>
        <li>
          <Link href={`/edit-freelancer/${favoriteFreelancerId}`} className="dropdown-item">
            <Image src={edit} alt="Edit icon" className="lazy-img" /> Edit
          </Link>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => setShowConfirm(true)}>
            <Image src={delete_icon} alt="Delete icon" className="lazy-img" /> Delete
          </button>
        </li>
      </ul>

      {showConfirm && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmDeleteTitle"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="confirmDeleteTitle">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove this freelancer from favorites?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionDropdown;
