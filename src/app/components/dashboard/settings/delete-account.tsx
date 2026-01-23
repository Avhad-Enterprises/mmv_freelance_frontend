'use client'
import React, { useState } from 'react';
import { makePostRequest } from '@/utils/api';
import { authCookies } from '@/utils/cookies';
import toast from 'react-hot-toast';

interface DeleteAccountSectionProps {
  userRole?: string;
  onAccountDeleted?: () => void;
}

const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({ 
  userRole = 'user',
  onAccountDeleted 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const token = authCookies.getToken();
      if (!token) {
        setIsDeleting(false);
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Clear local storage and cookies
        authCookies.removeToken();
        
        // Show success message
        toast.success('Your account has been deleted successfully. You will be redirected to the homepage.');
        
        // Call callback if provided
        if (onAccountDeleted) {
          onAccountDeleted();
        }
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to delete account');
      }
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Network error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationText('');
  };

  return (
    <div className="delete-account-section mt-45">
      <div className="bg-white card-box border-20">
        <div className="user-avatar-setting">
          {/* Header Section */}
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
            <div className="flex-grow-1">
              <h4 className="main-title" style={{ color: '#dc3545', marginBottom: '8px' }}>
                Delete Account Permanently
              </h4>
              <p className="fs-16" style={{ color: '#6c757d', marginBottom: '0' }}>
                This action cannot be undone. Please proceed with caution.
              </p>
            </div>
            {!showConfirmation && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="dash-btn-two tran3s w-100"
                  style={{ 
                    backgroundColor: '#dc3545', 
                    borderColor: '#dc3545',
                    color: 'white',
                    minWidth: '160px'
                  }}
                >
                  Delete My Account
                </button>
              </div>
            )}
          </div>

          {/* Warning Section */}
          <div 
            className="dash-input-wrapper mb-4"
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <div className="row">
              <div className="col-12">
                <p style={{ color: '#dc2626', fontWeight: '600', marginBottom: '12px' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Warning: Deleting your account will:
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <ul style={{ color: '#6b7280', marginBottom: '0', paddingLeft: '20px' }}>
                      <li>Permanently remove your profile and personal information</li>
                      <li>Cancel all active projects and bookings</li>
                      <li>Remove access to your dashboard and account features</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul style={{ color: '#6b7280', marginBottom: '0', paddingLeft: '20px' }}>
                      <li>Delete your project history and communications</li>
                      {userRole === 'freelancer' && (
                        <li>Remove your portfolio and service listings</li>
                      )}
                      {userRole === 'client' && (
                        <li>Cancel any pending project requests</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          {showConfirmation && (
            <div 
              className="dash-input-wrapper"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px'
              }}
            >
              <div className="row align-items-end gap-3 gap-md-0">
                <div className="col-12 col-md-7">
                  <label htmlFor="confirmDelete" className="form-label" style={{ color: '#dc2626', fontWeight: '600' }}>
                    Type "DELETE" to confirm account deletion:
                  </label>
                  <input
                    type="text"
                    id="confirmDelete"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE here"
                    className="dash-input-bg"
                    autoComplete="off"
                    style={{ marginBottom: '0' }}
                  />
                </div>
                <div className="col-12 col-md-5">
                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-md-end">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || confirmationText !== 'DELETE'}
                      className="dash-btn-two tran3s order-2 order-sm-1"
                      style={{
                        backgroundColor: confirmationText === 'DELETE' && !isDeleting ? '#dc3545' : '#6c757d',
                        borderColor: confirmationText === 'DELETE' && !isDeleting ? '#dc3545' : '#6c757d',
                        color: 'white',
                        cursor: confirmationText === 'DELETE' && !isDeleting ? 'pointer' : 'not-allowed',
                        minWidth: '140px'
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
                    </button>
                    
                    <button
                      onClick={resetConfirmation}
                      disabled={isDeleting}
                      className="dash-btn-one order-1 order-sm-2"
                      style={{ minWidth: '100px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountSection;