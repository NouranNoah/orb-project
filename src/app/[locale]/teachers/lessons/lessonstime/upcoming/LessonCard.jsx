"use client"

import { useTranslations } from "next-intl"
import styles from "../lessontime.module.css" 
import stylesq from "../../../../students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import { usePathname, useRouter } from "next/navigation"
import { cancelLessonFun } from "@/services"
import { useState } from "react"

export default function TeacherLessonCard({ lesson }) {
    const t = useTranslations("lessonstimepage")
    const router = useRouter()
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    console.log("data",lesson);


    const [errorMsg , setErrorMsg] = useState("");
    const [loading , setLoading] = useState(false);

    const lessonTime = lesson.meetingStartTime || lesson.requestedDate
    const now = new Date()
    const meetingStart = new Date(lessonTime)
    
    // المدرس يقدر يدخل لو الحصة مدفوعة ووقتها بدأ
    const isLessonStarted = now >= meetingStart
    const canJoinMeeting = lesson.paymentStatus === "paid" && isLessonStarted

    /* ================= Formatters ================= */
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true })
    }

    /* ================= Teacher Routes ================= */
    const cancelLesson = async(id) => {
        setLoading(true)
        setErrorMsg("")
        try{
            await cancelLessonFun(id);
            router.refresh();
            console.log("deleted~!");
        }catch(err){
            console.log(err);
            setErrorMsg("Failed to cancel lesson.");
        }finally{
            setLoading(false);
        }
    }

    const goToMeeting = () => {
        if (!canJoinMeeting) return
        router.push(`/${locale}/teachers/lessons/meeting/lobby/${lesson._id}`)
    }

    /* ================= Countdown Logic ================= */
    const getCountdown = (dateString) => {
        const diff = new Date(dateString) - new Date()
        if (diff <= 0) return null
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
    }

    const countdown = getCountdown(lessonTime)

    return (
        <div className={styles.lessonCard}>
            <div className="errorContainer">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
            </div>
            {/* Status Badge */}
            <div className={styles.lessonState}>
                {lesson.lessonState === "confirmed" || lesson.lessonState === "booked" ? (
                    <span className={styles.badgeGreen}>{t("confirmed")}</span>
                ) : (
                    <span className={styles.badgeGray} onClick={() => cancelLesson(lesson._id)}>
                        {loading ? t("cancelLessonL") : t("cancelLesson")}
                    </span>
                )}
            </div>

            {/* Student Info (بدل Teacher Info) */}
            {lesson.student && (
                <div className={styles.teacherInfo}>
                    <div className={styles.teacherText}>
                        <div className={styles.row}>
                            <h3>
                                {lesson.student.firstName} {lesson.student.lastName}
                            </h3>
                        </div>
                        {/* Lesson Title Section */}
                        <div className={styles.text}>
                            <p>
                                <span className={styles.texts}>{t("lessonTitle")} :</span>
                                {lesson.title}
                            </p>
                            <p>
                                <span className={styles.texts}>{t("subject")} :</span>
                                {lesson.subject}
                            </p>
                        </div>
                        <p className={styles.price}>
                            {t("price")} : 
                            <span> {lesson.price} {t("currency")}</span>
                        </p>
                    </div>
                    <img
                        src={lesson.student.imageProfile || "/images/defultImg.jpg"}
                        alt="student"
                        className={styles.avatar}
                    />
                </div>
            )}

            <div className={styles.divider}></div>

            {/* Lesson Details */}
            <div className={stylesq.lessonInfo}>
                <div className={styles.detail}>
                    <i className="fa-solid fa-calendar-days"></i>
                    {formatDate(lessonTime)}
                </div>
                <div className={styles.detail}>
                    <i className="fa-regular fa-clock"></i>
                    {formatTime(lessonTime)}
                </div>
                <div className={styles.detail}>
                    <i className="fa-solid fa-hourglass-half"></i>
                    {lesson.durationInMinutes} {t("unite")}
                </div>
            </div>

            {/* Countdown */}
            {countdown && !isLessonStarted && (
                <div className={styles.countdown}>
                    <i className="fa-solid fa-hourglass-start"></i>
                    {t("StartsIn")} {countdown}
                </div>
            )}

            

            {/* Action Button */}
            {
                lesson.lessonState === "confirmed" || lesson.lessonState === "booked" ?
                <button
                    className={`${styles.startBtn} ${!canJoinMeeting ? styles.disabledBtn : ""}`}
                    disabled={!canJoinMeeting}
                    onClick={goToMeeting}
                >
                    {canJoinMeeting
                        ? t("start")
                        : lesson.paymentStatus !== "paid"
                            ? t("awaitingPayment")
                            : t("notYet")
                    }
                </button>
                :
                <button
                    className={styles.startBtn}
                    onClick={() => router.push(`/${locale}/teachers/lessons/requestslesson/${lesson._id}`)}
                >
                    {t("goNegotiations")}
                </button>

            }
            
        </div>
    )
}