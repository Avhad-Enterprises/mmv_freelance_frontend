'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
import { useAppSelector } from "@/redux/hook";
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from "@/utils/categoryIcons";

const ListItemTwo = ({ item, onToggleSave }: { item: IJobType; onToggleSave?: (job: IJobType) => void }) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p.projects_task_id === item.projects_task_id);

  return (
    <div className={`candidate-profile-card ${isActive ? "favourite" : ""} list-layout mb-25`}>
      <div className="d-flex">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
          <Link href={`/job-details-v1/${item.projects_task_id}`} className="rounded-circle">
            <div
              className="lazy-img rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 80,
                height: 80,
                fontSize: '28px',
                fontWeight: 'bold',
                backgroundColor: getCategoryColor(item.project_category),
                color: getCategoryTextColor(item.project_category)
              }}
            >
              {getCategoryIcon(item.project_category)}
            </div>
          </Link>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link href={`/job-details-v1/${item.projects_task_id}`} className="tran3s">
                    {item.project_title
                      ? `${item.project_title.slice(0, 22)}${
                          item.project_title.length > 22 ? ".." : ""
                        }`
                      : ""}
                  </Link>
                </h4>

                <ul className="cadidate-skills style-none d-flex align-items-center">
                  {item.skills_required && item.skills_required.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-nowrap">{s}</li>
                  ))}
                  {item.skills_required && item.skills_required.length > 3 && (
                    <li className="more">+{item.skills_required.length - 3}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Budget</span>
                <div>${item.budget ?? 0}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Type</span>
                <div>{item.projects_type || 'Not specified'}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end align-items-center">
                {onToggleSave && (
                  <button
                    type="button"
                    className="save-btn text-center rounded-circle tran3s"
                    onClick={() => onToggleSave(item)}
                    title={isActive ? "Unsave" : "Save"}
                  >
                    <i className={`bi ${isActive ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                  </button>
                )}
                <Link
                  href={`/job-details-v1/${item.projects_task_id}`}
                  className="profile-btn tran3s ms-md-2"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemTwo;
