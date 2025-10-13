// CandidateClientView.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from '@/layouts/headers/header';
import HeaderDash from '@/layouts/headers/headerDash';
import Wrapper from '@/layouts/wrapper';
import CandidateV1Area from '../components/candidate/candidate-v1-area';
import FooterOne from '@/layouts/footers/footer-one';

interface DecodedToken {
  exp: number;
}

const CandidateClientView = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on initial component mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  // ✅ 1. Create a function to handle login state change
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="main-page-wrapper">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {isAuthenticated ? <HeaderDash /> : <Header />}

        {/* ✅ 2. Pass down the state and the handler function as props */}
        <CandidateV1Area 
          isAuthenticated={isAuthenticated} 
          onLoginSuccess={handleLogin} 
        />

        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default CandidateClientView;