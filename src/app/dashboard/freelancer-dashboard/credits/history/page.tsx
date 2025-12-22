"use client";

import React from "react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header-minus";
import { TransactionHistory } from "@/app/components/credits";
import Link from "next/link";

/**
 * Full Transaction History Page
 * Dedicated page for viewing all credit transactions
 */
const CreditsHistoryPage = () => {
    return (
        <PermissionGuard
            permission="credits.view_history"
            fallback={
                <div className="dashboard-body">
                    <div className="position-relative">
                        <div className="bg-white card-box border-20 text-center py-5">
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
                            <h4>Access Denied</h4>
                            <p className="text-muted">
                                You don&apos;t have permission to view transaction history.
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="dashboard-body">
                <div className="position-relative">
                    <DashboardHeader />

                    {/* Breadcrumb */}
                    <div className="d-flex align-items-center mb-20">
                        <Link
                            href="/dashboard/freelancer-dashboard/credits"
                            className="text-muted text-decoration-none"
                        >
                            ← Back to Keys
                        </Link>
                    </div>

                    <h2 className="main-title">Transaction History</h2>

                    {/* Full Transaction History */}
                    <TransactionHistory
                        initialPageSize={20}
                        showFilters={true}
                        compact={false}
                    />
                </div>
            </div>
        </PermissionGuard>
    );
};

export default CreditsHistoryPage;
