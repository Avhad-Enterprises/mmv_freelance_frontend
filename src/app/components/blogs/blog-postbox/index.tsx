"use client";

import React, { useEffect, useState } from "react";
import BlogSidebar from "./sidebar";
import BlogPagination from "./blog-pagination";
import BlogItem from "./blog-item";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

const BlogPostboxArea = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
    <section className="blog-section pt-100 lg-pt-80 pb-120 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-xxl-11 m-auto">
            <div className="row">
              <div className="col-lg-8">
                {loading ? (
                  <p>Loading blogs...</p>
                ) : currentBlogs.length > 0 ? (
                  <>
                    {currentBlogs.map((b) => (
                      <BlogItem key={b.blog_id} blog={b} />
                    ))}
                    <BlogPagination
                      total={Array.isArray(blogs) ? blogs.length : 0}
                      currentPage={currentPage}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  </>
                ) : (
                  <p>No blogs found.</p>
                )}
              </div>

              <div className="col-lg-4">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPostboxArea;
