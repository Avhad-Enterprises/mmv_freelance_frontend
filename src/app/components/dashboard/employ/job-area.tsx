'use client';

import React, { useState, useEffect, useCallback, Fragment, type FC } from "react";
import PostJobForm from "./PostJobForm";
import { makeGetRequest, makePatchRequest } from "@/utils/api";
import toast from 'react-hot-toast';
import { useSidebar } from "@/context/SidebarContext";
import DashboardHeader from "../candidate/dashboard-header";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import { IFreelancer } from "@/app/freelancer-profile/[id]/page";
import JobsList from "./JobsList";
import ApplicantsList from "./ApplicantsList";
import ApplicantProfile from "./ApplicantProfile";
import { authCookies } from "@/utils/cookies";
// Bootstrap will be imported dynamically on the client side

export interface ProjectSummary {
  project_id: string;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  status: number; // 0: Pending, 1: Approved, 2: Completed
}

export interface Applicant {
  applied_projects_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  status: 0 | 1 | 2 | 3; // 0: Pending, 1: Approved, 2: Completed, 3: Rejected
  bio: string | null;
  skills?: string[]; // Add skills field
  applied_date?: string; // Add applied date field
}

const EmployJobArea: FC = () => {
  const { setIsOpenSidebar } = useSidebar();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectForApplicants, setSelectedProjectForApplicants] = useState<ProjectSummary | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [savedApplicants, setSavedApplicants] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [applicantId: number]: number }>({});
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // State for viewing applicant profiles
  const [selectedApplicant, setSelectedApplicant] = useState<IFreelancer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initDropdowns = async () => {
        const bootstrap = await import('bootstrap');
        const dropdownElements = document.querySelectorAll('.dropdown-toggle');
        dropdownElements.forEach((element) => {
          new bootstrap.Dropdown(element);
        });
      };
      initDropdowns();
    }
  }, []);

  const fetchClientData = useCallback(async () => {
    if (isPostingJob) return;

    setLoading(true);
    setError(null);
    try {
      const meResponse = await makeGetRequest("api/v1/users/me");
      const clientId = meResponse.data?.data?.profile?.client_id;
      if (!clientId) throw new Error("Could not find Client ID. Please log in.");

      const projectsResponse = await makeGetRequest(`api/v1/projects-tasks/client/${clientId}`);
      const createdProjects = projectsResponse.data?.data || [];

      const processedData: ProjectSummary[] = createdProjects.map((p: any) => ({
        project_id: p.projects_task_id,
        title: p.project_title,
        date_created: p.created_at,
        category: p.project_category,
        budget: p.budget,
        status: p.status,
      }));

      setProjects(processedData);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to load your jobs.";
      setError(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [isPostingJob]);

  useEffect(() => { fetchClientData(); }, [fetchClientData]);

  // Effect to fetch user's favorite applicants
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoadingFavorites(true);
      try {
        const token = authCookies.getToken();
        if (!token) {
          setSavedApplicants([]);
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
          setSavedApplicants(savedIds);
          setFavoriteIds(favIds);
        }
      } catch (err) {
        console.error("Error loading favorites:", err);
        setSavedApplicants([]);
        setFavoriteIds({});
      } finally {
        setLoadingFavorites(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleReturnToList = () => {
    setIsPostingJob(false);
    fetchClientData();
  };

  const handleViewApplicantsClick = async (project: ProjectSummary) => {
    setSelectedProjectForApplicants(project);
    setApplicantsLoading(true);
    setApplicantsError(null);

    try {
      // Fetch applications
      const applicationsResponse = await makeGetRequest(`api/v1/applications/projects/${project.project_id}/applications`);
      const rawApplicants = applicationsResponse.data?.data || [];
      
      // Fetch all freelancers to get profile pictures and additional data
      const freelancersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
      if (!freelancersResponse.ok) throw new Error(`Failed to fetch freelancer data`);
      const freelancersData = await freelancersResponse.json();
      const freelancers = freelancersData.data || [];
      
      // Create a map of user_id to freelancer data for quick lookup
      const freelancerMap = new Map();
      freelancers.forEach((freelancer: any) => {
        freelancerMap.set(freelancer.user_id, freelancer);
      });
      
      // Map API response to match Applicant interface, enriched with freelancer data
      const applicantsData: Applicant[] = rawApplicants.map((app: any) => {
        const freelancer = freelancerMap.get(app.user_id);
        return {
          applied_projects_id: app.applied_projects_id,
          user_id: app.user_id,
          first_name: app.applicant?.first_name || freelancer?.first_name || 'Unknown',
          last_name: app.applicant?.last_name || freelancer?.last_name || '',
          email: app.applicant?.email || freelancer ? `${freelancer.username || 'unknown'}@example.com` : '',
          profile_picture: freelancer?.profile_picture || '',
          status: app.status,
          bio: freelancer?.bio || freelancer?.short_description || null,
          skills: freelancer?.skills || [],
          applied_date: app.created_at,
        };
      });
      
      setApplicants(applicantsData);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to load applicants.";
      setApplicantsError(message);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleBackToJobs = () => {
    setSelectedProjectForApplicants(null);
    setApplicants([]);
    setApplicantsError(null);
  };

  // Event Handler to Add/Remove Favorites
  const handleToggleSave = async (applicantId: number) => {
    const token = authCookies.getToken();
    if (!token) {
      toast.error("Please log in to save applicants.");
      return;
    }

    const isCurrentlySaved = savedApplicants.includes(applicantId);

    try {
      if (isCurrentlySaved) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites/remove-freelancer`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ freelancer_id: applicantId })
        });

        if (!response.ok) throw new Error("Failed to remove from favorites");

        setSavedApplicants(prev => prev.filter(id => id !== applicantId));
        setFavoriteIds(prev => {
          const newFavs = { ...prev };
          delete newFavs[applicantId];
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
          body: JSON.stringify({ freelancer_id: applicantId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add to favorites");
        }

        const result = await response.json();

        setSavedApplicants(prev => [...prev, applicantId]);
        setFavoriteIds(prev => ({ ...prev, [applicantId]: result.data.id }));
        toast.success('Added to favorites!');
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      toast.error(err.message || "An unexpected error occurred.");
    }
  };

  const handleUpdateApplicantStatus = async (
    projectId: string,
    applicationId: number,
    newStatus: Applicant['status']
  ) => {
    // Check if another applicant is already assigned or completed by looking at projects
    const currentProject = projects.find(p => p.project_id === projectId);
    if (!currentProject) return;

    if (newStatus === 1) {
      // Check if project is already assigned
      if (currentProject.status === 1) {
        toast.error("❌ Only one applicant can be assigned to this project.");
        return;
      }
    }
    if (newStatus === 2) {
      // Check if project is already completed
      if (currentProject.status === 2) {
        toast.error("❌ This project is already marked as completed.");
        return;
      }
    }

    // Optimistically update project status
    const originalProjects = JSON.parse(JSON.stringify(projects));
    let newProjectStatus: number | null = null;
    if (newStatus === 2) newProjectStatus = 2; // Completed
    else if (newStatus === 1) newProjectStatus = 1; // Assigned

    if (newProjectStatus !== null) {
      const updatedProjects = projects.map(p =>
        p.project_id === projectId ? { ...p, status: newProjectStatus! } : p
      );
      setProjects(updatedProjects);
    }

    try {
      // Update application status using the correct endpoint
      await makePatchRequest(`api/v1/applications/update-status`, {
        applied_projects_id: applicationId,
        status: newStatus,
      });

      // Update local state immediately after successful API call
      setApplicants(prev => prev.map(app => 
        app.applied_projects_id === applicationId 
          ? { ...app, status: newStatus } 
          : app
      ));

      // Update project status (only for Assigned or Completed)
      if (newStatus === 1 || newStatus === 2) {
        await makePatchRequest(`api/v1/projects-tasks/${projectId}/status`, {
          status: newProjectStatus,
        });
      }

      toast.success("✅ Applicant and project updated successfully!");
    } catch (err: any) {
      console.error("Failed to update applicant/project:", err);
      // Revert project status on error
      if (newProjectStatus !== null) {
        setProjects(originalProjects);
      }
      const message = err.response?.data?.message || err.message || "Failed to update applicant/project.";
      toast.error(`❌ ${message}`);
    }
  };

  const getStatusInfo = (status: Applicant['status'] | number) => {
    switch (status) {
      case 0: return { text: "Pending", className: "text-warning" };
      case 1: return { text: "Approved", className: "text-success" };
      case 2: return { text: "Completed", className: "text-info" };
      case 3: return { text: "Rejected", className: "text-danger" };
      default: return { text: "Unknown", className: "text-secondary" };
    }
  };

  // Helper function to map Applicant to IFreelancer
  const mapApplicantToIFreelancer = useCallback((applicant: Applicant): IFreelancer => {
    return {
      user_id: applicant.user_id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      bio: applicant.bio || null,
      profile_picture: applicant.profile_picture || null,
      skills: applicant.skills || [],
      superpowers: [], // Not available in applicant data
      languages: [], // Not available in applicant data
      city: null, // Not available in applicant data
      country: null, // Not available in applicant data
      email: applicant.email,
      rate_amount: "0.00", // Not available in applicant data
      currency: "USD",
      availability: "not specified",
      latitude: null,
      longitude: null,
      profile_title: null, // Not available in applicant data
      short_description: null, // Not available in applicant data
      youtube_videos: [], // Not available in applicant data
      experience_level: null, // Not available in applicant data
      work_type: null,
      hours_per_week: null,
      kyc_verified: false, // Not available in applicant data
      aadhaar_verification: false, // Not available in applicant data
      hire_count: 0, // Not available in applicant data
      review_id: 0, // Not available in applicant data
      total_earnings: 0, // Not available in applicant data
      time_spent: 0, // Not available in applicant data
      role_name: null,
      experience: [], // Not available in applicant data
      education: [], // Not available in applicant data
      previous_works: [], // Not available in applicant data
      certification: [], // Not available in applicant data
      services: [], // Not available in applicant data
      portfolio_links: [], // Not available in applicant data
    };
  }, []);

  // Handler for viewing applicant profile
  const handleViewProfile = async (applicantId: number) => {
    setLoadingProfile(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to fetch freelancer data`);

      const responseData = await response.json();
      const foundFreelancer = responseData.data?.find((f: any) => f.user_id === applicantId);

      if (foundFreelancer) {
        // Process YouTube links to extract ID and URL
        const youtubeVideos = (foundFreelancer.portfolio_links || [])
          .filter((link: string) => link.includes("youtube.com/watch?v="))
          .map((link: string) => {
            const videoId = link.split('v=')[1]?.split('&')[0] || '';
            return { id: videoId, url: link };
          })
          .filter((video: any) => video.id !== '');

        // Map raw API data to IFreelancer
        const mappedFreelancer: IFreelancer = {
          user_id: foundFreelancer.user_id,
          first_name: foundFreelancer.first_name,
          last_name: foundFreelancer.last_name,
          bio: foundFreelancer.bio || foundFreelancer.short_description || null,
          profile_picture: foundFreelancer.profile_picture || null,
          skills: foundFreelancer.skills || [],
          superpowers: foundFreelancer.superpowers || [],
          languages: foundFreelancer.languages || [],
          city: foundFreelancer.city || null,
          country: foundFreelancer.country || null,
          email: `${foundFreelancer.username || 'unknown'}@example.com`,
          rate_amount: foundFreelancer.rate_amount || "0.00",
          currency: foundFreelancer.currency || "USD",
          availability: foundFreelancer.availability || "not specified",
          latitude: foundFreelancer.latitude || null,
          longitude: foundFreelancer.longitude || null,
          profile_title: foundFreelancer.profile_title || null,
          short_description: foundFreelancer.short_description || null,
          youtube_videos: youtubeVideos,
          experience_level: foundFreelancer.experience_level || null,
          work_type: foundFreelancer.work_type || null,
          hours_per_week: foundFreelancer.hours_per_week || null,
          kyc_verified: foundFreelancer.kyc_verified,
          aadhaar_verification: foundFreelancer.aadhaar_verification,
          hire_count: foundFreelancer.hire_count,
          review_id: foundFreelancer.review_id,
          total_earnings: foundFreelancer.total_earnings,
          time_spent: foundFreelancer.time_spent,
          role_name: foundFreelancer.role_name || null,
          experience: foundFreelancer.experience || [],
          education: foundFreelancer.education || [],
          previous_works: foundFreelancer.previous_works || [],
          certification: foundFreelancer.certification || [],
          services: foundFreelancer.services || [],
          portfolio_links: foundFreelancer.portfolio_links || [],
        };
        setSelectedApplicant(mappedFreelancer);
      } else {
        toast.error("Freelancer profile not found. Please try again.");
        console.error("Freelancer not found in API:", applicantId);
      }
    } catch (err: any) {
      toast.error("Failed to load profile. Please try again.");
      console.error("Error fetching freelancer:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handler for going back to applicants list
  const handleBackToApplicants = () => {
    setSelectedApplicant(null);
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">
            {selectedApplicant ? `Profile: ${selectedApplicant.first_name} ${selectedApplicant.last_name}` : selectedProjectForApplicants ? `Applications for: ${selectedProjectForApplicants.title}` : (isPostingJob ? "Post a New Job" : "My Jobs")}
          </h2>
          {!isPostingJob && !selectedProjectForApplicants && !selectedApplicant && (
            <button className="dash-btn-two tran3s" onClick={() => setIsPostingJob(true)}>
              Post a Job
            </button>
          )}
          {selectedApplicant && (
            <button className="dash-btn-two tran3s" onClick={handleBackToApplicants}>
              ← Back to Applicants
            </button>
          )}
          {selectedProjectForApplicants && !selectedApplicant && (
            <button className="dash-btn-two tran3s" onClick={handleBackToJobs}>
              ← Back to Jobs
            </button>
          )}
        </div>

        {selectedApplicant ? (
          // Profile View
          <ApplicantProfile
            selectedApplicant={selectedApplicant}
            loadingProfile={loadingProfile}
            onBackToApplicants={handleBackToApplicants}
          />
        ) : selectedProjectForApplicants ? (
          // Applicants View
          <ApplicantsList
            applicants={applicants}
            applicantsLoading={applicantsLoading}
            applicantsError={applicantsError}
            savedApplicants={savedApplicants}
            selectedProjectForApplicants={selectedProjectForApplicants}
            onViewProfile={handleViewProfile}
            onToggleSave={handleToggleSave}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            getStatusInfo={getStatusInfo}
          />
        ) : (
          // Jobs View
          <>
            {isPostingJob ? (
              <PostJobForm onBackToList={handleReturnToList} />
            ) : (
              <JobsList
                projects={projects}
                loading={loading}
                error={error}
                onViewApplicants={handleViewApplicantsClick}
                getStatusInfo={getStatusInfo}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployJobArea;