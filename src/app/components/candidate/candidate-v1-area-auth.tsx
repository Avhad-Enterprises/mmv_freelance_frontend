"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { authCookies } from "@/utils/cookies";
import axios from "axios";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";
import CandidateListItem from "@/app/components/candidate/candidate-list-item-sidebar";
import CandidateV1FilterArea from "@/app/components/candidate/filter/candidate-v1-filter-area-hori";
import Pagination from "@/ui/pagination";
import NiceSelect from "@/ui/nice-select";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import { IFreelancer } from "@/app/freelancer-profile/[id]/page";
import DashboardSearchBar from "@/app/components/dashboard/common/DashboardSearchBar";

// This interface matches the raw data from your API
interface ApiCandidate {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture: string | null;
  bio: string | null;
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
  const [filteredCandidates, setFilteredCandidates] = useState<ApiCandidate[]>(
    []
  );
  const [savedCandidates, setSavedCandidates] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{
    [candidateId: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for viewing a single candidate profile
  const [selectedFreelancer, setSelectedFreelancer] =
    useState<IFreelancer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  // Filter and sort states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSuperpowers, setSelectedSuperpowers] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Helper function to format currency
  const formatCurrency = (amountStr: string, currencyCode: string) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return `${amountStr} ${currencyCode}`;
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }
  };

  // Helper function to map ApiCandidate to IFreelancer
  const mapApiCandidateToIFreelancer = useCallback(
    (apiCandidate: ApiCandidate): IFreelancer => {
      const youtubeVideos = (apiCandidate.portfolio_links || [])
        .filter((link) => link.includes("youtube.com/watch?v="))
        .map((link) => {
          const videoId = link.split("v=")[1]?.split("&")[0] || "";
          return { id: videoId, url: link };
        })
        .filter((video) => video.id !== "");

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
        email: "",
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
    },
    []
  );

  const router = useRouter();
  const { userData } = useUser();

  const handleStartChat = async (candidateUserId: number) => {
    if (!userData) {
      toast.error("Please sign in to message freelancers");
      return;
    }

    // Check if chat is allowed (freelancer must have applied to client's project)
    try {
      const permissionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/check-can-chat/${candidateUserId}`,
        {
          headers: {
            Authorization: `Bearer ${authCookies.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (permissionResponse.ok) {
        const permissionData = await permissionResponse.json();
        if (!permissionData.canChat) {
          toast.error(
            "You can only message freelancers who have applied to your projects."
          );
          return;
        }
      }
    } catch (permErr) {
      console.error("Error checking chat permission:", permErr);
      // Continue anyway - backend will enforce the rule
    }

    try {
      const token = authCookies.getToken();
      if (!token) {
        toast.error("Authentication required. Please sign in again.");
        return;
      }

      // Validate candidateUserId
      const otherUserIdNum = Number(candidateUserId);
      if (isNaN(otherUserIdNum)) {
        toast.error("Invalid user ID. Cannot start chat.");
        return;
      }

      // Create or get conversation via REST API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
        {
          otherUserId: otherUserIdNum,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const conversationId =
        response.data?.data?.conversation_id || response.data?.data?.id;

      if (!conversationId) {
        throw new Error("Invalid conversation ID received");
      }

      toast.success("Chat started! Redirecting...");
      router.push(
        `/dashboard/client-dashboard/messages?conversationId=${conversationId}`
      );
    } catch (err: any) {
      console.error("Failed to start chat:", err);
      toast.error(
        `Failed to start chat: ${err?.response?.data?.message || err?.message || "Unknown error"
        }`
      );
    }
  };

  // Effect to fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`,
          { cache: "no-cache" }
        );
        if (!response.ok) throw new Error(`HTTP Status ${response.status}`);

        const responseData = await response.json();
        const candidatesData: ApiCandidate[] = Array.isArray(responseData.data)
          ? responseData.data
          : [];
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

  // Effect to fetch favorites on component mount
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

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/my-favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch favorites");

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const savedIds = result.data.map(
            (fav: any) => fav.freelancer_user_id || fav.freelancer_id
          );
          const favIds = result.data.reduce((acc: any, fav: any) => {
            const userId = fav.freelancer_user_id || fav.freelancer_id;
            acc[userId] = fav.id;
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

  // Effect to automatically apply filters when selections change
  useEffect(() => {
    applyFilters();
  }, [selectedSkills, selectedLocations, selectedSuperpowers, searchQuery]);

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/remove-freelancer`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ freelancer_id: candidateId }),
          }
        );

        if (!response.ok) throw new Error("Failed to remove from favorites");

        setSavedCandidates((prev) => prev.filter((id) => id !== candidateId));
        setFavoriteIds((prev) => {
          const newFavs = { ...prev };
          delete newFavs[candidateId];
          return newFavs;
        });
        toast.success("Removed from favorites!");
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/add-freelancer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ freelancer_id: candidateId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add to favorites");
        }

        const result = await response.json();

        setSavedCandidates((prev) => [...prev, candidateId]);
        setFavoriteIds((prev) => ({ ...prev, [candidateId]: result.data.id }));
        toast.success("Added to favorites!");
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

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.username?.toLowerCase().includes(query) ||
          c.profile_title?.toLowerCase().includes(query) ||
          c.bio?.toLowerCase().includes(query) ||
          c.short_description?.toLowerCase().includes(query) ||
          c.skills?.some((skill) => skill.toLowerCase().includes(query)) ||
          c.superpowers?.some((sp) => sp.toLowerCase().includes(query)) ||
          c.city?.toLowerCase().includes(query) ||
          c.country?.toLowerCase().includes(query)
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((c) =>
        selectedSkills.every((skill) => c.skills?.includes(skill))
      );
    }

    if (selectedSuperpowers.length > 0) {
      filtered = filtered.filter((c) =>
        selectedSuperpowers.every((superpower) =>
          c.superpowers?.includes(superpower)
        )
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter(
        (c) =>
          c.city &&
          c.country &&
          selectedLocations.includes(`${c.city}, ${c.country}`)
      );
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedLocations([]);
    setSelectedSuperpowers([]);
    setSearchQuery("");
    setFilteredCandidates(candidates);
    setCurrentPage(1);
  };

  const handleSort = (value: string) => {
    setSortValue(value);
    let sorted = [...filteredCandidates];
    switch (value) {
      case "price-low-to-high":
        sorted.sort(
          (a, b) => parseFloat(a.rate_amount) - parseFloat(b.rate_amount)
        );
        break;
      case "price-high-to-low":
        sorted.sort(
          (a, b) => parseFloat(b.rate_amount) - parseFloat(a.rate_amount)
        );
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
    const candidate = candidates.find((c) => c.user_id === candidateId);
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
  const currentDisplayCandidates = filteredCandidates.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  const allSkills = Array.from(
    new Set(candidates.flatMap((c) => c.skills || []))
  );
  const allSuperpowers = Array.from(
    new Set(candidates.flatMap((c) => c.superpowers || []))
  );
  const allLocations = Array.from(
    new Set(
      candidates
        .filter((c) => c.city && c.country)
        .map((c) => `${c.city}, ${c.country}`)
    )
  );

  return (
    <div className="dashboard-body candidates-page-responsive">
      {/* Comprehensive Mobile Responsive Styles */}
      <style jsx global>{`
        /* Fix horizontal overflow and layout issues */
        @media (max-width: 1199px) {
          .candidates-page-responsive.dashboard-body {
            padding: 100px 25px 30px !important;
          }
        }
        
        @media (max-width: 991px) {
          .candidates-page-responsive.dashboard-body {
            padding: 90px 20px 30px !important;
            margin-left: 0 !important;
            border-radius: 20px 0 0 20px !important;
          }
          
          body, html {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          
          .dashboard-layout {
            overflow-x: hidden !important;
          }
          
          .candidates-page-responsive .bg-white.card-box {
            padding: 25px 20px !important;
          }
          
          .candidates-page-responsive .upper-filter {
            flex-direction: column !important;
            gap: 15px;
            align-items: flex-start !important;
          }
          
          .candidates-page-responsive .short-filter {
            width: 100% !important;
          }
          
          .candidates-page-responsive .short-filter .nice-select {
            width: 100% !important;
          }
        }
        
        @media (max-width: 767px) {
          .candidates-page-responsive.dashboard-body {
            padding: 80px 15px 20px !important;
            border-radius: 15px 0 0 15px !important;
            overflow-x: hidden !important;
          }
          
          .candidates-page-responsive .main-title {
            font-size: 24px !important;
            margin-bottom: 15px !important;
          }
          
          .candidates-page-responsive .filter-btn {
            margin-bottom: 20px !important;
          }
          
          .candidates-page-responsive .bg-white.card-box {
            padding: 20px 15px !important;
          }
          
          .candidates-page-responsive .dash-btn-two {
            font-size: 14px !important;
            padding: 8px 16px !important;
          }
          
          .candidates-page-responsive .d-sm-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px;
          }
        }
        
        @media (max-width: 575px) {
          .candidates-page-responsive.dashboard-body {
            padding: 70px 12px 20px !important;
          }
          
          .candidates-page-responsive .main-title {
            font-size: 20px !important;
          }
        }
      `}</style>
      
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-sm-flex align-items-center justify-content-between mb-20 lg-mb-10">
          <h2 className="main-title m0">
            {selectedFreelancer
              ? `Profile: ${selectedFreelancer.first_name} ${selectedFreelancer.last_name}`
              : "Candidates"}
          </h2>
          {selectedFreelancer && (
            <button
              className="dash-btn-two tran3s mt-3 mt-sm-0"
              onClick={() => setSelectedFreelancer(null)}
            >
              ← Back to Candidates
            </button>
          )}
        </div>

        {selectedFreelancer ? (
          <CandidateDetailsArea
            freelancer={selectedFreelancer}
            loading={loadingProfile}
            onMessage={() => handleStartChat(selectedFreelancer.user_id)}
          />
        ) : (
          <>
            <DashboardSearchBar
              placeholder="Search candidates by name, skills, location..."
              onSearch={setSearchQuery}
            />

            {/* Mobile Filter Button */}
            <button
              type="button"
              className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-30"
              data-bs-toggle="offcanvas"
              data-bs-target="#candidateFilterOffcanvas"
              style={{
                backgroundColor: 'transparent',
                color: '#31795A',
                borderRadius: '30px',
                border: '1px solid #31795A',
                padding: '10px 0'
              }}
            >
              <i className="bi bi-funnel me-2"></i>
              Filter Candidates
            </button>

            {/* Desktop Filter Area - Hidden on mobile */}
            <div className="bg-white card-box border-20 mb-40 d-none d-lg-block">
              <CandidateV1FilterArea
                onSkillChange={setSelectedSkills}
                onLocationChange={setSelectedLocations}
                onSuperpowerChange={setSelectedSuperpowers}
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
                  All{" "}
                  <span className="text-dark fw-500">
                    {filteredCandidates.length}
                  </span>{" "}
                  candidates found
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
                {loading && (
                  <div className="text-center p-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                {error && (
                  <p className="text-danger text-center p-5">{error}</p>
                )}

                {!loading &&
                  !error &&
                  currentDisplayCandidates.map((apiCandidate) => (
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
                        profile_picture:
                          apiCandidate.profile_picture || undefined,
                        city: apiCandidate.city || "",
                        country: apiCandidate.country || "",
                        skill: apiCandidate.skills,
                        post: apiCandidate.profile_title || "Freelancer",
                        budget: `${formatCurrency(
                          apiCandidate.rate_amount,
                          apiCandidate.currency
                        )} / hr`,
                        location: "",
                        total_earnings: apiCandidate.total_earnings,
                      }}
                    />
                  ))}

                {!loading && currentDisplayCandidates.length === 0 && (
                  <div className="text-center p-5">
                    <h4>No candidates found</h4>
                    <p>Try adjusting your filters</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pt-30 lg-pt-20 d-sm-flex align-items-center justify-content-between">
                  <p className="m0 order-sm-last text-center text-sm-start xs-pb-20">
                    Showing{" "}
                    <span className="text-dark fw-500">
                      {indexOfFirst + 1} to{" "}
                      {Math.min(indexOfLast, filteredCandidates.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-dark fw-500">
                      {filteredCandidates.length}
                    </span>
                  </p>
                  <Pagination
                    pageCount={totalPages}
                    handlePageClick={handlePageClick}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile Filter Offcanvas */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="candidateFilterOffcanvas" aria-labelledby="candidateFilterOffcanvasLabel" style={{ zIndex: 99999 }}>
        <div className="filter-area-tab">
          <button type="button" className="btn-close text-reset d-lg-none position-absolute top-0 end-0 m-4" data-bs-dismiss="offcanvas" aria-label="Close" style={{ zIndex: 10 }}></button>

          <div className="offcanvas-body p-4">
            <div className="main-title fw-500 text-dark text-center mb-4 mt-2">Filter By</div>

            <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30">

              {/* Skills */}
              <div className="filter-block bottom-line pb-25">
                <div className="filter-title fw-500 text-dark mb-3">Skills</div>
                <select
                  className="form-select"
                  onChange={(e) => {
                    if (e.target.value && !selectedSkills.includes(e.target.value)) {
                      setSelectedSkills([...selectedSkills, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                  style={{ height: '48px' }}
                >
                  <option value="">Select Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill} disabled={selectedSkills.includes(skill)}>
                      {skill}
                    </option>
                  ))}
                </select>
                {selectedSkills.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {selectedSkills.map(skill => (
                      <div
                        key={skill}
                        className="btn-eight fw-500 d-flex align-items-center"
                        style={{ backgroundColor: '#00BF58', color: 'white', padding: '5px 10px' }}
                      >
                        <span style={{ color: 'white', fontSize: '14px' }}>{skill}</span>
                        <button
                          onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                          className="btn-close ms-2"
                          style={{ width: '8px', height: '8px', filter: 'brightness(0) invert(1)' }}
                        ></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Superpowers */}
              <div className="filter-block bottom-line pb-25 mt-25">
                <div className="filter-title fw-500 text-dark mb-3">Superpowers</div>
                <select
                  className="form-select"
                  onChange={(e) => {
                    if (e.target.value && !selectedSuperpowers.includes(e.target.value)) {
                      setSelectedSuperpowers([...selectedSuperpowers, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                  style={{ height: '48px' }}
                >
                  <option value="">Select Superpowers</option>
                  {allSuperpowers.map(sp => (
                    <option key={sp} value={sp} disabled={selectedSuperpowers.includes(sp)}>
                      {sp}
                    </option>
                  ))}
                </select>
                {selectedSuperpowers.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {selectedSuperpowers.map(sp => (
                      <div
                        key={sp}
                        className="btn-eight fw-500 d-flex align-items-center"
                        style={{ backgroundColor: '#FF6B35', color: 'white', padding: '5px 10px' }}
                      >
                        <span style={{ color: 'white', fontSize: '14px' }}>{sp}</span>
                        <button
                          onClick={() => setSelectedSuperpowers(selectedSuperpowers.filter(s => s !== sp))}
                          className="btn-close ms-2"
                          style={{ width: '8px', height: '8px', filter: 'brightness(0) invert(1)' }}
                        ></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="filter-block bottom-line pb-25 mt-25">
                <div className="filter-title fw-500 text-dark mb-3">Location</div>
                <select
                  className="form-select"
                  onChange={(e) => {
                    if (e.target.value && !selectedLocations.includes(e.target.value)) {
                      setSelectedLocations([...selectedLocations, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                  style={{ height: '48px' }}
                >
                  <option value="">Select Location</option>
                  {allLocations.map(loc => (
                    <option key={loc} value={loc} disabled={selectedLocations.includes(loc)}>
                      {loc}
                    </option>
                  ))}
                </select>
                {selectedLocations.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {selectedLocations.map(loc => (
                      <div
                        key={loc}
                        className="btn-eight fw-500 d-flex align-items-center"
                        style={{ backgroundColor: '#00BF58', color: 'white', padding: '5px 10px' }}
                      >
                        <span style={{ color: 'white', fontSize: '14px' }}>{loc}</span>
                        <button
                          onClick={() => setSelectedLocations(selectedLocations.filter(l => l !== loc))}
                          className="btn-close ms-2"
                          style={{ width: '8px', height: '8px', filter: 'brightness(0) invert(1)' }}
                        ></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Button */}
              <div className="mt-40">
                <button
                  onClick={() => {
                    clearFilters();
                    // Close offcanvas
                    const offcanvasElement = document.getElementById('candidateFilterOffcanvas');
                    if (offcanvasElement) {
                      const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvasElement);
                      bsOffcanvas?.hide();
                    }
                  }}
                  className="btn-ten fw-500 text-white w-100 text-center tran3s"
                >
                  Reset Filter
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateV1Area;
