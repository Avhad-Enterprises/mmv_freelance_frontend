"use client";
import React from "react";
import { useUser } from "@/context/UserContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ChatList from "./ChatList";
import EmptyChat from "./EmptyChat";
import Typography from "@mui/material/Typography";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";

export default function ClientMessagesPage() {
  const { userData, isLoading } = useUser();

  if (isLoading) return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );

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
              <ChatList />
            </Box>

            {/* Right - Empty state (desktop only) */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "block" },
                background: "linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)",
                height: "100%",
              }}
            >
              <EmptyChat />
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
}
