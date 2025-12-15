"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Divider, Badge } from "@mui/material";

// Conversation interface
export interface Conversation {
  id: string;
  name: string;
  avatar?: string; // optional URL
  lastMessage: string;
  lastMessageTime: string; // ISO string for static data
  unread?: number;
}

// Static dummy data
const DUMMY_CONVERSATIONS: Conversation[] = [
  { id: "conv-1", name: "Alice Johnson", avatar: undefined, lastMessage: "Hey, are we still on for tomorrow?", lastMessageTime: new Date().toISOString(), unread: 2 },
  { id: "conv-2", name: "Bob Smith", avatar: undefined, lastMessage: "I'll share the files tonight.", lastMessageTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), unread: 0 },
  { id: "conv-3", name: "Carla Mendoza", avatar: undefined, lastMessage: "Loved your review — thanks!", lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unread: 0 },
  { id: "conv-4", name: "David Lee", avatar: undefined, lastMessage: "Can you send the invoice?", lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), unread: 1 },
  { id: "conv-5", name: "Elena Park", avatar: undefined, lastMessage: "Nice work on the edits.", lastMessageTime: new Date(Date.now() - 1000 * 60 * 10).toISOString(), unread: 0 },
];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  if (diff < 1000 * 60 * 60) {
    // minutes ago
    const m = Math.max(1, Math.floor(diff / (1000 * 60)));
    return `${m}m`;
  }
  if (diff < oneDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString();
};

const ChatList: React.FC = () => {
  const router = useRouter();

  const handleClick = (id: string) => {
    // Navigate to conversation thread
    router.push(`/dashboard/client-dashboard/messages/thread/${id}`);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: 'inherit', bgcolor: 'background.paper' }}>
      <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" sx={{ fontFamily: 'inherit', color: '#244034' }}>Messages</Typography>
        <Typography variant="body2" color="text.secondary">Recent conversations</Typography>
      </Box>

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <List disablePadding>
          {DUMMY_CONVERSATIONS.map((c) => (
            <React.Fragment key={c.id}>
              <ListItemButton
                onClick={() => handleClick(c.id)}
                sx={{
                  py: 1.25,
                  px: { xs: 2, md: 3 },
                  '&:hover': { backgroundColor: '#F3F7F5' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderLeft: '4px solid transparent',
                  '&.Mui-selected, &.selected': {
                    backgroundColor: '#e8f4ec',
                    borderLeftColor: '#244034'
                  }
                }}
              >
                <ListItemAvatar sx={{ minWidth: 0 }}>
                  <Badge color="success" variant="dot" overlap="circular" invisible={c.unread === 0}>
                    <Avatar sx={{ bgcolor: '#244034' }}>{c.name.charAt(0)}</Avatar>
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  primary={<Typography sx={{ fontWeight: 600, fontFamily: 'inherit' }}>{c.name}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>{c.lastMessage}</Typography>}
                />

                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">{formatTime(c.lastMessageTime)}</Typography>
                  {c.unread ? <Typography variant="caption" sx={{ mt: 0.5, display: 'block', backgroundColor: '#244034', color: '#fff', px: 0.6, borderRadius: 1 }}>{c.unread}</Typography> : null}
                </Box>
              </ListItemButton>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
