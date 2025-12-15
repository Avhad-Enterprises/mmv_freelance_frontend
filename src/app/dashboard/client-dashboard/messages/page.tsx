"use client";
import React from "react";
import { useUser } from "@/context/UserContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ChatList from "./ChatList";
import EmptyChat from "./EmptyChat";
import Typography from "@mui/material/Typography";

export default function ClientMessagesPage() {
  const { userData, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ minHeight: "100vh", py: 3, px: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 2, fontFamily: 'inherit', color: '#244034' }}>Messages</Typography>

      <Paper sx={{ display: "flex", minHeight: "calc(100vh - 150px)", height: { xs: 'auto', md: 'calc(100vh - 150px)' }, borderRadius: 2, overflow: "hidden", width: '100%' }}>
        {/* Left - Chat list (30% on md+, full width on xs) */}
        <Box sx={{ width: { xs: "100%", md: "30%" }, minWidth: { md: '300px' }, borderRight: { md: "1px solid" }, borderColor: "divider", bgcolor: "background.paper" }}>
          <ChatList />
        </Box>

        {/* Right - Empty state */}
        <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
          <EmptyChat />
        </Box>

        {/* On small screens show empty below the list */}
        <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
          <EmptyChat />
        </Box>
      </Paper>
    </Box>
  );
}
