"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import {
  ref, push, set, onValue, get, update, query, limitToLast, off
} from "firebase/database";

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: number | null;
  isRead: boolean;
};

interface Props {
  conversationId: string;
  currentUserId: string;
}

export default function Conversation({ conversationId, currentUserId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // fetch conversation participants (to determine receiverId for a 1:1 chat)
  useEffect(() => {
    if (!conversationId) return;
    const load = async () => {
      try {
        const convRef = ref(db, `conversations/${conversationId}`);
        const convSnap = await get(convRef);
        if (!convSnap.exists()) return;
        const data = convSnap.val() as any;
        const participants: string[] = data.participants || [];
        const other = participants.find((p) => p !== currentUserId) || null;
        setReceiverId(other);
      } catch (err: any) {
        console.error("Error loading conversation:", err);
        setError(err.message || String(err));
      }
    };
    load();
  }, [conversationId, currentUserId]);

  // realtime listener for messages
  useEffect(() => {
    if (!conversationId) return;
    const messagesRef = ref(db, `conversations/${conversationId}/messages`);
    const messagesQuery = query(messagesRef, limitToLast(100));

    const unsubscribe = onValue(
      messagesQuery,
      async (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setMessages([]);
          return;
        }

        const msgs: ChatMessage[] = Object.keys(data).map((messageId) => {
          const messageData = data[messageId];
          return {
            id: messageId,
            senderId: messageData.senderId || "",
            receiverId: messageData.receiverId || "",
            text: messageData.text || "",
            createdAt: messageData.createdAt || null,
            isRead: !!messageData.isRead,
          } as ChatMessage;
        }).sort((a, b) => {
          const timeA = a.createdAt || 0;
          const timeB = b.createdAt || 0;
          return timeA - timeB;
        });

        setMessages(msgs);

        // mark unread messages addressed to current user as read
        Object.keys(data).forEach(async (messageId) => {
          const messageData = data[messageId];
          if (messageData.receiverId === currentUserId && !messageData.isRead) {
            try {
              const msgRef = ref(db, `conversations/${conversationId}/messages/${messageId}`);
              await update(msgRef, { isRead: true });
            } catch (err) {
              // non-fatal
            }
          }
        });
      },
      (err) => {
        console.error("Message listener error:", err);
        setError(err?.message || String(err));
      }
    );

    return () => {
      const messagesRef = ref(db, `conversations/${conversationId}/messages`);
      off(messagesRef, 'value', unsubscribe);
    };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    setError(null);
    if (!input.trim()) return;
    if (!conversationId) return setError("Missing conversation id");
    if (!currentUserId) return setError("Missing current user id");
    if (!receiverId) return setError("Missing recipient id");

    try {
      const messagesRef = ref(db, `conversations/${conversationId}/messages`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, {
        senderId: currentUserId,
        receiverId,
        text: input.trim(),
        createdAt: Date.now(),
        isRead: false,
      });

      // update conversation metadata
      const convRef = ref(db, `conversations/${conversationId}`);
      await update(convRef, {
        lastMessage: input.trim(),
        lastMessageTime: Date.now(),
        lastSenderId: currentUserId,
        lastMessageRead: false,
      });

      setInput("");
    } catch (err: any) {
      console.error("Send message failed:", err);
      setError(err.message || String(err));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 8, display: "flex", justifyContent: m.senderId === currentUserId ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", padding: 8, borderRadius: 8, background: m.senderId === currentUserId ? "#244034" : "#fff", color: m.senderId === currentUserId ? "#fff" : "#111" }}>
              <div style={{ fontSize: 14, lineHeight: "18px" }}>{m.text}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "right", marginTop: 6 }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "..."}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", background: "#fff" }}>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message"
            style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #E5E7EB" }}
          />
          <button onClick={sendMessage} disabled={!input.trim()} style={{ background: input.trim() ? "#244034" : "#D1D5DB", color: "white", border: "none", padding: "8px 12px", borderRadius: 6 }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
