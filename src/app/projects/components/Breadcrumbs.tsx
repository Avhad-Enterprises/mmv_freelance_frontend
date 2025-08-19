import React from 'react';
import Link from 'next/link';

export default function Breadcrumbs() {
  return (
    <div className="container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="https://demoapus1.com/freeio" className="breadcrumb-link">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">Projects List</li>
        </ol>
      </nav>
    </div>
  );
}
