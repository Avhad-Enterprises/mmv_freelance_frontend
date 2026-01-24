"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
// Removed Firebase imports
import ChatActionsButton from "./ChatActionsButton";
import UpdateBudgetModal from "./UpdateBudgetModal";

interface Props {
  onSend: (text: string) => Promise<void> | void;
  onTyping?: (isTyping: boolean) => void; // New prop
  disabled?: boolean;
  conversationId?: string | null;
  currentUserId?: string | null;
  userRole?: string;
  otherParticipantId?: string;
}

export default function ChatInput({ onSend, onTyping, disabled, conversationId, currentUserId, userRole, otherParticipantId }: Props) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Track component mount state to prevent memory leaks
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear any pending timeouts on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, []);

  // Update typing status via prop
  const updateTypingStatus = useCallback((isTyping: boolean) => {
    if (!conversationId || !currentUserId || !isMountedRef.current || !onTyping) return;

    // Call the prop
    onTyping(isTyping);
    isTypingRef.current = isTyping;
  }, [conversationId, currentUserId, onTyping]);

  // Handle input change and typing detection
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Only update if component is mounted
    if (!isMountedRef.current) return;

    setValue(newValue);

    // Don't update typing status if disabled or no conversation
    if (disabled || !conversationId || !currentUserId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing status to true if there's text
    if (newValue.trim()) {
      if (!isTypingRef.current) {
        updateTypingStatus(true);
      }

      // Clear typing status after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        updateTypingStatus(false);
      }, 2000);
    } else {
      // Immediately clear typing if text is empty
      updateTypingStatus(false);
    }
  };

  // Cleanup on unmount or conversation change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      // Clear typing status when leaving conversation
      if (isTypingRef.current && conversationId && currentUserId && isMountedRef.current) {
        updateTypingStatus(false);
      }
    };
  }, [conversationId, currentUserId, updateTypingStatus]);

  // Clear typing when conversation changes
  useEffect(() => {
    if (isMountedRef.current) {
      setValue("");
    }
    isTypingRef.current = false;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [conversationId]);

  const handleSend = async () => {
    const text = value.trim();
    if (!text || disabled || sending || !isMountedRef.current) return;

    // Clear typing status when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    updateTypingStatus(false);

    setSending(true);
    try {
      await onSend(text);
      if (isMountedRef.current) {
        setValue("");
      }
    } finally {
      if (isMountedRef.current) {
        setSending(false);
      }
    }
  };

  return (
    <>
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(49,121,90,0.1)',
        background: '#FFFFFF',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexShrink: 0,
        position: 'sticky',
        bottom: 0,
        zIndex: 30,
        fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        borderRadius: '0 0 30px 0'
      }}>
        {/* Actions Button (Only for CLIENT role) */}
        <ChatActionsButton
          onUpdateBudget={() => setIsBudgetModalOpen(true)}
          userRole={userRole}
          disabled={disabled}
        />

        <textarea
          value={value}
          onChange={handleInputChange}
          placeholder={disabled ? 'Select a conversation to start messaging' : 'Type your message...'}
          rows={2}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '20px',
            border: '2px solid #E9F7EF',
            resize: 'none',
            background: disabled ? '#F8FBF9' : '#FFFFFF',
            outline: 'none',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            height: 'auto',
            minHeight: '48px' // Match button height exactly
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#31795A';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(49,121,90,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E9F7EF';
            e.currentTarget.style.boxShadow = 'none';
            // Clear typing when input loses focus
            if (isTypingRef.current) {
              updateTypingStatus(false);
            }
          }}
          disabled={disabled}
        />
        <button
          onClick={() => void handleSend()}
          disabled={disabled || sending || !value.trim()}
          style={{
            background: (disabled || !value.trim())
              ? '#D1D5DB'
              : '#244034',
            color: 'white',
            border: 'none',
            padding: 0,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: (disabled || !value.trim()) ? 'not-allowed' : 'pointer',
            opacity: sending ? 0.85 : 1,
            whiteSpace: 'nowrap',
            boxShadow: (disabled || !value.trim()) ? 'none' : '0 4px 14px rgba(36,64,52,0.2)',
            transition: 'all 0.12s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0
          }}
          onMouseEnter={(e) => {
            if (!disabled && value.trim()) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(36,64,52,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = (disabled || !value.trim()) ? 'none' : '0 4px 14px rgba(36,64,52,0.2)';
          }}
        >
          {sending ? (
            <span style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.35)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Budget Update Modal */}
      <UpdateBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentUserId={currentUserId || ''}
        otherParticipantId={otherParticipantId}
      />
    </>
  );
}
