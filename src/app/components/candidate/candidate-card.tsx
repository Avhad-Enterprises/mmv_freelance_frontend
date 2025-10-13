import React from 'react';

// Define the structure of a candidate object for type safety
interface Candidate {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string;
  bio: string | null;
  city: string | null;
  country: string | null;
  skills: string[];
  superpowers: string[];
  languages: string[];
  portfolio_links: string[];
  rate_amount: string;
  currency: string;
  availability: string;
}

// Define the props for the CandidateCard component
interface CandidateCardProps {
  candidate: Candidate;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  viewType: 'grid' | 'list';
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  isSaved, 
  onToggleSave, 
  viewType 
}) => {
  // FIX: Added logic to format availability text and determine badge color
  const availabilityText = candidate.availability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const availabilityClass = candidate.availability === 'full_time' 
    ? 'badge bg-success bg-opacity-10 text-success-emphasis border border-success-subtle' 
    : 'badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle';

  return (
    <div className={`candidate-card h-100 mb-4 p-3 border rounded ${viewType === 'list' ? 'w-100' : ''}`}>
      <div className="d-flex align-items-start h-100">
        <img
          src={candidate.profile_picture}
          alt={`${candidate.first_name} ${candidate.last_name}`.trim()}
          className="rounded-circle me-3"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
        />
        
        <div className="flex-grow-1 d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1 overflow-hidden me-2">
              <h5 className="mb-1 text-truncate" title={`${candidate.first_name} ${candidate.last_name}`.trim()}>
                {candidate.first_name} {candidate.last_name}
              </h5>
              <p className="text-muted mb-1 text-truncate" title={candidate.username}>{candidate.username}</p>
              <p className="text-muted mb-2 text-truncate">
                📍 {candidate.city && candidate.country ? `${candidate.city}, ${candidate.country}` : 'Location not specified'}
              </p>
            </div>
            
            <button
              onClick={() => onToggleSave(candidate.user_id)}
              className={`btn ${isSaved ? 'btn-danger' : 'btn-outline-secondary'} btn-sm`}
              title={isSaved ? 'Unsave' : 'Save'}
            >
              {isSaved ? '❤️' : '🤍'}
            </button>
          </div>
          
          <div className="flex-grow-1">
            {candidate.bio && <p className="mb-2">{candidate.bio}</p>}
            
            <div className="mb-2">
              <strong>Skills:</strong>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {candidate.skills.length > 0 ? (
                  candidate.skills.map((skill, idx) => (
                    <span key={idx} className="badge bg-primary">{skill}</span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>
            </div>

            <div className="mb-2">
              <strong>Superpowers:</strong>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {candidate.superpowers.length > 0 ? (
                  candidate.superpowers.map((power, idx) => (
                    <span key={idx} className="badge bg-success">{power}</span>
                  ))
                ) : (
                  <span className="text-muted">No superpowers listed</span>
                )}
              </div>
            </div>

            <div className="mb-2">
              <strong>Languages:</strong>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {candidate.languages.length > 0 ? (
                  candidate.languages.map((lang, idx) => (
                    <span key={idx} className="badge bg-info">{lang}</span>
                  ))
                ) : (
                  <span className="text-muted">No languages listed</span>
                )}
              </div>
            </div>

            <div className="mb-2">
              <strong>Portfolio:</strong>
              <div className="d-flex flex-wrap gap-2 mt-1">
                {candidate.portfolio_links.length > 0 ? (
                  candidate.portfolio_links.map((link, idx) => (
                    <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="text-primary">
                      Link {idx + 1}
                    </a>
                  ))
                ) : (
                  <span className="text-muted">No portfolio links</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-auto pt-2">
            {/* FIX: Replaced the simple text with a styled Bootstrap badge */}
            <span className={availabilityClass} style={{ fontSize: '0.8rem', padding: '0.4em 0.6em' }}>
              {availabilityText}
            </span>
            <span className="fw-bold text-success text-nowrap">{candidate.rate_amount} {candidate.currency}/hour</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;