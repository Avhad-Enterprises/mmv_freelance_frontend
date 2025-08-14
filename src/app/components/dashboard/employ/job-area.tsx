import React, { useState, useEffect } from "react";
import DashboardHeader from "../candidate/dashboard-header";
import EmployJobItem from "./job-item";
import { getLoggedInUser } from "@/utils/jwt";
import { makeGetRequest, makePostRequest } from "@/utils/api";

// props type 
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

type ProjectTask = {
  projects_task_id: number;
  id: number;
  project_title: string;
  country: string;
  count: string;
  created_at: string;
  // status: "active" | "pending" | "expired";
};

const EmployJobArea = ({ setIsOpenSidebar }: IProps) => {

  const [idata, setiData] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<null | number>(null);



  const fetchProjectTask = async () => {
    const decoded = getLoggedInUser();
    const clientId = decoded?.user_id;

    if (!clientId) {
      console.error("No user_id found in token");
      // toast.error("Please log in to view your profile.");
      setLoading(false);
      return;
    }
    try {
      const response = await makeGetRequest(`projectsTask/tasks-with-client/${clientId}`);
      console.log("response",response);

      if (response.data?.data?.length) {
        const projects = response.data.data.map((project: ProjectTask) => ({
          ...project,
          applicants: 0,
        }));

        for (const project of projects) {
          try {
            const countRes = await makePostRequest(
              "applications/projects/get-application-count",
              { projects_task_id: project.projects_task_id }
            );
            project.count = countRes.data?.count || 0;
          } catch (err) {
            console.error(`Failed to get count for project ${project.projects_task_id}`, err);
            project.count = 0;
          }
        }
        console.log("Project Data: ", projects)
        setiData(projects);
      } else {
        console.error("No data found");
        setiData([]);
      }
    } catch (err) {
      console.error("Error fetching project task:", err);
      setiData([]);
    }
  };

  const fetchProjectByStatus = async (status: number) => {
    const decoded = getLoggedInUser();
    const clientId = decoded?.user_id;

    if (!clientId) {
      console.error("No user_id found in token");
      setLoading(false);
      return;
    }

    try {
      const response = await makePostRequest(
        `applications/getStatus`,
        { client_id: clientId, status: status }
      );
      console.log(`Status ${status} projects response:`, response.data);

      if (response.data?.data?.length) {
        const projects = response.data.data.map((project: ProjectTask) => ({
          ...project,
          applicants: 0,
        }));

        for (const project of projects) {
          try {
            const countRes = await makePostRequest(
              "applications/projects/get-application-count",
              { projects_task_id: project.projects_task_id }
            );
            project.count = countRes.data?.count || 0;
          } catch (err) {
            console.error(`Failed to get count for project ${project.projects_task_id}`, err);
            project.count = 0;
          }
        }

        setiData(projects);
      } else {
        setiData([]);
      }

    } catch (err) {
      console.error("Error fetching projects by status:", err);
      setiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTask();
  }, []);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">My Jobs</h2>
          <div className="d-flex ms-auto xs-mt-30">
            <div
              className="nav nav-tabs tab-filter-btn me-4"
              id="nav-tab"
              role="tablist"
            >
              <button
                className={`nav-link ${statusFilter === null ? "active" : ""}`}
                data-bs-toggle="tab"
                data-bs-target="#a1"
                type="button"
                role="tab"
                aria-selected="true"
                onClick={() => {
                  setStatusFilter(null);
                  fetchProjectTask();
                }}
              >
                All
              </button>
              <button className="nav-link" data-bs-toggle="tab" data-bs-target="#a1" type="button" role="tab" aria-selected="false">New</button>
              <button
                className={`nav-link ${statusFilter === 0 ? "active" : ""}`}
                data-bs-toggle="tab"
                data-bs-target="#a1"
                type="button"
                role="tab"
                aria-selected="false"
                onClick={() => {
                  setStatusFilter(0);
                  fetchProjectByStatus(0);
                }}
              >
                On Going
              </button>
              <button
                className={`nav-link ${statusFilter === 1 ? "active" : ""}`}
                data-bs-toggle="tab"
                data-bs-target="#a1"
                type="button"
                role="tab"
                aria-selected="false"
                onClick={() => {
                  setStatusFilter(1);
                  fetchProjectByStatus(1);
                }}
              >
                Completed
              </button>
            </div>
            {/* <div className="short-filter d-flex align-items-center ms-auto">
              <div className="text-dark fw-500 me-2">Short by:</div>
              <EmployShortSelect />
            </div> */}
          </div>
        </div>

        <div className="bg-white card-box border-20">
          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="a1" role="tabpanel">
              <div className="table-responsive">
                <table className="table job-alert-table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Job Created</th>
                      <th scope="col">Applicants</th>
                      {/* <th scope="col">Status</th> */}
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="border-0">
                    {idata.length > 0 ? (
                      idata.map((project) => (
                        <EmployJobItem
                          key={project.id}
                          title={project.project_title}
                          info={project.country}
                          application={project.count}
                          date={new Date(project.created_at).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                          projectsTaskId={project.projects_task_id}
                        // status={project.status}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No applied projects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="tab-pane fade" id="a2" role="tabpanel">
              {/* New tab content here */}
            </div>
          </div>
        </div>

        <div className="dash-pagination d-flex justify-content-end mt-30">
          <ul className="style-none d-flex align-items-center">
            <li><a href="#" className="active">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li>..</li>
            <li><a href="#">7</a></li>
            <li><a href="#"><i className="bi bi-chevron-right"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployJobArea;
