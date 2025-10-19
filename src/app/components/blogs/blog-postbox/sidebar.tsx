"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { makeGetRequest } from "@/utils/api";
import { IBlogDataType } from "@/types/blog-type"; // import type

// helper function
function safeParseTags(tags: any): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags; // already array
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      // fallback: comma separated string case
      return tags.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const BlogSidebar = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await makeGetRequest("api/v1/blog/getallblogs");
        setBlogs(res.data.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="blog-sidebar">Loading...</div>;
  }

  // Recent 3 blogs
  const recent_blogs = [...blogs].slice(-3);

  // Categories with count
  const categories = blogs.reduce((acc: Record<string, number>, blog) => {
    if (blog.category) {
      acc[blog.category] = (acc[blog.category] || 0) + 1;
    }
    return acc;
  }, {});

  // Safe Tags Parsing
  const keywords = Array.from(
    new Set(blogs.flatMap((b) => safeParseTags(b.tags)))
  );

  return (
    <div className="blog-sidebar ps-xl-4 md-mt-60">
      {/* Search Box */}
      <form action="#" className="search-form position-relative mb-50 lg-mb-40">
        <input type="text" placeholder="Search..." />
        <button type="button">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {/* Categories */}
      <div className="category-list mb-60 lg-mb-40">
        <h3 className="sidebar-title">Categories</h3>
        <ul className="style-none">
          {Object.entries(categories).map(([cat, count]) => (
            <li key={cat}>
              <Link href={`/category/${cat.toLowerCase()}`}>
                {cat} ({count})
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Blogs */}
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
                alt={b.title}
                width={80}
                height={80}
                className="rounded object-cover"
              />
            </div>
            <div className="post ps-4">
              <h4 className="mb-5">
                <Link href={`/blog-details/${b.slug}`} className="title tran3s">
                  {b.title}
                </Link>
              </h4>
              <div className="date">
                {new Date(b.created_at || '').toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Keywords */}
      <div className="sidebar-keyword">
        <h4 className="sidebar-title">Keywords</h4>
        <ul className="style-none d-flex flex-wrap">
          {keywords.map((kw) => (
            <li key={kw}>
              <Link href={`/tag/${kw.toLowerCase()}`}>{kw}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogSidebar;
