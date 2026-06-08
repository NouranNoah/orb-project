"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { ZegoExpressEngine } from "zego-express-engine-webrtc"; 
import Cookies from "js-cookie";
import styles from './Meeting.module.css';
// استيراد الأيقونات
import {FaDesktop, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { meetingTokenStorageKey, normalizeZegoKitTokenFromUrl } from "@/lib/zegoMeeting";



export default function Meeting() {
  const { meetingId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'ar';

  const t = useTranslations("meetingPage")
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const engineRef = useRef(null);
  const localStreamRef = useRef(null); // ريفرنس للاستريم عشان نتحكم فيه

  const [initError, setInitError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  
  const userId = Cookies.get("idUser") || "guest_" + Math.random().toString(36).substring(7);
  // const userName = "Student_User";
  const userRole = Cookies.get("roleUser")
  const userName = userRole === "teacher" ? "Teacher_User" : "Student_User";

  useEffect(() => {
    const rtcToken =
      normalizeZegoKitTokenFromUrl(sessionStorage.getItem(meetingTokenStorageKey(meetingId))) ||
      normalizeZegoKitTokenFromUrl(searchParams.get("token"));
    if (!meetingId || !rtcToken) return;
    
    const envAppId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
    const appID = !Number.isNaN(envAppId) && envAppId ? envAppId : 1202786457;
    const zg = new ZegoExpressEngine(appID, "wss://webliveroom-api.zegocloud.com/ws");
    engineRef.current = zg;
    
    zg.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
      if (updateType === "ADD" && streamList.length > 0) {
        try {
          const remoteStream = await zg.startPlayingStream(streamList[0].streamID);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        } catch (err) {
          console.error("Remote Stream Error:", err);
        }
      }
    });
    
    const startMeeting = async () => {
      try {
        await zg.loginRoom(meetingId, rtcToken.trim(), { userID: userId, userName });

        try {
          const localStream = await zg.createStream({
            camera: { video: true, audio: true }
          });
          
          localStreamRef.current = localStream; // حفظ الاستريم للتحكم به لاحقاً

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }

          const streamID = `stream_${userId}_${Date.now()}`;
          await zg.startPublishingStream(streamID, localStream);

        } catch (mediaError) {
          setInitError(t("failCam"));
        }

      } catch (err) {
        setInitError(t("failServer"));
      }
    };
    
    startMeeting();

    return () => {
      if (engineRef.current) {
        zg.logoutRoom(meetingId);
        zg.destroyEngine();
      }
    };
  }, [meetingId, searchParams, userId]);

  // دالة كتم/تشغيل المايك
  const toggleMic = async () => {
    if (!localStreamRef.current) return;
    const newState = !micOn;
    // Zego API لكتم الصوت
    await engineRef.current.mutePublishStreamAudio(localStreamRef.current, !newState);
    setMicOn(newState);
  };

  // دالة كتم/تشغيل الكاميرا
  const toggleCamera = async () => {
    if (!localStreamRef.current) return;
    const newState = !cameraOn;
    // Zego API لكتم الفيديو
    await engineRef.current.mutePublishStreamVideo(localStreamRef.current, !newState);
    setCameraOn(newState);
  };

  const lessonId = Cookies.get("lessonNowId")
  
  // دالة مغادرة الغرفة
  const leaveRoom = () => {
    console.log('id',lessonId);
    if (confirm(t("confirmLeave"))) {
      router.push(`/${locale}/${userRole}s/lessons/requestslesson/${lessonId}/confirm`);
    }
  };

  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const screenStreamRef = useRef(null);

  // دالة مشاركة الشاشة
  const toggleScreenShare = async () => {
    try {
      if (!isSharingScreen) {
        // 1. إنشاء استريم الشاشة
        const screenStream = await engineRef.current.createStream({
          screen: {
            audio: true,
            video: true
          }
        });

        screenStreamRef.current = screenStream;

        // 2. الحل الصحيح لمشكلة .on هو الوصول للـ MediaStream الخاص بالمتصفح
        // نراقب متى يضغط المستخدم على "Stop Sharing" من شريط المتصفح
        const videoTrack = screenStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            stopScreenShare();
          };
        }

        // 3. نشر الاستريم
        const screenStreamID = `screen_${userId}_${Date.now()}`;
        // نحفظ الـ ID عشان نستخدمه لما نيجي نقفل
        screenStreamRef.current._id = screenStreamID; 
        
        await engineRef.current.startPublishingStream(screenStreamID, screenStream);
        
        setIsSharingScreen(true);
        console.log("✅ Screen sharing started");

      } else {
        stopScreenShare();
      }
    } catch (err) {
      console.error("Screen Share Error:", err);
      if (err.code === 1103010) {
        console.log("User cancelled screen sharing");
      } else {
        alert("فشل بدء مشاركة الشاشة: " + (err.msg || "تأكد من إعطاء الصلاحية"));
      }
    }
  };

  const stopScreenShare = async () => {
    if (screenStreamRef.current) {
      try {
        // نوقف النشر باستخدام الـ ID اللي حفظناه
        const streamID = screenStreamRef.current._id;
        if (streamID) {
          await engineRef.current.stopPublishingStream(streamID);
        }
        
        // نمرر الـ stream نفسه للـ destroy
        await engineRef.current.destroyStream(screenStreamRef.current);
        
        screenStreamRef.current = null;
        setIsSharingScreen(false);
        console.log("🛑 Screen sharing stopped");
      } catch (err) {
        console.error("Stop Screen Share Error:", err);
      }
    }
  };


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{t("liveClass")}</h2>
        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>ID: {meetingId}</div>
      </header>
      
      {initError && <div className={styles.errorBanner}>⚠️ {initError}</div>}
      
      <main className={styles.videoGrid}>
        <div className={styles.remoteVideoContainer}>
          <video ref={remoteVideoRef} className={styles.remoteVideo} autoPlay playsInline />
          <div className={styles.label}>{userRole === "teacher" ? t("remoteUserS") : t("remoteUserT")}</div>
        </div>

        <div className={styles.localVideoContainer}>
          <video ref={localVideoRef} className={styles.localVideo} autoPlay muted playsInline />
          <div className={styles.label}>{t("you")}</div>
        </div>

        {/* شريط الأدوات الجديد */}
        <div className={styles.controls}>
          <button 
            className={`${styles.controlBtn} ${!micOn ? styles.activeOff : ''}`} 
            onClick={toggleMic}
            title={micOn ? t("muteMic") : t("unmuteMic")}
          >
            {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>

          <button 
            className={`${styles.controlBtn} ${!cameraOn ? styles.activeOff : ''}`} 
            onClick={toggleCamera}
            title={cameraOn ? t("disableCamera") : t("enableCamera")}
          >
            {cameraOn ? <FaVideo /> : <FaVideoSlash />}
          </button>

          <button 
          className={`${styles.controlBtn} ${isSharingScreen ? styles.shareBtnActive : ''}`} 
          onClick={toggleScreenShare}
          title={isSharingScreen ? t("stopShare") : t("shareScreen")}
          >
            <FaDesktop />
          </button>

          <button 
            className={`${styles.controlBtn} ${styles.leaveBtn}`} 
            onClick={leaveRoom}
          >
            <FaPhoneSlash style={{marginRight: '8px'}} /> {t("leave")}
          </button>
        </div>
      </main>
    </div>
  );
}