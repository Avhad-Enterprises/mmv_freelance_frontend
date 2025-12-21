"use client";

import React from "react";

/**
 * How Credits Work - Educational Section
 * Explains the credit system to new users
 */
const HowCreditsWork: React.FC = () => {
    const steps = [
        {
            number: 1,
            title: "Purchase Credits",
            description: "Choose from our credit packages to start applying for projects.",
            icon: "💳",
        },
        {
            number: 2,
            title: "Apply to Projects",
            description: "Each project application costs 1 credit. Credits are deducted when you apply.",
            icon: "📝",
        },
        {
            number: 3,
            title: "Get Hired",
            description: "Once hired, build your portfolio and grow your freelance career.",
            icon: "🎉",
        },
    ];

    return (
        <div className="row mb-20">
            <div className="col-12">
                <div className="bg-white card-box border-20">
                    <h4 className="dash-title-three mb-10">How Credits Work</h4>
                    <p className="text-muted mb-25">
                        Credits are used to apply for projects on Make My Vid. Here&apos;s how it works:
                    </p>

                    <div className="row">
                        {steps.map((step) => (
                            <div key={step.number} className="col-md-4">
                                <div className="text-center mt-25">
                                    {/* Step Number Circle */}
                                    <div
                                        className="d-flex align-items-center justify-content-center mx-auto mb-15 position-relative"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            background: "linear-gradient(135deg, #D2F34C 0%, #a8c93d 100%)",
                                            borderRadius: "50%",
                                            boxShadow: "0 4px 15px rgba(210, 243, 76, 0.4)",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "28px",
                                                fontWeight: "bold",
                                                color: "#244034",
                                            }}
                                        >
                                            {step.icon}
                                        </span>

                                        {/* Step number badge */}
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: "-5px",
                                                right: "-5px",
                                                width: "24px",
                                                height: "24px",
                                                backgroundColor: "#244034",
                                                color: "#D2F34C",
                                                borderRadius: "50%",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Step Title */}
                                    <h5 className="mb-10 fw-bold">{step.title}</h5>

                                    {/* Step Description */}
                                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                                        {step.description}
                                    </p>
                                </div>

                                {/* Connector Line (except for last) */}
                                {step.number < steps.length && (
                                    <div
                                        className="d-none d-md-block position-absolute"
                                        style={{
                                            top: "35px",
                                            right: "-50%",
                                            width: "100%",
                                            height: "2px",
                                            background: "linear-gradient(90deg, #D2F34C 0%, #e0e0e0 100%)",
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Info Box */}
                    <div
                        className="mt-30 p-3 rounded-3"
                        style={{
                            backgroundColor: "#D2F34C10",
                            border: "1px solid #D2F34C30",
                        }}
                    >
                        <div className="d-flex align-items-start">
                            <span style={{ fontSize: "20px", marginRight: "12px" }}>💡</span>
                            <div>
                                <strong style={{ color: "#244034" }}>Pro Tip:</strong>
                                <span className="text-muted ms-2">
                                    Buy larger packages to save money! Our Pro and Enterprise packages include up to 30% savings.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Key Points */}
                    <div className="row mt-25">
                        <div className="col-md-4 col-6">
                            <div className="d-flex align-items-center">
                                <span
                                    className="d-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: "#28a74520",
                                        borderRadius: "50%",
                                        fontSize: "12px",
                                    }}
                                >
                                    ✓
                                </span>
                                <span className="text-muted" style={{ fontSize: "14px" }}>
                                    1 credit = 1 application
                                </span>
                            </div>
                        </div>
                        <div className="col-md-4 col-6">
                            <div className="d-flex align-items-center">
                                <span
                                    className="d-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: "#28a74520",
                                        borderRadius: "50%",
                                        fontSize: "12px",
                                    }}
                                >
                                    ✓
                                </span>
                                <span className="text-muted" style={{ fontSize: "14px" }}>
                                    Credits never expire
                                </span>
                            </div>
                        </div>
                        <div className="col-md-4 col-6">
                            <div className="d-flex align-items-center">
                                <span
                                    className="d-flex align-items-center justify-content-center me-2"
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: "#28a74520",
                                        borderRadius: "50%",
                                        fontSize: "12px",
                                    }}
                                >
                                    ✓
                                </span>
                                <span className="text-muted" style={{ fontSize: "14px" }}>
                                    Refunds for cancelled projects
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowCreditsWork;
