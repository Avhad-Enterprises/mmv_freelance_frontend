'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authCookies } from '@/utils/cookies';
import Link from 'next/link';

// Types
type UserIntent = 'hire' | 'work' | null;
type FreelancerType = 'videographer' | 'video_editor' | null;

// Loading spinner
const Spinner = () => (
    <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <style jsx>{`
            .spinner-container {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px;
            }
        `}</style>
    </div>
);

// Role Card Component
interface RoleCardProps {
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    selected?: boolean;
    disabled?: boolean;
}

const RoleCard = ({ icon, title, description, onClick, selected, disabled }: RoleCardProps) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`role-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
        type="button"
    >
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>

        <style jsx>{`
            .role-card {
                width: 100%;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 16px;
                padding: 32px 24px;
                text-align: center;
                cursor: pointer;
                transition: all 0.25s ease;
                position: relative;
                overflow: hidden;
            }
            
            .role-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #1f413a, #2a584e);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .role-card:hover:not(:disabled) {
                border-color: #1f413a;
                transform: translateY(-4px);
                box-shadow: 0 12px 32px rgba(31, 65, 58, 0.15);
            }
            
            .role-card:hover:not(:disabled)::before {
                transform: scaleX(1);
            }
            
            .role-card.selected {
                border-color: #1f413a;
                background: rgba(31, 65, 58, 0.03);
            }
            
            .role-card.selected::before {
                transform: scaleX(1);
            }
            
            .role-card.disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .card-icon {
                font-size: 56px;
                margin-bottom: 16px;
                line-height: 1;
            }
            
            .card-title {
                font-size: 20px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 8px;
            }
            
            .card-description {
                font-size: 14px;
                color: #6b7280;
                line-height: 1.5;
                margin: 0;
            }
        `}</style>
    </button>
);

// Step One: Choose Intent
interface StepOneProps {
    onSelect: (intent: UserIntent) => void;
    isSubmitting: boolean;
}

const StepOne = ({ onSelect, isSubmitting }: StepOneProps) => (
    <div className="step-container">
        <div className="step-header">
            <div className="step-indicator">
                <span className="step-dot active"></span>
                <span className="step-line"></span>
                <span className="step-dot"></span>
            </div>
            <p className="step-label">Step 1 of 2 • Choose your path</p>
        </div>

        <h1 className="step-title">What brings you to MMV Freelance?</h1>
        <p className="step-subtitle">Choose how you'd like to use our platform</p>

        <div className="cards-grid">
            <RoleCard
                icon="💼"
                title="I want to hire talent"
                description="Find skilled videographers and video editors for your projects"
                onClick={() => onSelect('hire')}
                disabled={isSubmitting}
            />
            <RoleCard
                icon="🎬"
                title="I want to find work"
                description="Offer your video production or editing skills to clients"
                onClick={() => onSelect('work')}
                disabled={isSubmitting}
            />
        </div>

        <style jsx>{`
            .step-container {
                width: 100%;
                max-width: 640px;
            }
            
            .step-header {
                text-align: center;
                margin-bottom: 32px;
            }
            
            .step-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            
            .step-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #e5e7eb;
                transition: all 0.3s;
            }
            
            .step-dot.active {
                background: #1f413a;
                width: 14px;
                height: 14px;
            }
            
            .step-line {
                width: 60px;
                height: 2px;
                background: #e5e7eb;
            }
            
            .step-label {
                font-size: 14px;
                color: #9ca3af;
                margin: 0;
            }
            
            .step-title {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
                text-align: center;
                margin-bottom: 8px;
            }
            
            .step-subtitle {
                font-size: 16px;
                color: #6b7280;
                text-align: center;
                margin-bottom: 40px;
            }
            
            .cards-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 32px;
            }
            
            @media (max-width: 640px) {
                .cards-grid {
                    grid-template-columns: 1fr;
                }
                
                .step-title {
                    font-size: 24px;
                }
            }
            
        `}</style>
    </div>
);

// Step Two: Choose Freelancer Type
interface StepTwoProps {
    onSelect: (type: FreelancerType) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

const StepTwo = ({ onSelect, onBack, isSubmitting }: StepTwoProps) => (
    <div className="step-container">
        <div className="step-header">
            <button onClick={onBack} disabled={isSubmitting} className="back-button" type="button">
                ← Back
            </button>
            <div className="step-indicator">
                <span className="step-dot completed"></span>
                <span className="step-line active"></span>
                <span className="step-dot active"></span>
            </div>
            <p className="step-label">Step 2 of 2 • Your specialty</p>
        </div>

        <h1 className="step-title">What's your specialty?</h1>
        <p className="step-subtitle">Choose your primary skill — you can add more later</p>

        <div className="cards-grid">
            <RoleCard
                icon="📹"
                title="Videographer"
                description="I shoot and produce video content for clients"
                onClick={() => onSelect('videographer')}
                disabled={isSubmitting}
            />
            <RoleCard
                icon="🎞️"
                title="Video Editor"
                description="I edit and post-produce video content"
                onClick={() => onSelect('video_editor')}
                disabled={isSubmitting}
            />
        </div>

        <p className="helper-text">
            You can always add or change your specialties later in your profile settings.
        </p>

        <style jsx>{`
            .step-container {
                width: 100%;
                max-width: 640px;
            }
            
            .step-header {
                text-align: center;
                margin-bottom: 32px;
                position: relative;
            }
            
            .back-button {
                position: absolute;
                left: 0;
                top: 0;
                padding: 8px 16px;
                background: transparent;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                color: #6b7280;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .back-button:hover:not(:disabled) {
                background: #f3f4f6;
                color: #1f2937;
            }
            
            .back-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .step-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            
            .step-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #e5e7eb;
                transition: all 0.3s;
            }
            
            .step-dot.active {
                background: #1f413a;
                width: 14px;
                height: 14px;
            }
            
            .step-dot.completed {
                background: #22c55e;
            }
            
            .step-line {
                width: 60px;
                height: 2px;
                background: #e5e7eb;
            }
            
            .step-line.active {
                background: linear-gradient(90deg, #22c55e, #1f413a);
            }
            
            .step-label {
                font-size: 14px;
                color: #9ca3af;
                margin: 0;
            }
            
            .step-title {
                font-size: 28px;
                font-weight: 700;
                color: #1f2937;
                text-align: center;
                margin-bottom: 8px;
            }
            
            .step-subtitle {
                font-size: 16px;
                color: #6b7280;
                text-align: center;
                margin-bottom: 40px;
            }
            
            .cards-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 24px;
            }
            
            @media (max-width: 640px) {
                .cards-grid {
                    grid-template-columns: 1fr;
                }
                
                .step-title {
                    font-size: 24px;
                }
                
                .back-button {
                    position: static;
                    display: block;
                    margin: 0 auto 24px;
                }
            }
            
            .helper-text {
                text-align: center;
                font-size: 13px;
                color: #9ca3af;
                margin: 0;
            }
        `}</style>
    </div>
);

// Main Content Component
const SelectRoleContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasCheckedAuth = useRef(false);

    // Check if user is authenticated and needs role selection
    useEffect(() => {
        if (hasCheckedAuth.current) return;
        hasCheckedAuth.current = true;

        const checkAuth = async () => {
            const token = authCookies.getToken();

            if (!token) {
                // Not authenticated, redirect to login
                window.location.href = '/';
                return;
            }

            // Optionally check if user already has a role
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/role-status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && !data.data.needsRoleSelection) {
                        // User already has a role, redirect to dashboard
                        const roles = data.data.roles || [];
                        if (roles.includes('CLIENT')) {
                            window.location.href = '/dashboard/client-dashboard';
                        } else {
                            window.location.href = '/dashboard/freelancer-dashboard';
                        }
                    }
                }
            } catch (err) {
                // If check fails, allow user to proceed with role selection
                console.warn('Role status check failed:', err);
            }
        };

        checkAuth();
    }, []);

    const submitRoleSelection = async (role: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const token = authCookies.getToken();

            if (!token) {
                setError('Session expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/set-role`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role }),
            });

            const data = await res.json();

            if (data.success) {
                // Save the new token with updated roles
                if (data.data.token) {
                    authCookies.setToken(data.data.token, true);
                }

                // Small delay to ensure token is saved
                await new Promise(resolve => setTimeout(resolve, 100));

                // Full page redirect to refresh context and go to dashboard
                window.location.href = data.data.redirect;
            } else {
                setError(data.message || 'Failed to set role. Please try again.');
            }
        } catch (err) {
            console.error('Error setting role:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIntentSelect = async (intent: UserIntent) => {
        if (intent === 'hire') {
            // Client - submit immediately
            await submitRoleSelection('CLIENT');
        } else if (intent === 'work') {
            // Freelancer - go to step 2
            setStep(2);
        }
    };

    const handleFreelancerTypeSelect = async (type: FreelancerType) => {
        if (type === 'videographer') {
            await submitRoleSelection('VIDEOGRAPHER');
        } else if (type === 'video_editor') {
            await submitRoleSelection('VIDEO_EDITOR');
        }
    };

    return (
        <div className="role-selection-page">
            <div className="page-content">
                {/* Logo */}
                <div className="logo-container">
                    <Link href="/">
                        <span className="logo-text">MMV Freelance</span>
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <p>{error}</p>
                        <button onClick={() => setError(null)} className="dismiss-btn">×</button>
                    </div>
                )}

                {/* Step Content */}
                {step === 1 && (
                    <StepOne
                        onSelect={handleIntentSelect}
                        isSubmitting={isSubmitting}
                    />
                )}

                {step === 2 && (
                    <StepTwo
                        onSelect={handleFreelancerTypeSelect}
                        onBack={() => setStep(1)}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* Loading Overlay */}
                {isSubmitting && (
                    <div className="loading-overlay">
                        <div className="loading-content">
                            <Spinner />
                            <p>Setting up your account...</p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <p className="footer-text">
                    By continuing, you agree to our{' '}
                    <Link href="/terms-condition">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy">Privacy Policy</Link>
                </p>
            </div>

            <style jsx>{`
                .role-selection-page {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #f8fafb 0%, #e9eef2 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    position: relative;
                }
                
                .page-content {
                    width: 100%;
                    max-width: 720px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .logo-container {
                    margin-bottom: 48px;
                }
                
                .logo-text {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f413a;
                    text-decoration: none;
                }
                
                .error-banner {
                    width: 100%;
                    max-width: 640px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .error-banner p {
                    color: #dc2626;
                    margin: 0;
                    font-size: 14px;
                }
                
                .dismiss-btn {
                    background: none;
                    border: none;
                    color: #dc2626;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0 4px;
                }
                
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .loading-content {
                    text-align: center;
                }
                
                .loading-content p {
                    margin-top: 16px;
                    color: #6b7280;
                    font-size: 16px;
                }
                
                .footer-text {
                    margin-top: 48px;
                    font-size: 13px;
                    color: #9ca3af;
                    text-align: center;
                }
                
                .footer-text :global(a) {
                    color: #6b7280;
                    text-decoration: underline;
                }
                
                .footer-text :global(a:hover) {
                    color: #1f413a;
                }
            `}</style>
        </div>
    );
};

// Main Page with Suspense
const SelectRolePage = () => {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #f8fafb 0%, #e9eef2 100%)'
            }}>
                <Spinner />
            </div>
        }>
            <SelectRoleContent />
        </Suspense>
    );
};

export default SelectRolePage;
