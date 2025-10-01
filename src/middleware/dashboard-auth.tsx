"use client";
import React from 'react';
import AuthMiddleware from './auth-middleware';

interface DashboardAuthProps {
  children: React.ReactNode;
}

const DashboardAuth: React.FC<DashboardAuthProps> = ({ children }) => {
  return (
    <AuthMiddleware 
      allowedRoles={['CLIENT', 'VIDEOGRAPHER', 'VIDEO_EDITOR']}
      redirectTo="/"
    >
      {children}
    </AuthMiddleware>
  );
};

export default DashboardAuth;


