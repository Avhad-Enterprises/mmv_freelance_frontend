"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

// The props interface is updated to include the onViewProfile function
interface CandidateListItemProps {
  item: MappedCandidate;
  isSaved: boolean;
  onToggleSave: (id: number) => void | Promise<void>;
  onViewProfile: (id: number) => void; // <-- ADDED: Prop to handle profile view
  onMessage?: (id: number) => void; // optional chat handler
}

const CandidateListItem: React.FC<CandidateListItemProps> = ({
  item,
  isSaved,
  onToggleSave,
  onViewProfile, // <-- ADDED: Destructure the new prop
  onMessage, // <-- ADDED: Message (chat) handler
}) => {
  // Get initials for fallback avatar
  const getInitials = () => {
    const first = item.first_name?.charAt(0) || '';
    const last = item.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <div className="candidate-profile-card position-relative list-layout mb-25">
      <div className="d-flex align-items-start">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto" style={{ flexShrink: 0 }}>
          {/* This link can remain for SEO purposes or right-click behavior, but the main action is the button */}
          <div className="rounded-circle">
            {item.profile_picture ? (
              <img
                src={item.profile_picture}
                alt={`${item.first_name} ${item.last_name}`}
                width={80}
                height={80}
                className="lazy-img rounded-circle"
                style={{ objectFit: 'cover', width: '80px', height: '80px' }}
                onError={(e) => {
                  // On error, replace with initials avatar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.initials-avatar')) {
                    const initialsDiv = document.createElement('div');
                    initialsDiv.className = 'initials-avatar rounded-circle d-flex align-items-center justify-content-center';
                    initialsDiv.style.cssText = 'width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 24px; font-weight: bold;';
                    initialsDiv.textContent = getInitials();
                    parent.appendChild(initialsDiv);
                  }
                }}
              />
            ) : (
              <div 
                className="initials-avatar rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              >
                {getInitials()}
              </div>
            )}
          </div>
        </div>
        <div className="right-side" style={{ width: '100%', paddingLeft: '30px' }}>
          {/* First Row: Name, Budget, Location, Actions */}
          <div className="row gx-2 align-items-center mb-2">
            <div className="col-xl-3 col-md-12 mb-xl-0 mb-2">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <span className="tran3s">
                    {item.first_name} {item.last_name}
                  </span>
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
                
                {/* MODIFIED: Changed from a Link to a button to trigger the in-page view */}
                <button
                  type="button"
                  onClick={() => onViewProfile(item.user_id)} 
                  className="profile-btn tran3s ms-md-2"
                >
                  View Profile
                </button>
                {/* Chat button */}
                <button
                  type="button"
                  onClick={() => onMessage?.(item.user_id)}
                  className="chat-btn tran3s ms-2"
                  title="Message"
                  style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <i className="bi bi-chat-dots" style={{ fontSize: '18px' }}></i>
                </button>
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
