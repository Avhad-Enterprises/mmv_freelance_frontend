"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import { useCreditsHistory } from "@/hooks/useCredits";
import { TransactionType } from "@/types/credits";
import { formatAmount } from "@/utils/razorpay";

interface TransactionHistoryProps {
    initialPageSize?: number;
    showFilters?: boolean;
    compact?: boolean;
}

export interface TransactionHistoryRef {
    refetch: () => Promise<void>;
}

const TYPE_CONFIG: Record<
    TransactionType,
    { label: string; color: string; bgColor: string; icon: string }
> = {
    purchase: {
        label: "Purchased",
        color: "#28a745",
        bgColor: "#28a74520",
        icon: "💳",
    },
    deduction: {
        label: "Used",
        color: "#dc3545",
        bgColor: "#dc354520",
        icon: "📤",
    },
    refund: {
        label: "Refunded",
        color: "#17a2b8",
        bgColor: "#17a2b820",
        icon: "↩️",
    },
    admin_add: {
        label: "Admin Added",
        color: "#6f42c1",
        bgColor: "#6f42c120",
        icon: "👤",
    },
    admin_deduct: {
        label: "Admin Deducted",
        color: "#fd7e14",
        bgColor: "#fd7e1420",
        icon: "👤",
    },
    signup_bonus: {
        label: "Signup Bonus",
        color: "#28a745",
        bgColor: "#28a74520",
        icon: "🎁",
    },
};

const FILTER_OPTIONS = [
    { value: "", label: "All Transactions" },
    { value: "purchase", label: "Purchases" },
    { value: "deduction", label: "Used" },
    { value: "refund", label: "Refunds" },
];

/**
 * Transaction History Table
 * Displays paginated credit transactions with type filters
 * Exposes refetch method via ref for parent components to trigger refresh
 */
const TransactionHistory = forwardRef<TransactionHistoryRef, TransactionHistoryProps>(
    ({ initialPageSize = 10, showFilters = true, compact = false }, ref) => {
        const {
            transactions,
            pagination,
            loading,
            error,
            setPage,
            setFilter,
            refetch,
        } = useCreditsHistory(initialPageSize);

        const [activeFilter, setActiveFilter] = React.useState("");

        // Expose refetch method to parent via ref
        useImperativeHandle(ref, () => ({
            refetch: async () => {
                await refetch();
            }
        }), [refetch]);

        const handleFilterChange = (type: string) => {
            setActiveFilter(type);
            setFilter(type);
        };

        const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        };

        const formatTime = (dateString: string): string => {
            const date = new Date(dateString);
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        // Loading skeleton
        if (loading && transactions.length === 0) {
            return (
                <div className="bg-white card-box border-20">
                    <h4 className="dash-title-three mb-20">Transaction History</h4>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5].map((j) => (
                                            <td key={j}>
                                                <div
                                                    style={{
                                                        width: j === 5 ? "150px" : "80px",
                                                        height: "20px",
                                                        borderRadius: "4px",
                                                        background:
                                                            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                                        backgroundSize: "200% 100%",
                                                        animation: "shimmer 1.5s infinite",
                                                    }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

        // Error state
        if (error) {
            return (
                <div className="bg-white card-box border-20">
                    <h4 className="dash-title-three mb-20">Transaction History</h4>
                    <div className="alert alert-danger">{error}</div>
                </div>
            );
        }

        return (
            <div className="bg-white card-box border-20">
                {/* Header with Filters */}
                <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                    <h4 className="dash-title-three mb-0">Transaction History</h4>

                    {showFilters && (
                        <div className="btn-group" role="group">
                            {FILTER_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`btn btn-sm ${activeFilter === option.value
                                        ? "btn-primary"
                                        : "btn-outline-secondary"
                                        }`}
                                    onClick={() => handleFilterChange(option.value)}
                                    style={{
                                        backgroundColor:
                                            activeFilter === option.value ? "#D2F34C" : undefined,
                                        borderColor:
                                            activeFilter === option.value ? "#D2F34C" : undefined,
                                        color: activeFilter === option.value ? "#244034" : undefined,
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {transactions.length === 0 && !loading && (
                    <div className="text-center py-5">
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
                        <p className="text-muted mb-0">
                            {activeFilter
                                ? `No ${activeFilter} transactions found`
                                : "No transactions yet"}
                        </p>
                    </div>
                )}

                {/* Transactions Table */}
                {transactions.length > 0 && (
                    <>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th className="text-end">Amount</th>
                                        {!compact && <th className="text-end">Balance</th>}
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => {
                                        const config = TYPE_CONFIG[tx.transaction_type] || {
                                            label: tx.transaction_type,
                                            color: "#6c757d",
                                            bgColor: "#6c757d20",
                                            icon: "📝",
                                        };
                                        const isPositive = tx.amount > 0;

                                        return (
                                            <tr key={tx.transaction_id}>
                                                <td>
                                                    <div>
                                                        <div className="fw-medium">{formatDate(tx.created_at)}</div>
                                                        <small className="text-muted">{formatTime(tx.created_at)}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            backgroundColor: config.bgColor,
                                                            color: config.color,
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {config.icon} {config.label}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <span
                                                        className="fw-bold"
                                                        style={{ color: isPositive ? "#28a745" : "#dc3545" }}
                                                    >
                                                        {isPositive ? "+" : ""}
                                                        {tx.amount}
                                                    </span>
                                                </td>
                                                {!compact && (
                                                    <td className="text-end">
                                                        <span className="text-muted">{tx.balance_after}</span>
                                                    </td>
                                                )}
                                                <td>
                                                    <span className="text-muted" style={{ fontSize: "14px" }}>
                                                        {tx.description}
                                                    </span>
                                                    {tx.payment_amount && (
                                                        <div>
                                                            <small className="text-success">
                                                                Paid: {formatAmount(tx.payment_amount)}
                                                            </small>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="d-flex justify-content-between align-items-center mt-20 flex-wrap gap-3">
                                <div className="text-muted small">
                                    Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                    {pagination.total}
                                </div>

                                <nav>
                                    <ul className="pagination pagination-sm mb-0">
                                        {/* Previous - Only show if not on first page */}
                                        {pagination.page > 1 && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(pagination.page - 1)}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                        )}

                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                                            let pageNum: number;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = idx + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = idx + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + idx;
                                            } else {
                                                pageNum = pagination.page - 2 + idx;
                                            }

                                            return (
                                                <li
                                                    key={pageNum}
                                                    className={`page-item ${pagination.page === pageNum ? "active" : ""}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPage(pageNum)}
                                                        style={{
                                                            backgroundColor:
                                                                pagination.page === pageNum ? "#D2F34C" : undefined,
                                                            borderColor:
                                                                pagination.page === pageNum ? "#D2F34C" : undefined,
                                                            color: pagination.page === pageNum ? "#244034" : undefined,
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                </li>
                                            );
                                        })}

                                        {/* Next - Only show if not on last page */}
                                        {pagination.page < pagination.totalPages && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    onClick={() => setPage(pagination.page + 1)}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
);

TransactionHistory.displayName = 'TransactionHistory';

export default TransactionHistory;
