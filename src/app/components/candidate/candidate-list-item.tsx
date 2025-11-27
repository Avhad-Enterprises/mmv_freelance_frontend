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
      <div className="d-flex align-items-start">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto" style={{ flexShrink: 0 }}>
          <Link href={`/freelancer-profile/${item.user_id}`} className="rounded-circle">
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
        <div className="right-side" style={{ width: '100%', paddingLeft: '30px' }}>
          {/* First Row: Name, Budget, Location, Actions */}
          <div className="row gx-2 align-items-center mb-2">
            <div className="col-xl-3 col-md-12 mb-xl-0 mb-2">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link href={`/freelancer-profile/${item.user_id}`} className="tran3s">
                    {item.first_name} {item.last_name}
                  </Link>
                </h4>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 mb-xl-0 mb-2">
              <div className="candidate-info">
                <span>Budget</span>
                <div>{item.budget}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4 col-sm-6 mb-xl-0 mb-2">
              <div className="candidate-info">
                <span>Location</span>
                <div>{item.city && item.country ? `${item.city}, ${item.country}` : 'N/A'}</div>
              </div>
            </div>

            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end align-items-center flex-wrap gap-2">
                <button
                  type="button"
                  className="save-btn text-center rounded-circle tran3s"
                  onClick={() => onToggleSave(item.user_id)}
                  title={isSaved ? "Unsave" : "Save"}
                  style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <i className={`bi ${isSaved ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                </button>
                <Link
                  href={`/freelancer-profile/${item.user_id}`} 
                  className="profile-btn tran3s ms-md-2"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Second Row: Skills */}
          <div className="row">
            <div className="col-12">
              <ul className="cadidate-skills style-none d-flex align-items-center flex-wrap" style={{ gap: '6px' }}>
                {item.skill && item.skill.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-nowrap">{s}</li>
                ))}
                {item.skill && item.skill.length > 3 && (
                  <li className="more">+{item.skill.length - 3}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateListItem;