"use client";
import React from "react";
import { Box, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from "@mui/material";

const ChatList: React.FC = () => {
  // Placeholder data
  const items = Array.from({ length: 6 }).map((_, i) => ({
    id: String(i + 1),
    name: `User ${i + 1}`,
    lastMessage: `Last message preview for user ${i + 1}`,
  }));

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: 'inherit' }}>
      <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: "1px solid", borderColor: "divider", bgcolor: 'background.paper' }}>
        <Typography variant="h6" sx={{ fontFamily: 'inherit', color: '#244034' }}>Messages</Typography>
        <Typography variant="body2" color="text.secondary">Recent conversations</Typography>
      </Box>

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <List disablePadding>
          {items.map((it) => (
            <React.Fragment key={it.id}>
              <ListItemButton sx={{ py: { xs: 1, md: 1.5 }, '&:hover': { backgroundColor: '#F3F7F5' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#244034' }}>{it.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontFamily: 'inherit', fontWeight: 600 }}>{it.name}</Typography>}
                  secondary={<Typography variant="body2" color="text.secondary">{it.lastMessage}</Typography>}
                />
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
