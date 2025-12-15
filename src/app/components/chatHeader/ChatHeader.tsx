"use client";
import React from "react";
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { MoreVertical } from 'lucide-react';
import { useRouter } from "next/navigation";

export interface ChatHeaderProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  userId?: string;
  onViewProfile?: (userId?: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, role = "Editor", avatarUrl, userId, onViewProfile }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleViewProfile = () => {
    handleClose();
    if (onViewProfile) return onViewProfile(userId);
    // default navigation
    if (userId) router.push(`/dashboard/client-dashboard/profile/${userId}`);
    else router.push(`/dashboard/client-dashboard/profile`);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={avatarUrl} sx={{ bgcolor: '#244034' }}>{!avatarUrl && name.charAt(0)}</Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, fontFamily: 'inherit' }}>{name}</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{role}</Typography>
        </Box>
      </Box>

      <Box sx={{ ml: 'auto' }}>
        <IconButton aria-label="chat-menu" onClick={handleOpenMenu} size="large">
          <MoreVertical />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ChatHeader;
