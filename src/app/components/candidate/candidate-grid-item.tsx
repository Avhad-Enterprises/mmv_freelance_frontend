import React from "react";
import Link from "next/link";
import AuthenticatedImage from "@/app/components/common/AuthenticatedImage";

type Candidate = {
  user_id: number;
  favorite?: boolean;
  post: any;
  salary_duration?: any;
  username: any;
  first_name: string;
  last_name: string;
  city: string | null;
  country: string | null;
  profile_picture?: string;
  skill?: {
    languages?: string[];
  };
  budget?: number;
};

interface CandidateGridItemProps {
  item: Candidate;
  style_2?: boolean;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
}

const CandidateGridItem: React.FC<CandidateGridItemProps> = ({
  item,
  style_2 = false,
  isSaved,
  onToggleSave,
}) => {
  return (
    <div
      className={`candidate-profile-card text-center grid-layout mb-25`}
    >
      {/* Heart Save Button */}
      <button
        type="button"
        className="save-btn tran3s"
        onClick={() => onToggleSave(item.user_id)}
      >
        <i
          className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart"}`}
        ></i>
      </button>

      <div className="cadidate-avatar online position-relative d-block m-auto">
        <Link href="/candidate-profile-v1" className="rounded-circle">
          <AuthenticatedImage
            src={item.profile_picture}
            alt="Candidate"
            width={80}
            height={80}
            className="lazy-img rounded-circle"
            unoptimized
            fallbackSrc="/images/default-avatar.png"
          />
        </Link>
      </div>

      <h4 className="candidate-name mt-15 mb-0">
        <Link href="/candidate-profile-v1" className="tran3s">
          {item.first_name} {item.last_name}
        </Link>
      </h4>
      <div className="candidate-post">
        {typeof item.post === "string"
          ? item.post
          : item.post?.languages || "N/A"}
      </div>

      <ul className="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center pt-30 sm-pt-20 pb-10">
        {(item.skill?.languages ?? []).slice(0, 1).map((lang, i) => (
          <li key={i}>{lang}</li>
        ))}
        {(item.skill?.languages?.length ?? 0) > 1 && (
          <li className="more">{(item.skill?.languages?.length ?? 0) - 1}+</li>
        )}
      </ul>



      <div className="row gx-1">
        <div className="col-6">
          <div className="candidate-info mt-10">
            <span>Budget</span>
            <div>{item.budget ? `${item.budget} / month` : "Negotiable"}</div>
          </div>
        </div>
        <div className="col-6">
          <div className="candidate-info mt-10">
            <span>Location</span>
            <div>{`${item.city || "Unknown"}, ${item.country || "Unknown"}`}</div>
          </div>
        </div>
      </div>

      <div className="row gx-2 pt-25 sm-pt-10">
        <div className="col-12">
          <Link
            href={`/candidate-profile-v1/${item.username}`}
            className="profile-btn tran3s w-100 mt-5"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateGridItem;
