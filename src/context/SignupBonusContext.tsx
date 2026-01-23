"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SignupBonusContextType {
    showBonusPopup: boolean;
    setShowBonusPopup: (show: boolean) => void;
    checkAndShowBonusPopup: () => void;
    dismissBonusPopup: () => void;
}

const SignupBonusContext = createContext<SignupBonusContextType | undefined>(undefined);

const BONUS_POPUP_SHOWN_KEY = "signup_bonus_popup_shown";
const BONUS_RECEIVED_KEY = "signup_bonus_received";

export function SignupBonusProvider({ children }: { children: ReactNode }) {
    const [showBonusPopup, setShowBonusPopup] = useState(false);

    /**
     * Check if we should show the bonus popup
     * Only shows if:
     * 1. User received bonus during registration (stored in sessionStorage)
     * 2. Popup hasn't been shown before in this session
     */
    const checkAndShowBonusPopup = useCallback(() => {
        try {
            // Check if bonus was received during this session
            const bonusReceived = sessionStorage.getItem(BONUS_RECEIVED_KEY);
            const popupAlreadyShown = sessionStorage.getItem(BONUS_POPUP_SHOWN_KEY);

            if (bonusReceived === "true" && popupAlreadyShown !== "true") {
                // Show popup after a short delay for better UX
                setTimeout(() => {
                    setShowBonusPopup(true);
                }, 1000);
            }
        } catch (error) {
            // sessionStorage not available
            console.warn("Could not access sessionStorage:", error);
        }
    }, []);

    /**
     * Dismiss the popup and mark it as shown
     */
    const dismissBonusPopup = useCallback(() => {
        setShowBonusPopup(false);
        try {
            sessionStorage.setItem(BONUS_POPUP_SHOWN_KEY, "true");
            // Clean up the bonus received flag
            sessionStorage.removeItem(BONUS_RECEIVED_KEY);
        } catch (error) {
            console.warn("Could not access sessionStorage:", error);
        }
    }, []);

    return (
        <SignupBonusContext.Provider
            value={{
                showBonusPopup,
                setShowBonusPopup,
                checkAndShowBonusPopup,
                dismissBonusPopup,
            }}
        >
            {children}
        </SignupBonusContext.Provider>
    );
}

export function useSignupBonus() {
    const context = useContext(SignupBonusContext);
    if (context === undefined) {
        throw new Error("useSignupBonus must be used within a SignupBonusProvider");
    }
    return context;
}

/**
 * Helper function to mark that signup bonus was received
 * Call this after successful registration with bonus
 */
export function markSignupBonusReceived() {
    try {
        sessionStorage.setItem(BONUS_RECEIVED_KEY, "true");
    } catch (error) {
        console.warn("Could not access sessionStorage:", error);
    }
}
