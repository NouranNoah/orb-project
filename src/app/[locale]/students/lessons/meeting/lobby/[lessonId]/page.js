"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./lobby.module.css";
import { CREATEMEETINGFORLESSON } from "@/services/lessons.service";
import {
  pickCreateMeetingPayload,
  pickRoomId,
  pickStudentKitToken,
  meetingTokenStorageKey,
  looksLikeZegoKitTokenString,
  tokenDiagnostics,
} from "@/lib/zegoMeeting";
import Cookies from "js-cookie";

export default function LobbyPage() {
  const { lessonId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] || "ar";

  Cookies.set("lessonNowId", lessonId);

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const res = await CREATEMEETINGFORLESSON(lessonId);
        const payload = pickCreateMeetingPayload(res);
        setMeetingData(payload);
        if (process.env.NODE_ENV === "development" && payload) {
          const tok = pickStudentKitToken(payload);
          const rid = pickRoomId(payload);
          console.info("[Lobby create-meeting]", {
            roomId: rid,
            tokenKeys: payload.tokens ? Object.keys(payload.tokens) : null,
            pickedToken: tok ? tokenDiagnostics(tok) : null,
            rawTokens: payload.tokens ?? null,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getMeeting();
  }, [lessonId]);

  const handleJoin = () => {
    if (!meetingData) return;

    const meetingId = pickRoomId(meetingData);
    const token = pickStudentKitToken(meetingData);

    if (!meetingId || !token) {
      console.warn("[Lobby] ناقص roomId أو kit token", { meetingData });
      return;
    }

    try {
      // الأفضل: لا نمرّر token في الـ URL (مشاكل + / . وطول الرابط)
      sessionStorage.setItem(meetingTokenStorageKey(meetingId), token);
      router.push(`/${locale}/students/lessons/meeting/${meetingId}`);
    } catch {
      // fallback لو sessionStorage غير متاح
      const encodedToken = encodeURIComponent(token);
      router.push(
        `/${locale}/students/lessons/meeting/${meetingId}?token=${encodedToken}`
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Your Lesson is Ready</h2>

        <p className={styles.desc}>
          Get ready to join your live session
        </p>

        {loading && (
          <div className={styles.countdown}>
            Loading meeting...
          </div>
        )}

        {!loading && meetingData && (
          <div className={styles.live}>
            Live now
          </div>
        )}

        <button
          type="button"
          className={`${styles.joinBtn} ${loading ? styles.disabled : ""}`}
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Waiting..." : "Join Lesson"}
        </button>
      </div>
    </div>
  );
}
