// This is the complete, authoritative interface for a freelancer
export interface IFreelancer {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  profile_picture: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  skills: string[];
  superpowers: string[];
  languages: string[];
  portfolio_links: string[];
  rate_amount: string;
  currency: string;
  availability: string;
  profile_title: string | null;
  short_description: string | null;
  experience_level: string | null;
  role_name: string | null;
  kyc_verified: boolean;
  aadhaar_verification: boolean;
  hire_count: number;
  review_id: number;
  total_earnings: number;
  time_spent: number;
  
  // Fields required by the component
  youtube_videos: { id: string; url: string; }[];
  experience: any[]; // Make sure your API provides this or default to []
  education: any[];
  previous_works: any[];
  certification: any[];
  services: any[];

  // Other raw fields from API
  created_at: string;
  updated_at: string;
  freelancer_id: number;
  work_type: string | null;
  hours_per_week: number | null;
}