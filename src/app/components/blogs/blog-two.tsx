"use client";
import React, { useEffect, useState } from "react";
import BlogItemTwo from "./blog-item/blog-item-2";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

const BlogTwo = () => {
  const [blogs, setBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await makeGetRequest("blog/getallblogs");
        const data: IBlogDataType[] = response.data;

        const formattedBlogs = data
          .filter((item) => item.is_active === 1 && item.is_deleted === false)
          .map((item) => ({
            ...item,
            tags: JSON.parse(item.tags as unknown as string || "[]"),
            notes: JSON.parse(item.notes as unknown as string || "[]"),
            sub_section: JSON.parse(item.sub_section as unknown as string || "[]"),
          }));

        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p className="text-center">Loading blogs...</p>;
  }

  return (
    <section className="blog-section-two pt-180 xl-pt-150 lg-pt-100 pb-150 xl-pb-130 lg-pb-80">
      <div className="container">
        <div className="position-relative">
          <div
            className="title-one text-center mb-30 lg-mb-10 wow fadeInUp"
            data-wow-delay="0.3s"
          >
            <h2 className="fw-600">Our Blog</h2>
          </div>
          <div className="row gx-xxl-5">
            {blogs.map((item) => (
              <div key={item.blog_id} className="col-lg-4 col-md-6">
                <BlogItemTwo blog={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTwo;
