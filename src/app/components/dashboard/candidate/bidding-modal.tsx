import React, { useState } from 'react';

interface BiddingModalProps {
  originalBudget: number;
  currency?: string;
  onSubmit: (bidAmount: number, bidMessage: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const BiddingModal: React.FC<BiddingModalProps> = ({
  originalBudget,
  currency = 'USD',
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    const amount = parseFloat(bidAmount);

    if (!bidAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount greater than 0');
      return;
    }

    setError('');
    onSubmit(amount, bidMessage);
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        overflow: 'auto'
      }}
      onClick={onCancel}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: '12px' }}>
          <div className="modal-header" style={{ borderBottom: '1px solid #e0e0e0' }}>
            <h5 className="modal-title fw-600">Submit Your Bid</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="mb-4">
              <div
                className="p-3 rounded-3"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Client's Budget:</span>
                  <span className="fw-600 text-dark" style={{ fontSize: '18px' }}>
                    {currency} {originalBudget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-500">
                Your Bid Amount <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">{currency}</span>
                <input
                  type="number"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value);
                    setError('');
                  }}
                  step="0.01"
                  min="0.01"
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <div className="text-danger mt-2" style={{ fontSize: '14px' }}>
                  {error}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-500">
                Bid Message <span className="text-muted">(Optional)</span>
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Explain why you're the right fit for this project..."
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="text-muted mt-1" style={{ fontSize: '12px' }}>
                {bidMessage.length}/500 characters
              </div>
            </div>

            <div
              className="alert alert-info d-flex align-items-start"
              style={{ fontSize: '13px' }}
            >
              <i className="bi bi-info-circle me-2 mt-1"></i>
              <div>
                <strong>Note:</strong> Submitting this bid will cost 1 key.
                Make sure your bid is competitive and realistic.
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: '1px solid #e0e0e0' }}>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                backgroundColor: '#3d6f5d',
                borderColor: '#3d6f5d'
              }}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Submitting...
                </>
              ) : (
                'Submit Bid'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingModal;