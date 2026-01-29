"use client";

import React from "react";
import Image from "next/image";
import { CreditBalance } from "@/types/credits";

// Dashboard icons
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";

interface CreditStatsProps {
    balance: CreditBalance | null;
    loading?: boolean;
}

/**
 * Credit Statistics Cards
 * Displays available credits, total purchased, and credits used
 */
const CreditStats: React.FC<CreditStatsProps> = ({ balance, loading = false }) => {
    const stats = [
        {
            id: "available",
            icon: icon_1,
            label: "Available Keys",
            value: balance?.credits_balance ?? 0,
            color: "#D2F34C",
        },
        {
            id: "purchased",
            icon: icon_2,
            label: "Total Purchased",
            value: balance?.total_credits_purchased ?? 0,
            color: "#5cb85c",
        },
        {
            id: "used",
            icon: icon_3,
            label: "Keys Used",
            value: balance?.credits_used ?? 0,
            color: "#f0ad4e",
        },
    ];

    if (loading) {
        return (
            <div className="row mb-20">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="col-lg-4 col-md-4 col-sm-12 mb-15">
                        <div className="dash-card-one bg-white border-30 position-relative h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                {/* Mobile: Centered layout */}
                                <div className="d-block d-sm-none w-100 text-center">
                                    <div
                                        className="skeleton-loader mx-auto mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                    <div
                                        className="skeleton-loader mb-2 mx-auto"
                                        style={{
                                            width: "80px",
                                            height: "36px",
                                            borderRadius: "4px",
                                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                    <div
                                        className="skeleton-loader mx-auto"
                                        style={{
                                            width: "100px",
                                            height: "16px",
                                            borderRadius: "4px",
                                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                </div>
                                
                                {/* Desktop: Normal layout */}
                                <div className="d-none d-sm-flex align-items-center justify-content-between w-100">
                                    <div>
                                        <div
                                            className="skeleton-loader mb-2"
                                            style={{
                                                width: "60px",
                                                height: "32px",
                                                borderRadius: "4px",
                                                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                                backgroundSize: "200% 100%",
                                                animation: "shimmer 1.5s infinite",
                                            }}
                                        />
                                        <div
                                            className="skeleton-loader"
                                            style={{
                                                width: "100px",
                                                height: "16px",
                                                borderRadius: "4px",
                                                background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                                backgroundSize: "200% 100%",
                                                animation: "shimmer 1.5s infinite",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="skeleton-loader"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="row mb-20">
            {stats.map((stat) => (
                <div key={stat.id} className="col-lg-4 col-md-4 col-sm-12 mb-15">
                    <div className="dash-card-one bg-white border-30 position-relative h-100">
                        <div className="d-flex align-items-center justify-content-between">
                            {/* Mobile: Icon centered above, Desktop: Icon on right */}
                            <div className="d-block d-sm-none w-100 text-center mb-3">
                                <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                                    <Image src={stat.icon} alt={stat.label} className="lazy-img" />
                                </div>
                                <div className="value fw-500" style={{ 
                                    color: stat.id === "available" ? stat.color : undefined,
                                    fontSize: "2.5rem",
                                    fontWeight: "bold"
                                }}>
                                    {stat.value.toLocaleString()}
                                </div>
                                <div style={{ 
                                    fontSize: "1rem",
                                    color: "#666",
                                    marginTop: "0.5rem"
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                            
                            {/* Desktop: Normal layout */}
                            <div className="d-none d-sm-flex align-items-center justify-content-between w-100">
                                <div className="order-sm-0">
                                    <div className="value fw-500 d-flex align-items-center gap-2" style={{ color: stat.id === "available" ? stat.color : undefined }}>
                                        {stat.value.toLocaleString()}
                                    </div>
                                    <span>{stat.label}</span>
                                </div>
                                <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                                    <Image src={stat.icon} alt={stat.label} className="lazy-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Custom CSS for mobile responsive design */}
            <style jsx>{`
                @media (max-width: 575.98px) {
                    .dash-card-one {
                        padding: 1.5rem 1rem !important;
                        text-align: center;
                    }
                    
                    .icon {
                        width: 60px !important;
                        height: 60px !important;
                        background: #f8f9fa !important;
                        border: 2px solid #e9ecef !important;
                    }
                    
                    .value {
                        line-height: 1.1 !important;
                        margin-bottom: 0.5rem !important;
                    }
                }
                
                @media (min-width: 576px) {
                    .dash-card-one {
                        padding: 1.25rem !important;
                    }
                    
                    .icon {
                        width: 50px;
                        height: 50px;
                        background: #f8f9fa;
                        border: 1px solid #e9ecef;
                    }
                }
            `}</style>
        </div>
    );
};

export default CreditStats;
