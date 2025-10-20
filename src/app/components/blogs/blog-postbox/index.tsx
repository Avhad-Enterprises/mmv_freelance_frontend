"use client";

import React, { useEffect, useState } from "react";
import BlogSidebar from "./sidebar";
import BlogPagination from "./blog-pagination";
import BlogItem from "./blog-item";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

// Helper function to parse tags
function parseTagsArray(tagStr?: string | null): string[] {
  if (!tagStr || typeof tagStr !== 'string' || tagStr.length <= 2) {
    return [];
  }
  // Removes {}, splits by ',', and cleans up each tag by removing quotes
  return tagStr.slice(1, -1).split(',').map(tag => tag.trim().replace(/"/g, ''));
}

const BlogPostboxArea = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await makeGetRequest("api/v1/blog/getallblogs");

        if (Array.isArray(response.data.data)) {
          setBlogs(response.data.data);
        } else {
          console.warn("API did not return an array:", response.data.data);
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

  // Filter blogs based on selected category and tags
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = !selectedCategory || blog.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => {
      if (typeof blog.tags === 'string') {
        return parseTagsArray(blog.tags).includes(tag);
      }
      if (Array.isArray(blog.tags)) {
        return blog.tags.includes(tag);
      }
      return false;
    });
    return matchesCategory && matchesTags;
  });

  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

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
                      total={filteredBlogs.length}
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
                <BlogSidebar
                  blogs={blogs}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onSelectCategory={setSelectedCategory}
                  onSelectTag={(tag) => {
                    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPostboxArea;
