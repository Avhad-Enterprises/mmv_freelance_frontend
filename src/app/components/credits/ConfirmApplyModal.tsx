"use client";

import React from "react";

interface ConfirmApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    projectTitle: string;
    currentBalance: number;
    isVideoEditor: boolean;
}

/**
 * Confirm Apply Modal
 * Shows confirmation before applying to a project
 * For video editors: Shows that it will cost 1 key
 * For videographers: Shows free application
 */
const ConfirmApplyModal: React.FC<ConfirmApplyModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    projectTitle,
    currentBalance,
    isVideoEditor,
}) => {
    if (!isOpen) return null;

    const keyCost = isVideoEditor ? 1 : 0;
    const newBalance = currentBalance - keyCost;

    return (
        <div
            className="modal fade show d-block"
            style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99999,
                overflow: 'auto'
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content border-20" style={{ borderRadius: "20px" }}>
                    {/* Header */}
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title dash-title-three">Confirm Application</h5>
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
                                    backgroundColor: "#D2F34C20",
                                }}
                            >
                                <span style={{ fontSize: "36px" }}>💼</span>
                            </div>

                            {/* Project Title */}
                            <h5 className="mb-15">Apply to this project?</h5>
                            <p className="text-muted mb-20" style={{ fontSize: "14px" }}>
                                <strong>{projectTitle}</strong>
                            </p>

                            {/* Key Cost Information */}
                            {isVideoEditor ? (
                                <>
                                    <div
                                        className="alert d-flex align-items-center justify-content-center mb-20"
                                        style={{
                                            backgroundColor: "#D2F34C20",
                                            border: "1px solid #D2F34C",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <span style={{ fontSize: "18px", marginRight: "8px" }}>🔑</span>
                                        <span>
                                            This application will cost <strong>1 key</strong>
                                        </span>
                                    </div>

                                    {/* Balance Display */}
                                    <div
                                        className="d-flex justify-content-around mb-20 p-3 rounded-3"
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    >
                                        <div className="text-center">
                                            <div className="text-muted small mb-1">Current Balance</div>
                                            <div
                                                className="fw-bold"
                                                style={{
                                                    fontSize: "24px",
                                                    color: "#28a745",
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
                                            <div className="text-muted small mb-1">After Application</div>
                                            <div className="fw-bold" style={{ fontSize: "24px" }}>
                                                {newBalance}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div
                                    className="alert d-flex align-items-center justify-content-center mb-20"
                                    style={{
                                        backgroundColor: "#28a74520",
                                        border: "1px solid #28a745",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <span style={{ fontSize: "18px", marginRight: "8px" }}>✨</span>
                                    <span>
                                        Free application - no keys required
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-muted" style={{ fontSize: "14px" }}>
                                {isVideoEditor
                                    ? "Once you apply, the key will be deducted from your balance."
                                    : "You can apply to this project at no cost."
                                }
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
                        <button
                            type="button"
                            className="dash-btn-two tran3s"
                            onClick={onConfirm}
                        >
                            Confirm &amp; Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmApplyModal;
