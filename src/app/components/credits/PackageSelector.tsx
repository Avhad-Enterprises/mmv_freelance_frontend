"use client";

import React from "react";
import { CreditPackage } from "@/types/credits";
import { formatAmount } from "@/utils/razorpay";

interface PackageSelectorProps {
    packages: CreditPackage[];
    selectedPackage: CreditPackage | null;
    onSelect: (pkg: CreditPackage) => void;
    loading?: boolean;
    disabled?: boolean;
    pricePerCredit?: number;
}

/**
 * Package Selector Grid
 * Displays available credit packages with dynamic pricing from backend
 */
const PackageSelector: React.FC<PackageSelectorProps> = ({
    packages,
    selectedPackage,
    onSelect,
    loading = false,
    disabled = false,
    pricePerCredit = 50,
}) => {
    if (loading) {
        return (
            <div className="row">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-lg-3 col-md-6">
                        <div
                            className="dash-card-one bg-white border-30 position-relative mb-15"
                            style={{ minHeight: "280px" }}
                        >
                            <div className="text-center p-3">
                                {/* Skeleton package name */}
                                <div
                                    className="skeleton-loader mx-auto mb-15"
                                    style={{
                                        width: "80px",
                                        height: "24px",
                                        borderRadius: "4px",
                                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 1.5s infinite",
                                    }}
                                />
                                {/* Skeleton credits */}
                                <div
                                    className="skeleton-loader mx-auto mb-10"
                                    style={{
                                        width: "100px",
                                        height: "48px",
                                        borderRadius: "4px",
                                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 1.5s infinite",
                                    }}
                                />
                                {/* Skeleton price */}
                                <div
                                    className="skeleton-loader mx-auto mb-15"
                                    style={{
                                        width: "80px",
                                        height: "28px",
                                        borderRadius: "4px",
                                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 1.5s infinite",
                                    }}
                                />
                                {/* Skeleton button */}
                                <div
                                    className="skeleton-loader mx-auto"
                                    style={{
                                        width: "100%",
                                        height: "44px",
                                        borderRadius: "22px",
                                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                        backgroundSize: "200% 100%",
                                        animation: "shimmer 1.5s infinite",
                                    }}
                                />
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

    if (!packages || packages.length === 0) {
        return (
            <div className="bg-white card-box border-20 text-center p-4">
                <p className="text-muted mb-0">No packages available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="row">
            {packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                const perCreditPrice = pkg.price / pkg.credits;
                const regularPrice = pkg.credits * pricePerCredit;
                const hasDiscount = pkg.savings_percent && pkg.savings_percent > 0;

                return (
                    <div key={pkg.id} className="col-lg-3 col-md-6">
                        <div
                            className={`dash-card-one bg-white border-30 position-relative mb-15 ${isSelected ? "border border-2" : ""
                                }`}
                            style={{
                                transition: "all 0.3s ease",
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.6 : 1,
                                borderColor: isSelected ? "#D2F34C" : undefined,
                                transform: isSelected ? "scale(1.02)" : undefined,
                                boxShadow: isSelected ? "0 4px 20px rgba(210, 243, 76, 0.3)" : undefined,
                            }}
                            onClick={() => !disabled && onSelect(pkg)}
                        >
                            {/* Popular Badge */}
                            {pkg.popular && (
                                <div
                                    className="position-absolute"
                                    style={{
                                        top: "-12px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        backgroundColor: "#D2F34C",
                                        color: "#244034",
                                        padding: "4px 16px",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        zIndex: 1,
                                    }}
                                >
                                    Most Popular
                                </div>
                            )}

                            {/* Discount Badge */}
                            {hasDiscount && (
                                <div
                                    className="position-absolute"
                                    style={{
                                        top: "10px",
                                        right: "10px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        padding: "2px 8px",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Save {pkg.savings_percent}%
                                </div>
                            )}

                            <div className="text-center p-3">
                                {/* Package Name */}
                                <h5 className="fw-bold mb-15 text-capitalize">{pkg.name}</h5>

                                {/* Credits Amount */}
                                <div className="mb-10">
                                    <span
                                        className="fw-bold"
                                        style={{ fontSize: "48px", color: "#D2F34C", lineHeight: 1 }}
                                    >
                                        {pkg.credits}
                                    </span>
                                    <span className="text-muted ms-2">Credits</span>
                                </div>

                                {/* Price */}
                                <div className="mb-10">
                                    {hasDiscount && (
                                        <span
                                            className="text-muted text-decoration-line-through me-2"
                                            style={{ fontSize: "14px" }}
                                        >
                                            {formatAmount(regularPrice)}
                                        </span>
                                    )}
                                    <span className="fw-bold" style={{ fontSize: "24px" }}>
                                        {formatAmount(pkg.price)}
                                    </span>
                                </div>

                                {/* Per Credit Price */}
                                <div className="text-muted small mb-15">
                                    {formatAmount(perCreditPrice)} per credit
                                </div>

                                {/* Description */}
                                {pkg.description && (
                                    <p className="text-muted small mb-15">{pkg.description}</p>
                                )}

                                {/* Select Button */}
                                <button
                                    className={`dash-btn-two w-100 tran3s ${isSelected ? "active" : ""}`}
                                    disabled={disabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!disabled) onSelect(pkg);
                                    }}
                                    style={{
                                        backgroundColor: isSelected ? "#D2F34C" : undefined,
                                        color: isSelected ? "#244034" : undefined,
                                    }}
                                >
                                    {isSelected ? "✓ Selected" : `Select ${pkg.credits} Credits`}
                                </button>

                                {/* Applications Info */}
                                <div className="mt-15 text-center">
                                    <small className="text-muted">
                                        {pkg.credits} project application{pkg.credits !== 1 ? "s" : ""}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PackageSelector;
