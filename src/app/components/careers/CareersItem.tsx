import React from "react";
import Link from "next/link";
import { Career } from "@/types/career.types";

const CareersItem = ({ item }: { item: Career }) => {
    const hasDetailedInfo = item.detail_description || item.job_details;

    return (
        <div
            className="career-card h-100"
            style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
        >
            {/* Image/Logo Section - Top 60% */}
            <div
                style={{
                    height: '240px',
                    background: item.company_logo
                        ? 'white'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: item.company_logo ? '0' : '40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {item.company_logo ? (
                    <img
                        src={item.company_logo}
                        alt={item.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                ) : (
                    // Default illustration when no logo
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <svg
                            style={{ width: '120px', height: '120px', opacity: 0.9 }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}


            </div>

            {/* Content Section - Bottom 40% */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Job Title */}
                <h3
                    style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '0px',
                        lineHeight: '1.3',
                        // minHeight: '58px', // Removed to reduce gap for shorter titles
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {item.title}
                </h3>

                {/* Short Description */}
                <p
                    style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        marginBottom: '16px',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {item.short_description}
                </p>

                {/* Meta Info: Location • Type • Date */}
                <div
                    style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        alignItems: 'center'
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg
                            style={{ width: '14px', height: '14px' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.office_location}
                    </span>
                    <span style={{ color: '#d1d5db' }}>•</span>
                    <span>Full Time</span>
                    <span style={{ color: '#d1d5db' }}>•</span>
                    <span>
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                {/* View Details Link */}
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                    <Link
                        href={`/careers/${item.job_id}`}
                        style={{
                            color: '#00BF58',
                            fontSize: '15px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.gap = '10px';
                            e.currentTarget.style.color = '#008f42';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.gap = '6px';
                            e.currentTarget.style.color = '#00BF58';
                        }}
                    >
                        View Details
                        <svg
                            style={{ width: '16px', height: '16px' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CareersItem;
