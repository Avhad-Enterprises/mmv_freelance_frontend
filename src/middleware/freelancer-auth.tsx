"use client";
import React from 'react';
import AuthMiddleware from './auth-middleware';

interface FreelancerAuthProps {
  children: React.ReactNode;
}

const FreelancerAuth: React.FC<FreelancerAuthProps> = ({ children }) => {
  return (
    <AuthMiddleware 
      allowedAccountTypes={['freelancer']}
      redirectTo="/login"
    >
      {children}
    </AuthMiddleware>
  );
};

export default FreelancerAuth;
