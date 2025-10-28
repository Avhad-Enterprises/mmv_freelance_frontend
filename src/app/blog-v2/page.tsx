"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/layouts/headers/header";
import Wrapper from "@/layouts/wrapper";
import JobPortalIntro from "../components/job-portal-intro/job-portal-intro";
import FooterOne from "@/layouts/footers/footer-one";
import BlogGridArea from "../components/blogs/blog-grid";
import { IBlogDataType } from "@/types/blog-type";

// Helper function to parse tags
const parseTags = (tagsString: string): string[] => {
  if (!tagsString || typeof tagsString !== 'string') return [];
  return tagsString.replace(/[{}"']/g, "").split(",").map(tag => tag.trim()).filter(Boolean);
};

const BlogV2Page = () => {
  const [allBlogs, setAllBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // CHANGED: Array instead of string | null

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blog/getallblogs`;
        const response = await axios.get(apiUrl);
        if (response.data && Array.isArray(response.data.data)) {
          const formattedBlogs = response.data.data.map((blog: any) => ({
            ...blog,
            tags: parseTags(blog.tags),
          }));
          setAllBlogs(formattedBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handler for category selection
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category));
    setSelectedTags([]); // Clear tags when selecting category
  };

  // Handler for tag selection - supports multiple tags
  const handleSelectTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // If tag is already selected, remove it
        return prev.filter(t => t !== tag);
      } else {
        // Add tag to selection
        return [...prev, tag];
      }
    });
    setSelectedCategory(null); // Clear category when selecting tags
  };

  // Apply the filter to the list of all blogs
  const filteredBlogs = allBlogs.filter(blog => {
    if (selectedCategory) {
      return blog.category === selectedCategory;
    }
    if (selectedTags.length > 0) {
      // Blog must have ALL selected tags
      return selectedTags.every(tag => blog.tags?.includes(tag));
    }
    return true; // If no filter is selected, show all blogs
  });

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <Header isAuthenticated={true} />

        <BlogGridArea
          allBlogs={allBlogs}
          blogsToDisplay={filteredBlogs}
          loading={loading}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags} // CHANGED: Pass array instead of single tag
          onSelectCategory={handleSelectCategory}
          onSelectTag={handleSelectTag}
        />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default BlogV2Page;