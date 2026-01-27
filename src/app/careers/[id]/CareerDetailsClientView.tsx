"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/layouts/headers/header";
import CommonBreadcrumb from "@/app/components/common/common-breadcrumb";
import Footer from "@/layouts/footers/footer-one";
import { Career } from "@/types/career.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

const CareerDetailsClientView = () => {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.id as string;

    const [career, setCareer] = useState<Career | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCareerDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/careers/${jobId}`);
                if (!response.ok) throw new Error("Failed to fetch");

                const result = await response.json();
                setCareer(result.data);
            } catch (err) {
                console.error("Error fetching career details:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchCareerDetails();
        }
    }, [jobId]);

    if (loading) {
        return (
            <>
                <Header />
                <CommonBreadcrumb title="Job Details" subtitle="Loading..." />
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !career) {
        return (
            <>
                <Header />
                <CommonBreadcrumb title="Job Details" subtitle="Not Found" />
                <div className="container py-5">
                    <div className="text-center">
                        <h3>Job not found</h3>
                        <Link href="/careers" className="btn btn-primary mt-3">
                            Back to Careers
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <CommonBreadcrumb title={career.title} subtitle="Job Details" />

            <div className="job-details-section pt-80 pb-80" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Header Card */}
                            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                                <div className="d-flex align-items-center gap-4">
                                    {career.company_logo && (
                                        <div
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                                background: '#f9fafb',
                                                border: '2px solid #e5e7eb',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}
                                        >
                                            <img
                                                src={career.company_logo}
                                                alt={career.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    padding: '16px'
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <h2 className="mb-2">{career.title}</h2>
                                        <div className="d-flex flex-wrap gap-3 align-items-center">
                                            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                                <svg
                                                    style={{ width: '16px', height: '16px', marginRight: '6px', marginTop: '-2px' }}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {career.office_location}
                                            </span>
                                            <span className="text-muted">
                                                Posted on {new Date(career.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        href={career.apply_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary px-4 py-2"
                                        style={{
                                            background: '#244034',
                                            border: 'none',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Apply Now →
                                    </Link>
                                </div>
                            </div>

                            {/* Description */}
                            {career.short_description && (
                                <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                                    <h4 className="mb-3">About the Role</h4>
                                    <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
                                        {career.short_description}
                                    </p>
                                </div>
                            )}

                            {/* Detailed Description */}
                            {career.detail_description && (
                                <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                                    <h4 className="mb-3">Job Description</h4>
                                    <div
                                        className="text-muted"
                                        style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                                    >
                                        {career.detail_description}
                                    </div>
                                </div>
                            )}

                            {/* Job Details */}
                            {career.job_details && (
                                <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                                    <h4 className="mb-3">Requirements & Benefits</h4>
                                    <div
                                        className="text-muted"
                                        style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                                    >
                                        {career.job_details}
                                    </div>
                                </div>
                            )}

                            {/* Apply CTA */}
                            <div className="bg-white rounded-3 shadow-sm p-4 text-center">
                                <h4 className="mb-3">Ready to Apply?</h4>
                                <p className="text-muted mb-4">
                                    Join our team and be part of something amazing!
                                </p>
                                <Link
                                    href={career.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg px-5"
                                    style={{
                                        background: '#244034',
                                        border: 'none'
                                    }}
                                >
                                    Apply for this Position →
                                </Link>
                            </div>

                            {/* Back Button */}
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => router.back()}
                                    className="btn btn-outline-secondary"
                                >
                                    ← Back to All Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default CareerDetailsClientView;
