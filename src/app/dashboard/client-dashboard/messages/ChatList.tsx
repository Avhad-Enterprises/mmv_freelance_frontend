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
import { Search, Plus } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useConversations } from "@/hooks/useConversations";
import Cookies from "js-cookie";

type ChatListProps = {
  /** Base path for thread page, e.g. "/dashboard/client-dashboard/messages/thread" */
  threadBasePath?: string;
  /** Callback for desktop inline view */
  onSelectConversation?: (id: string) => void;
  /** Currently selected conversation ID for highlighting */
  selectedConversationId?: string | null;
} & Omit<ComponentProps<"div">, "ref">;

const formatTime = (ts?: any) => {
  if (!ts) return "";
  const d =
    typeof ts === "number"
      ? new Date(ts)
      : ts?.toDate
      ? ts.toDate()
      : null;
  if (!d) return "";
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
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
  const { userData, isLoading } = useUser();
  const currentUserId = userData?.user_id ? String(userData.user_id) : null;
  const { conversations, loading, error } = useConversations(currentUserId);
  const [namesMap, setNamesMap] = React.useState<Record<string, string>>({});
  const [profilePicturesMap, setProfilePicturesMap] = React.useState<
    Record<string, string>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => {
      const name = (c as any).otherParticipantName || 
                   namesMap[c.otherParticipantId] || 
                   c.otherParticipantId;
      const message = c.lastMessage || "";
      return name.toLowerCase().includes(query) || message.toLowerCase().includes(query);
    });
  }, [conversations, namesMap, searchQuery]);

  // Fetch participant display names and profile pictures for chat list
  React.useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    const loadNames = async () => {
      try {
        const allOtherIds = Array.from(
          new Set(conversations.map((c) => String(c.otherParticipantId)))
        );

        const nameMap: Record<string, string> = {};
        const pictureMap: Record<string, string> = {};

        // 1) Try public freelancers endpoint (works when the other user is a freelancer)
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`,
            { cache: "no-cache" }
          );
          if (res.ok) {
            const data = await res.json();
            (data.data || []).forEach((f: any) => {
              const id = String(f.user_id);
              const displayName =
                f.first_name ||
                (f.username || "").split("@")[0] ||
                (f.company_name || "").toString().trim() ||
                id;
              nameMap[id] = displayName;
              if (f.profile_picture && f.profile_picture.trim() !== "") {
                pictureMap[id] = f.profile_picture;
              }
            });
          }
        } catch (err) {
          console.error("Failed to load freelancer names for chat list", err);
        }

        // 2) For any remaining ids (typically clients), try the public user info endpoint
        const token = Cookies.get("auth_token");
        if (token) {
          await Promise.all(
            allOtherIds
              .filter((id) => !nameMap[id])
              .map(async (id) => {
                try {
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}/public-info`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  if (!res.ok) return;
                  const data = await res.json();
                  const u = data?.data;
                  if (!u) return;
                  const displayName =
                    u.first_name ||
                    u.company_name ||
                    u.username ||
                    u.display_name ||
                    id;
                  nameMap[id] = displayName;
                  if (
                    u.profile_picture &&
                    typeof u.profile_picture === "string" &&
                    u.profile_picture.trim() !== ""
                  ) {
                    pictureMap[id] = u.profile_picture;
                  }
                } catch (err) {
                  console.error(
                    `Failed to load profile for conversation participant ${id}`,
                    err
                  );
                }
              })
          );
        }

        setNamesMap(nameMap);
        setProfilePicturesMap(pictureMap);
      } catch (err) {
        console.error("Failed to load participant names for chat list", err);
      }
    };
    loadNames();
  }, [conversations]);

  const isFreelancerUser =
    (userData as any)?.role === "freelancer" ||
    (userData as any)?.user_type === "freelancer";

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
          flex: 1,
          maxHeight: "calc(100% - 140px)",
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
          {isLoading || loading ? (
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
          ) : error ? (
            <Typography sx={{ p: 2, color: "error.main" }}>{error}</Typography>
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
            filteredConversations.map((c) => (
              <React.Fragment key={c.conversationId}>
                <ListItemButton
                  selected={selectedConversationId === c.conversationId}
                  onClick={() => handleClick(c.conversationId)}
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
                      invisible={
                        !(c.lastSenderId !== currentUserId && !c.lastMessageRead)
                      }
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#D2F34C",
                          border: "2px solid #FFFFFF",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                        src={
                          // Prefer profile picture coming directly from conversation data (bucket URL)
                          (c as any).otherParticipantProfilePicture ||
                          profilePicturesMap[c.otherParticipantId] ||
                          undefined
                        }
                      >
                        {!(
                          (c as any).otherParticipantProfilePicture ||
                          profilePicturesMap[c.otherParticipantId]
                        ) &&
                          // Use the first letter of the most friendly name we have
                          (
                            (c as any).otherParticipantName ||
                            namesMap[c.otherParticipantId] ||
                            c.otherParticipantId
                          )
                            .toString()
                            .charAt(0)
                            .toUpperCase()}
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
                        {/* Prefer name from conversation data (written by chat area),
                         * then API-resolved name, and only as a last resort fall back
                         * to a generic label / raw ID.
                         */}
                        {(c as any).otherParticipantName ||
                          namesMap[c.otherParticipantId] ||
                          (isFreelancerUser ? "Client" : c.otherParticipantId)}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ 
                          maxWidth: 200,
                          color: "#6B7280",
                          fontSize: "0.85rem",
                        }}
                      >
                        {c.lastMessage}
                      </Typography>
                    }
                  />

                  <Box sx={{ ml: "auto", textAlign: "right", flexShrink: 0 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: "#9CA3AF",
                        fontSize: "0.75rem",
                        display: "block",
                      }}
                    >
                      {formatTime(c.updatedAt)}
                    </Typography>
                    {c.lastSenderId !== currentUserId && !c.lastMessageRead && (
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
                            backgroundColor: "#D2F34C",
                            border: "2px solid #FFFFFF",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </ListItemButton>
                <Divider component="li" sx={{ borderColor: "#F0F5F3" }} />
              </React.Fragment>
            ))
          )}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
