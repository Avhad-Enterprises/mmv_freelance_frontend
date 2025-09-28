"use client";

import React, { useEffect, useState } from "react";
import BlogPagination from "../blog-postbox/blog-pagination";
import FullWidthItem from "./full-width-item";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

const BlogFullWidthArea = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await makeGetRequest("blog/getallblogs");

        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.warn("API did not return an array:", response.data);
          setBlogs([]);
        }

        console.log("Fetched Blogs:", response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBlogs = Array.isArray(blogs)
    ? blogs.slice(indexOfFirst, indexOfLast)
    : [];

  return (
    <section className="blog-section bg-color pt-100 lg-pt-80 pb-120 lg-pb-80">
      <div className="container">
        <div className="row gx-xl-5">
          {loading ? (
            <p className="text-center">Loading blogs...</p>
          ) : currentBlogs.length > 0 ? (
            currentBlogs.map((b) => (
              <div key={b.blog_id} className="col-md-6">
                <FullWidthItem blog={b} />
              </div>
            ))
          ) : (
            <p className="text-center">No blogs found.</p>
          )}
        </div>

        {/* Pagination only if there are blogs */}
        {Array.isArray(blogs) && blogs.length > 0 && (
          <BlogPagination
            total={blogs.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
};

export default BlogFullWidthArea;
