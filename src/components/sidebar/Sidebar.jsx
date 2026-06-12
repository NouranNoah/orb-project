"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./Sidebar.module.css";

export default function Sidebar({ isOpen, setIsOpen, roleUser }) {
  const t = useTranslations("header");
  const tLessons = useTranslations("lessonstimepage");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.split('/')[1] || 'ar';
  
  const [lessonsExpanded, setLessonsExpanded] = useState(false);
  const currentTab = searchParams.get('tab') || 'upcoming';

  useEffect(() => {
    if (pathname.includes('/lessons')) {
      setLessonsExpanded(true);
    }
  }, [pathname]);
  
  const logoPath = "/logo.svg";

  const isActive = (href) => pathname.includes(href) ? styles.active : "";
  const isSubActive = (tabName) => currentTab === tabName && pathname.includes('lessonstime') ? styles.subActive : "";

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <Image
            src={logoPath} 
            alt="logo"
            width={80}
            height={40}
          />
          <span className={styles.brandName}>{t("EduPlatform")}</span>
        </div>

        <nav className={styles.nav}>
          <Link 
            href={`/${locale}/${roleUser}s/home`} 
            className={`${styles.navLink} ${isActive(`/${roleUser}s/home`)}`}
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-house"></i>
            <span>{t("home")}</span>
          </Link>
          
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navLink} ${pathname.includes('lessons') && !lessonsExpanded ? styles.active : (pathname.includes('lessons') ? styles.activeParent : "")}`}
              onClick={() => setLessonsExpanded(!lessonsExpanded)}
              style={{ width: "100%", justifyContent: "space-between", border: "none", background: "none", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <i className="fa-solid fa-book-open"></i>
                <span>{t("lesson")}</span>
              </div>
              <i className={`fa-solid fa-chevron-${lessonsExpanded ? 'up' : 'down'}`} style={{ fontSize: "12px", width: "auto" }}></i>
            </button>
            
            {lessonsExpanded && (
              <div className={styles.subMenu}>
                {roleUser === "teacher" && (
                  <Link 
                    href={`/${locale}/${roleUser}s/lessons/lessonstime?tab=yourOffer`} 
                    className={`${styles.subLink} ${isSubActive('yourOffer')}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{tLessons("b0")}</span>
                  </Link>
                )}
                <Link 
                  href={`/${locale}/${roleUser}s/lessons/lessonstime?tab=upcoming`} 
                  className={`${styles.subLink} ${isSubActive('upcoming')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{tLessons("b1")}</span>
                </Link>
                <Link 
                  href={`/${locale}/${roleUser}s/lessons/lessonstime?tab=completed`} 
                  className={`${styles.subLink} ${isSubActive('completed')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{tLessons("b2")}</span>
                </Link>
                <Link 
                  href={`/${locale}/${roleUser}s/lessons/lessonstime?tab=problem`} 
                  className={`${styles.subLink} ${isSubActive('problem')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{tLessons("b3")}</span>
                </Link>
              </div>
            )}
          </div>

          <Link 
            href={`/${locale}/${roleUser}s/payments`} 
            className={`${styles.navLink} ${isActive(`/${roleUser}s/payments`)}`}
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-wallet"></i>
            <span>{t("payments")}</span>
          </Link>

          <Link 
            href={`/${locale}/${roleUser}s/support`} 
            className={`${styles.navLink} ${isActive(`/${roleUser}s/support`)}`}
            onClick={() => setIsOpen(false)}
          >
            <i className="fa-solid fa-headset"></i>
            <span>{t("support")}</span>
          </Link>

          {roleUser === "student" && (
            <Link 
              href={`/${locale}/${roleUser}s/setting`} 
              className={`${styles.navLink} ${isActive(`/${roleUser}s/setting`)}`}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-gear"></i>
              <span>{t("setting")}</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
