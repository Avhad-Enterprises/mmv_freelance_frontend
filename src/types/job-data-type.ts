export interface IJobType {
  category: any;
  projects_task_id?: number;
  client_id?: number;
  editor_id?: number | null;
  project_title?: string;
  project_category?: string;
  deadline?: string; // ISO date string
  project_description?: string;
  budget?: number;
  tags?: string[];
  skills_required?: string[];
  reference_links?: string[];
  additional_notes?: string;
  projects_type?: string;
  project_format?: string;
  audio_voiceover?: string;
  video_length?: number;
  preferred_video_style?: string;
  sample_project_file?: string | null;
  project_files?: string[];
  show_all_files?: boolean;
  is_active?: number;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  updated_by?: number | null;
  is_deleted?: boolean;
  deleted_by?: number | null;
  deleted_at?: string | null;



  // UI-specific or fallback fields (may not come from API)
  logo?: any; // optional - for placeholder logo
 
  location?: string; // optional - fallback, not in API
  experience?: string; // if added later in schema
  company?: string; // for display - if derived
  english_fluency?: string; // optional
  overview?: string; // optional
  salary_duration?: string; // optional
  id?: number; // optional
  duration?: string; // optional
  title?: string; 
  salary?: any; 
  date?:any;
}
