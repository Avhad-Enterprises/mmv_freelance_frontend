"use client";

import React, { useState, useEffect } from "react";
import BlogSidebar from "../blog-postbox/sidebar";
import BlogPagination from "../blog-postbox/blog-pagination";
import BlogItem from "../blog-postbox/blog-item";
import { IBlogDataType } from "@/types/blog-type";

// Define the types for the props this component will receive
interface BlogGridAreaProps {
  allBlogs: IBlogDataType[];
  blogsToDisplay: IBlogDataType[];
  loading: boolean;
  selectedCategory: string | null;
  selectedTags: string[];
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
}

const BlogGridArea = ({
  allBlogs,
  blogsToDisplay,
  loading,
  selectedCategory,
  selectedTags,
  onSelectCategory,
  onSelectTag,
}: BlogGridAreaProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // When the filter changes, reset the pagination to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [blogsToDisplay]);

  // Paginate the filtered list of blogs
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogsToDisplay.slice(startIndex, startIndex + itemsPerPage);

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
              <p>No blogs found for the selected filter.</p>
            )}

            {!loading && blogsToDisplay.length > itemsPerPage && (
              <BlogPagination
                total={blogsToDisplay.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="col-lg-4">
            <BlogSidebar
              blogs={allBlogs}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onSelectCategory={onSelectCategory}
              onSelectTag={onSelectTag}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogGridArea;