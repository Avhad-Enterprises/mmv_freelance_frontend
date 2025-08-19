'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_to_wishlist, remove_from_wishlist } from "@/redux/features/wishlist";
import { makePostRequest, makeDeleteRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken"; // <-- import custom hook

const ListItemTwo = ({ item }: { item: IJobType }) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p.projects_task_id === item.projects_task_id);
  const dispatch = useAppDispatch();
  const decoded = useDecodedToken(); // <-- use custom hook

  const handleAddWishlist = async (job: IJobType) => {
    try {
      if (!decoded || !decoded.user_id) {
        console.warn("User not logged in or token invalid.");
        return;
      }

      const userId = decoded.user_id;

      if (isActive) {
        // Remove from wishlist
        await makeDeleteRequest("saved/delete", {
          user_id: userId,
          projects_task_id: job.projects_task_id,
        });
        dispatch(remove_from_wishlist(job.projects_task_id || 0));
      } else {
        // Add to wishlist
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
    } catch (error) {
      console.error("Error in wishlist toggle:", error);
    }
  };

  return (
    <div className="job-list-one style-two position-relative border-style mb-20">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-5">
          <div className="job-title d-flex align-items-center">
            <div className="split-box1">
              <Link href={`/job-details-v1/${item.projects_task_id}`} className="job-duration fw-500">
                {item.Deadline?.slice(0, 10)}
              </Link>
              <Link href={`/job-details-v1/${item.projects_task_id}`} className="title fw-500 tran3s">
                {item.project_title?.slice(0, 22)}
               {(item.project_title ?? "").length > 20 ? ".." : ""}
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
            <span className="fw-500 text-dark">${item.Budget}</span> / Fixed Budget
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
            <a
              onClick={() => handleAddWishlist(item)}
              className={`save-btn text-center rounded-circle tran3s me-3 cursor-pointer ${isActive ? "active" : ""}`}
              title={`${isActive ? "Remove Job" : "Save Job"}`}
            >
              <i className={`bi ${isActive ? "bi-bookmark-check-fill" : "bi-bookmark-dash"}`}></i>
            </a>
            <Link href={`/job-details-v1/${item.projects_task_id}`} className="apply-btn text-center tran3s">
              APPLY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemTwo;
