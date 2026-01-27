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
                            {/* Header Card with Short Description */}
                            <div className="bg-white rounded-3 shadow-sm p-4 p-lg-5 mb-4">
                                <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
                                    {career.company_logo && (
                                        <div
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '20px',
                                                background: 'white',
                                                border: '1px solid #f3f4f6',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
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
                                                    padding: '12px'
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-grow-1 w-100">
                                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                                            <div>
                                                <h1 className="h2 mb-2 fw-bold text-dark">{career.title}</h1>
                                                <div className="d-flex flex-wrap gap-3 align-items-center text-muted">
                                                    <span className="d-flex align-items-center gap-1">
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {career.office_location}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        Posted {new Date(career.created_at).toLocaleDateString('en-US', {
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
                                                className="btn btn-primary px-4 py-2 rounded-pill"
                                                style={{
                                                    backgroundColor: '#244034',
                                                    borderColor: '#244034',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Apply Now
                                                <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>

                                        {/* Short Description as Lead Text */}
                                        {career.short_description && (
                                            <div className="mt-4 pt-4 border-top">
                                                <h5 className="mb-3 fw-bold">Role Overview</h5>
                                                <p className="lead text-dark fs-6 mb-0" style={{ lineHeight: '1.7', opacity: 0.85 }}>
                                                    {career.short_description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content: Detailed Description & Requirements */}
                            {(career.detail_description || career.job_details) && (
                                <div className="bg-white rounded-3 shadow-sm p-4 p-lg-5 mb-4">
                                    {career.detail_description && (
                                        <div className="mb-5">
                                            <h3 className="h4 mb-4 fw-bold">Job Description</h3>
                                            <div
                                                className="text-muted fs-6"
                                                style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                                            >
                                                {career.detail_description}
                                            </div>
                                        </div>
                                    )}

                                    {career.detail_description && career.job_details && <hr className="my-5 opacity-10" />}

                                    {career.job_details && (
                                        <div>
                                            <h3 className="h4 mb-4 fw-bold">Requirements & Benefits</h3>
                                            <div
                                                className="text-muted fs-6"
                                                style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}
                                            >
                                                {career.job_details}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Apply CTA */}
                            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
                                <h3 className="h4 mb-3 fw-bold">Ready to take the next step?</h3>
                                <p className="text-muted mb-4">
                                    Join our team and help us build the future of video creation.
                                </p>
                                <Link
                                    href={career.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg px-5 rounded-pill"
                                    style={{
                                        backgroundColor: '#244034',
                                        borderColor: '#244034'
                                    }}
                                >
                                    Apply for this Position
                                    <svg className="ms-2" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
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
