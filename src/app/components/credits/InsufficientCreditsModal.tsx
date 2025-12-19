"use client";

import React from "react";
import Link from "next/link";

interface InsufficientCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiredCredits?: number;
    currentBalance?: number;
    onBuyCredits?: () => void;
}

/**
 * Insufficient Credits Modal
 * Shown when user tries to apply without enough credits
 */
const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
    isOpen,
    onClose,
    requiredCredits = 1,
    currentBalance = 0,
    onBuyCredits,
}) => {
    if (!isOpen) return null;

    const creditsNeeded = Math.max(0, requiredCredits - currentBalance);

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content border-20" style={{ borderRadius: "20px" }}>
                    {/* Header */}
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title dash-title-three">Not Enough Credits</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <div className="text-center py-3">
                            {/* Icon */}
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-20"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    backgroundColor: "#dc354520",
                                }}
                            >
                                <span style={{ fontSize: "36px" }}>⚠️</span>
                            </div>

                            {/* Message */}
                            <h5 className="mb-15">You need more credits to apply</h5>

                            {/* Balance Display */}
                            <div
                                className="d-flex justify-content-around mb-25 p-3 rounded-3"
                                style={{ backgroundColor: "#f8f9fa" }}
                            >
                                <div className="text-center">
                                    <div className="text-muted small mb-1">Current Balance</div>
                                    <div
                                        className="fw-bold"
                                        style={{
                                            fontSize: "24px",
                                            color: currentBalance > 0 ? "#28a745" : "#dc3545",
                                        }}
                                    >
                                        {currentBalance}
                                    </div>
                                </div>
                                <div
                                    className="d-flex align-items-center"
                                    style={{ color: "#6c757d", fontSize: "24px" }}
                                >
                                    →
                                </div>
                                <div className="text-center">
                                    <div className="text-muted small mb-1">Required</div>
                                    <div className="fw-bold" style={{ fontSize: "24px" }}>
                                        {requiredCredits}
                                    </div>
                                </div>
                            </div>

                            {/* Credits Needed */}
                            <div
                                className="alert d-flex align-items-center justify-content-center mb-20"
                                style={{
                                    backgroundColor: "#D2F34C20",
                                    border: "1px solid #D2F34C",
                                    borderRadius: "10px",
                                }}
                            >
                                <span style={{ fontSize: "18px", marginRight: "8px" }}>💡</span>
                                <span>
                                    You need <strong>{creditsNeeded} more credit{creditsNeeded !== 1 ? "s" : ""}</strong> to apply
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-muted" style={{ fontSize: "14px" }}>
                                Purchase credits to continue applying for projects. Credits never expire!
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 pt-0">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {onBuyCredits ? (
                            <button
                                type="button"
                                className="dash-btn-two tran3s"
                                onClick={() => {
                                    onClose();
                                    onBuyCredits();
                                }}
                            >
                                Buy Credits
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/freelancer-dashboard/credits"
                                className="dash-btn-two tran3s text-decoration-none"
                                onClick={onClose}
                            >
                                Buy Credits
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsufficientCreditsModal;
