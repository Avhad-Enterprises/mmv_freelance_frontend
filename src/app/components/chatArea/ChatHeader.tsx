"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { ref, onValue, get } from "firebase/database";
import Cookies from "js-cookie";

interface ConversationShape {
  id: string;
  participants: string[];
  participantDetails?: { [id: string]: { email?: string; firstName?: string } };
}

interface Props {
  currentUserId?: string | null;
  conversation?: ConversationShape | null;
  onBack?: () => void;
  onProfileClick?: () => void;
}

export default function ChatHeader({ currentUserId, conversation, onBack, onProfileClick }: Props) {
  const router = useRouter();
  const otherId = conversation?.participants?.find((p) => p !== currentUserId) || null;
  const otherDetails = otherId ? conversation?.participantDetails?.[otherId] : null;
  const [fetchedDetails, setFetchedDetails] = useState<{ firstName?: string; email?: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!conversation?.id || !otherId) return;

    setFetchedDetails(null);

    // If db is not initialized (e.g. missing env vars), skip Firebase listeners
    if (!db) return;

    // Listen for typing status from Realtime Database
    const typingRef = ref(db, `conversations/${conversation.id}/typing/${otherId}`);
    const unsub = onValue(
      typingRef,
      (snap) => {
        const typing = snap.val() === true;
        setIsTyping(typing);
      },
      (err) => {
        console.error("Conversation typing listener error:", err);
      }
    );

    // If there are no details available from the conversation, try to fetch from public API
    (async () => {
      if (!otherDetails && otherId) {
        // Try to get user details from Realtime Database
        try {
          // Double check db existence
          if (db) {
            const userRef = ref(db, `users/${otherId}`);
            const userSnap = await get(userRef);
            if (userSnap.exists()) {
              const data = userSnap.val();
              setFetchedDetails({
                firstName: data.firstName || data.first_name || data.username || "",
                email: data.email || "",
              });
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch participant from Realtime Database users", err);
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`,
            { cache: "no-cache" }
          );
          if (res.ok) {
            const data = await res.json();
            const found = (data.data || []).find(
              (f: any) => String(f.user_id) === String(otherId)
            );
            if (found) {
              // Use the same naming logic as chat list and prefer real email/username
              const firstName =
                found.first_name ||
                (found.username || "").split("@")[0] ||
                (found.company_name || "").toString().trim() ||
                "";
              const email =
                found.email ||
                (typeof found.username === "string" && found.username.includes("@")
                  ? found.username
                  : "");

              setFetchedDetails({
                firstName,
                email,
              });
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch other participant details", err);
        }
      }
    })();

    return () => unsub();
  }, [conversation?.id, otherId]);

  const normalizeName = (n?: string | null) => {
    if (!n) return null;
    const s = n.toString().trim();
    if (!s) return null;
    if (/^user\s*name$/i.test(s)) return null;
    if (/^user\s*\d+$/i.test(s)) return null;
    if (/^unknown$/i.test(s)) return null;
    return s;
  };

  const emailCandidate = otherDetails?.email || fetchedDetails?.email || '';
  const fallbackFromEmail = emailCandidate ? emailCandidate.split("@")[0] : null;
  const fallbackFromParticipant =
    normalizeName(otherDetails?.firstName) ||
    normalizeName((otherDetails as any)?.first_name) ||
    normalizeName((otherDetails as any)?.username) ||
    normalizeName((otherDetails as any)?.company_name) ||
    normalizeName((otherDetails as any)?.displayName);
  const fallbackFromFetched =
    normalizeName(fetchedDetails?.firstName) ||
    normalizeName((fetchedDetails as any)?.first_name) ||
    normalizeName((fetchedDetails as any)?.username) ||
    normalizeName((fetchedDetails as any)?.company_name);

  const displayFirstName =
    fallbackFromParticipant ||
    fallbackFromFetched ||
    normalizeName(fallbackFromEmail) ||
    "Client";
  const displayEmail = emailCandidate;

  return (
    <div style={{
      padding: '1rem 1.25rem',
      borderBottom: '1px solid rgba(49,121,90,0.1)',
      background: '#244034',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
      borderRadius: '0 30px 0 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          className="mobile-back-btn"
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              // keep it generic so it works for both client + freelancer dashboards
              router.back();
            }
          }}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'rgba(255,255,255,0.95)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          aria-label="Back to messages"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          onClick={() => onProfileClick && onProfileClick()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            cursor: onProfileClick ? 'pointer' : 'default'
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {displayFirstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '1rem' }}>{displayFirstName}</div>
            <div style={{
              fontSize: '0.8rem',
              color: isTyping ? '#D2F34C' : 'rgba(255,255,255,0.7)',
              fontWeight: isTyping ? 500 : 400
            }}>
              {isTyping ? '● Typing...' : displayEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
