"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { MessageCircle } from "lucide-react";

const EmptyChat: React.FC<{ message?: string }> = ({ message = "Select a chat to start messaging" }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 3, md: 6 },
        fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        background: "linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)",
        borderRadius: { xs: "0 0 20px 20px", md: "0 20px 20px 0" },
      }}
    >
      <Box 
        sx={{ 
          textAlign: "center", 
          maxWidth: 480,
          bgcolor: "#FFFFFF",
          borderRadius: "30px",
          p: { xs: 4, md: 5 },
          boxShadow: "0 10px 40px rgba(36,64,52,0.08)",
          border: "1px solid rgba(49,121,90,0.1)",
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#244034",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            border: "2px solid #31795A20",
          }}
        >
          <MessageCircle size={48} color="#31795A" strokeWidth={1.5} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            mb: 1.5,
            color: "#244034",
            fontFamily: "var(--eb_garamond-font), serif",
            fontWeight: 600,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
          }}
        >
          {message}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "#6B7280",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          Choose a conversation from the left to continue chatting or start a new conversation.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: "#244034",
            "&:hover": { 
              background: "#244034",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(36,64,52,0.3)",
            },
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            boxShadow: "0 4px 14px rgba(36,64,52,0.2)",
            transition: "all 0.2s ease",
          }}
        >
          Start New Chat
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyChat;
