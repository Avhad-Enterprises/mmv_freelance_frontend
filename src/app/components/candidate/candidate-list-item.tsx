import React from "react";
import Image from "next/image";
import Link from "next/link";

type Candidate = {
  user_id: number;
  username: any;
  first_name: string;
  last_name: string;
  location: string;
  city: string;
  country: string;
  profile_picture?: string;
  skill?: any[];
  total_earnings: number;
  favorite?: boolean;
  post: any;
  budget: any;
};

interface CandidateListItemProps {
  item: Candidate;
  style_2?: boolean;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

const CandidateListItem: React.FC<CandidateListItemProps> = ({
  item,
  style_2 = false,
  isSaved,
  onToggleSave,
}) => {
  return (
    <div
      className={`candidate-profile-card ${isSaved ? "favourite" : ""} ${style_2 ? "border-0" : ""
        } list-layout mb-25`}
    >
      <div className="d-flex">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
          <Link href="/candidate-profile-v2" className="rounded-circle">
            <Image
              src={item.profile_picture || "/images/default-avatar.png"}
              alt="Candidate"
              width={80}
              height={80}
              className="lazy-img rounded-circle"
              unoptimized
            />
          </Link>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link href="/candidate-profile-v2" className="tran3s">
                    {item.first_name} {item.last_name}
                  </Link>
                </h4>
                <div className="candidate-post">{item.post}</div>
                <ul className="cadidate-skills style-none d-flex align-items-center">
                  {Array.isArray(item.skill) &&
                    item.skill.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}

                  {Array.isArray(item.skill) && item.skill.length > 3 && (
                    <li>+{item.skill.length - 3}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Budget</span>
                <div>
                  {item.budget ? `${item.budget} / month` : "Negotiable"}
                </div>
              </div>
            </div>


            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Location</span>
                <div>{`${item.city}, ${item.country}`}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end">
                {/*Heart Save Button */}
                <button
                  type="button"
                  className="save-btn text-center rounded-circle tran3s mt-10"
                  onClick={() => onToggleSave(item.user_id)}
                >
                  <i
                    className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart"
                      }`}
                  ></i>
                </button>

                <Link
                  href={`/candidate-profile/${item.username}`}
                  className="profile-btn tran3s ms-md-2 mt-10 sm-mt-20"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateListItem;
