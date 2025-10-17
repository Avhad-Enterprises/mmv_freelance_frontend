// This type represents a simplified project entry from the user's profile
export type ProjectSummary = {
  project_id: number;
  title: string;
  date_created: string;
  count: number; // Placeholder for applicant count
};

// This type represents the full payload for creating a new project
export type NewProjectPayload = {
  project_title: string;
  project_category: string;
  deadline: string;
  project_description: string;
  budget: number;
  tags?: string;
  skills_required: string[];
  reference_links: string[];
  additional_notes: string;
  projects_type: string;
  project_format: string;
  audio_voiceover: string;
  audio_description?: string;
  video_length: number;
  preferred_video_style: string;
  url: string;
  meta_title: string;
  meta_description: string;
  client_id?: number;
  created_by?: number;
};