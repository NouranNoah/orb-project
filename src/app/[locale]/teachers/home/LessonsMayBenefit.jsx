"use client";
import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { getLessonsRequestsForTeacher } from '@/services';
import styles from './Home.module.css';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from "next/navigation";

export default function LessonsMayBenefit() {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(6);

    const t = useTranslations("HomePageTeacher");
    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    const fetchLessons = async (limitValue = 6) => {
        try {
            setLoading(true);

            const res = await getLessonsRequestsForTeacher(limitValue);

            console.log("Lessons", res?.data?.data);

            setLessons(res?.data?.data || []);
        } catch (err) {
            console.error("Error fetching lessons:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons(6);
    }, []);

    if (loading) return <div className={styles.loader}>جاري التحميل...</div>;

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>{t("lessonsMayBenefit")}</h3>

                <button
                    className={styles.viewAll}
                    onClick={() => {
                        setLimit(50);
                        fetchLessons(50);
                    }}
                >
                    {t("viewAll")}
                </button>
            </div>

            <div className={styles.grid}>
                {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <div key={lesson._id} className={styles.benefitCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.studentInfo}>
                                    <img
                                        src={
                                            lesson.student?.imageProfile ||
                                            "/images/default-avatar.png"
                                        }
                                        alt="student"
                                        className={styles.studentImg}
                                    />

                                    <span className={styles.studentLabel}>
                                        {t("student")} .{" "}
                                        {lesson.student?.firstName}{" "}
                                        {lesson.student?.lastName}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.lessonTitle}>
                                    {lesson.subject} . {lesson.title}
                                </h3>

                                <p className={styles.academicInfo}>
                                    {lesson.student?.studentProfile?.grade} .{" "}
                                    {lesson.student?.studentProfile?.education_system}
                                </p>

                                <div className={styles.metaRow}>
                                    <div className={styles.metaItem}>
                                        <div className={styles.iconBox}>
                                            <i className="fa-solid fa-calendar-check"></i>
                                        </div>

                                        <span>
                                            {new Date(
                                                lesson.requestedDate
                                            ).toLocaleDateString("ar-EG", {
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </span>
                                    </div>

                                    <div className={styles.metaItem}>
                                        <div className={styles.iconBox}>
                                            <i className="fa-regular fa-clock"></i>
                                        </div>

                                        <span>
                                            {new Date(
                                                lesson.requestedDate
                                            ).toLocaleTimeString("ar-EG", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <div className={styles.metaItem}>
                                        <div className={styles.iconBox}>
                                            <i className="fa-solid fa-hourglass-half"></i>
                                        </div>

                                        <span>
                                            {lesson.durationInMinutes} {t("min")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <button
                                    className={styles.applyBtn}
                                    onClick={() =>
                                        router.push(
                                            `/${locale}/teachers/lessons/submitoffer/${lesson._id}?data=${encodeURIComponent(JSON.stringify(lesson))}`
                                        )
                                    }
                                >
                                    {t("sendOffer")}
                                </button>

                                <div className={styles.offersInfo}>
                                    <span className={styles.offersText}>
                                        {lesson.offers?.length > 0
                                            ? `${lesson.offers.length} ${t("teachersOffered")}`
                                            : t("beFirstToOffer")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        {t("noLessonsInYourSubject")}
                    </div>
                )}
            </div>
        </section>
    );
}