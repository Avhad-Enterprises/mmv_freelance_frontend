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
  { id: "professional", amount: 50, price: 50, popular: true },
  { id: "premium", amount: 100, price: 100 },
];

const CreditsArea = () => {
  const decoded = useDecodedToken();
  const [balance, setBalance] = useState<CreditsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
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
          <div className="text-center py-45">
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
        <div className="row mb-20">
          <div className="col-lg-4 col-md-6">
            <div className="dash-card-one bg-white border-30 position-relative mb-15">
              <div className="d-sm-flex align-items-center justify-content-between">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                  <Image src={icon_1} alt="Available Credits" className="lazy-img" />
                </div>
                <div className="order-sm-0">
                  <div className="value fw-500">{balance?.credits_balance || 0}</div>
                  <span>Available Credits</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="dash-card-one bg-white border-30 position-relative mb-15">
              <div className="d-sm-flex align-items-center justify-content-between">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                  <Image src={icon_2} alt="Total Purchased" className="lazy-img" />
                </div>
                <div className="order-sm-0">
                  <div className="value fw-500">{balance?.total_credits_purchased || 0}</div>
                  <span>Total Purchased</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="dash-card-one bg-white border-30 position-relative mb-15">
              <div className="d-sm-flex align-items-center justify-content-between">
                <div className="icon rounded-circle d-flex align-items-center justify-content-center order-sm-1">
                  <Image src={icon_3} alt="Credits Used" className="lazy-img" />
                </div>
                <div className="order-sm-0">
                  <div className="value fw-500">{balance?.credits_used || 0}</div>
                  <span>Credits Used</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Credits Work */}
        <div className="row mb-20">
          <div className="col-12">
            <div className="bg-white card-box border-20">
              <h4 className="dash-title-three">How Credits Work</h4>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center mt-25">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-15" style={{ width: '60px', height: '60px', background: '#D2F34C', color: '#244034', fontSize: '24px', fontWeight: 'bold' }}>
                      1
                    </div>
                    <h5 className="mb-10">Purchase Credits</h5>
                    <p>
                      Choose from our credit packages to start applying for projects.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center mt-25">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-15" style={{ width: '60px', height: '60px', background: '#D2F34C', color: '#244034', fontSize: '24px', fontWeight: 'bold' }}>
                      2
                    </div>
                    <h5 className="mb-10">Apply to Projects</h5>
                    <p>
                      Each project application costs 50 credits. Credits are deducted automatically.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center mt-25">
                    <div className="icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-15" style={{ width: '60px', height: '60px', background: '#D2F34C', color: '#244034', fontSize: '24px', fontWeight: 'bold' }}>
                      3
                    </div>
                    <h5 className="mb-10">Get Hired</h5>
                    <p>
                      Once hired, build your portfolio and grow your freelance career.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Credits Section */}
        <div className="row mb-20">
          <div className="col-12">
            <div className="bg-white card-box border-20">
              <h4 className="dash-title-three">Purchase Credit Packages</h4>
              <p className="mb-25">
                Choose a credit package to start applying for projects. Each application requires 50 credits.
              </p>

              <div className="row">
                {CREDIT_PACKAGES.map((pkg) => (
                  <div key={pkg.id} className="col-lg-4 col-md-6">
                    <div
                      className={`dash-card-one bg-white border-30 position-relative mb-15 ${pkg.popular ? 'border' : ''
                        }`}
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        borderColor: pkg.popular ? '#D2F34C' : undefined
                      }}
                    >
                      {pkg.popular && (
                        <div
                          className="position-absolute top-0 start-50 translate-middle"
                          style={{
                            marginTop: '10px',
                            backgroundColor: '#D2F34C',
                            color: '#244034',
                            border: '2px solid #D2F34C'
                          }}
                        >
                          <span className="badge">Most Popular</span>
                        </div>
                      )}

                      <div className="text-center mb-25">
                        <h3 className="fw-bold mb-10 text-capitalize">{pkg.id}</h3>
                        <div className="mb-15">
                          <span className="fs-1 fw-bold" style={{ color: '#D2F34C' }}>{pkg.amount}</span>
                          <span className="text-muted ms-1">Credits</span>
                        </div>
                        <div className="mb-15">
                          <span className="fs-4 fw-bold">${pkg.price.toFixed(2)}</span>
                        </div>
                        <div className="text-muted small mb-15">
                          ${(pkg.price / pkg.amount).toFixed(2)} per credit
                        </div>
                      </div>

                      <button
                        className={`dash-btn-two w-100 tran3s ${purchasing === pkg.id ? 'disabled' : ''
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

                      <div className="mt-15 text-center">
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

        {/* Confirmation Modal */}
        {showConfirmModal && pendingPurchase && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, overflow: 'auto' }}
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-20">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title dash-title-three">Confirm Purchase</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={cancelPurchase}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center py-25">
                    <div className="mb-15">
                      <span className="fs-2 fw-bold" style={{ color: '#D2F34C' }}>{pendingPurchase.amount}</span>
                      <span className="text-muted ms-2">Credits</span>
                    </div>
                    <div className="mb-15">
                      <span className="fs-4 fw-bold">${pendingPurchase.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-muted mb-25">
                      This will give you <strong>{Math.floor(pendingPurchase.amount / 50)}</strong> project application{Math.floor(pendingPurchase.amount / 50) !== 1 ? 's' : ''}
                    </div>
                    <p className="text-muted">
                      Are you sure you want to purchase these credits?
                    </p>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelPurchase}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="dash-btn-two tran3s"
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