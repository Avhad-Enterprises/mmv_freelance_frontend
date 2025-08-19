// types/blog-type.ts

export interface IBlogDataType {
  id(id: any): unknown;
  blog_id: number;
  title: string;
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
  sub_section: string[];
  tags: string[];
  notes: string[];
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  updated_by: number;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
}
