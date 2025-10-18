"use client";
import React, { useEffect, useState } from "react";
import CandidateCard from "../../candidate/candidate-card";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

interface SavedCandidate {
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

const SavedCandidateArea = ({ setIsOpenSidebar }: IProps) => {
  const [savedCandidates, setSavedCandidates] = useState<SavedCandidate[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view saved candidates');
          setLoading(false);
          return;
        }

        const response = await fetch('https://api.makemyvid.io/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        if (data.success && data.data.user) {
          setCurrentUserId(data.data.user.user_id);
        }
      } catch (err: any) {
        console.error('Error fetching current user:', err);
        setError('Failed to load user information');
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch saved candidates
  useEffect(() => {
    const fetchSavedCandidates = async () => {
      if (!currentUserId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          return;
        }

        // Fetch favorites list
        const favoritesResponse = await fetch('https://api.makemyvid.io/api/v1/favorites/listfreelancers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!favoritesResponse.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const favoritesData = await favoritesResponse.json();
        console.log('Favorites Response:', favoritesData);

        if (!favoritesData.data || favoritesData.data.length === 0) {
          setSavedCandidates([]);
          setLoading(false);
          return;
        }

        // Extract freelancer IDs and favorite record IDs
        const freelancerIds: number[] = [];
        const favIds: { [key: number]: number } = {};

        favoritesData.data.forEach((fav: any) => {
          const freelancerId = fav.freelancer_id || fav.favorite_freelancer_id;
          const favoriteRecordId = fav.favorite_id || fav.id;
          
          if (freelancerId) {
            freelancerIds.push(freelancerId);
            if (favoriteRecordId) {
              favIds[freelancerId] = favoriteRecordId;
            }
          }
        });

        setFavoriteIds(favIds);

        // Fetch full candidate details
        const candidatesResponse = await fetch('https://api.makemyvid.io/api/v1/freelancers/getfreelancers-public', {
          cache: 'no-cache'
        });

        if (!candidatesResponse.ok) {
          throw new Error('Failed to fetch candidates');
        }

        const candidatesData = await candidatesResponse.json();
        const allCandidates = Array.isArray(candidatesData.data) ? candidatesData.data : [];

        // Filter to only saved candidates
        const saved = allCandidates.filter((candidate: SavedCandidate) => 
          freelancerIds.includes(candidate.user_id)
        );

        setSavedCandidates(saved);
        console.log('Loaded saved candidates:', saved);
      } catch (err: any) {
        console.error('Error fetching saved candidates:', err);
        setError(`Failed to load saved candidates: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCandidates();
  }, [currentUserId]);

  // Handle removing a candidate from favorites
  const handleRemoveFavorite = async (candidateId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const favoriteId = favoriteIds[candidateId];
      if (!favoriteId) {
        console.error('No favorite ID found for candidate:', candidateId);
        // Still remove from UI
        setSavedCandidates(prev => prev.filter(c => c.user_id !== candidateId));
        return;
      }

      const response = await fetch('https://api.makemyvid.io/api/v1/favorites/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: favoriteId })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove candidate' }));
        throw new Error(errorData.message || 'Failed to remove from favorites');
      }

      // Remove from UI
      setSavedCandidates(prev => prev.filter(c => c.user_id !== candidateId));
      setFavoriteIds(prev => {
        const newIds = { ...prev };
        delete newIds[candidateId];
        return newIds;
      });

      console.log('Candidate removed from favorites');
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      alert(`Failed to remove candidate: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="main-title m-0">Saved Candidates</h2>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewType('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              className={`btn btn-sm ${viewType === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setViewType('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>

        <div className="wrapper">
          {loading && (
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading saved candidates...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && savedCandidates.length === 0 && (
            <div className="text-center p-5">
              <h4>No saved candidates yet</h4>
              <p className="text-muted">
                Start exploring candidates and save your favorites!
              </p>
            </div>
          )}

          {!loading && !error && savedCandidates.length > 0 && (
            <>
              <div className="mb-3">
                <span className="fw-bold">{savedCandidates.length}</span> saved candidate{savedCandidates.length !== 1 ? 's' : ''}
              </div>
              
              <div className={viewType === 'grid' ? 'row' : ''}>
                {savedCandidates.map((candidate) => (
                  <div 
                    key={candidate.user_id} 
                    className={viewType === 'grid' ? 'col-md-6 col-lg-6 mb-4' : 'col-12 mb-3'}
                  >
                    <CandidateCard
                      candidate={candidate}
                      isSaved={true}
                      onToggleSave={handleRemoveFavorite}
                      viewType={viewType}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCandidateArea;