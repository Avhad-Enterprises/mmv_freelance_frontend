// CandidateV1Area.tsx
import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import SaveCandidateLoginModal from "../../components/common/popup/save-candidate-login-modal";
import CandidateCard from "../candidate/candidate-card";

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

// Define props for the component
interface CandidateV1AreaProps {
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
}

const CandidateV1Area = ({ isAuthenticated, onLoginSuccess }: CandidateV1AreaProps) => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [candidateId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});

  // Filter states
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortValue, setSortValue] = useState("");

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentCandidates = Array.isArray(filteredCandidates)
    ? filteredCandidates.slice(indexOfFirst, indexOfLast)
    : [];
  const totalPages = Math.ceil(
    Array.isArray(filteredCandidates) ? filteredCandidates.length / ITEMS_PER_PAGE : 0
  );

  const loginModalRef = useRef<any>(null);

  // Fetch current user information when authenticated
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!isAuthenticated) {
        setCurrentUserId(null);
        setUserType(null);
        setSavedCandidates([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:8000/api/v1/users/me', {
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
          setUserType(data.data.userType);
          console.log('Current user ID:', data.data.user.user_id);
          console.log('Current user type:', data.data.userType);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated]);

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/freelancers/getfreelancers-public', {
          cache: 'no-cache' 
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch candidates: HTTP Status ${response.status}`);
        }
        
        const responseData = await response.json();
        const candidatesData = Array.isArray(responseData.data) ? responseData.data : [];
        setCandidates(candidatesData);
        setFilteredCandidates(candidatesData);
      } catch (err: any) {
        console.error("Error fetching candidates:", err);
        setError(`Error fetching candidates. Please try again later. Details: ${err.message}`);
        setCandidates([]);
        setFilteredCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Load saved candidates from localStorage when auth status changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && currentUserId && userType === 'CLIENT') {
        try {
          setLoadingFavorites(true);
          const token = localStorage.getItem('token');
          if (!token) {
            setLoadingFavorites(false);
            return;
          }

          // Fetch favorites from API
          console.log('Fetching favorites from API...');
          const response = await fetch('http://localhost:8000/api/v1/favorites/listfreelancers', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Favorites API Response:', result);
            console.log('Favorites data array:', result.data);
            
            if (result.data && Array.isArray(result.data)) {
              const savedIds: number[] = [];
              const favIds: { [key: number]: number } = {};
              
              result.data.forEach((fav: any) => {
                console.log('Processing favorite item:', fav);
                
                // Try different possible field names
                const freelancerId = fav.favorite_freelancer_id || fav.freelancer_id || fav.user_id;
                const favoriteRecordId = fav.favorite_id || fav.id;
                
                if (freelancerId) {
                  savedIds.push(freelancerId);
                  // Store the favorite record ID for deletion
                  if (favoriteRecordId) {
                    favIds[freelancerId] = favoriteRecordId;
                  }
                  console.log(`Found favorite: Freelancer ID ${freelancerId}, Record ID ${favoriteRecordId}`);
                }
              });
              
              setSavedCandidates(savedIds);
              setFavoriteIds(favIds);
              
              // Also save to localStorage
              localStorage.setItem(`savedCandidates_${currentUserId}`, JSON.stringify(savedIds));
              localStorage.setItem(`favoriteIds_${currentUserId}`, JSON.stringify(favIds));
              
              console.log('✅ Loaded favorites:', savedIds);
              console.log('✅ Loaded favorite IDs:', favIds);
            }
          } else {
            console.error('Failed to fetch favorites:', response.status);
            // Fallback to localStorage
            const saved = localStorage.getItem(`savedCandidates_${currentUserId}`);
            const ids = localStorage.getItem(`favoriteIds_${currentUserId}`);
            if (saved) {
              setSavedCandidates(JSON.parse(saved));
            }
            if (ids) {
              setFavoriteIds(JSON.parse(ids));
            }
          }
        } catch (err) {
          console.error('Error loading favorites:', err);
          // Fallback to localStorage
          const saved = localStorage.getItem(`savedCandidates_${currentUserId}`);
          const ids = localStorage.getItem(`favoriteIds_${currentUserId}`);
          if (saved) {
            setSavedCandidates(JSON.parse(saved));
          }
          if (ids) {
            setFavoriteIds(JSON.parse(ids));
          }
        } finally {
          setLoadingFavorites(false);
        }
      } else {
        setSavedCandidates([]);
        setFavoriteIds({});
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, currentUserId, userType]);

  // Initialize the Bootstrap modal instance
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initModal = async () => {
        const bootstrap = await import('bootstrap');
        const modalElement = document.getElementById('saveCandidateLoginModal');
        if (modalElement && !loginModalRef.current) {
          loginModalRef.current = new bootstrap.Modal(modalElement);
        } else if (!modalElement) {
          console.error('Modal element with ID saveCandidateLoginModal not found');
        }
      };
      initModal();
    }
  }, []);

  // Handle saving/unsaving a candidate
  const handleToggleSave = async (candidateId: number) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      if (loginModalRef.current) {
        loginModalRef.current.show();
      } else {
        console.error('Login modal not initialized');
      }
      return;
    }

    // Check if user is a CLIENT
    if (userType !== 'CLIENT') {
      toast.error('Only clients can save candidates. Please switch to a client account.');
      return;
    }

    // Check if user ID is available
    if (!currentUserId) {
      console.error('User ID not available');
      toast.error('Unable to save candidate. Please try logging in again.');
      return;
    }

    // Prevent double-clicking
    if (savingStates[candidateId]) {
      return;
    }

    const isSaved = savedCandidates.includes(candidateId);

    // Set saving state
    setSavingStates(prev => ({ ...prev, [candidateId]: true }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication required. Please log in again.');
        setSavingStates(prev => ({ ...prev, [candidateId]: false }));
        return;
      }

      if (isSaved) {
        // Remove from favorites using the API
        const favoriteId = favoriteIds[candidateId];
        
        if (!favoriteId) {
          console.error('No favorite ID found for candidate:', candidateId);
          // Still remove from local state
          setSavedCandidates(prev => {
            const newSaved = prev.filter(id => id !== candidateId);
            localStorage.setItem(`savedCandidates_${currentUserId}`, JSON.stringify(newSaved));
            return newSaved;
          });
          setFavoriteIds(prev => {
            const newIds = { ...prev };
            delete newIds[candidateId];
            localStorage.setItem(`favoriteIds_${currentUserId}`, JSON.stringify(newIds));
            return newIds;
          });
          return;
        }
        
        const removePayload = {
          id: favoriteId
        };
        
        console.log('Removing candidate from favorites:', removePayload);

        const response = await fetch('http://localhost:8000/api/v1/favorites/remove', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(removePayload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to remove candidate' }));
          console.error('Remove API Error:', errorData);
          console.error('Remove API Status:', response.status);
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response (Remove):', result);

        // Update local state - remove from saved
        setSavedCandidates(prev => {
          const newSaved = prev.filter(id => id !== candidateId);
          localStorage.setItem(`savedCandidates_${currentUserId}`, JSON.stringify(newSaved));
          return newSaved;
        });
        setFavoriteIds(prev => {
          const newIds = { ...prev };
          delete newIds[candidateId];
          localStorage.setItem(`favoriteIds_${currentUserId}`, JSON.stringify(newIds));
          return newIds;
        });
        toast.success('Candidate removed from favorites');
        console.log(`Candidate ${candidateId} removed from favorites successfully`);
      } else {
        // Add to favorites using the API
        const addPayload = {
          user_id: currentUserId,
          freelancer_id: candidateId,
          created_by: currentUserId
        };
        
        console.log('Adding candidate to favorites:', addPayload);

        const response = await fetch('http://localhost:8000/api/v1/favorites/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addPayload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to save candidate' }));
          console.error('Add API Error:', errorData);
          
          // If already in favorites, just update local state
          if (errorData.message && errorData.message.includes('already in favorites')) {
            console.log('Candidate already in favorites, updating local state');
            setSavedCandidates(prev => {
              const newSaved = [...prev, candidateId];
              localStorage.setItem(`savedCandidates_${currentUserId}`, JSON.stringify(newSaved));
              return newSaved;
            });
            return;
          }
          
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response (Add):', result);

        // Extract the favorite ID from the response
        const favoriteId = result.data?.favorite_id || result.data?.id || result.id;
        console.log('Favorite ID from API:', favoriteId);

        // Update local state - add to saved
        setSavedCandidates(prev => {
          const newSaved = [...prev, candidateId];
          localStorage.setItem(`savedCandidates_${currentUserId}`, JSON.stringify(newSaved));
          return newSaved;
        });
        
        // Store the favorite ID for later removal
        if (favoriteId) {
          setFavoriteIds(prev => {
            const newIds = { ...prev, [candidateId]: favoriteId };
            localStorage.setItem(`favoriteIds_${currentUserId}`, JSON.stringify(newIds));
            return newIds;
          });
        }
        
        toast.success('Candidate added to favorites');
        console.log(`Candidate ${candidateId} added to favorites successfully`);
      }
    } catch (err: any) {
      console.error('Error toggling save:', err);
      toast.error(`Failed to ${isSaved ? 'remove' : 'save'} candidate: ${err.message}`);
    } finally {
      // Clear saving state
      setSavingStates(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  // Handle successful login from the modal
  const handleLoginSuccess = () => {
    console.log('handleLoginSuccess called');
    if (loginModalRef.current) {
      loginModalRef.current.hide();
    } else {
      console.error('Modal ref not initialized when calling handleLoginSuccess');
    }
    onLoginSuccess();
  };

  // Apply skill and location filters
  const applyFilters = () => {
    let filtered = [...candidates];

    if (selectedSkill) {
      filtered = filtered.filter(c => c.skills.includes(selectedSkill));
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        c => c.city && c.country && `${c.city}, ${c.country}` === selectedLocation
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedSkill("");
    setSelectedLocation("");
    setFilteredCandidates(candidates);
    setCurrentPage(1);
  };

  // Handle sorting of candidates
  const handleSort = (value: string) => {
    setSortValue(value);
    let sorted = [...filteredCandidates];

    switch (value) {
      case "rate-low":
        sorted.sort((a, b) => parseFloat(a.rate_amount) - parseFloat(b.rate_amount));
        break;
      case "rate-high":
        sorted.sort((a, b) => parseFloat(b.rate_amount) - parseFloat(a.rate_amount));
        break;
      case "name":
        sorted.sort((a, b) => a.first_name.localeCompare(b.first_name));
        break;
      default:
        break;
    }
    setFilteredCandidates(sorted);
  };

  // Extract unique skills and locations for filter dropdowns
  const allSkills = Array.from(
    new Set(candidates.flatMap(c => c.skills))
  );

  const allLocations = Array.from(
    new Set(candidates
      .filter(c => c.city && c.country)
      .map(c => `${c.city}, ${c.country}`))
  );

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <section className="candidates-profile pt-5 pb-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Find Candidates</h2>
                {isAuthenticated && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success">✓ Logged In</span>
                    {userType && (
                      <span className={`badge ${userType === 'CLIENT' ? 'bg-primary' : 'bg-secondary'}`}>
                        {userType}
                      </span>
                    )}
                    {loadingFavorites && (
                      <span className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading favorites...</span>
                      </span>
                    )}
                    {currentUserId && (
                      <span className="text-muted small">User ID: {currentUserId}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            {/* Filter Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="filter-area p-3 border rounded bg-light">
                <h5 className="mb-3">Filters</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Skill</label>
                  <select
                    className="form-select"
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option value="">All Skills</option>
                    {allSkills.map((skill, idx) => (
                      <option key={idx} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Location</label>
                  <select
                    className="form-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {allLocations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>

                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Candidate List */}
            <div className="col-lg-9">
              {/* Top Controls */}
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="mb-2 mb-sm-0">
                  {loading ? (
                    <span>Loading candidates...</span>
                  ) : (
                    <>
                      <span className="fw-bold">{filteredCandidates.length}</span> candidates found
                      {savedCandidates.length > 0 && userType === 'CLIENT' && (
                        <span className="text-muted ms-2">
                          ({savedCandidates.length} saved)
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                <div className="d-flex gap-2">
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={sortValue}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">Sort By</option>
                    <option value="rate-low">Rate: Low to High</option>
                    <option value="rate-high">Rate: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>

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

              {/* Candidates Display */}
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-5">
                  <h4>Error</h4>
                  <p>{error}</p>
                </div>
              ) : currentCandidates.length === 0 ? (
                <div className="text-center p-5">
                  <h4>No candidates found</h4>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                <div className={viewType === 'grid' ? 'row' : ''}>
                  {currentCandidates.map(candidate => (
                    <div 
                      key={candidate.user_id} 
                      className={viewType === 'grid' ? 'col-md-6 col-lg-6 mb-4' : 'col-12 mb-3'}
                    >
                      <CandidateCard
                        candidate={candidate}
                        isSaved={savedCandidates.includes(candidate.user_id)}
                        onToggleSave={handleToggleSave}
                        viewType={viewType}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}

              {!loading && (
                <div className="text-center mt-3 text-muted">
                  Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredCandidates.length)} of {filteredCandidates.length} candidates
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SaveCandidateLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default CandidateV1Area;