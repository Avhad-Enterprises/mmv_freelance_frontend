"use client";
import React, { useState, useMemo } from "react";
import CareersItem from "./CareersItem";
import { useCareers } from "@/services/careers.service";
import { Career } from "@/types/career.types";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_INCREMENT = 6;

const CareersList = () => {
    const { data: careers = [], isLoading, error } = useCareers();
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    // Filter careers based on search query
    const filteredCareers = useMemo(() => {
        if (!searchQuery.trim()) return careers;

        const query = searchQuery.toLowerCase();
        return careers.filter(
            (career: Career) =>
                career.title.toLowerCase().includes(query) ||
                career.short_description.toLowerCase().includes(query) ||
                career.office_location.toLowerCase().includes(query)
        );
    }, [careers, searchQuery]);

    // Derived state for visible items
    const visibleCareers = filteredCareers.slice(0, visibleCount);
    const hasMore = visibleCount < filteredCareers.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + LOAD_MORE_INCREMENT);
    };

    if (isLoading) {
        return (
            <div className="careers-section pt-80 pb-80">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading job openings...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="careers-section pt-80 pb-80">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="alert alert-danger text-center">
                                Failed to load job openings. Please try again later.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="careers-section pt-60 pb-80" style={{ backgroundColor: '#f9fafb' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        {/* Modern Search Section */}
                        <div className="text-center mb-50">
                            <div className="search-container mx-auto" style={{ maxWidth: '700px', position: 'relative' }}>
                                <div className="d-flex align-items-center" style={{
                                    background: 'white',
                                    borderRadius: '50px',
                                    padding: '8px 8px 8px 24px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #f3f4f6'
                                }}>
                                    <svg
                                        style={{ width: '20px', height: '20px', color: '#6b7280', marginRight: '12px' }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by title, keyword, or location..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setVisibleCount(INITIAL_VISIBLE_COUNT); // Reset pagination on search
                                        }}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            width: '100%',
                                            fontSize: '16px',
                                            color: '#1f2937',
                                            padding: '8px 0'
                                        }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        style={{
                                            borderRadius: '50px',
                                            padding: '12px 32px',
                                            fontWeight: '600',
                                            backgroundColor: '#D2F34C',
                                            borderColor: '#D2F34C',
                                            color: '#100631',
                                            marginLeft: '12px',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Search
                                    </button>
                                </div>
                                {searchQuery && (
                                    <div className="mt-2 text-start px-4">
                                        <span className="text-muted" style={{ fontSize: '14px' }}>
                                            Found {filteredCareers.length} matches
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Jobs Grid */}
                        {visibleCareers.length > 0 ? (
                            <>
                                <div className="row g-4">
                                    {visibleCareers.map((career: Career) => (
                                        <div key={career.job_id} className="col-lg-4 col-md-6 col-12">
                                            <CareersItem item={career} />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="text-center mt-50">
                                        <button
                                            onClick={handleLoadMore}
                                            className="btn btn-outline-dark"
                                            style={{
                                                padding: '12px 36px',
                                                borderRadius: '50px',
                                                fontWeight: '600',
                                                borderWidth: '2px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#100631';
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.borderColor = '#100631';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#100631';
                                                e.currentTarget.style.borderColor = '#100631';
                                            }}
                                        >
                                            Load More Positions
                                        </button>
                                        <p className="text-muted mt-3" style={{ fontSize: '13px' }}>
                                            Showing {visibleCareers.length} of {filteredCareers.length} jobs
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <div style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    padding: '60px 20px',
                                    maxWidth: '500px',
                                    margin: '0 auto',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <div style={{
                                        background: '#f3f4f6',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px'
                                    }}>
                                        <svg
                                            style={{ width: '40px', height: '40px', color: '#9ca3af' }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-gray-900 mb-2 font-bold">No jobs found</h4>
                                    <p className="text-muted mb-0">
                                        We couldn't find any positions matching "{searchQuery}".
                                        <br />Try adjusting your search terms.
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="btn btn-link mt-3"
                                        style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersList;
