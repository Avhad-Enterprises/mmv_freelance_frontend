"use client";
import React from "react";
import useConversations, { ConversationSummary } from "@/hooks/useConversations";

interface Props {
  currentUserId: string | null;
  onSelect?: (conversation: ConversationSummary) => void;
}

function formatTime(ts?: any) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString();
}

export default function ClientChatList({ currentUserId, onSelect }: Props) {
  const { conversations, loading, error } = useConversations(currentUserId);

  if (!currentUserId) return <div>Please sign in to view messages.</div>;

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <h3 style={{ margin: "0 0 12px 0" }}>Messages</h3>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {conversations.map((c) => (
          <button
            key={c.conversationId}
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
              {c.otherParticipantId.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 600 }}>{c.otherParticipantId}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{formatTime(c.updatedAt)}</div>
              </div>
              <div style={{ color: "#6B7280", marginTop: 4, fontSize: 14 }}>{c.lastMessage || "No messages yet"}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#9CA3AF" }}>{c.otherParticipantRole}</div>
            </div>
          </button>
        ))}
        {conversations.length === 0 && !loading && <div>No conversations yet.</div>}
      </div>
    </div>
  );
}
