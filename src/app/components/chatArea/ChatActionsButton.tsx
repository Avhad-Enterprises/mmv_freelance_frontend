"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Settings, DollarSign } from 'lucide-react';

interface ChatActionsButtonProps {
  onUpdateBudget: () => void;
  userRole?: string;
  disabled?: boolean;
}

const ChatActionsButton: React.FC<ChatActionsButtonProps> = ({
  onUpdateBudget,
  userRole,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only show for CLIENT role (case-insensitive check)
  if (!userRole || userRole.toUpperCase() !== 'CLIENT') {
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleUpdateBudgetClick = () => {
    setIsOpen(false);
    onUpdateBudget();
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          background: disabled ? '#D1D5DB' : '#F0F5F3',
          color: disabled ? '#9CA3AF' : '#244034',
          border: 'none',
          padding: 0,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.12s ease',
          boxShadow: disabled ? 'none' : '0 2px 8px rgba(36,64,52,0.1)',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.background = '#E9F7EF';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(36,64,52,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = disabled ? '#D1D5DB' : '#F0F5F3';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = disabled ? 'none' : '0 2px 8px rgba(36,64,52,0.1)';
        }}
        title="Actions"
        aria-label="Chat Actions"
      >
        <Settings size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: 0,
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
            overflow: 'hidden',
            border: '1px solid rgba(49,121,90,0.1)',
          }}
        >
          <button
            onClick={handleUpdateBudgetClick}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#244034',
              fontSize: '0.95rem',
              transition: 'background 0.12s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F0F5F3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <DollarSign size={18} style={{ color: '#31795A' }} />
            <span style={{ fontWeight: 500 }}>Update Budget</span>
          </button>

          {/* Future actions can be added here */}
          {/* <button style={...}>
            <Paperclip size={18} />
            <span>Attach File</span>
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ChatActionsButton;
