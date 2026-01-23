/**
 * Credit Management System - TypeScript Interfaces
 * @module types/credits
 */

// ============================================
// BALANCE & STATS
// ============================================

export interface CreditBalance {
    credits_balance: number;
    total_credits_purchased: number;
    credits_used: number;
    signup_bonus_claimed?: boolean;
}

// ============================================
// PACKAGES
// ============================================

export interface CreditPackage {
    id: number;
    name: string;
    credits: number;
    price: number; // in INR
    description?: string;
    savings_percent?: number;
    popular?: boolean;
}

export interface PackagesResponse {
    packages: CreditPackage[];
    pricePerCredit: number;
    currency: string;
    limits: {
        minPurchase: number;
        maxPurchase: number;
        maxBalance: number;
    };
}

// ============================================
// TRANSACTIONS
// ============================================

export type TransactionType =
    | "purchase"
    | "deduction"
    | "refund"
    | "admin_add"
    | "admin_deduct"
    | "signup_bonus";

export interface CreditTransaction {
    transaction_id: number;
    transaction_type: TransactionType;
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string;
    payment_amount?: number;
    package_name?: string;
    created_at: string;
}

export interface TransactionHistoryResponse {
    transactions: CreditTransaction[];
    pagination: Pagination;
}

// ============================================
// PURCHASE FLOW
// ============================================

export interface InitiatePurchaseRequest {
    package_id?: number;
    credits_amount?: number;
}

export interface InitiatePurchaseResponse {
    order_id: string;
    amount: number; // in paise (₹1 = 100 paise)
    currency: string;
    credits: number;
    package_name?: string;
    key_id: string;
    user: {
        name: string;
        email: string;
    };
}

export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifyPaymentResponse {
    credits_added: number;
    credits_balance: number;
    transaction_id: string;
}

// ============================================
// REFUNDS
// ============================================

export interface RefundEligibility {
    application_id: number;
    eligible: boolean;
    reason?: string;
    credits_to_refund: number;
}

export interface RefundTransaction {
    transaction_id: number;
    amount: number;
    reason: string;
    application_id?: number;
    project_title?: string;
    created_at: string;
}

export interface RefundsResponse {
    refunds: RefundTransaction[];
    pagination: Pagination;
}

// ============================================
// PAGINATION
// ============================================

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface HistoryParams extends PaginationParams {
    type?: TransactionType | string;
}

// ============================================
// ERROR HANDLING
// ============================================

export interface CreditError {
    success: false;
    message: string;
    code?: string;
    details?: Record<string, unknown>;
}

export type CreditErrorCode =
    | "INSUFFICIENT_CREDITS"
    | "MAX_BALANCE_EXCEEDED"
    | "INVALID_PACKAGE"
    | "INVALID_AMOUNT"
    | "INVALID_SIGNATURE"
    | "PAYMENT_ALREADY_PROCESSED"
    | "REFUND_NOT_ELIGIBLE"
    | "PROFILE_NOT_FOUND";

// ============================================
// RAZORPAY TYPES
// ============================================

export interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill: {
        name: string;
        email: string;
        contact?: string;
    };
    theme: {
        color: string;
    };
    handler: (response: RazorpaySuccessResponse) => void;
    modal?: {
        ondismiss?: () => void;
        escape?: boolean;
        backdropclose?: boolean;
    };
    notes?: Record<string, string>;
}

export interface RazorpaySuccessResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface RazorpayErrorResponse {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: {
            order_id: string;
            payment_id: string;
        };
    };
}

// Extend Window interface for Razorpay
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

export interface RazorpayInstance {
    open: () => void;
    close: () => void;
    on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface PackageSelectorProps {
    packages: CreditPackage[];
    selectedPackage: CreditPackage | null;
    onSelect: (pkg: CreditPackage) => void;
    loading?: boolean;
    disabled?: boolean;
}

export interface CreditStatsProps {
    balance: CreditBalance | null;
    loading?: boolean;
}

export interface TransactionHistoryProps {
    initialPage?: number;
    pageSize?: number;
    showFilters?: boolean;
    compact?: boolean;
}

export interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPackage: CreditPackage | null;
    onSuccess: () => void;
}

export interface InsufficientCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiredCredits: number;
    currentBalance: number;
    onBuyCredits: () => void;
}
