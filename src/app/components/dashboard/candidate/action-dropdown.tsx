"use client";
import React, { useState } from "react";
import Image from "next/image";
import { makePostRequest } from "@/utils/api";
import view from "@/assets/dashboard/images/icon/icon_18.svg";
import edit from "@/assets/dashboard/images/icon/icon_20.svg";
import delete_icon from "@/assets/dashboard/images/icon/icon_21.svg";
import Link from "next/link";

type Props = {
  projectsTaskId: number;
  deletedBy: number;
  onDeleted?: (id: number) => void;
};

const ActionDropdown = ({ projectsTaskId, deletedBy, onDeleted }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const userId = Number(localStorage.getItem("user_id"));

  const handleDelete = async () => {
    try {
      const response = await makePostRequest("projectsTask/delete",
        {
          projects_task_id: projectsTaskId,
          is_active: 0,
          is_deleted: true,
          deleted_by: userId
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Project Deleted successfully!");
        if (onDeleted) onDeleted(projectsTaskId);
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Something went wrong");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <a className="dropdown-item" href="#">
            <Image src={view} alt="icon" className="lazy-img" /> View
          </a>
        </li>
        <li>
          <Link href={`/edit-projects/${projectsTaskId}`} className="dropdown-item">
            <Image src={edit} alt="icon" className="lazy-img" /> Edit
          </Link>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => setShowConfirm(true)}
          >
            <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
          </button>
        </li>
      </ul>

      {showConfirm && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this project?</p>
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
