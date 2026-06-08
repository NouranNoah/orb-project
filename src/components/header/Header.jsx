"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getAllNotifications } from "@/services/notifications";
import { connectSocket } from "@/services";


export default function Header() {
    
    const t = useTranslations("header");
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';
    const [menuOpen, setMenuOpen] = useState(false);
    const [roleUser, setRoleUser] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);    
    const logoPath = "/logo.svg";
    const avatarPath = "/images/37.jpg";

    useEffect(() => {
        const role = Cookies.get("roleUser");
        setRoleUser(role || "student"); 
    }, []);

    const isActive = (href) => pathname.includes(href) ? styles.active : "";

    // get notifications from backend
    useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const res = await getAllNotifications();

            const unread = res.data.data.filter(
                (item) => !item.read
            );

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

    const isLoading = roleUser === null;
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/firebase-messaging-sw.js");
        }
    }, []);

    return (
        <header className={styles.header} dir={locale === "ar" ? "rtl" : "ltr"}>
            {isLoading ? (
            <header style={{ opacity: 0 }} />
        ) : (
            <>
            
                <div className={styles.left}>
                    <Image
                        src={logoPath} 
                        alt="logo"
                        width={100}
                        height={50}
                    />
                    <span className={styles.brand}>{t("EduPlatform")}</span>
                </div>

                <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                    <Link href={`/${locale}/${roleUser}s/home`} className={isActive(`/${roleUser}s/home`)}>{t("home")}</Link>
                    <Link href={`/${locale}/${roleUser}s/lessons/lessonstime`} className={isActive(`/${roleUser}s/lessons`)}>{t("lesson")}</Link>
                    <Link href={`/${locale}/${roleUser}s/payments`} className={isActive(`/${roleUser}s/payments`)}>{t("payments")}</Link>
                    <Link href={`/${locale}/${roleUser}s/support`} className={isActive(`/${roleUser}s/support`)}>{t("support")}</Link>
                    <Link href={`/${locale}/${roleUser}s/profile`} className={isActive(`/${roleUser}s/profile`)}>{t("profile")}</Link>
                    {roleUser === "student" && (
                        <Link href={`/${locale}/${roleUser}s/setting`} className={isActive(`/${roleUser}s/setting`)}>{t("setting")}</Link>
                    )}
                </nav>

                <div className={styles.right}>
                    <div className={styles.search}>
                        <input type="text" placeholder={t("search")} />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <button className={styles.iconBtn}>
                        <Link 
                            href={`/${locale}/${roleUser}s/notifications`}
                            onClick={() => setUnreadCount(0)}
                        >
                            <i className="fa-solid fa-bell"></i>

                            {unreadCount > 0 && (
                                <span className={styles.badge}>
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    </button>
                    
                    <div className={styles.avatar}>
                        <Link href={`/${locale}/${roleUser}s/profile`}>
                            <Image src={avatarPath} alt="profile" width={32} height={32} />
                        </Link>
                    </div>

                    <div className={styles.hamburger}>
                        <i className="fa-solid fa-bars" onClick={() => setMenuOpen(!menuOpen)}></i>
                    </div>
                </div>
            </>
        )}
        </header>
    );
}