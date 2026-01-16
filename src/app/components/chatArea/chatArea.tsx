'use client'
/**
 * Chat Area Component - Socket.io Implementation
 */
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import { useSocket } from '@/context/SocketContext';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { useSocketMessages } from '@/hooks/useSocketMessages';
import { MessageCircle, Plus } from 'lucide-react';
import ChatHeader from '@/app/components/chatArea/ChatHeader';
import ProfileDetailsModal from '@/app/components/chatArea/ProfileDetailsModal';
import ChatBody, { LocalMessage } from '@/app/components/chatArea/ChatBody';
import ChatInput from '@/app/components/chatArea/ChatInput';
import AuthenticatedImage from '@/app/components/common/AuthenticatedImage';
import { toast } from 'react-hot-toast';

// ---------------- STYLES ----------------
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive Styles */
  .chat-shell {
    display: flex;
    background: linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%);
    height: calc(100vh - 240px);
    min-height: 560px;
    border-radius: 30px;
    overflow: hidden;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    box-shadow: 0 4px 20px rgba(36,64,52,0.08);
    border: 1px solid rgba(49,121,90,0.12);
  }

  .chat-search-input::placeholder {
    color: rgba(255,255,255,0.65);
  }

  .chat-search-input:focus {
    outline: none;
    border-color: #D2F34C !important;
    box-shadow: 0 0 0 2px rgba(210,243,76,0.2);
  }

  /* Custom scrollbar for chat */
  .chat-sidebar::-webkit-scrollbar,
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-sidebar::-webkit-scrollbar-track,
  .chat-messages::-webkit-scrollbar-track {
    background: #F0F5F3;
  }
  
  .chat-sidebar::-webkit-scrollbar-thumb,
  .chat-messages::-webkit-scrollbar-thumb {
    background: #31795A;
    border-radius: 3px;
  }

  .chat-sidebar::-webkit-scrollbar-thumb:hover,
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #244034;
  }

  @media (max-width: 768px) {
    .chat-shell {
      height: calc(100vh - 200px);
      min-height: 520px;
      border-radius: 20px;
    }

    .chat-sidebar {
      width: 100% !important;
      border-right: none !important;
      display: flex;
      border-radius: 20px 20px 0 0 !important;
    }
    
    .chat-main {
      display: none !important;
      
    }

    .chat-main.active {
      display: flex !important;
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      z-index: 50;
      background: linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%);
      border-radius: 0;
    }

    .mobile-back-btn {
      display: flex !important;
    }
  }

  @media (min-width: 769px) {
    .mobile-back-btn {
      display: none !important;
    }
  }
`;


// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('chat-area-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'chat-area-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ---------------- COMPONENT ----------------
const ChatArea: React.FC = () => {
  const { userData } = useUser();
  const { isConnected } = useSocket();
  // Fetch conversations
  const { conversations, isLoading: loadingConversations } = useConversations(userData?.user_id?.toString());

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalUser, setProfileModalUser] = useState<{ id?: string; firstName?: string; email?: string } | null>(null);

  // Messages Hook for selected conversation
  const {
    messages,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    isOtherUserTyping,
    sendTyping
  } = useSocketMessages({
    conversationId: selectedConversation?.id || null,
    currentUserId: userData?.user_id?.toString() || null
  });

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true;
    const otherUserId = c.participants.find(p => p !== userData?.user_id?.toString());
    const otherUser = otherUserId ? c.participantDetails[otherUserId] : null;
    const name = otherUser ? `${otherUser.firstName}` : 'Unknown';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleConversationClick = (convo: Conversation) => {
    setSelectedConversation(convo);
  };

  const getOtherParticipant = (convo: Conversation) => {
    const otherId = convo.participants.find(p => p !== userData?.user_id?.toString());
    return otherId ? { id: otherId, ...convo.participantDetails[otherId] } : null;
  };

  const handleProfileClick = () => {
    if (selectedConversation) {
      const other = getOtherParticipant(selectedConversation);
      if (other) {
        setProfileModalUser({ id: other.id, firstName: other.firstName, email: other.email });
        setShowProfileModal(true);
      }
    }
  };

  return (
    <div className="chat-shell">
      {/* SIDEBAR */}
      <div className="chat-sidebar" style={{
        width: '320px',
        borderRight: '1px solid rgba(49,121,90,0.1)',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(49,121,90,0.06)' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Messages
          </h2>
          <div style={{ marginTop: '16px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search messages..."
              className="chat-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                background: '#F9FAFB',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingConversations ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Loading conversations...</div>
          ) : filteredConversations.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{
                width: '48px', height: '48px', background: '#F3F4F6', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px'
              }}>
                <MessageCircle size={24} color="#9CA3AF" />
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>No conversations yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px' }}>Start connecting with people!</p>
            </div>
          ) : (
            filteredConversations.map(convo => {
              const other = getOtherParticipant(convo);
              const isActive = selectedConversation?.id === convo.id;
              return (
                <div
                  key={convo.id}
                  onClick={() => handleConversationClick(convo)}
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive ? '#F0FDF4' : 'transparent',
                    borderLeft: isActive ? '3px solid #31795A' : '3px solid transparent'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden',
                      background: '#E5E7EB', flexShrink: 0
                    }}>
                      {other?.profilePicture ? (
                        <AuthenticatedImage
                          src={other.profilePicture}
                          alt={other.firstName || 'User'}
                          width={44}
                          height={44}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>
                          {(other?.firstName || 'U')[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#111827', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {other?.firstName || 'Unknown User'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', flexShrink: 0 }}>
                        {convo.lastMessageTime ? new Date(convo.lastMessageTime).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        color: isActive ? '#31795A' : '#6B7280',
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '180px'
                      }}>
                        {convo.lastMessage || 'No messages'}
                      </span>
                      {convo.hasUnread && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#31795A' }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className={`chat - main ${selectedConversation ? 'active' : ''} `} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        position: 'relative'
      }}>
        {selectedConversation ? (
          <>
            <ChatHeader
              conversation={selectedConversation}
              currentUserId={userData?.user_id?.toString()}
              onBack={() => setSelectedConversation(null)}
              onProfileClick={handleProfileClick}
              isTyping={isOtherUserTyping}
            />

            <ChatBody
              messages={messages}
              currentUserId={userData?.user_id?.toString()}
              isOtherUserTyping={isOtherUserTyping}
              hasMoreMessages={hasMoreMessages}
              isLoadingMore={isLoadingMore}
              onLoadMore={loadMoreMessages}
              isOnline={true}
              isConnected={isConnected}
            />

            <ChatInput
              onSend={sendMessage}
              onTyping={sendTyping}
              conversationId={selectedConversation.id}
              currentUserId={userData?.user_id?.toString()}
              userRole={userData?.account_type} // or role
              disabled={!isConnected}
            />
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', background: '#F9FAFB' }}>
            <div style={{ width: '80px', height: '80px', background: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <MessageCircle size={40} color="#9CA3AF" />
            </div>
            <h3 style={{ margin: '0 0 8px', color: '#374151' }}>Select a conversation</h3>
            <p style={{ margin: 0, maxWidth: '280px', textAlign: 'center', fontSize: '14px' }}>Choose a contact from the left sidebar to start messaging.</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileModalUser && (
        <ProfileDetailsModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userData={{
            id: profileModalUser.id || '',
            firstName: profileModalUser.firstName || '',
            email: profileModalUser.email || ''
          }}
        />
      )}
    </div>
  );
};

export default ChatArea;
