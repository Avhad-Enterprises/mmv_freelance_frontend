"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";

export type ParticipantRole = "client" | "videoEditor" | "videographer" | string;

export interface ConversationSummary {
  conversationId: string;
  lastMessage: string;
  updatedAt?: Timestamp | null;
  otherParticipantId: string;
  otherParticipantRole: ParticipantRole;
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

    const convRef = collection(db, "conversations");
    const q = query(
      convRef,
      where("participants", "array-contains", currentUserId),
      orderBy("updatedAt", "desc")
    );

    let unsub: Unsubscribe | null = null;

    try {
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const items: ConversationSummary[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            const participants: string[] = Array.isArray(data.participants) ? data.participants : [];
            const participantRoles: Record<string, ParticipantRole> = data.participantRoles || {};

            // find other participant who is editor or videographer
            const other = participants.find((p) => {
              if (p === currentUserId) return false;
              const roleRaw = participantRoles?.[p] || "";
              const roleLower = String(roleRaw).toLowerCase();
              return ["videoeditor", "videographer", "editor"].includes(roleLower);
            });

            if (!other) return; // skip conversations that do not match role criteria

            const role = participantRoles?.[other] || ("unknown" as ParticipantRole);

            items.push({
              conversationId: doc.id,
              lastMessage: data.lastMessage || "",
              updatedAt: (data.updatedAt as Timestamp) || null,
              otherParticipantId: other,
              otherParticipantRole: role,
            });
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
    } catch (err: any) {
      console.error("Failed to subscribe to conversations:", err);
      setError(err?.message || String(err));
      setLoading(false);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [currentUserId]);

  return { conversations, loading, error } as const;
}

export default useConversations;
