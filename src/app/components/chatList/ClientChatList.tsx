"use client";
import React from "react";
import { MessageCircle } from 'lucide-react';
import { useConversations, Conversation } from "@/hooks/useConversations";

interface Props {
  currentUserId: string | undefined;
  onSelect?: (conversation: Conversation) => void;
}

function formatTime(ts?: any) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString();
}

export default function ClientChatList({ currentUserId, onSelect }: Props) {
  const { conversations, isLoading } = useConversations(currentUserId);

  if (!currentUserId) return <div>Please sign in to view messages.</div>;

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ background: '#244034', padding: '1rem', borderRadius: 10, color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Messages</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#D1D5DB' }}>Recent conversations</p>
        </div>
      </div>
      {isLoading && <div>Loading...</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {conversations.map((c) => {
          const otherParticipantId = c.participants.find(p => p !== currentUserId) || '';
          const otherDetails = c.participantDetails[otherParticipantId];
          return (
          <button
            key={c.id}
            onClick={() => onSelect?.(c)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "white",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#244034", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {otherDetails?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 600 }}>{otherDetails?.firstName || otherParticipantId}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ''}</div>
              </div>
              <div style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>{c.lastMessage || "No messages yet"}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#9CA3AF" }}>User</div>
            </div>
          </button>
          );
        })}
        {conversations.length === 0 && !isLoading && <div>No conversations yet.</div>}
      </div>
    </div>
  );
}
