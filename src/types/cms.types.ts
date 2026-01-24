/**
 * CMS API Response wrapper
 */
export interface CMSResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Hero Section - Main banner content
 */
export interface HeroSection {
  id: number;
  title: string;
  subtitle?: string;
  hero_left_image?: string;
  hero_right_image?: string;
  background_image?: string;
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Trusted Company - Partner logos
 */
export interface TrustedCompany {
  id: number;
  company_name: string;
  logo_url: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Why Choose Us - Feature points with 5 expandable items
 */
export interface WhyChooseUs {
  id: number;
  title: string;
  description?: string;
  point_1?: string;
  point_1_description?: string;
  point_2?: string;
  point_2_description?: string;
  point_3?: string;
  point_3_description?: string;
  point_4?: string;
  point_4_description?: string;
  point_5?: string;
  point_5_description?: string;
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Featured Creator - Highlighted creator profiles
 */
export interface FeaturedCreator {
  id: number;
  name: string;
  title?: string;
  bio?: string;
  profile_image?: string;
  portfolio_url?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_instagram?: string;
  skills?: string[];
  stats?: {
    projects_completed?: number;
    rating?: number;
  };
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Success Story - Client testimonials
 */
export interface SuccessStory {
  id: number;
  client_name: string;
  client_title?: string;
  client_image?: string;
  testimonial: string;
  rating?: number;
  company?: string;
  company_logo?: string;
  project_type?: string;
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Landing FAQ - Frequently asked questions
 */
export interface LandingFaq {
  id: number;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  is_active: boolean;
  sort_order: number;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Complete Landing Page Content
 */
export interface LandingPageContent {
  hero: HeroSection[];
  trustedCompanies: TrustedCompany[]; // Changed from trusted_companies
  whyChooseUs: WhyChooseUs[]; // Changed from why_choose_us
  featuredCreators: FeaturedCreator[]; // Changed from featured_creators
  successStories: SuccessStory[]; // Changed from success_stories
  faqs: LandingFaq[]; // Changed from landing_faqs
}
