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
          console.log('No valid token found, redirecting to login');
          router.push(redirectTo);
          setIsLoading(false);
          return;
        }

        // Decode token directly (don't wait for useDecodedToken hook)
        try {
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          
          // Check token expiration
          if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
            console.log('Token expired, redirecting to login');
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
            console.log(`User roles '${rolesArray.join(', ')}' not allowed. Allowed roles:`, allowedRoles);
            
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
          console.log('Auth check passed - user authorized with roles:', rolesArray);
          setIsAuthorized(true);
          setIsLoading(false);
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          authCookies.removeToken();
          router.push(redirectTo);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
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