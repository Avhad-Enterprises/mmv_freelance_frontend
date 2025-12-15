"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const EmptyChat: React.FC<{ message?: string }> = ({ message = "Select a chat to start messaging" }) => {
  return (
    <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, md: 6 }, fontFamily: 'inherit' }}>
      <Box sx={{ textAlign: "center", maxWidth: 520 }}>
        <Box sx={{ width: 96, height: 96, borderRadius: '50%', bgcolor: '#F3F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
          <Box component="span" sx={{ fontSize: 40, color: '#9CA3AF' }}>💬</Box>
        </Box>
        <Typography variant="h5" sx={{ mt: 2, mb: 1, color: '#244034', fontFamily: 'inherit' }}>{message}</Typography>
        <Typography variant="body2" color="text.secondary">Choose a conversation from the left to continue.</Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#244034', '&:hover': { backgroundColor: '#1d332b' } }}
          >
            Start New Chat
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EmptyChat;
