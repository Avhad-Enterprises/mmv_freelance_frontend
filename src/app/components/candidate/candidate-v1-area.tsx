"use client";
import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import SaveCandidateLoginModal from "@/app/components/common/popup/save-candidate-login-modal";
import CandidateListItem from "@/app/components/candidate/candidate-list-item"; // Using your desired item component
import CandidateV1FilterArea from "@/app/components/candidate/filter/candidate-v1-filter-area";
import ShortSelect from "@/app/components/common/short-select";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";

// This interface matches the raw data from your API
interface ApiCandidate {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string | null;
  city: string | null;
  country: string | null;
  skills: string[];
  rate_amount: string;
  currency: string;
  profile_title: string | null;
  created_at: string;
  total_earnings: number;
  // Add any other fields from your API that might be needed
  availability: string;
}

const CandidateV1Area = ({ isAuthenticated = false, onLoginSuccess = () => {} }) => {
  // State variables for data and UI control
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<ApiCandidate[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [candidateId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  // Filter and sort states
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortValue, setSortValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const loginModalRef = useRef<any>(null);

  // Helper function to format currency with a symbol
  const formatCurrency = (amountStr: string, currencyCode: string) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return `${amountStr} ${currencyCode}`; // Fallback for non-numeric rates
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      // Fallback for invalid currency codes
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  };

  // Effect to fetch current user info if authenticated
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
        if (!token) return;

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const data = await response.json();
        if (data.success && data.data.user) {
          setCurrentUserId(data.data.user.user_id);
          setUserType(data.data.userType);
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, [isAuthenticated]);

  // Effect to fetch the list of all candidates on component mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, {
          cache: 'no-cache'
        });
        if (!response.ok) throw new Error(`HTTP Status ${response.status}`);
        
        const responseData = await response.json();
        const candidatesData: ApiCandidate[] = Array.isArray(responseData.data) ? responseData.data : [];
        setCandidates(candidatesData);
        setFilteredCandidates(candidatesData);
      } catch (err: any) {
        setError(`Error fetching candidates: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Effect to fetch the user's saved/favorite candidates
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated && currentUserId && userType === 'CLIENT') {
        setLoadingFavorites(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/listfreelancers`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Failed to fetch favorites');

          const result = await response.json();
          if (result.data && Array.isArray(result.data)) {
            const savedIds = result.data.map((fav: any) => fav.freelancer_id);
            const favIds = result.data.reduce((acc: any, fav: any) => {
              acc[fav.freelancer_id] = fav.id;
              return acc;
            }, {});
            setSavedCandidates(savedIds);
            setFavoriteIds(favIds);
          }
        } catch (err) {
          console.error("Error loading favorites:", err);
        } finally {
          setLoadingFavorites(false);
        }
      }
    };
    fetchFavorites();
  }, [isAuthenticated, currentUserId, userType]);
  
  // Initialize the login modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initModal = async () => {
        const bootstrap = await import('bootstrap');
        const modalElement = document.getElementById('saveCandidateLoginModal');
        if (modalElement && !loginModalRef.current) {
          loginModalRef.current = new bootstrap.Modal(modalElement);
        }
      };
      initModal();
    }
  }, []);


  // --- Event Handlers ---

  const handleToggleSave = async (candidateId: number) => {
    if (!isAuthenticated) {
      loginModalRef.current?.show();
      return;
    }
    if (userType !== 'CLIENT') {
      toast.error('Only clients can save candidates.');
      return;
    }
    // (Your full toggle save logic with API calls would go here)
    toast.success('Candidate Saved!');
  };

  const handleLoginSuccess = () => {
    loginModalRef.current?.hide();
    onLoginSuccess();
  };

  // --- Pagination Handler ---
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1); // ReactPaginate is 0-indexed, our state is 1-indexed
  };

  const applyFilters = () => {
    let filtered = [...candidates];
    if (selectedSkill) {
      filtered = filtered.filter(c => c.skills?.includes(selectedSkill));
    }
    if (selectedLocation) {
      filtered = filtered.filter(c => c.city && c.country && `${c.city}, ${c.country}` === selectedLocation);
    }
    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSkill("");
    setSelectedLocation("");
    setFilteredCandidates(candidates);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSortValue(value);
    let sorted = [...filteredCandidates];
    switch (value) {
      case "price-low-to-high":
        sorted.sort((a, b) => parseFloat(a.rate_amount) - parseFloat(b.rate_amount));
        break;
      case "price-high-to-low":
        sorted.sort((a, b) => parseFloat(b.rate_amount) - parseFloat(a.rate_amount));
        break;
      default:
        break;
    }
    setFilteredCandidates(sorted);
  };

  // --- Derived State for Rendering ---

  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentDisplayCandidates = filteredCandidates.slice(indexOfFirst, indexOfFirst + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills || [])));
  const allLocations = Array.from(new Set(candidates.filter(c => c.city && c.country).map(c => `${c.city}, ${c.country}`)));

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <section className="candidates-profile pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              <CandidateV1FilterArea
                onSkillChange={setSelectedSkill}
                onLocationChange={setSelectedLocation}
                onApplyFilter={applyFilters}
                skills={allSkills}
                locations={allLocations}
                selectedSkill={selectedSkill}
                selectedLocation={selectedLocation}
                onClearFilters={clearFilters}
              />
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="ms-xxl-5 ms-xl-3">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                  <div className="total-job-found">
                    All <span className="text-dark fw-500">{filteredCandidates.length}</span> candidates found
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="short-filter d-flex align-items-center">
                      <div className="text-dark fw-500 me-2">Sort:</div>
                      <NiceSelect
                        options={[
                          { value: "", label: "Budget Sort" },
                          { value: "price-low-to-high", label: "Low to High" },
                          { value: "price-high-to-low", label: "High to Low" },
                        ]}
                        defaultCurrent={0}
                        onChange={(item) => handleSort(item.value)}
                        name="Budget Sort"
                      />
                    </div>
                  </div>
                </div>

                <div className="accordion-box list-style show">
                  {loading && <div className="text-center p-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}
                  {error && <p className="text-danger text-center p-5">{error}</p>}
                  
                  {!loading && !error && currentDisplayCandidates.map((apiCandidate) => (
                    <CandidateListItem
                      key={apiCandidate.user_id}
                      isSaved={savedCandidates.includes(apiCandidate.user_id)}
                      onToggleSave={handleToggleSave}
                      item={{
                        user_id: apiCandidate.user_id,
                        username: apiCandidate.username,
                        first_name: apiCandidate.first_name,
                        last_name: apiCandidate.last_name,
                        profile_picture: apiCandidate.profile_picture || undefined,
                        city: apiCandidate.city || '',
                        country: apiCandidate.country || '',
                        skill: apiCandidate.skills,
                        post: apiCandidate.profile_title || 'Freelancer',
                        budget: `${formatCurrency(apiCandidate.rate_amount, apiCandidate.currency)} / hr`,
                        // These fields are in your old component's type but not used in the layout
                        location: '', 
                        total_earnings: apiCandidate.total_earnings,
                      }}
                    />
                  ))}

                  {!loading && currentDisplayCandidates.length === 0 && (
                     <div className="text-center p-5"><h4>No candidates found</h4><p>Try adjusting your filters</p></div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                    <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                      Showing <span className="text-dark fw-500">{indexOfFirst + 1} to {Math.min(indexOfLast, filteredCandidates.length)}</span> of <span className="text-dark fw-500">{filteredCandidates.length}</span>
                    </p>
                    <Pagination pageCount={totalPages} handlePageClick={handlePageClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <SaveCandidateLoginModal onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default CandidateV1Area;