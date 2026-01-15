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
  onSettingsClick?: () => void;
}

export default function ChatHeader({
  currentUserId,
  conversation,
  onBack,
  onSettingsClick,
}: Props) {
  const router = useRouter();
  const otherId =
    conversation?.participants?.find((p) => p !== currentUserId) || null;
  const otherDetails = otherId
    ? conversation?.participantDetails?.[otherId]
    : null;
  const [fetchedDetails, setFetchedDetails] = useState<{
    firstName?: string;
    email?: string;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!conversation?.id || !otherId) return;

    setFetchedDetails(null);

    // Listen for typing status from Realtime Database
    const typingRef = ref(
      db,
      `conversations/${conversation.id}/typing/${otherId}`
    );
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
          const userRef = ref(db, `users/${otherId}`);
          const userSnap = await get(userRef);
          if (userSnap.exists()) {
            const data = userSnap.val();
            setFetchedDetails({
              firstName:
                data.firstName || data.first_name || data.username || "",
              email: data.email || "",
            });
            return;
          }
        } catch (err) {
          console.error(
            "Failed to fetch participant from Realtime Database users",
            err
          );
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
                (typeof found.username === "string" &&
                found.username.includes("@")
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

  const emailCandidate = otherDetails?.email || fetchedDetails?.email || "";
  const fallbackFromEmail = emailCandidate
    ? emailCandidate.split("@")[0]
    : null;
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
    <div
      style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid rgba(49,121,90,0.1)",
        background: "#244034",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 40,
        fontFamily:
          "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        borderRadius: "0 30px 0 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "rgba(255,255,255,0.95)",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          aria-label="Back to messages"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {displayFirstName?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "1rem" }}>
            {displayFirstName}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: isTyping ? "#D2F34C" : "rgba(255,255,255,0.7)",
              fontWeight: isTyping ? 500 : 400,
            }}
          >
            {isTyping ? "● Typing..." : displayEmail}
          </div>
        </div>
      </div>

      {/* Settings Button */}
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "rgba(255,255,255,0.95)",
            cursor: "pointer",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
          }
          aria-label="Settings"
          title="Update Project Budget"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.1667 12.5C16.0557 12.7513 16.0228 13.0302 16.0722 13.3005C16.1216 13.5708 16.2512 13.8203 16.4442 14.0167L16.4917 14.0642C16.6461 14.2184 16.7687 14.4022 16.8525 14.6048C16.9363 14.8074 16.9796 15.0248 16.9796 15.2442C16.9796 15.4636 16.9363 15.681 16.8525 15.8836C16.7687 16.0862 16.6461 16.27 16.4917 16.4242C16.3375 16.5786 16.1537 16.7012 15.9511 16.785C15.7485 16.8688 15.5311 16.9121 15.3117 16.9121C15.0923 16.9121 14.8749 16.8688 14.6723 16.785C14.4697 16.7012 14.2859 16.5786 14.1317 16.4242L14.0842 16.3767C13.8878 16.1837 13.6383 16.0541 13.368 16.0047C13.0977 15.9553 12.8188 15.9882 12.5675 16.0992C12.3213 16.2056 12.1135 16.3826 11.9707 16.6076C11.8279 16.8327 11.7564 17.0959 11.7659 17.3625V17.5C11.7659 17.942 11.5903 18.366 11.2777 18.6785C10.9652 18.9911 10.5412 19.1667 10.0992 19.1667C9.65717 19.1667 9.23318 18.9911 8.92062 18.6785C8.60806 18.366 8.43245 17.942 8.43245 17.5V17.425C8.41749 17.1486 8.33183 16.8813 8.18405 16.6507C8.03627 16.4201 7.83169 16.2343 7.59078 16.1117C7.33949 16.0007 7.06061 15.9678 6.79031 16.0172C6.52001 16.0666 6.27048 16.1962 6.07411 16.3892L6.02661 16.4367C5.87241 16.5911 5.68862 16.7137 5.48602 16.7975C5.28342 16.8813 5.06602 16.9246 4.84661 16.9246C4.6272 16.9246 4.4098 16.8813 4.2072 16.7975C4.0046 16.7137 3.82082 16.5911 3.66661 16.4367C3.51222 16.2825 3.38963 16.0987 3.30583 15.8961C3.22203 15.6935 3.17871 15.4761 3.17871 15.2567C3.17871 15.0373 3.22203 14.8199 3.30583 14.6173C3.38963 14.4147 3.51222 14.2309 3.66661 14.0767L3.71411 14.0292C3.90713 13.8328 4.03672 13.5833 4.08612 13.313C4.13552 13.0427 4.10263 12.7638 3.99161 12.5125C3.88524 12.2663 3.70826 12.0585 3.48321 11.9157C3.25816 11.7729 2.99496 11.7014 2.72828 11.7108H2.59161C2.14959 11.7108 1.7256 11.5352 1.41304 11.2227C1.10048 10.9101 0.924866 10.4861 0.924866 10.0442C0.924866 9.60213 1.10048 9.17814 1.41304 8.86558C1.7256 8.55302 2.14959 8.37741 2.59161 8.37741H2.66661C2.94304 8.36245 3.21035 8.27679 3.44094 8.12901C3.67153 7.98123 3.85734 7.77665 3.97995 7.53574C4.09096 7.28445 4.12385 7.00557 4.07445 6.73527C4.02505 6.46497 3.89547 6.21544 3.70245 6.01907L3.65495 5.97157C3.50056 5.81738 3.37797 5.63359 3.29417 5.43099C3.21037 5.22839 3.16705 5.01099 3.16705 4.79157C3.16705 4.57216 3.21037 4.35476 3.29417 4.15216C3.37797 3.94956 3.50056 3.76578 3.65495 3.61157C3.80916 3.45718 3.99295 3.33459 4.19555 3.25079C4.39815 3.16699 4.61555 3.12367 4.83495 3.12367C5.05436 3.12367 5.27176 3.16699 5.47436 3.25079C5.67696 3.33459 5.86074 3.45718 6.01495 3.61157L6.06245 3.65907C6.25882 3.85209 6.50835 3.98168 6.77865 4.03108C7.04895 4.08048 7.32783 4.04759 7.57911 3.93657H7.65911C7.90532 3.8302 8.11311 3.65322 8.25591 3.42817C8.39871 3.20312 8.47021 2.93992 8.46078 2.67324V2.53657C8.46078 2.09455 8.6364 1.67056 8.94896 1.358C9.26152 1.04544 9.68551 0.869827 10.1275 0.869827C10.5695 0.869827 10.9935 1.04544 11.3061 1.358C11.6187 1.67056 11.7943 2.09455 11.7943 2.53657V2.61157C11.7847 2.87825 11.8562 3.14145 11.999 3.3665C12.1418 3.59155 12.3496 3.76853 12.5958 3.8749C12.8471 3.98592 13.126 4.01881 13.3963 3.96941C13.6666 3.92001 13.9161 3.79042 14.1125 3.5974L14.16 3.5499C14.3142 3.39551 14.498 3.27292 14.7006 3.18912C14.9032 3.10532 15.1206 3.062 15.34 3.062C15.5594 3.062 15.7768 3.10532 15.9794 3.18912C16.182 3.27292 16.3658 3.39551 16.52 3.5499C16.6744 3.70411 16.797 3.8879 16.8808 4.0905C16.9646 4.2931 17.0079 4.5105 17.0079 4.7299C17.0079 4.94931 16.9646 5.16671 16.8808 5.36931C16.797 5.57191 16.6744 5.7557 16.52 5.9099L16.4725 5.9574C16.2795 6.15377 16.1499 6.4033 16.1005 6.6736C16.0511 6.9439 16.084 7.22278 16.195 7.47407V7.55407C16.3014 7.80028 16.4784 8.00807 16.7034 8.15087C16.9285 8.29367 17.1917 8.36517 17.4583 8.35574H17.595C18.037 8.35574 18.461 8.53135 18.7736 8.84391C19.0861 9.15647 19.2618 9.58046 19.2618 10.0225C19.2618 10.4645 19.0861 10.8885 18.7736 11.201C18.461 11.5136 18.037 11.6892 17.595 11.6892H17.52C17.2533 11.6798 16.9901 11.7513 16.7651 11.8941C16.54 12.0369 16.363 12.2447 16.2567 12.4909V12.4909Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
