"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SignupBonusPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Signup Bonus Popup
 * Shows a celebratory popup when a new freelancer receives their 5 free keys
 */
const SignupBonusPopup: React.FC<SignupBonusPopupProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Delay for animation
            setTimeout(() => setIsVisible(true), 100);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleViewCredits = () => {
        onClose();
        router.push("/dashboard/freelancer-dashboard/credits");
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    zIndex: 9998,
                    opacity: isVisible ? 1 : 0,
                    transition: "opacity 0.3s ease",
                }}
                onClick={onClose}
            />

            {/* Popup */}
            <div
                className="position-fixed top-50 start-50"
                style={{
                    transform: isVisible 
                        ? "translate(-50%, -50%) scale(1)" 
                        : "translate(-50%, -50%) scale(0.8)",
                    opacity: isVisible ? 1 : 0,
                    transition: "all 0.3s ease",
                    zIndex: 9999,
                    maxWidth: "420px",
                    width: "90%",
                }}
            >
                <div
                    className="bg-white rounded-4 p-4 text-center position-relative"
                    style={{
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="position-absolute border-0 bg-transparent"
                        style={{
                            top: "15px",
                            right: "15px",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#666",
                        }}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    {/* Celebration icon */}
                    <div
                        className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #D2F34C 0%, #a8d935 100%)",
                            fontSize: "50px",
                            animation: "bounce 1s ease infinite",
                        }}
                    >
                        🎁
                    </div>

                    {/* Title */}
                    <h3
                        className="fw-bold mb-2"
                        style={{
                            color: "#244034",
                            fontSize: "24px",
                        }}
                    >
                        Welcome Reward Received!
                    </h3>

                    {/* Subtitle */}
                    <p
                        className="mb-3"
                        style={{
                            color: "#666",
                            fontSize: "16px",
                        }}
                    >
                        Congratulations on joining us! 🎉
                    </p>

                    {/* Keys display */}
                    <div
                        className="mx-auto mb-4 d-flex align-items-center justify-content-center gap-2"
                        style={{
                            backgroundColor: "#f0fdf4",
                            border: "2px solid #D2F34C",
                            borderRadius: "16px",
                            padding: "20px 30px",
                            maxWidth: "200px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "48px",
                                fontWeight: "700",
                                color: "#244034",
                            }}
                        >
                            5
                        </span>
                        <div className="text-start">
                            <div
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#244034",
                                }}
                            >
                                FREE
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#666",
                                }}
                            >
                                Keys
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        className="mb-4"
                        style={{
                            color: "#666",
                            fontSize: "14px",
                            lineHeight: "1.6",
                        }}
                    >
                        Use these keys to apply for projects and start your freelance journey with us!
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={handleViewCredits}
                        className="btn w-100 fw-600"
                        style={{
                            backgroundColor: "#D2F34C",
                            color: "#244034",
                            padding: "14px 24px",
                            borderRadius: "30px",
                            fontSize: "16px",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#c4e644";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#D2F34C";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Click here to view your Keys →
                    </button>

                    {/* Animation keyframes */}
                    <style jsx>{`
                        @keyframes bounce {
                            0%, 100% {
                                transform: translateY(0);
                            }
                            50% {
                                transform: translateY(-10px);
                            }
                        }
                    `}</style>
                </div>
            </div>
        </>
    );
};

export default SignupBonusPopup;
