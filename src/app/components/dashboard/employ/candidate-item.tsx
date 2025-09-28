import React from "react";
import ActionDropdown from "../employ/action-dropdown";


type CandidateItemProps = {
  item: {
    id: number;
    favorite_freelancer_id: number;
    username: string;
    email: string;
    skill: string[];
    country: string;
    city: string;
    created_at?: string;
    img?: string;
  };
};

const CandidateItem = ({ item }: CandidateItemProps) => {
  return (
    <div className="candidate-profile-card list-layout border-0 mb-25">
      <div className="d-flex">
        <div className="candidate-avatar online position-relative d-block me-auto ms-auto">
          <a href="#" className="rounded-circle">
            {/* <img
              src={item.img || "https://share.google/images/Lbox26Y4DHg7EWM7e"}
              alt="image"
              className="lazy-img rounded-circle"
              style={{ height: "auto" }}
              width={60}
              height={60}
              onError={(e) => {
                e.currentTarget.src = "https://share.google/images/Lbox26Y4DHg7EWM7e";
              }}
            /> */}
          </a>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <a href="#" className="tran3s">
                    {item.username}
                  </a>
                </h4>
                <div className="candidate-post">{item.email}</div>
                <ul className="candidate-skills style-none d-flex align-items-center">
                  {item.skill?.slice(0, 3).map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                  {item.skill?.length > 3 && (
                    <li className="more">{item.skill.length - 3}+</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Location</span>
                <div>
                  {item.city ? item.city + ", " : ""}
                  {item.country || "Not specified"}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Saved On</span>
                <div>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-md-end align-items-center">
                <a
                  href="#"
                  className="save-btn text-center rounded-circle tran3s mt-10 fw-normal"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <div className="action-dots float-end mt-10 ms-2">
                  <button
                    className="action-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span></span>
                  </button>
                  <ActionDropdown favoriteFreelancerId={item.favorite_freelancer_id} id={item.id} username={item.username} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateItem;
