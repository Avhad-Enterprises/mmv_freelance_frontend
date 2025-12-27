"use client";

import React, { useState, useRef } from "react";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header-minus";
import { useCredits } from "@/hooks/useCredits";
import { CreditPackage } from "@/types/credits";
import {
    CreditStats,
    PackageSelector,
    PurchaseModal,
    TransactionHistory,
    TransactionHistoryRef,
    HowCreditsWork,
} from "@/app/components/credits";
import toast from "react-hot-toast";

/**
 * Credits Area - Main orchestrator component
 * Combines all credit components with Razorpay purchase flow
 */
const CreditsArea: React.FC = () => {
    // State
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseProcessing, setPurchaseProcessing] = useState(false);

    // Ref for transaction history to trigger refresh
    const transactionHistoryRef = useRef<TransactionHistoryRef>(null);

    // Fetch balance and packages
    const { balance, packages, loading, error, refreshBalance } = useCredits();

    // Handle package selection
    const handlePackageSelect = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
    };

    // Handle purchase button click
    const handlePurchaseClick = () => {
        if (!selectedPackage) {
            toast.error("Please select a package first");
            return;
        }
        setShowPurchaseModal(true);
    };

    // Handle successful purchase
    const handlePurchaseSuccess = async () => {
        await refreshBalance();
        // Refresh transaction history to show the new purchase
        await transactionHistoryRef.current?.refetch();
        setSelectedPackage(null);
        setPurchaseProcessing(false);
    };

    // Handle modal close
    const handleModalClose = () => {
        if (!purchaseProcessing) {
            setShowPurchaseModal(false);
        }
    };

    // Error state
    if (error && !loading) {
        return (
            <div className="dashboard-body">
                <div className="position-relative">
                    <DashboardHeader />
                    <h2 className="main-title">Keys to Abundance</h2>
                    <div className="bg-white card-box border-20">
                        <div className="alert alert-danger mb-0">
                            <strong>Error loading keys:</strong> {error}
                            <br />
                            <button
                                className="btn btn-link p-0 mt-2"
                                onClick={() => window.location.reload()}
                            >
                                Refresh page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeader />
                <h2 className="main-title">Keys to Abundance</h2>

                {/* Credits Balance Stats */}
                <CreditStats balance={balance} loading={loading} />

                {/* How Credits Work */}
                <HowCreditsWork />

                {/* Purchase Credits Section */}
                <div className="row mb-20">
                    <div className="col-12">
                        <div className="bg-white card-box border-20">
                            <div className="d-flex justify-content-between align-items-center mb-20 flex-wrap gap-3">
                                <div>
                                    <h4 className="dash-title-three mb-10">Purchase Keys to Abundance Packages</h4>
                                    <p className="mb-0 text-muted">
                                        Choose a Keys to Abundance package to start applying for projects. 1 key = 1 application.
                                    </p>
                                </div>

                                {/* Buy Now Button */}
                                {selectedPackage && (
                                    <button
                                        className="dash-btn-two tran3s"
                                        onClick={handlePurchaseClick}
                                        disabled={purchaseProcessing}
                                        style={{
                                            minWidth: "180px",
                                        }}
                                    >
                                        {purchaseProcessing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Buy {selectedPackage.credits} Keys to Abundance - ₹
                                                {selectedPackage.price.toLocaleString("en-IN")}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Package Selector Grid */}
                            <PackageSelector
                                packages={packages?.packages || []}
                                selectedPackage={selectedPackage}
                                onSelect={handlePackageSelect}
                                loading={loading}
                                disabled={purchaseProcessing}
                                pricePerCredit={packages?.pricePerCredit || 50}
                            />
                        </div>
                    </div>
                </div>

                {/* Transaction History (Compact View) */}
                <div className="row mb-20">
                    <div className="col-12">
                        <TransactionHistory ref={transactionHistoryRef} initialPageSize={5} showFilters={true} compact={false} />
                    </div>
                </div>

                {/* Purchase Modal */}
                <PurchaseModal
                    isOpen={showPurchaseModal}
                    onClose={handleModalClose}
                    selectedPackage={selectedPackage}
                    onSuccess={handlePurchaseSuccess}
                />
            </div>
        </div>
    );
};

export default CreditsArea;
