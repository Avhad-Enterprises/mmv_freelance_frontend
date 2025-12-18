"use client";
import React from "react";

interface Props {
  open: boolean;
  userData?: { id?: string; firstName?: string; email?: string } | null;
  onClose: () => void;
}

export default function ProfileDetailsModal({ open, userData, onClose }: Props) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', padding: 20, borderRadius: 12, width: '90%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Profile Details</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Close</button>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <div>
            <strong>Name:</strong> {userData?.firstName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {userData?.email || 'N/A'}
          </div>
          <div>
            <strong>User ID:</strong> {userData?.id || 'N/A'}
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: '#244034', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Close</button>
        </div>
      </div>
    </div>
  );
}
