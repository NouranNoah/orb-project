import React, { useEffect, useState } from 'react'
import { upcomingLessonFun } from "@/services/lessons.service"
import styles from "./Home.module.css"
import { useTranslations } from "next-intl"
import { usePathname ,useRouter } from 'next/navigation';

export default function TodayLessons() {
  const [dataLessons, setDataLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const t = useTranslations("HomePageTeacher");
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'ar';

  const getTodayLessons = async () => {
    setLoading(true);
    setErrorMsg("");

    // الحصول على تاريخ اليوم بتنسيق YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const params = {
        page: 1, // الصفحة الأولى
        limit: 10, // عدد النتائج
        fromDate: today, // بداية اليوم
        toDate: today,   // نهاية اليوم
        sort: "requestedDate" // ترتيب حسب وقت البدء
    };

    try {
        const res = await upcomingLessonFun(params);
        const lessons = (res.data.data || []).filter(l => 
            ["booked", "confirmed"].includes(l.lessonState)
        );
        // هنا الداتا راجعة مفلترة جاهزة من السيرفر
        setDataLessons(lessons);
    } catch (err) {
        console.error("Error fetching lessons:", err);
        setErrorMsg(t("errorUpcomingLesson"));
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    getTodayLessons();
  }, []);

  const getAllupCommingLessons = () => {
    router.push(`/${locale}/teachers/lessons/lessonstime`)
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3>{t("todayLessons")}</h3>
        <button className={styles.viewAll} onClick={getAllupCommingLessons} >
          {t("viewAll")}
        </button>
      </div>

      <div className={styles.grid}>
        {dataLessons.length > 0 ? (
          dataLessons.map((lesson) => (
            <div key={lesson._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.subjectInfo}>
                  <span className={styles.category}>{lesson.subject}</span>
                  <h4 className={styles.lessonTitle}>{lesson.title}</h4>
                </div>
                <button className={styles.joinBtn}>{t("join")}</button>
              </div>
              
              <div className={styles.cardBottom}>
                <div className={styles.userInfo}>
                  <img 
                    src={lesson.student?.imageProfile || "/user-placeholder.png"} 
                    alt="student" 
                  />
                  <span>
                    {lesson.student?.firstName} {lesson.student?.lastName}
                  </span>
                </div>
                <div className={styles.timeInfo}>
                   <i className="fa-regular fa-clock" style={{marginLeft: '5px'}}></i>
                   <span>
                     {new Date(lesson.requestedDate).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                     })}
                   </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noData}>{t("noLessons")}</p>
        )}
      </div>
    </section>
  );
}