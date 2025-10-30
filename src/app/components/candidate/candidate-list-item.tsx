// app/components/candidate/candidate-list-item.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import AuthenticatedImage from '@/app/components/common/AuthenticatedImage';

// Interface defining the props for this component
interface MappedCandidate {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  profile_picture?: string;
  skill?: string[];
  location: string;
  post: string;
  budget: string;
  total_earnings: number;
}

interface CandidateListItemProps {
  item: MappedCandidate;
  isSaved: boolean;
  onToggleSave: (id: number) => void | Promise<void>;
}

const CandidateListItem: React.FC<CandidateListItemProps> = ({
  item,
  isSaved,
  onToggleSave,
}) => {
  return (
    // ✅ MODIFIED: Removed the "favourite" class logic to hide the corner badge
    <div className="candidate-profile-card position-relative list-layout mb-25">
      <div className="d-flex">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
          <Link href={`/candidate-profile-v1/${item.user_id}`} className="rounded-circle">
            <AuthenticatedImage
              src={item.profile_picture}
              alt="Candidate"
              width={80}
              height={80}
              className="lazy-img rounded-circle"
              style={{ objectFit: 'cover' }}
              unoptimized
              fallbackSrc="/images/default-avatar.png"
            />
          </Link>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link href={`/candidate-profile-v1/${item.user_id}`} className="tran3s">
                    {item.first_name} {item.last_name}
                  </Link>
                </h4>
                
                <ul className="cadidate-skills style-none d-flex align-items-center">
                  {item.skill && item.skill.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-nowrap">{s}</li>
                  ))}
                  {item.skill && item.skill.length > 3 && (
                    <li className="more">+{item.skill.length - 3}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Budget</span>
                <div>{item.budget}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Location</span>
                <div>{item.city && item.country ? `${item.city}, ${item.country}` : 'N/A'}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end align-items-center">
                <button
                  type="button"
                  className="save-btn text-center rounded-circle tran3s"
                  onClick={() => onToggleSave(item.user_id)}
                  title={isSaved ? "Unsave" : "Save"}
                >
                  <i className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                </button>
                <Link
                  href={`/candidate-profile-v1/${item.user_id}`} 
                  className="profile-btn tran3s ms-md-2"
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