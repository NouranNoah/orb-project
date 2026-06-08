'use client';

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./Home.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useImagePath } from "@/lib/useImagePath";
import ExploreSection from "./ExploreSection";
import TodayLessons from "./TodayLessons";
import Link from "next/link";
import LessonsMayBenefit from "./LessonsMayBenefit";

export default function HomePage() {
    const t = useTranslations("homeStudent");
    const [name, setName] = useState("");
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    useEffect(() => {
        const userName = Cookies.get("nameUser") || "";
        setName(userName);
    }, []);

  return (
    <div className={styles.home}>
        <TodayLessons />
        <LessonsMayBenefit />
        {/* <ExploreSection /> */}
    </div>
  );
}
