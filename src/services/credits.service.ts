/**
 * Credit Management API Service
 * @module services/credits.service
 *
 * Handles all API calls related to credit management
 */

import {
    CreditBalance,
    PackagesResponse,
    InitiatePurchaseResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    CreditTransaction,
    Pagination,
    HistoryParams,
    RefundEligibility,
    RefundsResponse,
} from "@/types/credits";
import { makeGetRequest, makePostRequest } from "@/utils/api";

// API Endpoints
const ENDPOINTS = {
    BALANCE: "api/v1/credits/balance",
    PACKAGES: "api/v1/credits/packages",
    INITIATE_PURCHASE: "api/v1/credits/initiate-purchase",
    VERIFY_PAYMENT: "api/v1/credits/verify-payment",
    HISTORY: "api/v1/credits/history",
    REFUND_ELIGIBILITY: (id: number) => `api/v1/credits/refund-eligibility/${id}`,
    REFUNDS: "api/v1/credits/refunds",
} as const;

/**
 * Credits API Service
 */
export const creditsService = {
    /**
     * Get current credit balance for the logged-in user
     * @returns Credit balance including available, purchased, and used
     */
    async getBalance(): Promise<CreditBalance> {
        const response = await makeGetRequest(ENDPOINTS.BALANCE);
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to fetch balance");
        }
        return response.data.data;
    },

    /**
     * Get available credit packages with dynamic pricing
     * @returns Packages array with pricing info
     */
    async getPackages(): Promise<PackagesResponse> {
        const response = await makeGetRequest(ENDPOINTS.PACKAGES);
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to fetch packages");
        }
        return response.data.data;
    },

    /**
     * Initiate a credit purchase (creates Razorpay order)
     * @param packageId - Package ID (1-4) for predefined packages
     * @param creditsAmount - Custom credits amount (if not using package)
     * @returns Order details for Razorpay checkout
     */
    async initiatePurchase(
        packageId?: number,
        creditsAmount?: number
    ): Promise<InitiatePurchaseResponse> {
        const payload: Record<string, number> = {};

        if (packageId !== undefined) {
            payload.package_id = packageId;
        }
        if (creditsAmount !== undefined) {
            payload.credits_amount = creditsAmount;
        }

        const response = await makePostRequest(ENDPOINTS.INITIATE_PURCHASE, payload);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to initiate purchase");
        }
        return response.data.data;
    },

    /**
     * Verify payment after Razorpay checkout completes
     * @param data - Razorpay response containing order_id, payment_id, signature
     * @returns Credits added and new balance
     */
    async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
        const response = await makePostRequest(ENDPOINTS.VERIFY_PAYMENT, data);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Payment verification failed");
        }
        return response.data.data;
    },

    /**
     * Get transaction history with filtering and pagination
     * @param params - Pagination and filter options
     * @returns Transactions array with pagination info
     */
    async getHistory(
        params?: HistoryParams
    ): Promise<{ transactions: CreditTransaction[]; pagination: Pagination }> {
        // Build query string
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.type) queryParams.append("type", params.type);

        const queryString = queryParams.toString();
        const url = queryString
            ? `${ENDPOINTS.HISTORY}?${queryString}`
            : ENDPOINTS.HISTORY;

        const response = await makeGetRequest(url);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to fetch history");
        }
        return response.data.data;
    },

    /**
     * Check if an application is eligible for credit refund
     * @param applicationId - The application ID to check
     * @returns Eligibility status with reason
     */
    async checkRefundEligibility(applicationId: number): Promise<RefundEligibility> {
        const response = await makeGetRequest(ENDPOINTS.REFUND_ELIGIBILITY(applicationId));

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to check refund eligibility");
        }
        return response.data.data;
    },

    /**
     * Get list of user's refund transactions
     * @param params - Pagination options
     * @returns Refunds array with pagination
     */
    async getRefunds(
        params?: { page?: number; limit?: number }
    ): Promise<RefundsResponse> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        const queryString = queryParams.toString();
        const url = queryString
            ? `${ENDPOINTS.REFUNDS}?${queryString}`
            : ENDPOINTS.REFUNDS;

        const response = await makeGetRequest(url);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Failed to fetch refunds");
        }
        return response.data.data;
    },
};

export default creditsService;
