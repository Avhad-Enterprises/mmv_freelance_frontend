// types/blog-type.ts

export interface IBlogDataType {
  blog_id: number;
  title: string;
  // img: string; // API se string aata hai (URL)
  slug: string;
  featured_image: string;
  content: string;
  short_description: string;
  author_name: string;
  category: string;
  is_featured: boolean;
  views: number;
  seo_title: string;
  seo_description: string;
  reading_time: number;
  comment_count: number;
  scheduled_at: string | null;
  sub_section: string;   // API se string aata hai (JSON string)
  tags: string[];          // API se string aata hai (JSON string)
  notes: string;         // API se string aata hai (JSON string)
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  updated_by: number;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
}
