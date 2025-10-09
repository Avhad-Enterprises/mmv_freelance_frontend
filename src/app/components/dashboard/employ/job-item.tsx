import React, { useState } from "react";
import { ProjectTask } from "./job-area"; // Import the type from the parent

// Props type for this component
type IProps = {
  project: ProjectTask;
};

const EmployJobItem = ({ project }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the expanded view
  const toggleOpen = () => setIsOpen(!isOpen);

  // Format the creation date
  const createdDate = new Date(project.created_at).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Main Table Row - Click to toggle details */}
      <tr onClick={toggleOpen} style={{ cursor: "pointer" }} title="Click to see details">
        <td>
          <div className="job-name fw-500">{project.project_title}</div>
        </td>
        <td>{project.project_category}</td>
        <td>${project.budget.toLocaleString()}</td>
        <td>{createdDate}</td>
        <td>{project.count}</td>
        <td>
          <div className="action-dots float-end">
            <button
              className="action-btn dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={(e) => e.stopPropagation()} // Prevent row click from triggering
            >
              <span></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">View Applicants</a></li>
              <li><a className="dropdown-item" href="#">Edit</a></li>
              <li><a className="dropdown-item" href="#">Delete</a></li>
            </ul>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row - Conditionally rendered */}
      {isOpen && (
        <tr>
          <td colSpan={6} style={{ padding: '0.5rem 1rem', backgroundColor: '#f8f9fa' }}>
            <div className="p-3">
              <h5>Project Details</h5>
              <p>{project.project_description}</p>
              <h5>Skills Required</h5>
              <div>
                {project.skills_required.map((skill, index) => (
                  <span key={index} className="badge bg-secondary text-white me-2 mb-2 p-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default EmployJobItem;