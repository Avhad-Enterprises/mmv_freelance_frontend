"use client";

import React, { useState, useCallback } from "react";
import { CreditPackage, RazorpaySuccessResponse } from "@/types/credits";
import { loadRazorpay, formatAmount, getRazorpayThemeColor } from "@/utils/razorpay";
import { creditsService } from "@/services/credits.service";
import toast from "react-hot-toast";

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPackage: CreditPackage | null;
    onSuccess: () => void;
}

type PurchaseStep = "confirm" | "processing" | "success" | "error";

/**
 * Purchase Modal with Razorpay Integration
 * Handles the complete purchase flow from confirmation to payment verification
 */
const PurchaseModal: React.FC<PurchaseModalProps> = ({
    isOpen,
    onClose,
    selectedPackage,
    onSuccess,
}) => {
    const [step, setStep] = useState<PurchaseStep>("confirm");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [purchasedCredits, setPurchasedCredits] = useState<number>(0);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setStep("confirm");
            setErrorMessage("");
        }
    }, [isOpen]);

    const handlePaymentSuccess = useCallback(
        async (response: RazorpaySuccessResponse) => {
            try {
                const result = await creditsService.verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });

                setPurchasedCredits(result.credits_added);
                setStep("success");
                toast.success(`${result.credits_added} keys added to your account!`);
                onSuccess();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Payment verification failed";
                setErrorMessage(message);
                setStep("error");
                toast.error(message);
            }
        },
        [onSuccess]
    );

    const handlePurchase = async () => {
        if (!selectedPackage) return;

        setStep("processing");

        try {
            // Load Razorpay SDK
            const loaded = await loadRazorpay();
            if (!loaded) {
                throw new Error("Failed to load payment gateway. Please try again.");
            }

            // Create order on backend
            const orderData = await creditsService.initiatePurchase(selectedPackage.id);

            // Configure Razorpay checkout
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Make My Vid",
                description: `Purchase ${orderData.credits} Keys`,
                order_id: orderData.order_id,
                prefill: {
                    name: orderData.user.name,
                    email: orderData.user.email,
                },
                theme: {
                    color: getRazorpayThemeColor(),
                },
                handler: handlePaymentSuccess,
                modal: {
                    ondismiss: () => {
                        setStep("confirm");
                    },
                    escape: true,
                    backdropclose: false,
                },
                notes: {
                    credits: String(orderData.credits),
                    package_name: orderData.package_name || "",
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (response: { error: { description: string } }) => {
                setErrorMessage(response.error.description || "Payment failed");
                setStep("error");
            });

            razorpay.open();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to initiate purchase";
            setErrorMessage(message);
            setStep("error");
            toast.error(message);
        }
    };

    const handleClose = () => {
        if (step === "processing") return; // Don't allow closing during processing
        onClose();
    };

    if (!isOpen || !selectedPackage) return null;

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
            onClick={handleClose}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content border-20" style={{ borderRadius: "20px" }}>
                    {/* Header */}
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title dash-title-three">
                            {step === "confirm" && "Confirm Purchase"}
                            {step === "processing" && "Processing Payment"}
                            {step === "success" && "Payment Successful!"}
                            {step === "error" && "Payment Failed"}
                        </h5>
                        {step !== "processing" && (
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleClose}
                                aria-label="Close"
                            />
                        )}
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Confirm Step */}
                        {step === "confirm" && (
                            <div className="text-center py-3">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-20"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#D2F34C20",
                                    }}
                                >
                                    <span style={{ fontSize: "36px" }}>💳</span>
                                </div>

                                <div className="mb-15">
                                    <span
                                        className="fw-bold"
                                        style={{ fontSize: "48px", color: "#D2F34C" }}
                                    >
                                        {selectedPackage.credits}
                                    </span>
                                    <span className="text-muted ms-2">Keys</span>
                                </div>

                                <div className="mb-20">
                                    <span className="fw-bold" style={{ fontSize: "28px" }}>
                                        {formatAmount(selectedPackage.price)}
                                    </span>
                                </div>

                                {selectedPackage.savings_percent && selectedPackage.savings_percent > 0 && (
                                    <div className="mb-15">
                                        <span
                                            className="badge"
                                            style={{ backgroundColor: "#28a745", color: "white" }}
                                        >
                                            You save {selectedPackage.savings_percent}%
                                        </span>
                                    </div>
                                )}

                                <div className="text-muted mb-20">
                                    <small>
                                        You will get <strong>{selectedPackage.credits}</strong> project application
                                        {selectedPackage.credits !== 1 ? "s" : ""}
                                    </small>
                                </div>

                                <div
                                    className="alert alert-info d-flex align-items-start text-start"
                                    style={{ fontSize: "13px" }}
                                >
                                    <i className="bi bi-shield-check me-2 mt-1" style={{ fontSize: "16px" }} />
                                    <div>
                                        <strong>Secure Payment</strong>
                                        <br />
                                        Your payment is processed securely via Razorpay. We never store your card details.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Processing Step */}
                        {step === "processing" && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-20" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted">
                                    Please complete your payment in the Razorpay window...
                                </p>
                                <p className="text-muted small">
                                    Do not close this window until the payment is complete.
                                </p>
                            </div>
                        )}

                        {/* Success Step */}
                        {step === "success" && (
                            <div className="text-center py-3">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-20"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#28a74520",
                                    }}
                                >
                                    <span style={{ fontSize: "36px" }}>✅</span>
                                </div>

                                <h4 className="mb-15">Payment Successful!</h4>

                                <div className="mb-20">
                                    <span
                                        className="fw-bold"
                                        style={{ fontSize: "48px", color: "#28a745" }}
                                    >
                                        +{purchasedCredits}
                                    </span>
                                    <span className="text-muted ms-2">Keys</span>
                                </div>

                                <p className="text-muted">
                                    Your keys have been added to your account. You can now apply to projects!
                                </p>
                            </div>
                        )}

                        {/* Error Step */}
                        {step === "error" && (
                            <div className="text-center py-3">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-20"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#dc354520",
                                    }}
                                >
                                    <span style={{ fontSize: "36px" }}>❌</span>
                                </div>

                                <h4 className="mb-15 text-danger">Payment Failed</h4>

                                <p className="text-muted mb-20">{errorMessage}</p>

                                <p className="text-muted small">
                                    If amount was deducted from your account, it will be refunded within 5-7 business days.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 pt-0">
                        {step === "confirm" && (
                            <div className="d-flex w-100 gap-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary flex-grow-1"
                                    onClick={handleClose}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        height: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '500'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="dash-btn-two tran3s flex-grow-1"
                                    onClick={handlePurchase}
                                    style={{
                                        backgroundColor: '#3d6f5d',
                                        borderColor: '#3d6f5d',
                                        color: 'white',
                                        borderRadius: '8px',
                                        padding: '12px 24px',
                                        height: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '500'
                                    }}
                                >
                                    Pay {formatAmount(selectedPackage.price)}
                                </button>
                            </div>
                        )}

                        {step === "success" && (
                            <button
                                type="button"
                                className="dash-btn-two tran3s w-100"
                                onClick={handleClose}
                            >
                                Done
                            </button>
                        )}

                        {step === "error" && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="dash-btn-two tran3s"
                                    onClick={() => setStep("confirm")}
                                >
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;
