import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ICompany } from "@/types/company-type";

const CompanyGridItem = ({ item }: { item: ICompany }) => {
  const imgSrc = typeof item.img === 'string' ? item.img : (item.img as any)?.src || '';

  return (
    <div
      className={`company-grid-layout ${item.isFav ? "favourite" : ""} mb-30`}
    >
      <Link href="/company-details"
        className="company-logo me-auto ms-auto rounded-circle"
      >
        {/* Guard against empty image src - fall back to placeholder */}
        {imgSrc && imgSrc.trim() !== '' ? (
          // Use standard img for dynamic/external images to avoid next/image config issues
          <img src={imgSrc} alt={item.name} className="lazy-img rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100'; }} />
        ) : (
          <img src={'https://via.placeholder.com/100'} alt={item.name} className="lazy-img rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        )}
      </Link>
      <h5 className="text-center">
        <Link href="/company-details" className="company-name tran3s">
          {item.name}
        </Link>
      </h5>
      <p className="text-center mb-auto">{item.location}</p>
      <div className="bottom-line d-flex">
        <Link href="/company-details">{item.vacancy} Vacancy</Link>
        <Link href="/company-details">
          <i className="bi bi-bookmark-dash"></i> Save
        </Link>
      </div>
    </div>
  );
};

export default CompanyGridItem;
