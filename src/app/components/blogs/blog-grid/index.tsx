"use client";

import React, { useEffect, useState } from "react";
import BlogSidebar from "../blog-postbox/sidebar";
import BlogPagination from "../blog-postbox/blog-pagination";
import BlogItem from "../blog-postbox/blog-item";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

const BlogGridArea = () => {
  const [allBlogs, setAllBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Safe JSON parser
  const safeJson = (str: any): string[] => {
    try {
      return typeof str === "string" ? JSON.parse(str) : [];
    } catch (error) {
      console.error("JSON parse error:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await makeGetRequest("blog/getallblogs");
        const data = res.data?.data;

        const parsedBlogs: IBlogDataType[] = data.map((b: any): IBlogDataType => ({
          ...b,
          sub_section: safeJson(b.sub_section),
          tags: safeJson(b.tags),
          notes: safeJson(b.notes),
        }));

        console.log("Parsed Blogs:", parsedBlogs); // Debugging log
        setAllBlogs(parsedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = allBlogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="blog-section pt-100 lg-pt-80 pb-120 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <p>Loading...</p>
            ) : paginatedBlogs.length > 0 ? (
              <div className="row">
                {paginatedBlogs.map((blog) => (
                  <div key={blog.blog_id} className="col-md-6">
                    <BlogItem blog={blog} style_2={true} />
                  </div>
                ))}
              </div>
            ) : (
              <p>No blogs found.</p>
            )}

            {!loading && allBlogs.length > itemsPerPage && (
              <BlogPagination
                total={allBlogs.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="col-lg-4">
            <BlogSidebar/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGridArea;
