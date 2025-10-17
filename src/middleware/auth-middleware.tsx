"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDecodedToken from '@/hooks/useDecodedToken';

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
  const decoded = useDecodedToken();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check if token exists
      const token = localStorage.getItem('token');
      
      if (!token || token === 'null' || token === 'undefined') {
        console.log('No valid token found, redirecting to login');
        router.push(redirectTo);
        setIsLoading(false);
        return;
      }

      // Check if token is decoded successfully
      if (!decoded) {
        console.log('Token could not be decoded, redirecting to login');
        router.push(redirectTo);
        setIsLoading(false);
        return;
      }

      // Check if user has required role
      const userRoles = decoded.roles || decoded.role || [];
      const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
      const hasAllowedRole = allowedRoles.some(role => rolesArray.includes(role));
      
      if (allowedRoles.length > 0 && !hasAllowedRole) {
        console.log(`User roles '${rolesArray.join(', ')}' not allowed. Allowed roles:`, allowedRoles);
        
        // Redirect based on role
        if (rolesArray.includes('CLIENT') || rolesArray.includes('client')) {
          router.push('/dashboard/employ-dashboard');
        } else if (rolesArray.includes('VIDEOGRAPHER') || rolesArray.includes('videographer') || 
                   rolesArray.includes('VIDEO_EDITOR') || rolesArray.includes('video_editor') ||
                   rolesArray.includes('videoEditor')) {
          router.push('/dashboard/candidate-dashboard');
        } else {
          router.push(redirectTo);
        }
        setIsLoading(false);
        return;
      }

      // All checks passed
      setIsAuthorized(true);
      setIsLoading(false);
    };

    // Small delay to ensure token is properly loaded
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [decoded, allowedRoles, redirectTo, router]);

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

// "use client";
// import React from "react";

// interface AuthMiddlewareProps {
//   children: React.ReactNode;
//   allowedRoles?: string[];
//   redirectTo?: string;
// }

// // ✅ Bypassed version — no checks, no redirects
// const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
//   return <>{children}</>;
// };

// export default AuthMiddleware;

