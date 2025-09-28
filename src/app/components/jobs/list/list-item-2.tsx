'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_to_wishlist, remove_from_wishlist } from "@/redux/features/wishlist";
import { makePostRequest, makeDeleteRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";

const ListItemTwo = ({ item }: { item: IJobType }) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p.projects_task_id === item.projects_task_id);
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken();

  const handleToggleWishlist = async (job: IJobType) => {
    try {
      if (!decoded || !decoded.user_id) {
        console.warn("User not logged in or token invalid.");
        return;
      }

      const userId = decoded.user_id;

      if (isActive) {
        if (job.projects_task_id !== undefined) {
          await makeDeleteRequest("saved/remove-saved", {
            user_id: userId,
            projects_task_id: job.projects_task_id,
          });
          dispatch(remove_from_wishlist(job.projects_task_id));
        }
      } else {
        if (job.projects_task_id !== undefined) {
          const payload = {
            user_id: userId,
            projects_task_id: job.projects_task_id,
            is_active: true,
            is_deleted: false,
            created_by: userId,
          };

          await makePostRequest("saved/create", payload);
          dispatch(add_to_wishlist(job));
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <div className="job-list-one style-two position-relative border-style mb-20">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-5">
          <div className="job-title d-flex align-items-center">
            <div className="split-box1">
              <Link
                href={`/job-details-v1/${item.projects_task_id}`}
                className="job-duration fw-500"
              >
                {item.deadline?.slice(0, 10) || ""}
              </Link>
              <Link
                href={`/job-details-v1/${item.projects_task_id}`}
                className="title fw-500 tran3s"
              >
                {item.project_title
                  ? `${item.project_title.slice(0, 22)}${
                      item.project_title.length > 20 ? ".." : ""
                    }`
                  : ""}
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6">
          <div className="job-location">
            <Link href={`/job-details-v1/${item.projects_task_id}`}>
              Remote / Not specified
            </Link>
          </div>
          <div className="job-salary">
            <span className="fw-500 text-dark">${item.budget ?? 0}</span> / Fixed Budget
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
            {/* Toggle Save/Unsave Button */}
            <button
              onClick={() => handleToggleWishlist(item)}
              className={`save-btn text-center rounded-circle tran3s me-3 ${
                isActive ? "active" : ""
              }`}
              title={isActive ? "Remove Job" : "Save Job"}
            >
              <i
                className={`bi ${
                  isActive ? "bi-bookmark-check-fill" : "bi-bookmark"
                }`}
              ></i>
            </button>

            {/* Apply button */}
            <Link
              href={`/job-details-v1/${item.projects_task_id}`}
              className="apply-btn text-center tran3s"
            >
              APPLY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemTwo;
