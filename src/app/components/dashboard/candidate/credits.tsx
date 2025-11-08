"use client";
import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import icon_1 from "@/assets/dashboard/images/icon/icon_12.svg";
import icon_2 from "@/assets/dashboard/images/icon/icon_13.svg";
import icon_3 from "@/assets/dashboard/images/icon/icon_14.svg";
import DashboardHeader from "./dashboard-header-minus";
import { makeGetRequest, makePostRequest } from "@/utils/api";
import useDecodedToken from "@/hooks/useDecodedToken";
import { authCookies } from "@/utils/cookies";
import toast from "react-hot-toast";

type CreditsBalance = {
  credits_balance: number;
  total_credits_purchased: number;
  credits_used: number;
};

type CreditPackage = {
  id: string;
  amount: number;
  price: number;
  popular?: boolean;
};

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "starter", amount: 10, price: 10 },
  { id: "basic", amount: 25, price: 25 },
  { id: "professional", amount: 50, price: 50, popular: true },
  { id: "premium", amount: 100, price: 100 },
  { id: "enterprise", amount: 250, price: 250 },
];

const CreditsArea = () => {
  const decoded = useDecodedToken();
  const [balance, setBalance] = useState<CreditsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState(10);
  const [purchasingCustom, setPurchasingCustom] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{ amount: number; packageId?: string } | null>(null);

  // Fetch credits balance
  const fetchBalance = async () => {
    try {
      const token = authCookies.getToken();
      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }
      
      const response = await makeGetRequest("api/v1/credits/balance");
      
      if (response?.data?.success) {
        setBalance(response.data.data);
      } else {
        toast.error("Failed to load credits balance");
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      toast.error("Unable to fetch credits balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Handle credit purchase
  const handlePurchase = async (amount: number, packageId?: string) => {
    // Show confirmation modal
    setPendingPurchase({ amount, packageId });
    setShowConfirmModal(true);
  };

  // Confirm and process purchase
  const confirmPurchase = async () => {
    if (!pendingPurchase) return;

    const { amount, packageId } = pendingPurchase;
    
    if (packageId) {
      setPurchasing(packageId);
    } else {
      setPurchasingCustom(true);
    }

    setShowConfirmModal(false);

    try {
      // In production, integrate with payment gateway here
      const paymentReference = `PAY-${Date.now()}-${amount}`;
      
      const response = await makePostRequest("api/v1/credits/purchase", {
        credits_amount: amount,
        payment_reference: paymentReference,
      });

      if (response?.data?.success) {
        toast.success(`Successfully purchased ${amount} credits!`);
        // Refresh balance
        await fetchBalance();
      } else {
        toast.error(response?.data?.message || "Purchase failed");
      }
    } catch (err: any) {
      console.error("Error purchasing credits:", err);
      toast.error(err?.response?.data?.message || "Unable to complete purchase");
    } finally {
      setPurchasing(null);
      setPurchasingCustom(false);
      setPendingPurchase(null);
    }
  };

  // Cancel purchase
  const cancelPurchase = () => {
    setShowConfirmModal(false);
    setPendingPurchase(null);
  };

  if (loading) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeader />
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
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
        <h2 className="main-title">Credits Management</h2>

        {/* Credits Balance Section */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="bg-white border-20 p-4">
              <h4 className="dash-title-three mb-4">Your Credits Balance</h4>
              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <div className="dash-card-one border-20 position-relative p-4 text-center">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px', background: '#f0f5ff' }}>
                      <Image src={icon_1} alt="Available Credits" className="lazy-img" />
                    </div>
                    <div className="value fw-500 fs-1 text-primary">
                      {balance?.credits_balance || 0}
                    </div>
                    <span className="text-muted">Available Credits</span>
                    <div className="fs-6 text-muted mt-2">
                      Use credits to apply for projects
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="dash-card-one border-20 position-relative p-4 text-center">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px', background: '#f0fff4' }}>
                      <Image src={icon_2} alt="Total Purchased" className="lazy-img" />
                    </div>
                    <div className="value fw-500 fs-1 text-success">
                      {balance?.total_credits_purchased || 0}
                    </div>
                    <span className="text-muted">Total Purchased</span>
                    <div className="fs-6 text-muted mt-2">
                      Lifetime credits purchased
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="dash-card-one border-20 position-relative p-4 text-center">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '70px', height: '70px', background: '#fff7ed' }}>
                      <Image src={icon_3} alt="Credits Used" className="lazy-img" />
                    </div>
                    <div className="value fw-500 fs-1 text-warning">
                      {balance?.credits_used || 0}
                    </div>
                    <span className="text-muted">Credits Used</span>
                    <div className="fs-6 text-muted mt-2">
                      Applied to {Math.floor((balance?.credits_used || 0) / 50)} projects
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Credits Work */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="bg-white border-20 p-4">
              <h4 className="dash-title-three mb-4">How Credits Work</h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>
                      1
                    </div>
                    <h5 className="mb-2">Purchase Credits</h5>
                    <p className="text-muted mb-0">
                      Choose a package or customize your own credit amount below.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>
                      2
                    </div>
                    <h5 className="mb-2">Apply to Projects</h5>
                    <p className="text-muted mb-0">
                      Each project application costs 50 credits. Credits are deducted automatically.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '24px', fontWeight: 'bold' }}>
                      3
                    </div>
                    <h5 className="mb-2">Get Hired</h5>
                    <p className="text-muted mb-0">
                      Once hired, build your portfolio and grow your freelance career.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Credits Section */}
        <div className="row mb-40">
          <div className="col-12">
            <div className="bg-white border-20 p-4">
              <h4 className="dash-title-three mb-4">Purchase Credit Packages</h4>
              <p className="text-muted mb-4">
                Choose a credit package to start applying for projects. Each application requires 50 credits.
              </p>
              
              <div className="row g-4">
                {CREDIT_PACKAGES.map((pkg) => (
                  <div key={pkg.id} className="col-lg-4 col-md-6">
                    <div 
                      className={`dash-card-one border-20 position-relative p-4 h-100 ${
                        pkg.popular ? 'border border-primary' : ''
                      }`}
                      style={{ 
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      {pkg.popular && (
                        <div 
                          className="position-absolute top-0 start-50 translate-middle"
                          style={{ marginTop: '10px' }}
                        >
                          <span className="badge bg-primary">Most Popular</span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="fw-bold mb-2 text-capitalize">{pkg.id}</h3>
                        <div className="mb-3">
                          <span className="fs-1 fw-bold text-primary">{pkg.amount}</span>
                          <span className="text-muted ms-1">Credits</span>
                        </div>
                        <div className="mb-3">
                          <span className="fs-4 fw-bold">${pkg.price.toFixed(2)}</span>
                        </div>
                        <div className="text-muted small mb-3">
                          ${(pkg.price / pkg.amount).toFixed(2)} per credit
                        </div>
                      </div>

                      <button
                        className={`dash-btn-two w-100 ${
                          purchasing === pkg.id ? 'disabled' : ''
                        }`}
                        onClick={() => handlePurchase(pkg.amount, pkg.id)}
                        disabled={purchasing === pkg.id}
                      >
                        {purchasing === pkg.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          `Purchase ${pkg.amount} Credits`
                        )}
                      </button>

                      <div className="mt-3 text-center">
                        <small className="text-muted">
                          {Math.floor(pkg.amount / 50)} project applications
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Amount Section */}
        <div className="row">
          <div className="col-12">
            <div className="bg-white border-20 p-4">
              <h4 className="dash-title-three mb-4">Custom Amount</h4>
              <p className="text-muted mb-4">
                Need a different amount? Use the slider to choose your custom credit amount.
              </p>
              
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <span className="fs-1 fw-bold text-primary">{customAmount}</span>
                      <span className="text-muted ms-2 fs-5">Credits</span>
                    </div>
                    <div className="mb-2">
                      <span className="fs-4 fw-bold">${customAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-muted small">
                      $1.00 per credit • {Math.floor(customAmount / 50)} project applications
                    </div>
                  </div>

                  <div className="mb-4">
                    <input
                      type="range"
                      className="form-range"
                      min="1"
                      max="500"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      style={{
                        height: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <div className="d-flex justify-content-between text-muted small mt-2">
                      <span>1 Credit</span>
                      <span>500 Credits</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      className={`dash-btn-two ${purchasingCustom ? 'disabled' : ''}`}
                      onClick={() => handlePurchase(customAmount)}
                      disabled={purchasingCustom}
                      style={{ minWidth: '250px' }}
                    >
                      {purchasingCustom ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        `Purchase ${customAmount} Credits - ${customAmount.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && pendingPurchase && (
          <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Purchase</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={cancelPurchase}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center py-3">
                    <div className="mb-3">
                      <span className="fs-2 fw-bold text-primary">{pendingPurchase.amount}</span>
                      <span className="text-muted ms-2">Credits</span>
                    </div>
                    <div className="mb-3">
                      <span className="fs-4 fw-bold">${pendingPurchase.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-muted mb-4">
                      This will give you <strong>{Math.floor(pendingPurchase.amount / 50)}</strong> project application{Math.floor(pendingPurchase.amount / 50) !== 1 ? 's' : ''}
                    </div>
                    <p className="text-muted">
                      Are you sure you want to purchase these credits?
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={cancelPurchase}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="dash-btn-two" 
                    onClick={confirmPurchase}
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreditsArea;