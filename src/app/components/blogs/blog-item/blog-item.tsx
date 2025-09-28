import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IBlogDataType } from "@/types/blog-type";

const BlogItem = ({ item }: { item: IBlogDataType }) => {
  return (
    <article className="blog-meta-one mt-35 wow fadeInUp">
      <figure className="post-img m0">
        <Link href={`/blog-details/${item.blog_id}`} className="w-100 d-block">
          <Image
            src={item.featured_image || ''}
            alt="blog-img"
            className="lazy-img blog-img w-100 tran4s"
          />
        </Link>
      </figure>
      <div className="post-data mt-30 lg-mt-20">
        <ul className="tags style-none d-flex">
         {item.tags?.map((t, i) => (
  <li key={i}>
    <a href="#">{t}</a>
  </li>
))}

        </ul>
        <Link href={`/blog-details/${item.blog_id}`} className="mt-10 mb-10">
          <h4 className="tran3s blog-title">{item.title}</h4>
        </Link>
        <div className="author">
          By{" "}
          <a href="#" className="text-dark fw-500">
            {item.author_name}
          </a>
        </div>
      </div>
    </article>
  );
};

export default BlogItem;
