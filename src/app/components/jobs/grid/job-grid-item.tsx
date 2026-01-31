'use client';
import React from "react";
import Link from "next/link";
import { IJobType } from "@/types/job-data-type";
// import { useAppSelector } from "@/redux/hook"; // <-- Removed Redux
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from "@/utils/categoryIcons";

// --- UPDATED PROPS ---
// Added 'isActive' and made it required
const JobGridItem = ({ 
  item, 
  style_2 = true, 
  onToggleSave,
  isActive // <-- Added prop
}: { 
  item: IJobType; 
  style_2?: boolean; 
  onToggleSave?: (job: IJobType) => void;
  isActive: boolean; // <-- Added prop type
}) => {
  const { projects_task_id, projects_type, budget, project_title } = item || {};
  
  // --- REMOVED REDUX LOGIC ---
  // const { wishlist } = useAppSelector(state => state.wishlist);
  // const isActive = wishlist.some(p => p.projects_task_id === projects_task_id);
  // The 'isActive' const now comes directly from props.

  return (
    // Removed favourite class - only heart icon should change
    <div className="candidate-profile-card text-center grid-layout mb-25">
      {onToggleSave && (
        <a
          onClick={() => onToggleSave(item)}
          // 'isActive' prop controls the 'active' class
          className={`save-btn text-center rounded-circle tran3s cursor-pointer ${isActive ? 'active' : ''}`}
          title={isActive ? 'Unsave Project' : 'Save Project'}
        >
          {/* 'isActive' prop controls the icon */}
          <i className={`bi ${isActive ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
        </a>
      )}

      <div className="cadidate-avatar online position-relative d-block m-auto">
        <Link href={`/job-details/${projects_task_id}`} className="rounded-circle">
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

      <h4 className="candidate-name mt-15 mb-0">
        <Link href={`/job-details/${projects_task_id}`} className="tran3s">
          {project_title}
        </Link>
      </h4>

      {/* <div className="candidate-post">
        {item.project_category || 'Project'}
      </div> */}

      <ul className="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center pt-30 sm-pt-20 pb-10">
        {item.skills_required && item.skills_required.slice(0, 1).map((s, i) => (
          <li key={i}>{s}</li>
        ))}
        {item.skills_required && item.skills_required.length > 1 && (
          <li className="more">{item.skills_required.length - 1}+</li>
        )}
      </ul>

      <div className="row gx-1">
        <div className="col-6">
          <div className="candidate-info mt-10">
            <span>Budget</span>
            <div>${budget ?? 0}</div>
          </div>
        </div>
        <div className="col-6">
          <div className="candidate-info mt-10">
            <span>Type</span>
            <div>{projects_type || 'Not specified'}</div>
          </div>
        </div>
      </div>

      <div className="row gx-2 pt-25 sm-pt-10">
        <div className="col-12">
          <Link
            href={`/job-details/${projects_task_id}`}
            className="profile-btn tran3s w-100 mt-5"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobGridItem;