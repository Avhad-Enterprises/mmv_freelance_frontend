import Link from "next/link";
import React from "react";
import ActionDropdown from "../candidate/action-dropdown";

const EmployJobItem = ({
  title,
  info,
  date,
  application,
  projectsTaskId,
  // status,
}: {
  title: string;
  info: string;
  date: string;
  application: string;
  projectsTaskId: number;
  // status: string;
}) => {
  return (
    <tr className={status}>
      <td>
        <div className="job-name fw-500">{title}</div>
        <div className="info1">{info}</div>
      </td>
      <td>{date}</td>
      <td>
        <Link href={`/applications/details/${projectsTaskId}`}>
          <span className="text-primary" style={{ cursor: 'pointer' }}>
            {application} Applications
          </span>
        </Link>
      </td>
      {/* <td>
        <div className="job-status text-capitalize">{status}</div>
      </td> */}
      <td>
        <div className="action-dots float-end">
          <button
            className="action-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span></span>
          </button>
          {/* action dropdown start */}
          {/* <ActionDropdown
            projectsTaskId={projectsTaskId}
            deletedBy={Number(localStorage.getItem("user_id"))}
          /> */}
          {/* action dropdown end */}
        </div>
      </td>
    </tr>
  );
};

export default EmployJobItem;
