"use client"

import { useTranslations } from "next-intl"
import styles from "../lessontime.module.css"
import stylesq from "../../requestslesson/[lessonId]/RequestsLesson.module.css"
import { usePathname, useRouter } from "next/navigation"

export default function LessonCard({ lesson }) {

    const t = useTranslations("lessonstimepage")
    const router = useRouter()
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    const now = new Date()
    const lessonTime = lesson.meetingStartTime || lesson.requestedDate
    const meetingStart = new Date(lessonTime)
    const isLessonStarted = now >= meetingStart

    const canJoinMeeting =
        lesson.paymentStatus === "paid" &&
        isLessonStarted

  /* ================= Format Date ================= */

    const formatDate = (dateString) => {

        const date = new Date(dateString)

        const day = date.getDate()

        const month = date.toLocaleDateString("ar-EG", {
        month: "long"
        })

        return `${day} ${month}`
    }

  /* ================= Format Time ================= */

    const formatTime = (dateString) => {

        const date = new Date(dateString)

        return date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
        })
    }

  /* ================= Lesson State Badge ================= */

    const renderState = () => {

        switch (lesson.lessonState) {

        case "waiting_teacher":
            return <span className={styles.badgeGray} onClick={()=> router.push(`/${locale}/students/lessons/requestslesson/${lesson._id}`)}>{t("waitingTeacher")}</span>

        case "awaiting_payment":
            return <span className={styles.badgeOrange} onClick={()=> router.push(`/${locale}/students/lessons/requestslesson/${lesson._id}`)}>{t("awaitingPayment")}</span>

        case "confirmed":
        case "booked":
            return <span className={styles.badgeGreen}>{t("confirmed")}</span>
        
        case "live":
            return <span className={styles.badgeLive}>Live now</span>

        default:
            return null
        }
    }

  /* ================= Go To Meeting ================= */

    const goToMeeting = () => {

        if (!canJoinMeeting) return

        router.push(`/${locale}/students/lessons/meeting/lobby/${lesson._id}`)
    }

    
    const getCountdown = (dateString) => {

        const now = new Date()
        const target = new Date(dateString)

        const diff = target - now

        if(diff <= 0) return null

        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if(hours > 0){
        return `${hours}h ${remainingMinutes}m`
        }

        return `${remainingMinutes}m`
    }

    const countdown = getCountdown(lessonTime)

  return (

    <div className={styles.lessonCard}>

      {/* Lesson State */}
      <div className={styles.lessonState}>
        {renderState()}
      </div>

      {/* teacher info */}

      {lesson.acceptedTeacher && (

        <div className={styles.teacherInfo}>

          <div className={styles.teacherText}>

            <div className={styles.row}>

              <h3>
                {lesson.acceptedTeacher.firstName} {lesson.acceptedTeacher.lastName}
              </h3>

              <div className={styles.rating}>
                <i className="fa-solid fa-star"></i>{" "}
                {lesson.acceptedTeacher.teacherProfile?.avgRating || 0}
              </div>

            </div>

            <p className={styles.subject}>
              {lesson.subject}
            </p>

            <p className={styles.price}>
              {t("price")} :
              <span> {lesson.price} {t("currency")}</span>
            </p>

          </div>

          <img
            src={lesson.acceptedTeacher.imageProfile || "/images/defultImg.jpg"}
            alt="teacher"
          />

        </div>

      )}

      <div className={styles.divider}></div>

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

      {countdown && !isLessonStarted && (

        <div className={styles.countdown}>

          <i className="fa-solid fa-hourglass-start"></i>

          {t("StartsIn")} {countdown}

        </div>

      )}

      <div className={styles.text}>

        <span>
          <span className={styles.texts}>{t("subject")} :</span>
          {lesson.subject}
        </span>

        <p>
          <span className={styles.texts}>{t("title")} :</span>
          {lesson.title}
        </p>

      </div>

      <button
        className={`${styles.startBtn} ${!canJoinMeeting ? styles.disabledBtn : ""}`}
        disabled={!canJoinMeeting}
        onClick={goToMeeting}
      >

        {canJoinMeeting
          ? t("start")
          : lesson.lessonState === "awaiting_payment"
            ? t("payFirst")
            : t("notYet")
        }

      </button>

    </div>

  )
}