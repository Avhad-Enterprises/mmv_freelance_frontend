"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Conversation from "@/app/components/conversation/Conversation";

export default function ThreadPage() {
  const params = useParams() as { id?: string };
  const conversationId = params?.id;
  const { userData, isLoading } = useUser();

  if (!conversationId) return <div>Missing conversation id</div>;
  if (isLoading || !userData) return <div>Loading...</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Conversation conversationId={conversationId} currentUserId={String(userData.user_id)} />
    </div>
  );
}
