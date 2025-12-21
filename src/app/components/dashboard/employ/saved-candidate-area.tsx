"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import DashboardHeader from "../candidate/dashboard-header";
import CandidateListItem from "@/app/components/candidate/candidate-list-item-sidebar";
import DashboardSearchBar from "../common/DashboardSearchBar";
// import CandidateV1FilterArea from "@/app/components/candidate/filter/candidate-v1-filter-area-hori"; // Removed as filters are not needed for "saved only"
import Pagination from "@/ui/pagination";
// import NiceSelect from "@/ui/nice-select"; // Removed as sorting is not needed for "saved only"
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar"; // Import CandidateDetailsArea
import { IFreelancer } from "@/app/freelancer-profile/[id]/page"; // Import IFreelancer interface
import { authCookies } from "@/utils/cookies";
import { useUser } from "@/context/UserContext";
import { db, auth } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { signInWithCustomToken } from 'firebase/auth';

// This interface matches the raw data from your API
interface ApiCandidate {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email?: string; // Email from API
  profile_picture: string | null;
  bio: string | null; // Added bio for mapping
  address: string | null;
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
  portfolio_links: string[]; // Can contain YouTube links and others
  certification: any; // Can be null
  education: any; // Can be null
  previous_works: any; // Can be null
  services: any; // Can be null
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


const SavedCandidateArea = () => {
  const router = useRouter();
  const { userData } = useUser();

  // State variables for data and UI control
  const [allCandidates, setAllCandidates] = useState<ApiCandidate[]>([]); // Renamed to allCandidates
  const [displayedCandidates, setDisplayedCandidates] = useState<ApiCandidate[]>([]); // Holds only saved candidates
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [candidateId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for viewing a single candidate profile
  const [selectedFreelancer, setSelectedFreelancer] = useState<IFreelancer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [searchQuery, setSearchQuery] = useState('');

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
      email: apiCandidate.email || '',
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
        setAllCandidates(candidatesData); // Store all candidates
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
        const token = authCookies.getToken();
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

  // Effect to filter candidates based on saved status and search query
  useEffect(() => {
    if (allCandidates.length > 0 && savedCandidates.length > 0) {
      let savedOnlyCandidates = allCandidates.filter(candidate =>
        savedCandidates.includes(candidate.user_id)
      );

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        savedOnlyCandidates = savedOnlyCandidates.filter(c =>
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.username?.toLowerCase().includes(query) ||
          c.profile_title?.toLowerCase().includes(query) ||
          c.bio?.toLowerCase().includes(query) ||
          c.short_description?.toLowerCase().includes(query) ||
          c.skills?.some(skill => skill.toLowerCase().includes(query)) ||
          c.superpowers?.some(sp => sp.toLowerCase().includes(query)) ||
          c.city?.toLowerCase().includes(query) ||
          c.country?.toLowerCase().includes(query)
        );
      }

      setDisplayedCandidates(savedOnlyCandidates);
      setCurrentPage(1); // Reset pagination when candidates are filtered
    } else if (savedCandidates.length === 0) {
      setDisplayedCandidates([]);
    }
  }, [allCandidates, savedCandidates, searchQuery]); // Rerun when allCandidates, savedCandidates, or searchQuery change

  // --- Event Handler to Add/Remove Favorites ---
  const handleToggleSave = async (candidateId: number) => {
    const token = authCookies.getToken();
    if (!token) {
      toast.error("Please log in to save candidates.");
      return;
    }

    const isCurrentlySaved = savedCandidates.includes(candidateId);

    try {
      if (isCurrentlySaved) {
        // --- REMOVE from favorites ---
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/remove-freelancer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ freelancer_id: candidateId })
        });

        if (!response.ok) throw new Error("Failed to remove from favorites");

        // Update state immutably
        setSavedCandidates(prev => prev.filter(id => id !== candidateId));
        setFavoriteIds(prev => {
          const newFavs = { ...prev };
          delete newFavs[candidateId];
          return newFavs;
        });
        toast.success('Removed from favorites!');
      } else {
        // --- ADD to favorites ---
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

        // Update state immutably
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

  // --- New Handlers for Profile View ---
  const handleViewProfile = (candidateId: number) => {
    setLoadingProfile(true);
    // Find in allCandidates to ensure we have the full data
    const candidate = allCandidates.find(c => c.user_id === candidateId);
    if (candidate) {
      setSelectedFreelancer(mapApiCandidateToIFreelancer(candidate));
    } else {
      toast.error("Candidate profile not found locally. Please try again.");
      console.error("Candidate not found in local state:", candidateId);
    }
    setLoadingProfile(false);
  };

  // --- Handler for messaging a candidate ---
  const handleMessage = async (candidateId: number) => {
    if (!userData) {
      toast.error('Please sign in to message freelancers');
      return;
    }

    // Check if chat is allowed (freelancer must have applied to client's project)
    try {
      const permissionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/check-can-chat/${candidateId}`,
        {
          headers: {
            'Authorization': `Bearer ${authCookies.getToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (permissionResponse.ok) {
        const permissionData = await permissionResponse.json();
        if (!permissionData.canChat) {
          toast.error('You can only message freelancers who have applied to your projects.');
          return;
        }
      }
    } catch (permErr) {
      console.error('Error checking chat permission:', permErr);
      // Continue anyway - backend will enforce the rule
    }

    try {
      // Ensure Firebase authentication
      if (!auth.currentUser) {
        const authToken = authCookies.getToken();
        if (!authToken) {
          toast.error('Authentication required. Please sign in again.');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/firebase-token`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get Firebase authentication token');
        }

        const { data } = await response.json();
        await signInWithCustomToken(auth, data.customToken);
      }

      // Create or get conversation
      const currentUserId = String(userData.user_id);
      const otherId = String(candidateId);
      const participants = [currentUserId, otherId].sort();
      const conversationId = participants.join('_');

      const convRef = ref(db, `conversations/${conversationId}`);
      const convSnap = await get(convRef);

      if (!convSnap.exists()) {
        // Build participant details
        const participantDetails: any = {};
        participantDetails[currentUserId] = {
          firstName: userData.first_name || '',
          email: userData.email || '',
          profilePicture: userData.profile_picture || null
        };

        const candidate = allCandidates.find(c => c.user_id === candidateId);
        if (candidate) {
          participantDetails[otherId] = {
            firstName: candidate.first_name || candidate.username || '',
            email: candidate.email || '',
            profilePicture: candidate.profile_picture || null
          };
        }

        await set(convRef, {
          participants,
          participantRoles: {
            [currentUserId]: 'client',
            [otherId]: 'freelancer',
          },
          participantDetails,
          lastMessage: '',
          lastSenderId: '',
          updatedAt: Date.now(),
          createdAt: Date.now(),
        });
        toast.success('Chat started! Redirecting...');
      } else {
        toast.success('Opening chat...');
      }

      // Navigate to chat
      router.push(`/dashboard/client-dashboard/messages?conversationId=${conversationId}`);
    } catch (err: any) {
      console.error('Failed to start chat:', err);
      toast.error(`Failed to start chat: ${err?.message || 'Unknown error'}`);
    }
  };

  // --- Derived State for Rendering ---
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentDisplayCandidates = displayedCandidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(displayedCandidates.length / ITEMS_PER_PAGE);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">
            {selectedFreelancer ? `Profile: ${selectedFreelancer.first_name} ${selectedFreelancer.last_name}` : "My Saved Candidates"}
          </h2>
          {selectedFreelancer && (
            <button className="dash-btn-two tran3s" onClick={() => setSelectedFreelancer(null)}>
              ← Back to Saved Candidates
            </button>
          )}
        </div>

        {selectedFreelancer ? (
          // Render CandidateDetailsArea if a freelancer is selected
          <CandidateDetailsArea
            freelancer={selectedFreelancer}
            loading={loadingProfile}
            onMessage={handleMessage}
          />
        ) : (
          // Otherwise, render the list of saved candidates
          <>            <DashboardSearchBar
            placeholder="Search saved candidates by name, skills, location..."
            onSearch={setSearchQuery}
          />
            {/* Removed CandidateV1FilterArea */}
            {/* Removed Filter and Sort UI as only saved candidates are shown */}

            <div className="candidate-profile-area">
              <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                <div className="total-job-found">
                  Showing <span className="text-dark fw-500">{displayedCandidates.length}</span> saved candidates
                </div>
                {/* Removed sorting NiceSelect */}
              </div>

              {(loading || loadingFavorites) && (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {error && <p className="text-danger text-center p-5">{error}</p>}

              {!loading && !loadingFavorites && currentDisplayCandidates.length === 0 && (
                <div className="text-center p-5">
                  <h4>No saved candidates found</h4>
                  <p>You haven't added any candidates to your favorites yet.</p>
                </div>
              )}

              {!loading && !loadingFavorites && currentDisplayCandidates.length > 0 && (
                <div className="accordion-box list-style show">
                  {currentDisplayCandidates.map((apiCandidate) => (
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
                </div>
              )}

              {totalPages > 1 && (
                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                  <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                    Showing <span className="text-dark fw-500">{indexOfFirst + 1} to {Math.min(indexOfLast, displayedCandidates.length)}</span> of <span className="text-dark fw-500">{displayedCandidates.length}</span>
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

export default SavedCandidateArea;