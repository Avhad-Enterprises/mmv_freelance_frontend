"use client";
import React, { ComponentProps, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Badge,
  InputBase,
} from "@mui/material";
import { Search } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useConversations } from "@/hooks/useConversations";

type ChatListProps = {
  /** Base path for thread page, e.g. "/dashboard/client-dashboard/messages/thread" */
  threadBasePath?: string;
  /** Callback for desktop inline view */
  onSelectConversation?: (id: string) => void;
  /** Currently selected conversation ID for highlighting */
  selectedConversationId?: string | null;
} & Omit<ComponentProps<"div">, "ref">;

const formatTime = (ts?: number) => {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString();
};

const ChatList: React.FC<ChatListProps> = ({
  threadBasePath = "/dashboard/client-dashboard/messages/thread",
  onSelectConversation,
  selectedConversationId,
}) => {
  const router = useRouter();
  const { userData } = useUser();
  const currentUserId = userData?.user_id ? String(userData.user_id) : null;
  const { conversations, isLoading } = useConversations(currentUserId || undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const getOtherParticipant = (convo: any) => {
    const otherId = convo.participants.find((p: string) => p !== currentUserId);
    if (otherId && convo.participantDetails && convo.participantDetails[otherId]) {
      return { id: otherId, ...convo.participantDetails[otherId] };
    }
    return { id: otherId || 'unknown', firstName: 'Unknown User', email: '' }; // Fallback
  };

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => {
      const other = getOtherParticipant(c);
      const name = other.firstName || "";
      const message = c.lastMessage || "";
      return name.toLowerCase().includes(query) || message.toLowerCase().includes(query);
    });
  }, [conversations, searchQuery, currentUserId]);

  const handleClick = (id: string) => {
    if (onSelectConversation) {
      // Desktop: inline view
      onSelectConversation(id);
    } else {
      // Mobile: navigate to thread page
      router.push(`${threadBasePath}/${id}`);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        maxHeight: "100%",
        minHeight: 0, // Critical for flex-based scrolling
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        bgcolor: "#FFFFFF",
        position: "relative",
        borderRadius: { xs: "20px 20px 0 0", md: "20px 0 0 20px" },
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, md: 2.5 },
          background: "#244034",
          borderRadius: { xs: "20px 20px 0 0", md: "20px 0 0 0" },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: "var(--gorditas-font), inherit",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: 0.3,
            mb: 0.5,
          }}
        >
          Messages
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.75)", mb: 2, fontSize: "0.85rem" }}
        >
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.15)",
            borderRadius: "30px",
            px: 2,
            py: 0.75,
            border: "1px solid rgba(255,255,255,0.2)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.2)",
              borderColor: "rgba(255,255,255,0.3)",
            },
            "&:focus-within": {
              bgcolor: "rgba(255,255,255,0.25)",
              borderColor: "#D2F34C",
              boxShadow: "0 0 0 2px rgba(210,243,76,0.2)",
            },
          }}
        >
          <Search size={20} color="rgba(255,255,255,0.7)" style={{ marginRight: 8, flexShrink: 0 }} />
          <InputBase
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              color: "#FFFFFF",
              fontSize: "0.9rem",
              "& input::placeholder": {
                color: "rgba(255,255,255,0.6)",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>

      {/* Only the conversation list scrolls, header stays fixed */}
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          minHeight: 0, // Critical for flex children to enable scrolling
          bgcolor: "#FFFFFF",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "#F0F5F3",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#31795A",
            borderRadius: "3px",
            "&:hover": {
              bgcolor: "#244034",
            },
          },
        }}
      >
        <List disablePadding>
          {isLoading ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: "3px solid #E9F7EF",
                  borderTopColor: "#31795A",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  mx: "auto",
                  mb: 2,
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography sx={{ color: "#6B7280" }}>Loading...</Typography>
            </Box>
          ) : filteredConversations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#6B7280", mb: 1 }}>
                {searchQuery ? "No matching conversations" : "No conversations yet"}
              </Typography>
              {searchQuery && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#31795A",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" }
                  }}
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Typography>
              )}
            </Box>
          ) : (
            filteredConversations.map((c) => {
              const other = getOtherParticipant(c);
              const hasUnread = c.hasUnread; // Assuming useConversations hook provides this from backend

              return (
                <React.Fragment key={c.id}>
                  <ListItemButton
                    selected={selectedConversationId === c.id}
                    onClick={() => handleClick(c.id)}
                    sx={{
                      py: 1.5,
                      px: { xs: 2, md: 2.5 },
                      bgcolor: "#FFFFFF",
                      "&:hover": {
                        backgroundColor: "#F0F5F3",
                        "& .chat-avatar": {
                          transform: "scale(1.05)",
                        },
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderLeft: "4px solid transparent",
                      transition: "all 0.2s ease",
                      "&.Mui-selected, &.selected": {
                        backgroundColor: "#E9F7EF",
                        borderLeftColor: "#31795A",
                      },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 0 }}>
                      <Badge
                        color="success"
                        variant="dot"
                        overlap="circular"
                        invisible={!hasUnread}
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: "#1a5f3d",
                            border: "2px solid #FFFFFF",
                            boxShadow: "0 2px 6px rgba(26, 95, 61, 0.4)",
                          },
                        }}
                      >
                        <Avatar
                          className="chat-avatar"
                          sx={{
                            bgcolor: "#244034",
                            width: 48,
                            height: 48,
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            transition: "transform 0.2s ease",
                            boxShadow: "0 2px 8px rgba(36,64,52,0.15)",
                          }}
                          src={other.profilePicture}
                        >
                          {!other.profilePicture && (other.firstName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontFamily: "inherit",
                            color: "#244034",
                            fontSize: "0.95rem",
                          }}
                        >
                          {other.firstName}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: 200,
                            color: hasUnread ? "#111827" : "#6B7280",
                            fontWeight: hasUnread ? 600 : 400,
                            fontSize: "0.85rem",
                          }}
                        >
                          {c.lastMessage || 'No messages'}
                        </Typography>
                      }
                    />

                    <Box sx={{ ml: "auto", textAlign: "right", flexShrink: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: hasUnread ? "#31795A" : "#9CA3AF",
                          fontWeight: hasUnread ? 600 : 400,
                          fontSize: "0.75rem",
                          display: "block",
                        }}
                      >
                        {formatTime(c.updatedAt)}
                      </Typography>
                      {hasUnread && (
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: "#1a5f3d",
                              border: "2px solid #FFFFFF",
                              boxShadow: "0 2px 6px rgba(26, 95, 61, 0.4)",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </ListItemButton>
                  <Divider component="li" sx={{ borderColor: "#F0F5F3" }} />
                </React.Fragment>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
