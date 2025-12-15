"use client";
import React, { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import ChatMessagesBody, { MessageItem } from './ChatMessagesBody';

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: Timestamp | null;
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
        const convRef = doc(db, "conversations", conversationId);
        const convSnap = await getDoc(convRef);
        if (!convSnap.exists()) return;
        const data = convSnap.data() as any;
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
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      async (snap) => {
        const msgs: ChatMessage[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            senderId: data.senderId || "",
            receiverId: data.receiverId || "",
            text: data.text || "",
            createdAt: data.createdAt || null,
            isRead: !!data.isRead,
          } as ChatMessage;
        });

        setMessages(msgs);

        // mark unread messages addressed to current user as read
        snap.docs.forEach(async (d) => {
          const data = d.data() as any;
          if (data.receiverId === currentUserId && !data.isRead) {
            try {
              await setDoc(d.ref, { isRead: true }, { merge: true });
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

    return () => unsubscribe();
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
      await addDoc(collection(db, `conversations/${conversationId}/messages`), {
        senderId: currentUserId,
        receiverId,
        text: input.trim(),
        createdAt: serverTimestamp(),
        isRead: false,
      });

      // update conversation metadata
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          lastMessage: input.trim(),
          lastMessageTime: serverTimestamp(),
          lastSenderId: currentUserId,
          lastMessageRead: false,
        },
        { merge: true }
      );

      setInput("");
    } catch (err: any) {
      console.error("Send message failed:", err);
      setError(err.message || String(err));
    }
  };

  // map firebase ChatMessage -> MessageItem for presentational component
  const mappedMessages: MessageItem[] = messages.length
    ? messages.map((m) => ({ id: m.id, senderId: m.senderId, text: m.text, createdAt: m.createdAt ? m.createdAt.toDate() : new Date() }))
    : [
        { id: "d1", senderId: "other", text: "Hi there — welcome to the chat!", createdAt: new Date() },
        { id: "d2", senderId: currentUserId, text: "Thanks — looks good!", createdAt: new Date() },
      ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ChatMessagesBody messages={mappedMessages} currentUserId={currentUserId} />

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
