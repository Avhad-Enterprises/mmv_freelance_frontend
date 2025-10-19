'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
import { useAppSelector } from "@/redux/hook";
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from "@/utils/categoryIcons";

const JobGridItem = ({ item, style_2 = true, onToggleSave }: { item: IJobType; style_2?: boolean; onToggleSave?: (job: IJobType) => void }) => {
  const { projects_task_id, projects_type, budget, project_title } = item || {};
  const { wishlist } = useAppSelector(state => state.wishlist);
  const isActive = wishlist.some(p => p.projects_task_id === projects_task_id);

  return (
    <div className={`candidate-profile-card grid-layout ${isActive ? "favourite" : ""}`}>
      {onToggleSave && (
        <a
          onClick={() => onToggleSave(item)}
          className={`save-btn text-center rounded-circle tran3s cursor-pointer ${isActive ? 'active' : ''}`}
          title={isActive ? 'Unsave Job' : 'Save Job'}
        >
          <i className={`bi ${isActive ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
        </a>
      )}

      <div className="cadidate-avatar online position-relative d-block me-auto ms-auto mb-3">
        <Link href={`/job-details-v1/${projects_task_id}`} className="rounded-circle">
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

      <div className="text-center mb-2">
        <h4 className="candidate-name mb-2">
          <Link href={`/job-details-v1/${projects_task_id}`} className="tran3s">
            {project_title}
          </Link>
        </h4>

        <ul className="cadidate-skills style-none d-flex align-items-center justify-content-center mb-3">
          {item.skills_required && item.skills_required.slice(0, 2).map((s, i) => (
            <li key={i} className="text-nowrap">{s}</li>
          ))}
        </ul>
      </div>

      <div className="candidate-info text-center mb-3">
        <span>Budget</span>
        <div>${budget ?? 0}</div>
      </div>

      <div className="candidate-info text-center mb-3">
        <span>Type</span>
        <div>{projects_type || 'Not specified'}</div>
      </div>

      <div className="d-flex justify-content-center">
        <Link
          href={`/job-details-v1/${projects_task_id}`}
          className="profile-btn tran3s"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobGridItem;
