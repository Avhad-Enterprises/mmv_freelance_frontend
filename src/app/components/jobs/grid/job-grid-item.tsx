'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { add_to_wishlist } from "@/redux/features/wishlist";

const JobGridItem = ({ item, style_2 = true }: { item: IJobType; style_2?: boolean }) => {
  const { projects_task_id, projects_type, budget, project_title } = item || {};
  const { wishlist } = useAppSelector(state => state.wishlist);
  const isActive = wishlist.some(p => p.projects_task_id === projects_task_id);
  const dispatch = useAppDispatch();

  const handleAddWishlist = (item: IJobType) => {
    dispatch(add_to_wishlist(item));
  };

  return (
    <div className={`job-list-two ${style_2 ? 'style-two' : ''} position-relative`}>
      <a
        onClick={() => handleAddWishlist(item)}
        className={`save-btn text-center rounded-circle tran3s cursor-pointer ${isActive ? 'active' : ''}`}
        title={isActive ? 'Remove from Wishlist' : 'Save Job'}
      >
        <i className="bi bi-bookmark-dash"></i>
      </a>

      <div>
        <Link href={`/job-details-v1/${projects_task_id}`} className={`job-duration fw-500`}>
          {projects_type}
        </Link>
      </div>

      <div>
        <Link href={`/job-details-v1/${projects_task_id}`} className="title fw-500 tran3s">
          {project_title}
        </Link>
      </div>

      <div className="job-salary">
        <span className="fw-500 text-dark">${budget}</span> / project
      </div>

      <div className="d-flex align-items-center justify-content-between mt-auto">
        <div /> {/* Empty column for layout */}
        <Link href={`/job-details-v1/${projects_task_id}`} className="apply-btn text-center tran3s">
          APPLY
        </Link>
      </div>
    </div>
  );
};

export default JobGridItem;
