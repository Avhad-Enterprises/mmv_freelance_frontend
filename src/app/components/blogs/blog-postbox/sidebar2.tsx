"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IBlogDataType } from "@/types/blog-type";

// Helper to parse the non-standard tags string from your API
function parseTagsArray(tagStr?: string | null): string[] {
  if (!tagStr || typeof tagStr !== 'string' || tagStr.length <= 2) {
    return [];
  }
  // Removes {}, splits by ',', and cleans up each tag by removing quotes
  return tagStr.slice(1, -1).split(',').map(tag => tag.trim().replace(/"/g, ''));
}

interface BlogSidebarProps {
  blogs: IBlogDataType[];
  selectedCategory: string | null;
  selectedTags: string[];
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
}

const BlogSidebar = ({
  blogs,
  selectedCategory,
  selectedTags,
  onSelectCategory,
  onSelectTag,
}: BlogSidebarProps) => {
  if (!blogs || !blogs.length) {
    return <div className="blog-sidebar">Loading sidebar...</div>;
  }

  // Sort blogs by date to get the most recent ones
  const recent_blogs = [...blogs]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 3);

  // Calculate categories with counts
  const categories = blogs.reduce((acc: Record<string, number>, blog) => {
    if (blog.category) {
      acc[blog.category] = (acc[blog.category] || 0) + 1;
    }
    return acc;
  }, {});

  // **FIXED LOGIC**: Safely get all unique tags
  const allTags = [
    ...new Set(
      blogs.flatMap(blog => {
        // If tags is a string (from API), parse it.
        if (typeof blog.tags === 'string') {
          return parseTagsArray(blog.tags);
        }
        // If it's already an array, use it directly.
        if (Array.isArray(blog.tags)) {
          return blog.tags;
        }
        // Otherwise, return an empty array.
        return [];
      })
    )
  ];

  return (
    <div className="blog-sidebar ps-xl-4 md-mt-60">
      

      <div className="category-list mb-60 lg-mb-40">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="style-none">
          {Object.entries(categories).map(([cat, count]) => (
            <li key={cat}>
              <Link
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={selectedCategory === cat ? 'active' : ''}
              >
                {cat} ({count})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-recent-news mb-60 lg-mb-40">
        <h4 className="sidebar-title">Recent News</h4>
        {recent_blogs.map((b, i) => (
          <div
            key={b.blog_id}
            className={`news-block d-flex align-items-center pt-20 pb-20 border-top ${
              i === recent_blogs.length - 1 ? "border-bottom" : ""
            }`}
          >
            <div>
              <Image
                src={b.featured_image || "/images/placeholder.jpg"}
                alt={b.title || "Recent Post"}
                width={80}
                height={80}
                className="rounded object-cover"
              />
            </div>
            <div className="post ps-4">
              <h4 className="mb-5">
                <Link href={`/blog-details/${b.blog_id}`} className="title tran3s">
                  {b.title}
                </Link>
              </h4>
              <div className="date">
                {b.created_at
                  ? new Date(b.created_at).toLocaleDateString("en-US", {
                      day: "numeric", month: "short", year: "numeric",
                    })
                  : "Date not available"}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="sidebar-tags">
        <h3 className="sidebar-title">Tags</h3>
        <ul className="style-none d-flex flex-wrap">
          {allTags.map((tag) => (
            <li key={tag}>
              <Link href={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogSidebar;