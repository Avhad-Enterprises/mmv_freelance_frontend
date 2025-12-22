'use client';

import React, { useState, useEffect, useCallback, Fragment, type FC } from "react";
import PostJobForm from "./PostJobForm";
import { makeGetRequest, makePatchRequest } from "@/utils/api";
import toast from 'react-hot-toast';
import { useSidebar } from '@/context/SidebarContext';
import DashboardHeader from "../candidate/dashboard-header";
import DashboardSearchBar from "../common/DashboardSearchBar";
import ApplicantsList from "./ApplicantsList";
import ApplicantProfile from "./ApplicantProfile";
import { getCategoryIcon, getCategoryColor, getCategoryTextColor } from '@/utils/categoryIcons';
import { authCookies } from "@/utils/cookies";
import { IFreelancer } from "@/app/freelancer-profile/[id]/page";

export interface ProjectSummary {
  project_id: string;
  title: string;
  date_created: string;
  category: string;
  budget: number;
  status: number;
}

export interface Applicant {
  applied_projects_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: string;
  status: 0 | 1 | 2 | 3;
  bio: string | null;
  skills?: string[];
  applied_date?: string;
}

// Submission Interface
interface Submission {
  submission_id: number;
  projects_task_id: number;
  user_id: number;
  submitted_files: string; // Comma-separated URLs
  additional_notes?: string;
  status: 0 | 1 | 2; // 0: Submitted, 1: Approved, 2: Rejected
  created_at: string;
  freelancer_name?: string;
  freelancer_email?: string;
  freelancer_profile_picture?: string;
}

const OngoingJobArea: FC = () => {
  const { setIsOpenSidebar } = useSidebar();
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectForApplicants, setSelectedProjectForApplicants] = useState<ProjectSummary | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);
  const [savedApplicants, setSavedApplicants] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<{ [applicantId: number]: number }>({});
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Submission Review States
  const [selectedProjectForSubmissions, setSelectedProjectForSubmissions] = useState<ProjectSummary | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState(false);

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

      // Filter to show only ongoing projects (status 1 = Assigned/In Progress)
      // Status 0 = Pending/Awaiting Assignment, Status 2 = Completed
      const ongoingProjects = createdProjects.filter((p: any) => p.status === 1);

      const processedData: ProjectSummary[] = ongoingProjects.map((p: any) => ({
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

  // View Submissions Handler
  const handleViewSubmissionsClick = async (project: ProjectSummary) => {
    setSelectedProjectForSubmissions(project);
    setSubmissionsLoading(true);
    setSubmissionsError(null);

    try {
      const token = authCookies.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/${project.project_id}/submissions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load submissions');
      }

      if (result.success) {
        const submissionsData: Submission[] = (result.data || []).map((sub: any) => ({
          submission_id: sub.submission_id,
          projects_task_id: sub.projects_task_id,
          user_id: sub.user_id,
          submitted_files: sub.submitted_files,
          additional_notes: sub.additional_notes || '',
          status: sub.status,
          created_at: sub.created_at,
          freelancer_name: `${sub.freelancer_first_name || ''} ${sub.freelancer_last_name || ''}`.trim(),
          freelancer_email: sub.freelancer_email || '',
          freelancer_profile_picture: sub.freelancer_profile_picture || ''
        }));

        setSubmissions(submissionsData);
      }
    } catch (err: any) {
      const message = err.message || "Failed to load submissions.";
      setSubmissionsError(message);
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleViewApplicantsClick = async (project: ProjectSummary) => {
    setSelectedProjectForApplicants(project);
    setApplicantsLoading(true);
    setApplicantsError(null);

    try {
      const applicationsResponse = await makeGetRequest(`api/v1/applications/projects/${project.project_id}/applications`);
      const rawApplicants = applicationsResponse.data?.data || [];

      const freelancersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
      if (!freelancersResponse.ok) throw new Error(`Failed to fetch freelancer data`);
      const freelancersData = await freelancersResponse.json();
      const freelancers = freelancersData.data || [];

      const freelancerMap = new Map();
      freelancers.forEach((freelancer: any) => {
        freelancerMap.set(freelancer.user_id, freelancer);
      });

      const applicantsData: Applicant[] = rawApplicants.map((app: any) => {
        const freelancer = freelancerMap.get(app.user_id);
        return {
          applied_projects_id: app.applied_projects_id,
          user_id: app.user_id,
          first_name: app.applicant?.first_name || freelancer?.first_name || 'Unknown',
          last_name: app.applicant?.last_name || freelancer?.last_name || '',
          email: app.applicant?.email || freelancer?.email || '',
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
    setSelectedProjectForSubmissions(null);
    setApplicants([]);
    setSubmissions([]);
    setApplicantsError(null);
    setSubmissionsError(null);
  };

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
    const currentProject = projects.find(p => p.project_id === projectId);
    if (!currentProject) return;

    if (newStatus === 1) {
      if (currentProject.status === 1) {
        toast.error("Only one applicant can be assigned to this project.");
        return;
      }
    }
    if (newStatus === 2) {
      if (currentProject.status === 2) {
        toast.error("This project is already marked as completed.");
        return;
      }
    }

    const originalProjects = JSON.parse(JSON.stringify(projects));
    let newProjectStatus: number | null = null;
    if (newStatus === 2) newProjectStatus = 2;
    else if (newStatus === 1) newProjectStatus = 1;

    if (newProjectStatus !== null) {
      const updatedProjects = projects.map(p =>
        p.project_id === projectId ? { ...p, status: newProjectStatus! } : p
      );
      setProjects(updatedProjects);
    }

    try {
      await makePatchRequest(`api/v1/applications/update-status`, {
        applied_projects_id: applicationId,
        status: newStatus,
      });

      setApplicants(prev => prev.map(app =>
        app.applied_projects_id === applicationId
          ? { ...app, status: newStatus }
          : app
      ));

      if (newStatus === 1 || newStatus === 2) {
        await makePatchRequest(`api/v1/projects-tasks/${projectId}/status`, {
          status: newProjectStatus,
        });
      }

      toast.success("Applicant and project updated successfully!");
    } catch (err: any) {
      console.error("Failed to update applicant/project:", err);
      if (newProjectStatus !== null) {
        setProjects(originalProjects);
      }
      const message = err.response?.data?.message || err.message || "Failed to update applicant/project.";
      toast.error(`${message}`);
    }
  };

  // Open submission review modal
  const handleOpenSubmissionModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleCloseSubmissionModal = () => {
    setShowSubmissionModal(false);
    setSelectedSubmission(null);
  };

  // Approve/Reject Submission
  const handleReviewSubmission = async (submissionId: number, status: 1 | 2) => {
    setReviewingSubmission(true);

    try {
      const token = authCookies.getToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects-tasks/submissions/${submissionId}/approve`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update submission status');
      }

      if (result.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub =>
          sub.submission_id === submissionId
            ? { ...sub, status }
            : sub
        ));

        if (status === 1) {
          // Approved - project is now completed
          toast.success('Submission approved! Project marked as completed.');
          handleCloseSubmissionModal();

          // Remove the completed project from ongoing projects list immediately
          if (selectedProjectForSubmissions) {
            setProjects(prev => prev.filter(p => p.project_id !== selectedProjectForSubmissions.project_id));
          }

          // Also clear the submissions view
          setSelectedProjectForSubmissions(null);
          setSubmissions([]);

          // Refresh to get latest data from server
          fetchClientData();
        } else {
          // Rejected
          toast.success('Submission rejected. Freelancer can resubmit.');
          handleCloseSubmissionModal();
        }
      }
    } catch (error: any) {
      console.error('Error reviewing submission:', error);
      toast.error(error.message || 'Failed to review submission');
    } finally {
      setReviewingSubmission(false);
    }
  };

  // Application Status Info - for viewing applicants
  const getApplicationStatusInfo = (status: Applicant['status'] | number) => {
    switch (status) {
      case 0: return { text: "Pending", className: "text-warning" };
      case 1: return { text: "Approved", className: "text-success" };
      case 2: return { text: "Completed", className: "text-info" };
      case 3: return { text: "Rejected", className: "text-danger" };
      default: return { text: "Unknown", className: "text-secondary" };
    }
  };

  // Project Task Status Info - for ongoing projects list
  const getProjectStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { text: "Awaiting Assignment", className: "text-warning" };
      case 1: return { text: "In Progress", className: "text-success" };
      case 2: return { text: "Completed", className: "text-info" };
      default: return { text: "Unknown", className: "text-secondary" };
    }
  };

  const getSubmissionStatusInfo = (status: 0 | 1 | 2) => {
    switch (status) {
      case 0: return { text: "Pending Review", className: "bg-warning" };
      case 1: return { text: "Approved", className: "bg-success" };
      case 2: return { text: "Rejected", className: "bg-danger" };
      default: return { text: "Unknown", className: "bg-secondary" };
    }
  };

  const mapApplicantToIFreelancer = useCallback((applicant: Applicant): IFreelancer => {
    return {
      user_id: applicant.user_id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      bio: applicant.bio || null,
      profile_picture: applicant.profile_picture || null,
      skills: applicant.skills || [],
      superpowers: [],
      languages: [],
      city: null,
      country: null,
      email: applicant.email,
      rate_amount: "0.00",
      currency: "USD",
      availability: "not specified",
      latitude: null,
      longitude: null,
      profile_title: null,
      short_description: null,
      youtube_videos: [],
      experience_level: null,
      work_type: null,
      hours_per_week: null,
      kyc_verified: false,
      aadhaar_verification: false,
      hire_count: 0,
      review_id: 0,
      total_earnings: 0,
      time_spent: 0,
      role_name: null,
      experience: [],
      education: [],
      previous_works: [],
      certification: [],
      services: [],
      portfolio_links: [],
    };
  }, []);

  const handleViewProfile = async (applicantId: number) => {
    setLoadingProfile(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Failed to fetch freelancer data`);

      const responseData = await response.json();
      const foundFreelancer = responseData.data?.find((f: any) => f.user_id === applicantId);

      if (foundFreelancer) {
        const youtubeVideos = (foundFreelancer.portfolio_links || [])
          .filter((link: string) => link.includes("youtube.com/watch?v="))
          .map((link: string) => {
            const videoId = link.split('v=')[1]?.split('&')[0] || '';
            return { id: videoId, url: link };
          })
          .filter((video: any) => video.id !== '');

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
          email: foundFreelancer.email || '',
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

  const handleBackToApplicants = () => {
    setSelectedApplicant(null);
  };

  const handleOpenChat = (applicant: Applicant) => {
    // TODO: Implement chat functionality
    toast(`Chat with ${applicant.first_name} ${applicant.last_name} - Coming soon!`);
  };

  return (
    <>
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
            <h2 className="main-title m0">
              {selectedApplicant
                ? `Profile: ${selectedApplicant.first_name} ${selectedApplicant.last_name}`
                : selectedProjectForSubmissions
                  ? `Submissions for: ${selectedProjectForSubmissions.title}`
                  : selectedProjectForApplicants
                    ? `Applications for: ${selectedProjectForApplicants.title}`
                    : (isPostingJob ? "Post a New Job" : "Ongoing Projects")}
            </h2>
            {selectedApplicant && (
              <button className="dash-btn-two tran3s" onClick={handleBackToApplicants}>
                ← Back to Applicants
              </button>
            )}
            {(selectedProjectForApplicants || selectedProjectForSubmissions) && !selectedApplicant && (
              <button className="dash-btn-two tran3s" onClick={handleBackToJobs}>
                ← Back to Jobs
              </button>
            )}
          </div>

          {selectedApplicant ? (
            <ApplicantProfile
              selectedApplicant={selectedApplicant}
              loadingProfile={loadingProfile}
              onBackToApplicants={handleBackToApplicants}
            />
          ) : selectedProjectForSubmissions ? (
            // Submissions View
            <div className="bg-white card-box border-20">
              <div className="table-responsive">
                {submissionsLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : submissionsError ? (
                  <div className="alert alert-danger">{submissionsError}</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center p-5">
                    <h5>No Submissions Yet</h5>
                    <p className="text-muted mb-0">No freelancers have submitted their work for this project.</p>
                  </div>
                ) : (
                  <table className="table job-alert-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>Freelancer</th>
                        <th>Submitted On</th>
                        <th>Submission Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody className="border-0">
                      {submissions.map((submission) => {
                        const statusInfo = getSubmissionStatusInfo(submission.status);
                        return (
                          <tr key={submission.submission_id} className="align-middle">
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={submission.freelancer_profile_picture || 'https://via.placeholder.com/50'}
                                  alt={submission.freelancer_name}
                                  className="rounded-circle me-3"
                                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                                />
                                <div>
                                  <div className="job-name fw-500">{submission.freelancer_name}</div>
                                  <small className="text-muted">{submission.freelancer_email}</small>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(submission.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</td>
                            <td>
                              <span className={`fw-bold ${statusInfo.className === 'bg-warning' ? 'text-warning' : statusInfo.className === 'bg-success' ? 'text-success' : 'text-danger'}`}>
                                {statusInfo.text}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                className="btn"
                                onClick={() => handleOpenSubmissionModal(submission)}
                                style={{
                                  backgroundColor: '#31795A',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '14px',
                                  fontWeight: '500'
                                }}
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : selectedProjectForApplicants ? (
            <ApplicantsList
              applicants={applicants}
              applicantsLoading={applicantsLoading}
              applicantsError={applicantsError}
              savedApplicants={savedApplicants}
              selectedProjectForApplicants={selectedProjectForApplicants}
              onViewProfile={handleViewProfile}
              onToggleSave={handleToggleSave}
              onUpdateApplicantStatus={handleUpdateApplicantStatus}
              getStatusInfo={getApplicationStatusInfo}
              onOpenChat={handleOpenChat}
            />
          ) : (
            <>
              {isPostingJob ? (
                <PostJobForm onBackToList={handleReturnToList} />
              ) : (
                <>
                  <DashboardSearchBar
                    placeholder="Search ongoing projects by title, category..."
                    onSearch={setSearchQuery}
                  />

                  <div className="bg-white card-box border-20">
                    <div className="table-responsive">
                      <table className="table job-alert-table">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Title</th>
                            <th>Category</th>
                            <th>Budget</th>
                            <th>Date Created</th>
                            <th>Project Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody className="border-0">
                          {loading && (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </td>
                            </tr>
                          )}
                          {error && (
                            <tr>
                              <td colSpan={6} className="text-center text-danger py-4">
                                {error}
                              </td>
                            </tr>
                          )}
                          {!loading && !error && projects.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-5">
                                <h5>No Ongoing Projects</h5>
                                <p className="text-muted mb-0">You don't have any ongoing projects at the moment.</p>
                              </td>
                            </tr>
                          )}
                          {!loading && !error && projects
                            .filter((project) => {
                              if (!searchQuery.trim()) return true;
                              const query = searchQuery.toLowerCase();
                              return (
                                project.title.toLowerCase().includes(query) ||
                                project.category.toLowerCase().includes(query)
                              );
                            })
                            .map((project) => {
                              const statusInfo = getProjectStatusInfo(project.status);
                              return (
                                <tr key={project.project_id} className="align-middle">
                                  <td>
                                    <div className="job-name fw-500">{project.title}</div>
                                  </td>
                                  <td>{project.category}</td>
                                  <td>₹{project.budget?.toLocaleString() ?? 0}</td>
                                  <td>
                                    {new Date(project.date_created).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </td>
                                  <td>
                                    <span className={`fw-bold ${statusInfo.className}`}>
                                      {statusInfo.text}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    <button
                                      className="btn"
                                      onClick={() => handleViewSubmissionsClick(project)}
                                      style={{
                                        backgroundColor: '#31795A',
                                        color: 'white',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                      }}
                                    >
                                      View Submissions
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Submission Review Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, overflow: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Review Submission</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseSubmissionModal}
                  disabled={reviewingSubmission}
                ></button>
              </div>
              <div className="modal-body">
                {/* Freelancer Info */}
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                  <img
                    src={selectedSubmission.freelancer_profile_picture || 'https://via.placeholder.com/80'}
                    alt={selectedSubmission.freelancer_name}
                    className="rounded-circle me-3"
                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-1">{selectedSubmission.freelancer_name}</h6>
                    <p className="text-muted mb-0">{selectedSubmission.freelancer_email}</p>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Submitted Files</label>
                  <div className="bg-light p-3 rounded">
                    {selectedSubmission.submitted_files.split(',').map((link, index) => (
                      <div key={index} className="mb-2">
                        <a
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none d-flex align-items-center"
                        >
                          <i className="bi bi-link-45deg me-2"></i>
                          <span className="text-break">{link.trim()}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedSubmission.additional_notes && (
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Additional Notes</label>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0">{selectedSubmission.additional_notes}</p>
                    </div>
                  </div>
                )}

                {/* Submission Info */}
                <div className="mb-4">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Submitted On</label>
                      <p>{new Date(selectedSubmission.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Status</label>
                      <p>
                        <span className={`badge ${getSubmissionStatusInfo(selectedSubmission.status).className}`}>
                          {getSubmissionStatusInfo(selectedSubmission.status).text}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alert for pending submissions */}
                {selectedSubmission.status === 0 && (
                  <div className="alert alert-info" role="alert">
                    <strong>Action Required:</strong> Please review the submitted work and either approve or reject it.
                    Approving will automatically assign this freelancer to the project.
                  </div>
                )}

                {/* Alert for reviewed submissions */}
                {selectedSubmission.status === 1 && (
                  <div className="alert alert-success" role="alert">
                    <strong>Approved:</strong> This submission has been approved and the freelancer has been assigned to the project.
                  </div>
                )}

                {selectedSubmission.status === 2 && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Rejected:</strong> This submission has been rejected. The freelancer can submit again.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseSubmissionModal}
                  disabled={reviewingSubmission}
                >
                  Close
                </button>

                {selectedSubmission.status === 0 && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleReviewSubmission(selectedSubmission.submission_id, 2)}
                      disabled={reviewingSubmission}
                    >
                      {reviewingSubmission ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleReviewSubmission(selectedSubmission.submission_id, 1)}
                      disabled={reviewingSubmission}
                    >
                      {reviewingSubmission ? 'Processing...' : 'Approve & Assign'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OngoingJobArea;