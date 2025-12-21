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
                    <div key={i} className="col-lg-4 col-md-6 col-sm-12">
                        <div className="dash-card-one bg-white border-30 position-relative mb-15">
                            <div className="d-sm-flex align-items-center justify-content-between">
                                <div
                                    className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1"
                                    style={{ background: "#f0f0f0" }}
                                >
                                    <div
                                        className="skeleton-loader"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                            backgroundSize: "200% 100%",
                                            animation: "shimmer 1.5s infinite",
                                        }}
                                    />
                                </div>
                                <div className="order-sm-0">
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
                <div key={stat.id} className="col-lg-4 col-md-6 col-sm-12">
                    <div className="dash-card-one bg-white border-30 position-relative mb-15">
                        <div className="d-sm-flex align-items-center justify-content-between">
                            <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                                <Image src={stat.icon} alt={stat.label} className="lazy-img" />
                            </div>
                            <div className="order-sm-0">
                                <div className="value fw-500" style={{ color: stat.id === "available" ? stat.color : undefined }}>
                                    {stat.value.toLocaleString()}
                                </div>
                                <span>{stat.label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CreditStats;
