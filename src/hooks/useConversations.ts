"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";

export type ParticipantRole = "client" | "videoEditor" | "videographer" | string;

export interface ConversationSummary {
  conversationId: string;
  lastMessage: string;
  updatedAt?: number | null;
  otherParticipantId: string;
  otherParticipantRole: ParticipantRole;
  /** Human-friendly name for the other participant, if available from conversation data */
  otherParticipantName?: string;
  /** Profile image URL for the other participant, if available from conversation data (e.g. bucket URL) */
  otherParticipantProfilePicture?: string;
  lastSenderId?: string;
  lastMessageRead?: boolean;
}

export function useConversations(currentUserId: string | null) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const conversationsRef = ref(db, 'conversations');

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setConversations([]);
          setLoading(false);
          return;
        }

        const items: ConversationSummary[] = [];
        
        // Iterate through all conversations
        Object.keys(data).forEach((conversationId) => {
          const conversationData = data[conversationId];
          const participants: string[] = Array.isArray(conversationData.participants) 
            ? conversationData.participants 
            : [];
          
          // Check if current user is a participant
          if (!participants.includes(currentUserId)) {
            return;
          }

          const participantRoles: Record<string, ParticipantRole> =
            conversationData.participantRoles || {};

          // Find other participant (not the current user)
          const other = participants.find((p) => p !== currentUserId);

          if (!other) return; // Skip if no other participant found

          // Try to read a friendly name + avatar from Firebase conversation data.
          // ChatArea writes participantDetails like:
          // { [userId]: { email, firstName, profilePicture? } }
          const participantDetails = conversationData.participantDetails || {};
          const otherDetails = participantDetails[other] || {};

          const rawFirstName =
            (otherDetails.firstName ||
              otherDetails.first_name ||
              otherDetails.name ||
              "") as string;

          const otherEmail = (otherDetails.email || "") as string;

          const otherName =
            rawFirstName?.toString().trim() ||
            (otherEmail && otherEmail.includes("@")
              ? otherEmail.split("@")[0]
              : "");

          const otherProfilePicture =
            (otherDetails.profilePicture ||
              otherDetails.profile_picture ||
              "") as string;

          const role = participantRoles?.[other] || ("unknown" as ParticipantRole);

          items.push({
            conversationId,
            lastMessage: conversationData.lastMessage || "",
            updatedAt: conversationData.updatedAt || null,
            otherParticipantId: other,
            otherParticipantRole: role,
            otherParticipantName: otherName || undefined,
            otherParticipantProfilePicture:
              otherProfilePicture && otherProfilePicture.trim() !== ""
                ? otherProfilePicture
                : undefined,
            lastSenderId: conversationData.lastSenderId || "",
            lastMessageRead: !!conversationData.lastMessageRead,
          });
        });

        // Sort client-side by updatedAt desc
        items.sort((a, b) => {
          const ta = a.updatedAt || 0;
          const tb = b.updatedAt || 0;
          return tb - ta;
        });

        setConversations(items);
        setLoading(false);
      },
      (err) => {
        console.error("Conversations listener error:", err);
        setError(err?.message || String(err));
        setLoading(false);
      }
    );

    return () => {
      off(conversationsRef, 'value', unsubscribe);
    };
  }, [currentUserId]);

  return { conversations, loading, error } as const;
}

export default useConversations;
