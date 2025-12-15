"use client";
import React, { useState } from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => Promise<void> | void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInputBar: React.FC<Props> = ({ onSend, placeholder = "Type a message", disabled = false }) => {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const doSend = async (text: string) => {
    if (!text.trim()) return;
    try {
      setIsSending(true);
      await onSend(text.trim());
      setValue("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && !isSending) doSend(value);
      }}
      sx={{ position: "sticky", bottom: 0, zIndex: 10, p: 1, display: "flex", alignItems: "center", gap: 1, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}
      aria-label="message-input-bar"
    >
      <InputBase
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && !isSending) doSend(value);
          }
        }}
        placeholder={placeholder}
        multiline
        maxRows={6}
        sx={{ flex: 1, pl: 1, pr: 1 }}
        inputProps={{ 'aria-label': 'Type a message' }}
        disabled={disabled}
      />

      <IconButton color="primary" onClick={() => doSend(value)} aria-label="send message" disabled={disabled || isSending}>
        <Send size={18} />
      </IconButton>
    </Paper>
  );
};

export default MessageInputBar;
