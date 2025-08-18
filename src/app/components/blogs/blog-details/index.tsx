"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogSidebar from "../blog-postbox/sidebar";
import BlogCommentForm from "../../forms/blog-comment-form";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api"; // wrapper import

// Safe helpers
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    return dateStr.split("T")[0];
  } catch {
    return "";
  }
}

function parseJsonArray(str?: string | null): string[] {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

const BlogDetailsArea = ({ blogId }: { blogId: number }) => {
  const [item, setItem] = useState<IBlogDataType | null>(null);
  const [loading, setLoading] = useState(true);

  //Fetch blog by ID
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await makeGetRequest(`blog/getblog/${blogId}`);
        if (res?.data?.data) {
          setItem(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading blog details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <p>Blog not found.</p>
      </div>
    );
  }

  // Safe parsing
  const parsedTags = parseJsonArray(item?.tags);
  const parsedSections = parseJsonArray(item?.sub_section);

  return (
    <section className="blog-section pt-100 lg-pt-80">
      <div className="container">
        <div className="border-bottom pb-160 xl-pb-130 lg-pb-80">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-details-page pe-xxl-5 me-xxl-3">
                <article className="blog-details-meta">
                  <div className="blog-pubish-date">
                    {item.category} · {formatDate(item.created_at)} · By{" "}
                    <a href="#">{item.author_name}</a>
                  </div>

                  <h2 className="blog-heading">{item.title}</h2>

                  {item.featured_image && (
                    <div className="img-meta mb-15">
                      <Image
                        src={item.featured_image}
                        alt={item.title}
                        className="lazy-img"
                        width={800}
                        height={400}
                      />
                    </div>
                  )}

                  <p>{item.short_description}</p>
                  <p>{item.content}</p>

                  {parsedSections.length > 0 && (
                    <div className="pt-20">
                      <h4>Sections</h4>
                      <ul>
                        {parsedSections.map((sec, i) => (
                          <li key={i}>• {sec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
                    {parsedTags.length > 0 && (
                      <ul className="d-flex tags style-none pb-20">
                        <li>Tag:</li>
                        {parsedTags.map((tag, i) => (
                          <li key={i}>
                            <a href="#">{tag},</a>
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="d-flex share-icon align-items-center style-none pb-20">
                      <li>Share:</li>
                      <li>
                        <a href="#">
                          <i className="bi bi-google"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="bi bi-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="bi bi-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </article>

                <div className="blog-comment-area">
                  <h3 className="blog-inner-title pb-15">
                    {item.comment_count} Comments
                  </h3>
                  <p>No comments yet...</p>
                </div>

                <div className="blog-comment-form">
                  <h3 className="blog-inner-title">Leave A Comment</h3>
                  <p>
                    <Link
                      href="/register"
                      className="text-decoration-underline"
                    >
                      Sign
                    </Link>{" "}
                    in to post your comment or signup if you do not have any
                    account.
                  </p>
                  <BlogCommentForm />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
