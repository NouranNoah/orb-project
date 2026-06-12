'use client';

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./Home.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TopTeachers from "./TopTeachers";
import ExploreSection from "./ExploreSection";
import TodayLessons from "./TodayLessons";
import Link from "next/link";
import SearchBar from "@/components/common/SearchBar";

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
        <div className={styles.headHome}>
            <div className={styles.textBlock}>
                <h2>{t("welcom")} {name} 👋</h2>
                <p>{t("welcomMsg")}</p>

                <Link href={`/${locale}/students/lessons/createlesson`}>
                    <button className={styles.primaryBtn}>
                        <i className="fa-solid fa-file-circle-plus"></i>
                        <span>{t("addLesson")}</span>
                    </button>
                </Link>
            </div>
            {/* <Image src={locale=== 'en'? useImagePath('/images/arrowEn.png'):useImagePath('/images/arrowAr.png')} alt='homeImg'
                width={350}
                height={115}
                className={styles.arrow}
            /> */}
            <Image src={locale=== 'en'?    '/images/homeStudentEN.png': '/images/homeStudentAR.png'} alt='homeImg'
                width={650}
                height={235}
                className={styles.imHead}
            />
        </div>
        <SearchBar />
        <TopTeachers />
        <ExploreSection />
        <TodayLessons />
    </div>
  );
}
