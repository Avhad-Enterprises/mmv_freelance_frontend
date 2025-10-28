"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogSidebar from "../blog-postbox/sidebar2";
import BlogCommentForm from "../../forms/blog-comment-form";
import { IBlogDataType } from "@/types/blog-type";
import { makeGetRequest } from "@/utils/api";

// Helper type for a single sub-section
interface IBlogSection {
  heading: string;
  content: string;
}

// Helper to format date strings
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Date not available";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
}

// Helper to parse the non-standard tags string from your API
function parseTagsArray(tagStr?: string | null): string[] {
  if (!tagStr || typeof tagStr !== 'string' || tagStr.length <= 2) {
    return [];
  }
  return tagStr.slice(1, -1).split(',').map(tag => tag.trim().replace(/"/g, ''));
}

// Helper to parse the complex, escaped sub_section JSON string
function parseSectionsArray(sectionStr?: string | null): IBlogSection[] {
  if (!sectionStr || typeof sectionStr !== 'string' || sectionStr.length <= 2) {
    return [];
  }
  try {
    let content = sectionStr.slice(1, -1);
    const stringifiedObjects = content.split('","');
    if (stringifiedObjects.length > 0) {
      if (stringifiedObjects[0].startsWith('"')) {
        stringifiedObjects[0] = stringifiedObjects[0].substring(1);
      }
      const lastIndex = stringifiedObjects.length - 1;
      if (stringifiedObjects[lastIndex].endsWith('"')) {
        stringifiedObjects[lastIndex] = stringifiedObjects[lastIndex].slice(0, -1);
      }
    }
    return stringifiedObjects.map(objStr => {
      const correctedStr = objStr.replace(/\\"/g, '"');
      return JSON.parse(correctedStr);
    });
  } catch (error) {
    console.error("Failed to parse sub_sections:", sectionStr, error);
    return [];
  }
}

const BlogDetailsArea = ({ blogId }: { blogId: number }) => {
  const [item, setItem] = useState<IBlogDataType | null>(null);
  const [allBlogs, setAllBlogs] = useState<IBlogDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchAndSetBlog = async () => {
      if (!blogId) return;
      setLoading(true);

      try {
        // Step 1: Fetch ALL blogs from the single endpoint
        const res = await makeGetRequest('api/v1/blog');
        
        if (res?.data?.data && Array.isArray(res.data.data)) {
          const blogs: IBlogDataType[] = res.data.data;
          setAllBlogs(blogs); // Save all blogs for the sidebar

          // Step 2: Find the specific blog by its ID from the fetched list
          const foundBlog = blogs.find(blog => blog.blog_id == blogId);

          if (foundBlog) {
            setItem(foundBlog);
          } else {
            console.error(`Blog with ID ${blogId} not found.`);
            setItem(null);
          }
        } else {
          setAllBlogs([]);
          setItem(null);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetBlog();
  }, [blogId]);

  if (loading) {
    return <div className="text-center py-10"><p>Loading blog details...</p></div>;
  }

  if (!item) {
    return <div className="text-center py-10"><p>Blog not found.</p></div>;
  }
  
  // Safely parse data regardless of type (string from API vs. array from type definition)
  const parsedTags: string[] = typeof item.tags === 'string'
    ? parseTagsArray(item.tags)
    : (Array.isArray(item.tags) ? item.tags : []);

  const parsedSections: IBlogSection[] = typeof item.sub_section === 'string'
    ? parseSectionsArray(item.sub_section)
    : (Array.isArray(item.sub_section) ? item.sub_section : []);

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
                      {!imageError ? (
                        <Image
                          src={item.featured_image}
                          alt={item.title || "Blog Feature Image"}
                          className="lazy-img"
                          width={800}
                          height={400}
                          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                          unoptimized={true}
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '400px',
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6b7280',
                            fontSize: '16px',
                            borderRadius: '8px'
                          }}
                        >
                          Image not available
                        </div>
                      )}
                    </div>
                  )}

                  <p>{item.short_description}</p>
                  <div dangerouslySetInnerHTML={{ __html: item.content || "" }} />

                  {parsedSections.length > 0 && (
                    <div className="pt-20">
                      {parsedSections.map((sec, i) => (
                        <div key={i} className="mb-4">
                          <h4 className="blog-inner-title">{sec.heading}</h4>
                          <p>{sec.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bottom-widget border-bottom d-sm-flex align-items-center justify-content-between">
                    {parsedTags.length > 0 && (
                      <ul className="d-flex tags style-none pb-20">
                        <li>Tag:</li>
                        {parsedTags.map((tag, i) => (
                          <li key={i}>
                            <a href="#">{tag}{i !== parsedTags.length - 1 ? ',' : ''}</a>
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="d-flex share-icon align-items-center style-none pb-20">
                      <li>Share:</li>
                      <li><a href="#"><i className="bi bi-google"></i></a></li>
                      <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                      <li><a href="#"><i className="bi bi-instagram"></i></a></li>
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
                    <Link href="/register" className="text-decoration-underline">Sign</Link>{" "}
                    in to post your comment or signup if you do not have any account.
                  </p>
                  <BlogCommentForm />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <BlogSidebar
                blogs={allBlogs}
                selectedCategory={null}
                selectedTags={[]}
                onSelectCategory={() => {}}
                onSelectTag={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;