"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authCookies } from '@/utils/cookies';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ 
  children, 
  allowedRoles = ['VIDEOGRAPHER', 'VIDEO_EDITOR', 'CLIENT'], 
  redirectTo = '/' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in cookies
        const token = authCookies.getToken();

        if (!token || token === 'null' || token === 'undefined') {
          router.push(redirectTo);
          setIsLoading(false);
          return;
        }

        // Decode token directly (don't wait for useDecodedToken hook)
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT token format');
          }
          const base64Payload = tokenParts[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          
          // Check token expiration
          if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
            authCookies.removeToken();
            router.push(redirectTo);
            setIsLoading(false);
            return;
          }

          // Check if user has required role
          const userRoles = decodedPayload.roles || decodedPayload.role || [];
          const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
          
          // Normalize roles to uppercase for comparison
          const normalizedUserRoles = rolesArray.map((role: string) => role.toUpperCase());
          const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
          
          const hasAllowedRole = normalizedAllowedRoles.some(role => normalizedUserRoles.includes(role));
          
          if (allowedRoles.length > 0 && !hasAllowedRole) {
            // Redirect based on role
            if (normalizedUserRoles.includes('CLIENT')) {
              router.push('/dashboard/client-dashboard');
            } else if (normalizedUserRoles.includes('VIDEOGRAPHER') || 
                       normalizedUserRoles.includes('VIDEO_EDITOR') ||
                       normalizedUserRoles.includes('VIDEOEDITOR')) {
              router.push('/dashboard/freelancer-dashboard');
            } else {
              router.push(redirectTo);
            }
            setIsLoading(false);
            return;
          }

          // All checks passed
          setIsAuthorized(true);
          setIsLoading(false);
        } catch (decodeError) {
          authCookies.removeToken();
          router.push(redirectTo);
          setIsLoading(false);
        }
      } catch (error) {
        router.push(redirectTo);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        <div className="loading-spinner">
          <div 
            style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Verifying access...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authorized, don't render children (redirect is happening)
  if (!isAuthorized) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default AuthMiddleware;