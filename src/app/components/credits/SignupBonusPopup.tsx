"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SignupBonusPopupProps {
    isOpen: boolean;
    onClose: () => void;
    creditsReceived?: number;
}

/**
 * Signup Bonus Popup
 * Shows when a new freelancer logs in for the first time after registration
 * Displays the bonus credits received and allows navigation to credits page
 */
const SignupBonusPopup: React.FC<SignupBonusPopupProps> = ({
    isOpen,
    onClose,
    creditsReceived = 5,
}) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Delay animation for smooth entrance
            setTimeout(() => setIsVisible(true), 100);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleViewCredits = () => {
        onClose();
        router.push("/dashboard/freelancer-dashboard/credits");
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`signup-bonus-backdrop ${isVisible ? "visible" : ""}`}
                onClick={handleClose}
            />

            {/* Popup */}
            <div className={`signup-bonus-popup ${isVisible ? "visible" : ""}`}>
                <div className="popup-content">
                    {/* Close button */}
                    <button
                        className="close-btn"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    {/* Gift icon */}
                    <div className="gift-icon">
                        🎁
                    </div>

                    {/* Title */}
                    <h2 className="popup-title">
                        Welcome Reward!
                    </h2>

                    {/* Subtitle */}
                    <p className="popup-subtitle">
                        Congratulations! You&apos;ve received
                    </p>

                    {/* Credits badge */}
                    <div className="credits-badge">
                        <span className="credits-number">{creditsReceived}</span>
                        <span className="credits-label">Free Keys</span>
                    </div>

                    {/* Description */}
                    <p className="popup-description">
                        Use these keys to apply for projects and start your freelancing journey!
                    </p>

                    {/* CTA Button */}
                    <button
                        className="view-credits-btn"
                        onClick={handleViewCredits}
                    >
                        Click here to see your Keys →
                    </button>
                </div>
            </div>

            <style jsx>{`
                .signup-bonus-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9998;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .signup-bonus-backdrop.visible {
                    opacity: 1;
                }

                .signup-bonus-popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    z-index: 9999;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .signup-bonus-popup.visible {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }

                .popup-content {
                    background: white;
                    border-radius: 24px;
                    padding: 40px 32px;
                    text-align: center;
                    max-width: 400px;
                    width: 90vw;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                }

                .close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 28px;
                    color: #999;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: #f0f0f0;
                    color: #333;
                }

                .gift-icon {
                    font-size: 64px;
                    margin-bottom: 16px;
                    animation: bounce 1s ease infinite;
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .popup-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #244034;
                    margin: 0 0 8px 0;
                }

                .popup-subtitle {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 20px 0;
                }

                .credits-badge {
                    background: linear-gradient(135deg, #D2F34C 0%, #b8e035 100%);
                    border-radius: 16px;
                    padding: 20px 32px;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                    box-shadow: 0 8px 24px rgba(210, 243, 76, 0.4);
                }

                .credits-number {
                    font-size: 48px;
                    font-weight: 800;
                    color: #244034;
                    line-height: 1;
                }

                .credits-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #244034;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-top: 4px;
                }

                .popup-description {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 24px 0;
                    line-height: 1.5;
                }

                .view-credits-btn {
                    background: #244034;
                    color: #D2F34C;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 30px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .view-credits-btn:hover {
                    background: #1a3028;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(36, 64, 52, 0.3);
                }

                @media (max-width: 480px) {
                    .popup-content {
                        padding: 32px 24px;
                    }

                    .gift-icon {
                        font-size: 48px;
                    }

                    .popup-title {
                        font-size: 24px;
                    }

                    .credits-number {
                        font-size: 40px;
                    }
                }
            `}</style>
        </>
    );
};

export default SignupBonusPopup;
