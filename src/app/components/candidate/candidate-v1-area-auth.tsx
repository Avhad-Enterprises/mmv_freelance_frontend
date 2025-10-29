"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from 'react-hot-toast';
import DashboardHeader from "../dashboard/candidate/dashboard-header";
import CandidateListItem from "@/app/components/candidate/candidate-list-item-sidebar";
import CandidateV1FilterArea from "@/app/components/candidate/filter/candidate-v1-filter-area-hori";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import { IFreelancer } from "@/app/candidate-profile-v1/[id]/page";

// This interface matches the raw data from your API
interface ApiCandidate {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string | null;
  bio: string | null;
  timezone: string | null;
  address_line_first: string | null;
  address_line_second: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  is_banned: boolean;
  is_deleted: boolean;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
  freelancer_id: number;
  profile_title: string | null;
  role: string | null;
  short_description: string | null;
  experience_level: string | null;
  skills: string[];
  superpowers: string[];
  skill_tags: string[];
  base_skills: string[];
  languages: string[];
  portfolio_links: string[];
  certification: any;
  education: any;
  previous_works: any;
  services: any;
  rate_amount: string;
  currency: string;
  availability: string;
  work_type: string | null;
  hours_per_week: number | null;
  id_type: string | null;
  id_document_url: string | null;
  kyc_verified: boolean;
  aadhaar_verification: boolean;
  hire_count: number;
  review_id: number;
  total_earnings: number;
  time_spent: number;
  projects_applied: any[];
  projects_completed: any[];
  payment_method: any;
  bank_account_info: any;
  role_name: string | null;
  experience: any; 
}


const CandidateV1Area = () => {
  // State variables for data and UI control
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<ApiCandidate[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [candidateId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for viewing a single candidate profile
  const [selectedFreelancer, setSelectedFreelancer] = useState<IFreelancer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Filter and sort states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSuperpowers, setSelectedSuperpowers] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Helper function to format currency
  const formatCurrency = (amountStr: string, currencyCode: string) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return `${amountStr} ${currencyCode}`;
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 2 }).format(amount);
    } catch (e) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  };

  // Helper function to map ApiCandidate to IFreelancer
  const mapApiCandidateToIFreelancer = useCallback((apiCandidate: ApiCandidate): IFreelancer => {
    const youtubeVideos = (apiCandidate.portfolio_links || [])
      .filter(link => link.includes("youtube.com/watch?v="))
      .map(link => {
        const videoId = link.split('v=')[1]?.split('&')[0] || '';
        return { id: videoId, url: link };
      })
      .filter(video => video.id !== '');

    return {
      user_id: apiCandidate.user_id,
      first_name: apiCandidate.first_name,
      last_name: apiCandidate.last_name,
      bio: apiCandidate.bio || apiCandidate.short_description || null,
      profile_picture: apiCandidate.profile_picture || null,
      skills: apiCandidate.skills || [],
      superpowers: apiCandidate.superpowers || [],
      languages: apiCandidate.languages || [],
      city: apiCandidate.city || null,
      country: apiCandidate.country || null,
      email: `${apiCandidate.username || 'unknown'}@example.com`,
      rate_amount: apiCandidate.rate_amount || "0.00",
      currency: apiCandidate.currency || "USD",
      availability: apiCandidate.availability || "not specified",
      latitude: apiCandidate.latitude || null,
      longitude: apiCandidate.longitude || null,
      profile_title: apiCandidate.profile_title || null,
      short_description: apiCandidate.short_description || null,
      youtube_videos: youtubeVideos,
      experience_level: apiCandidate.experience_level || null,
      work_type: apiCandidate.work_type || null,
      hours_per_week: apiCandidate.hours_per_week || null,
      kyc_verified: apiCandidate.kyc_verified,
      aadhaar_verification: apiCandidate.aadhaar_verification,
      hire_count: apiCandidate.hire_count,
      review_id: apiCandidate.review_id,
      total_earnings: apiCandidate.total_earnings,
      time_spent: apiCandidate.time_spent,
      role_name: apiCandidate.role_name || null,
      experience: apiCandidate.experience || [],
      education: apiCandidate.education || [],
      previous_works: apiCandidate.previous_works || [],
      certification: apiCandidate.certification || [],
      services: apiCandidate.services || [],
      portfolio_links: apiCandidate.portfolio_links || [],
    };
  }, []);

  // Effect to fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
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

  // Effect to fetch user's favorite candidates
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoadingFavorites(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSavedCandidates([]);
          setFavoriteIds({});
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/my-favorites`, {
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
        setSavedCandidates([]);
        setFavoriteIds({});
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
  }, []);
  
  // --- Event Handler to Add/Remove Favorites ---
  const handleToggleSave = async (candidateId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please log in to save candidates.");
        return;
    }

    const isCurrentlySaved = savedCandidates.includes(candidateId);
    
    try {
        if (isCurrentlySaved) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/remove-freelancer`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ freelancer_id: candidateId })
            });

            if (!response.ok) throw new Error("Failed to remove from favorites");

            setSavedCandidates(prev => prev.filter(id => id !== candidateId));
            setFavoriteIds(prev => {
                const newFavs = { ...prev };
                delete newFavs[candidateId];
                return newFavs;
            });
            toast.success('Removed from favorites!');
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/add-freelancer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ freelancer_id: candidateId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add to favorites");
            }
            
            const result = await response.json();

            setSavedCandidates(prev => [...prev, candidateId]);
            setFavoriteIds(prev => ({ ...prev, [candidateId]: result.data.id }));
            toast.success('Added to favorites!');
        }
    } catch (err: any) {
        console.error("Error toggling favorite:", err);
        toast.error(err.message || "An unexpected error occurred.");
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const applyFilters = () => {
    let filtered = [...candidates];
    
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(c => 
        selectedSkills.every(skill => c.skills?.includes(skill))
      );
    }

    if (selectedSuperpowers.length > 0) {
      filtered = filtered.filter(c => 
        selectedSuperpowers.every(superpower => c.superpowers?.includes(superpower))
      );
    }
    
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(c => 
        c.city && c.country && selectedLocations.includes(`${c.city}, ${c.country}`)
      );
    }
    
    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedLocations([]);
    setSelectedSuperpowers([]);
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
        applyFilters(); 
        return;
    }
    setFilteredCandidates(sorted);
  };

  // --- New Handlers for Profile View ---
  const handleViewProfile = (candidateId: number) => {
    setLoadingProfile(true);
    const candidate = candidates.find(c => c.user_id === candidateId);
    if (candidate) {
      setSelectedFreelancer(mapApiCandidateToIFreelancer(candidate));
    } else {
      toast.error("Candidate profile not found locally. Please try again.");
      console.error("Candidate not found in local state:", candidateId);
    }
    setLoadingProfile(false);
  };

  // --- Derived State for Rendering ---
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentDisplayCandidates = filteredCandidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const allSkills = Array.from(new Set(candidates.flatMap(c => c.skills || [])));
  const allSuperpowers = Array.from(new Set(candidates.flatMap(c => c.superpowers || [])));
  const allLocations = Array.from(new Set(candidates.filter(c => c.city && c.country).map(c => `${c.city}, ${c.country}`)));

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <Toaster position="top-right" reverseOrder={false} />
        <DashboardHeader />
        <h2 className="main-title">Candidates</h2>
        
        {selectedFreelancer ? (
          <CandidateDetailsArea freelancer={selectedFreelancer} loading={loadingProfile} />
        ) : (
          <>
            <div className="bg-white card-box border-20 mb-40">
                <CandidateV1FilterArea
                  onSkillChange={setSelectedSkills}
                  onLocationChange={setSelectedLocations}
                  onSuperpowerChange={setSelectedSuperpowers}
                  onApplyFilter={applyFilters}
                  skills={allSkills}
                  locations={allLocations}
                  superpowers={allSuperpowers}
                  selectedSkills={selectedSkills}
                  selectedLocations={selectedLocations}
                  selectedSuperpowers={selectedSuperpowers}
                  onClearFilters={clearFilters}
                />
            </div>

            <div className="candidate-profile-area">
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
                            onViewProfile={handleViewProfile}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateV1Area;