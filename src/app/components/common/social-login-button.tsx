'use client';

import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface SocialLoginButtonProps {
    provider: 'google' | 'facebook' | 'apple';
    icon: StaticImageData;
    label: string;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable Social Login Button Component
 * 
 * Handles OAuth login flow with loading states and accessibility
 */
const SocialLoginButton = ({
    provider,
    icon,
    label,
    onClick,
    isLoading = false,
    disabled = false,
    className = '',
    size = 'medium',
}: SocialLoginButtonProps) => {
    const handleClick = () => {
        if (disabled || isLoading || !onClick) return;
        onClick();
    };

    const sizeClasses = {
        small: 'btn-sm',
        medium: '',
        large: 'btn-lg',
    };

    const iconSizes = {
        small: 16,
        medium: 20,
        large: 24,
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={`social-login-btn social-use-btn d-flex align-items-center justify-content-center tran3s w-100 ${sizeClasses[size]} ${className}`}
            aria-label={`Continue with ${label}`}
            data-provider={provider}
        >
            {isLoading ? (
                <span className="spinner-wrapper">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span className="loading-text">Connecting...</span>
                </span>
            ) : (
                <>
                    <Image
                        src={icon}
                        alt={`${label} icon`}
                        width={iconSizes[size]}
                        height={iconSizes[size]}
                        className="provider-icon"
                    />
                    <span className="label-text">{label}</span>
                </>
            )}

            <style jsx>{`
        .social-login-btn {
          position: relative;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          gap: 10px;
        }
        
        .social-login-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .social-login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .social-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .social-login-btn.btn-sm {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .social-login-btn.btn-lg {
          padding: 16px 20px;
          font-size: 16px;
        }
        
        .spinner-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .loading-text {
          margin-left: 4px;
        }
        
        .label-text {
          white-space: nowrap;
        }
        
        /* Provider-specific hover colors */
        .social-login-btn[data-provider="google"]:hover:not(:disabled) {
          border-color: #ea4335;
        }
        
        .social-login-btn[data-provider="facebook"]:hover:not(:disabled) {
          border-color: #1877f2;
        }
        
        .social-login-btn[data-provider="apple"]:hover:not(:disabled) {
          border-color: #000000;
        }
      `}</style>
        </button>
    );
};

export default SocialLoginButton;
