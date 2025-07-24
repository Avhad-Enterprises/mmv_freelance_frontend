"use client";

import React, { useEffect, useState } from "react";
import BlogSidebar from "../blog-postbox/sidebar";
import BlogPagination from "../blog-postbox/blog-pagination";
import BlogItem from "../blog-postbox/blog-item";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

const BlogGridArea = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await makeGetRequest("blogs");
        const data: IBlogDataType[] = res.data;
        // Filter by blog-postbox and take first 6
        const filtered = data
          .filter((b) => b.sub_section?.includes("blog-postbox"))
          .slice(0, 6);
        setBlogs(filtered);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="blog-section pt-100 lg-pt-80 pb-120 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="row">
                {blogs.map((b) => (
                  <div key={b.blog_id} className="col-md-6">
                    <BlogItem blog={b} style_2={true} />
                  </div>
                ))}
              </div>
            )}
            <BlogPagination />
          </div>

          <div className="col-lg-4">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGridArea;
