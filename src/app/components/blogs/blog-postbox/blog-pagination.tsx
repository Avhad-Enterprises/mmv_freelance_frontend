// components/blogs/blog-postbox/blog-pagination.tsx

import React from "react";
import Image from "next/image";
import icon from "@/assets/images/icon/icon_50.svg";

interface BlogPaginationProps {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  center?: boolean;
}

const BlogPagination = ({
  total,
  currentPage,
  itemsPerPage,
  onPageChange,
  center = false,
}: BlogPaginationProps) => {
  const totalPages = Math.ceil(total / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul
      className={`pagination-one d-flex align-items-center ${
        center ? "justify-content-center" : ""
      } style-none pt-10`}
    >
      {pages.map((page) => (
        <li key={page} className={currentPage === page ? "active" : ""}>
          <button onClick={() => onPageChange(page)}>{page}</button>
        </li>
      ))}
      {totalPages > 4 && (
        <li className="ms-2">
          <button
            onClick={() => onPageChange(totalPages)}
            className="d-flex align-items-center"
          >
            Last <Image src={icon} alt="icon" className="ms-2" />
          </button>
        </li>
      )}
    </ul>
  );
};

export default BlogPagination;
