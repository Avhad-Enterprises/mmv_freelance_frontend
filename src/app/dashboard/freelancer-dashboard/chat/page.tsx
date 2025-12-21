"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useMediaQuery, useTheme } from "@mui/material";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header-minus";
import ChatList from "@/app/dashboard/client-dashboard/messages/ChatList";
import EmptyChat from "@/app/dashboard/client-dashboard/messages/EmptyChat";
import InlineThreadView from "@/app/dashboard/client-dashboard/messages/InlineThreadView";

export default function FreelancerChatPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <h2 className="main-title">Messages</h2>

        <div className="bg-white border-30" style={{ overflow: "hidden" }}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              height: { xs: "calc(100vh - 200px)", md: "calc(100vh - 240px)" },
              minHeight: { xs: 520, md: 560 },
              borderRadius: "30px",
              overflow: "hidden",
              width: "100%",
              boxShadow: "0 4px 20px rgba(36,64,52,0.08)",
              border: "1px solid rgba(49,121,90,0.12)",
              fontFamily:
                "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
              bgcolor: "#FFFFFF",
            }}
          >
            {/* Left - Chat list (32% on md+, full width on xs) */}
            <Box
              sx={{
                width: { xs: "100%", md: "32%" },
                minWidth: { md: "320px" },
                maxWidth: { md: "380px" },
                borderRight: { md: "1px solid rgba(49,121,90,0.1)" },
                bgcolor: "#FFFFFF",
                height: "100%",
              }}
            >
              <ChatList
                threadBasePath="/dashboard/freelancer-dashboard/chat/thread"
                onSelectConversation={isDesktop ? (id) => setSelectedConversationId(id) : undefined}
                selectedConversationId={isDesktop ? selectedConversationId : undefined}
              />
            </Box>

            {/* Right - Chat or Empty state (desktop only) */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "block" },
                background: selectedConversationId ? "#FFFFFF" : "linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)",
                height: "100%",
              }}
            >
              {selectedConversationId ? (
                <InlineThreadView conversationId={selectedConversationId} />
              ) : (
                <EmptyChat />
              )}
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
}
