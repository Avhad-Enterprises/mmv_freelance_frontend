"use client";
import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

export interface MessageItem {
  id: string;
  senderId: string;
  text: string;
  createdAt: string | Date;
}

interface Props {
  messages: MessageItem[];
  currentUserId: string;
}

const formatTime = (when: string | Date) => {
  const d = typeof when === "string" ? new Date(when) : when;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatMessagesBody: React.FC<Props> = ({ messages, currentUserId }) => {
  const endRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (!endRef.current) return;
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box ref={containerRef} sx={{ flex: 1, overflowY: "auto", p: { xs: 2, md: 3 }, bgcolor: "#EFF6F3" }}>
      {messages.map((m) => {
        const isMe = m.senderId === currentUserId;
        return (
          <Box key={m.id} sx={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", mb: 1.25 }}>
            <Box
              sx={{
                maxWidth: "78%",
                bgcolor: isMe ? "#244034" : "#fff",
                color: isMe ? "#fff" : "#111827",
                p: 1.25,
                borderRadius: 2,
                borderTopLeftRadius: isMe ? 12 : 2,
                borderTopRightRadius: isMe ? 2 : 12,
                boxShadow: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, lineHeight: "18px", whiteSpace: "pre-wrap" }}>{m.text}</Typography>
              <Typography sx={{ fontSize: 11, color: isMe ? "rgba(255,255,255,0.8)" : "#6B7280", textAlign: "right", mt: 0.5 }}>{formatTime(m.createdAt)}</Typography>
            </Box>
          </Box>
        );
      })}

      <div ref={endRef} />
    </Box>
  );
};

export default ChatMessagesBody;
