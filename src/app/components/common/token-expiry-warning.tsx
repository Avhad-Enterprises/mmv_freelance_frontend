"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TokenRefreshService from '@/utils/tokenRefresh';

const TokenExpiryWarning: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [warningDismissed, setWarningDismissed] = useState(false);

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const tokenRefreshService = TokenRefreshService.getInstance();

      if (tokenRefreshService.shouldShowExpiryWarning(token) && !warningDismissed) {
        const timeUntilExpiry = tokenRefreshService.getTimeUntilExpiry(token);
        setTimeRemaining(timeUntilExpiry);
        setShowWarning(true);
      } else if (!tokenRefreshService.shouldShowExpiryWarning(token)) {
        setShowWarning(false);
      }
    };

    // Check immediately and then every minute
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [warningDismissed]);

  const handleExtendSession = async () => {
    try {
      const tokenRefreshService = TokenRefreshService.getInstance();
      await tokenRefreshService.refreshToken();
      setShowWarning(false);
      setWarningDismissed(false);
      toast.success('Session extended successfully!');
    } catch (error) {
      toast.error('Failed to extend session. Please log in again.');
    }
  };

  const handleDismiss = () => {
    setShowWarning(false);
    setWarningDismissed(true);
  };

  if (!showWarning) return null;

  const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-bold">Session Expiring</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-yellow-700 hover:text-yellow-900 ml-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-sm mt-2">
          Your session will expire in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}.
          Would you like to extend your session?
        </p>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleExtendSession}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Extend Session
          </button>
          <button
            onClick={handleDismiss}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryWarning;