'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { authCookies } from '@/utils/cookies';
import {
    getLinkedProviders,
    unlinkProvider,
    linkProvider,
    OAuthProvider
} from '@/utils/oauth';

// Import icons
import googleIcon from '@/assets/images/icon/google.png';
import facebookIcon from '@/assets/images/icon/facebook.png';
import appleIcon from '@/assets/images/icon/apple.png';

// Provider configurations
const providerConfig: Record<OAuthProvider, {
    icon: any;
    label: string;
    color: string;
    enabled: boolean;
}> = {
    google: {
        icon: googleIcon,
        label: 'Google',
        color: '#DB4437',
        enabled: true,
    },
    facebook: {
        icon: facebookIcon,
        label: 'Facebook',
        color: '#1877F2',
        enabled: false, // Coming soon
    },
    apple: {
        icon: appleIcon,
        label: 'Apple',
        color: '#000000',
        enabled: false, // Coming soon
    },
};

interface LinkedAccountsSectionProps {
    className?: string;
}

const LinkedAccountsSection: React.FC<LinkedAccountsSectionProps> = ({
    className = ''
}) => {
    const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [unlinkingProvider, setUnlinkingProvider] = useState<OAuthProvider | null>(null);

    // Fetch linked providers on mount
    useEffect(() => {
        const fetchLinked = async () => {
            try {
                const token = authCookies.getToken();
                if (token) {
                    const providers = await getLinkedProviders(token);
                    setLinkedProviders(providers);
                }
            } catch (error) {
                console.error('Failed to fetch linked providers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLinked();
    }, []);

    /**
     * Handle linking a new OAuth provider
     */
    const handleLinkProvider = (provider: OAuthProvider) => {
        if (!providerConfig[provider].enabled) {
            toast.error(`${providerConfig[provider].label} login coming soon!`);
            return;
        }

        // Redirect to OAuth flow - backend will handle linking for authenticated users
        linkProvider(provider);
    };

    /**
     * Handle unlinking an OAuth provider
     */
    const handleUnlinkProvider = async (provider: OAuthProvider) => {
        // Confirm with user
        const confirmed = window.confirm(
            `Are you sure you want to unlink your ${providerConfig[provider].label} account?\n\n` +
            `You won't be able to use ${providerConfig[provider].label} to sign in after this.`
        );

        if (!confirmed) return;

        setUnlinkingProvider(provider);

        try {
            const token = authCookies.getToken();
            if (!token) {
                toast.error('Authentication required. Please log in again.');
                return;
            }

            const result = await unlinkProvider(token, provider);

            if (result.success) {
                setLinkedProviders(prev => prev.filter(p => p !== provider));
                toast.success(`${providerConfig[provider].label} account unlinked`);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Failed to unlink account. Please try again.');
        } finally {
            setUnlinkingProvider(null);
        }
    };

    if (isLoading) {
        return (
            <div className={`linked-accounts-section mt-45 ${className}`}>
                <h2 className="main-title">Linked Accounts</h2>
                <div className="bg-white card-box border-20 p-4">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`linked-accounts-section mt-45 ${className}`}>
            <h2 className="main-title">Linked Accounts</h2>

            <div className="bg-white card-box border-20">
                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                    Connect your social accounts for faster login. You can link multiple accounts to your profile.
                </p>

                <div className="providers-list">
                    {(Object.keys(providerConfig) as OAuthProvider[]).map((provider) => {
                        const config = providerConfig[provider];
                        const isLinked = linkedProviders.includes(provider);
                        const isUnlinking = unlinkingProvider === provider;

                        return (
                            <div
                                key={provider}
                                className="provider-item d-flex align-items-center justify-content-between py-3"
                                style={{ borderBottom: '1px solid #e5e7eb' }}
                            >
                                <div className="d-flex align-items-center">
                                    <div
                                        className="provider-icon-wrapper d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            background: '#f3f4f6'
                                        }}
                                    >
                                        <Image
                                            src={config.icon}
                                            alt={config.label}
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className="ms-3">
                                        <span className="fw-500">{config.label}</span>
                                        {isLinked && (
                                            <span
                                                className="badge ms-2"
                                                style={{
                                                    background: '#dcfce7',
                                                    color: '#16a34a',
                                                    fontSize: '11px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Connected
                                            </span>
                                        )}
                                        {!config.enabled && !isLinked && (
                                            <span
                                                className="badge ms-2"
                                                style={{
                                                    background: '#f3f4f6',
                                                    color: '#9ca3af',
                                                    fontSize: '11px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="provider-action">
                                    {isLinked ? (
                                        <button
                                            onClick={() => handleUnlinkProvider(provider)}
                                            disabled={isUnlinking}
                                            className="btn btn-outline-danger btn-sm"
                                            style={{
                                                minWidth: '80px',
                                                fontSize: '13px',
                                                padding: '6px 16px'
                                            }}
                                        >
                                            {isUnlinking ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" />
                                                    Unlinking...
                                                </>
                                            ) : (
                                                'Unlink'
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleLinkProvider(provider)}
                                            disabled={!config.enabled}
                                            className="btn btn-outline-primary btn-sm"
                                            style={{
                                                minWidth: '80px',
                                                fontSize: '13px',
                                                padding: '6px 16px',
                                                opacity: config.enabled ? 1 : 0.5
                                            }}
                                        >
                                            Link
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {linkedProviders.length === 0 && (
                    <div
                        className="mt-4 p-3 text-center"
                        style={{
                            background: '#fefce8',
                            borderRadius: '8px',
                            border: '1px solid #fef08a'
                        }}
                    >
                        <p className="mb-0" style={{ color: '#854d0e', fontSize: '13px' }}>
                            <strong>Tip:</strong> Link a social account to make signing in faster and more secure.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkedAccountsSection;
