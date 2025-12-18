"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for better performance
const EmployDashboardArea = dynamic(() => import('@/app/components/dashboard/employ/dashboard-area'), {
  loading: () => (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
});

const EmployDashboardPage = () => {
  return <EmployDashboardArea />;
};

export default EmployDashboardPage;