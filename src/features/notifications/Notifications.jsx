"use client";

import React, { useEffect, useState } from "react";
import styles from "./Noti.module.css";
import { getAllNotifications, markNotificationAsRead, deleteNotification, deleteAllNotifications } from "@/services/notifications";
import { useTranslations } from "next-intl";
import { connectSocket } from "@/services";

export default function Notifications() {
  const t = useTranslations("notifications");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getAllNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.log(err);
      setError(t("failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // الاستماع للإشعارات الجديدة عبر socket
    const socket = connectSocket();
    socket.on("new_notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, []);

  const handleMarkAsRead = async (notification) => {
    if (notification.read) return; // إذا كان مقروء بالفعل
    
    try {
      await markNotificationAsRead(notification._id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id
            ? { ...n, read: true }
            : n
        )
      );
    } catch (err) {
      console.log("Failed to mark as read", err);
    }
  };

  const handleDeleteNotification = async (id) => {
    setDeleting(id);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log("Failed to delete notification", err);
      alert("فشل حذف الإشعار");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!confirm("هل تريد حذف جميع الإشعارات?")) return;
    
    setDeleting("all");
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.log("Failed to delete all notifications", err);
      alert("فشل حذف الإشعارات");
    } finally {
      setDeleting(null);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>{t("title")}</h2>
          <span className={styles.count}>
            {unreadCount > 0 && unreadCount}
          </span>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={handleDeleteAllNotifications}
            disabled={deleting === "all"}
            className={styles.deleteAllBtn}
          >
            {deleting === "all" ? "جاري الحذف..." : "حذف الكل"}
          </button>
        )}
      </div>

      {loading && <p className={styles.loading}>جاري التحميل...</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && notifications.length === 0 && (
        <div className={styles.empty}>
          <p>{t("noNotifications")}</p>
        </div>
      )}

      <div className={styles.list}>
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`${styles.card} ${n.read ? styles.read : styles.unread}`}
          >
            <div className={styles.icon}>🔔</div>

            <div className={styles.content} onClick={() => handleMarkAsRead(n)}>
              <p className={styles.title}>
                {n.title || "إشعار جديد"}
              </p>

              <p className={styles.body}>
                {n.body || n.message || ""}
              </p>
            </div>

            <span className={styles.time}>
              {n.createdAt
                ? new Date(n.createdAt).toLocaleString("ar-EG")
                : ""}
            </span>

            <button
              className={styles.deleteBtn}
              onClick={() => handleDeleteNotification(n._id)}
              disabled={deleting === n._id}
            >
              {deleting === n._id ? "..." : "✕"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}