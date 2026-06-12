"use client";

import { useEffect, useState } from "react";
import styles from "./LayoutControls.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getAllNotifications } from "@/services/notifications";
import { connectSocket } from "@/services";

export default function FloatingNotification() {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';
    const [roleUser, setRoleUser] = useState("student");
    const [unreadCount, setUnreadCount] = useState(0);    

    useEffect(() => {
        const role = Cookies.get("roleUser");
        setRoleUser(role || "student"); 
    }, []);

    // get notifications from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getAllNotifications();
                const unread = res.data.data.filter((item) => !item.read);
                setUnreadCount(unread.length);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNotifications();
    }, []);

    // firebase realtime notification
    useEffect(() => {
        const init = async () => {
            const messaging = await getFirebaseMessaging();
            if (!messaging) return;
            onMessage(messaging, () => {
                setUnreadCount((prev) => prev + 1);
            });
        };
        init();
    }, []);

    // socket realtime notification
    useEffect(() => {
        const socket = connectSocket();
        socket.on("new_notification", () => {
            setUnreadCount((prev) => prev + 1);
        });
        return () => {
            socket.off("new_notification");
        };
    }, []);

    return (
        <Link 
            href={`/${locale}/${roleUser}s/notifications`}
            onClick={() => setUnreadCount(0)}
            className={styles.floatingNotification}
        >
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && (
                <span className={styles.badge}>
                    {unreadCount}
                </span>
            )}
        </Link>
    );
}
