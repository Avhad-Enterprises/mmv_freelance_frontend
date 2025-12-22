/**
 * Razorpay SDK Utility
 * @module utils/razorpay
 * 
 * Handles dynamic loading of Razorpay checkout SDK
 */

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/**
 * Check if Razorpay SDK is already loaded
 */
export const isRazorpayLoaded = (): boolean => {
    return typeof window !== "undefined" && typeof window.Razorpay !== "undefined";
};

/**
 * Load Razorpay SDK dynamically
 * @returns Promise that resolves to true if loaded successfully
 */
export const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Already loaded
        if (isRazorpayLoaded()) {
            resolve(true);
            return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
            `script[src="${RAZORPAY_SCRIPT_URL}"]`
        );

        if (existingScript) {
            // Script exists, wait for it to load
            existingScript.addEventListener("load", () => resolve(true));
            existingScript.addEventListener("error", () => resolve(false));
            return;
        }

        // Create and append script
        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;

        script.onload = () => {
            resolve(true);
        };

        script.onerror = () => {
            console.error("Failed to load Razorpay SDK");
            resolve(false);
        };

        document.body.appendChild(script);
    });
};

/**
 * Format amount for display (paise to rupees)
 * @param amountInPaise Amount in paise
 * @returns Formatted string with ₹ symbol
 */
export const formatAmountFromPaise = (amountInPaise: number): string => {
    const rupees = amountInPaise / 100;
    return `₹${rupees.toLocaleString("en-IN")}`;
};

/**
 * Format amount for display (rupees)
 * @param amount Amount in rupees
 * @returns Formatted string with ₹ symbol
 */
export const formatAmount = (amount: number): string => {
    return `₹${amount.toLocaleString("en-IN")}`;
};

/**
 * Get Razorpay theme color based on app theme
 */
export const getRazorpayThemeColor = (): string => {
    // Primary brand color
    return "#D2F34C";
};

export default {
    loadRazorpay,
    isRazorpayLoaded,
    formatAmountFromPaise,
    formatAmount,
    getRazorpayThemeColor,
};
