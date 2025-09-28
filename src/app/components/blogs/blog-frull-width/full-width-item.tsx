import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IBlogDataType } from "@/types/blog-type";

const FullWidthItem = ({ blog }: { blog: IBlogDataType }) => {
  const {
    blog_id,
    featured_image,
    created_at,
    is_featured,
    tags,
    title,
  } = blog;

  const formattedDate = created_at
  ? new Date(created_at).toLocaleDateString()
  : "N/A";

  //Use featured_image directly (it's already a full URL)
  const imageUrl = featured_image;
  console.log(`Image URL: ${imageUrl}`); // Debugging log

  return (
    <article className="blog-meta-two box-layout mb-50 lg-mb-30">
      <figure className="post-img m0">
        <Link href={`/blog-details/${blog_id}`} className="w-100 d-block">
          <Image
            src={imageUrl || ""}
            alt="blog-img"
            width={600}
            height={400}
            className="lazy-img w-100 tran4s"
          />
        </Link>
        {tags?.[0] && (
  <Link href={`/blog-details/${blog_id}`} className="tags fw-500">
    {tags[0]}
  </Link>
)}
      </figure>

      <div className="post-data mt-35">
        <div className="date">
          {is_featured && <span className="fw-500 text-dark">Featured - </span>}
          <Link href={`/blog-details/${blog_id}`}>{formattedDate}</Link>
        </div>

        <Link href={`/blog-details/${blog_id}`}>
          <h4 className="tran3s blog-title">
            {`${title?.substring(0, 50)}...`}
          </h4>
        </Link>

        <Link
          href={`/blog-details/${blog_id}`}
          className="continue-btn tran3s d-flex align-items-center"
        >
          <span className="fw-500 me-2">Continue Reading</span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default FullWidthItem;
