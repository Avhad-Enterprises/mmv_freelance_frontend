"use client";
import React, { useEffect, useRef } from "react";

export type LocalMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: Date | number | null;
  isRead?: boolean;
  failed?: boolean; // For optimistic updates that failed
  deliveryStatus?: 'sending' | 'sent' | 'delivered' | 'read'; // WhatsApp-style delivery status
};

// Tick mark component for message status
const MessageStatus = ({ status, isSender }: { status?: string; isSender: boolean }) => {
  if (!isSender) return null; // Only show status for sender's messages
  
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return (
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5.5L6 9.5L14 1.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
          </svg>
        );
      case 'sent':
        // Single grey tick
        return (
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5.5L6 9.5L14 1.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'delivered':
        // Double grey ticks
        return (
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5.5L5 9.5L13 1.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 5.5L10 9.5L18 1.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'read':
        // Double blue ticks
        return (
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5.5L5 9.5L13 1.5" stroke="#34B7F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 5.5L10 9.5L18 1.5" stroke="#34B7F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        // Default to single tick if status is unknown but message exists
        return (
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5.5L6 9.5L14 1.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
      {getStatusIcon()}
    </span>
  );
};

interface Props {
  messages: LocalMessage[];
  currentUserId?: string | null;
  isOtherUserTyping?: boolean;
  hasMoreMessages?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  pendingMessages?: LocalMessage[];
  isOnline?: boolean;
  isConnected?: boolean;
}

// Inject typing animation styles
if (typeof document !== 'undefined' && !document.getElementById('typing-indicator-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'typing-indicator-styles';
  styleSheet.textContent = `
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }
    .typing-dot {
      width: 8px;
      height: 8px;
      background-color: #9CA3AF;
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }
    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `;
  document.head.appendChild(styleSheet);
}

// Helper to convert number timestamp or Date to Date
const toDate = (val: Date | number | null | undefined): Date | null => {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  return null;
};

// Helper to format date label (Today, Yesterday, or date)
const formatDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  const resetTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const msgDate = resetTime(date);
  const todayDate = resetTime(today);
  const yesterdayDate = resetTime(yesterday);

  if (msgDate.getTime() === todayDate.getTime()) {
    return 'Today';
  } else if (msgDate.getTime() === yesterdayDate.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
};

// Helper to group messages by date
const groupMessagesByDate = (messages: LocalMessage[]): { date: string; messages: LocalMessage[] }[] => {
  const groups: { [key: string]: LocalMessage[] } = {};
  
  messages.forEach((msg) => {
    const date = toDate(msg.createdAt);
    if (!date) return;
    
    const dateLabel = formatDateLabel(date);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(msg);
  });

  return Object.keys(groups).map(date => ({ date, messages: groups[date] }));
};

export default function ChatBody({ messages, currentUserId, isOtherUserTyping, hasMoreMessages, isLoadingMore, onLoadMore, pendingMessages = [], isOnline = true, isConnected = true }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherUserTyping, pendingMessages]);

  // Combine confirmed messages with pending messages
  const allMessages = [...messages, ...pendingMessages];
  const groupedMessages = groupMessagesByDate(allMessages);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: 14,
      background: '#E9F7EF',
      minHeight: 0,
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
    }}>
      {/* Connection Status Banner */}
      {(!isOnline || !isConnected) && (
        <div style={{
          textAlign: 'center',
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          {!isOnline ? 'You are offline. Messages will be sent when connection is restored.' : 'Connecting to server...'}
        </div>
      )}
      
      {/* Load More Button */}
      {hasMoreMessages && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            style={{
              backgroundColor: isLoadingMore ? '#E5E7EB' : '#244034',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: isLoadingMore ? 'not-allowed' : 'pointer',
              opacity: isLoadingMore ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoadingMore ? 'Loading...' : 'Load Older Messages'}
          </button>
        </div>
      )}
      
      {messages.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '20px' }}>No messages yet — say hello 👋</div>
      )}

      {groupedMessages.map((group) => (
        <div key={group.date}>
          {/* Date header */}
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <span style={{ 
              backgroundColor: 'rgba(255,255,255,0.75)', 
              color: '#374151', 
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: 500
            }}>
              {group.date}
            </span>
          </div>

          {/* Messages for this date */}
          {group.messages.map((m) => {
            const msgDate = toDate(m.createdAt);
            const isPending = m.id.startsWith('temp_');
            const isFailed = m.failed;
            // Ensure string comparison for sender check
            const isSender = String(m.senderId) === String(currentUserId);
            
            // Determine delivery status - prioritize explicit deliveryStatus
            let displayStatus: 'sending' | 'sent' | 'delivered' | 'read' | undefined = m.deliveryStatus;
            if (isPending && !isFailed) {
              displayStatus = 'sending';
            } else if (isFailed) {
              displayStatus = undefined; // Will show failed icon instead
            } else if (!displayStatus) {
              // Fallback: if isRead is true, show as read; otherwise show as sent
              displayStatus = m.isRead ? 'read' : 'sent';
            }
            // Debug log to help diagnose status issues
            if (isSender) {
              // Message status debugging removed
            }
            
            return (
              <div key={m.id} style={{ marginBottom: 8, display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  maxWidth: '75%', 
                  padding: '10px 12px', 
                  borderRadius: 10,
                  background: isSender ? (isFailed ? '#FCA5A5' : '#DCF8C6') : '#fff',
                  color: isSender ? '#111827' : '#111827',
                  border: isSender ? (isFailed ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(17,24,39,0.08)') : '1px solid rgba(17,24,39,0.06)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  opacity: isPending && !isFailed ? 0.7 : 1,
                  position: 'relative'
                }}>
                  <div style={{ fontSize: 14, lineHeight: '20px', wordBreak: 'break-word' }}>{m.text}</div>
                  <div style={{ 
                    fontSize: 11, 
                    color: isFailed ? 'rgba(255,255,255,0.92)' : '#6B7280',
                    textAlign: 'right', 
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '2px'
                  }}>
                    {msgDate ? msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    {isFailed ? (
                      <span style={{ fontSize: 10, color: '#DC2626', marginLeft: '4px' }} title="Failed to send">❌</span>
                    ) : (
                      <MessageStatus status={displayStatus} isSender={isSender} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Typing Indicator */}
      {isOtherUserTyping && (
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ 
            padding: '12px 16px', 
            borderRadius: 8, 
            background: '#fff', 
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
