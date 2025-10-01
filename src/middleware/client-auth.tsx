"use client";
import React from 'react';
import AuthMiddleware from './auth-middleware';

interface ClientAuthProps {
  children: React.ReactNode;
}

const ClientAuth: React.FC<ClientAuthProps> = ({ children }) => {
  return (
    <AuthMiddleware 
      allowedAccountTypes={['client']}
      redirectTo="/login"
    >
      {children}
    </AuthMiddleware>
  );
};

export default ClientAuth;
