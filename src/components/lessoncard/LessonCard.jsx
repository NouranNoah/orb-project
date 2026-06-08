import { useTranslations } from "next-intl";
import styles from "../../app/[locale]/students/lessons/lessonstime/lessontime.module.css";
import stylesq from "../../app/[locale]/students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css";

export default function LessonCard({lesson,status}){
    const t = useTranslations("lessonstimepage");

    const formatDate = (dateString) => {
        const date = new Date(dateString)

        const day = date.getDate()

        const month = date.toLocaleDateString("ar-EG", {
            month: "long"
        })

        return `${day} ${month}`
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)

        return date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }

return (
    <div className={styles.lessonCard}>
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
        
    
        <div className={stylesq.lessonInfo}>

            <div className={styles.detail}>
                <i className="fa-solid fa-calendar-days"></i>
                {formatDate(lesson.requestedDate)}
            </div>

            <div className={styles.detail}>
                <i className="fa-regular fa-clock"></i>
                {formatTime(lesson.requestedDate)}
            </div>

            <div className={styles.detail}>
                <i className="fa-solid fa-hourglass-half"></i>
                {lesson.durationInMinutes} {t("unite")}
            </div>

        </div>

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

        

        <div className={styles.allRa}>
            {
                status==="incomplete"?
                <p className={styles.probDes}>{lesson.description}</p>
                :
                <div className={styles.ratingWrapper}>
                    <span className={styles.ratingNumber}>
                        {t("yourRate")}
                    </span>
                    {[...Array(5)].map((_, i) => (

                        <i
                        key={i}
                        className={
                            i < Math.round(lesson.acceptedTeacher?.teacherProfile?.avgRating || 0)
                            ? "fa-solid fa-star"
                            : "fa-regular fa-star"
                        }
                        ></i>

                    ))}
                </div>
            }
            
            {status==="incomplete"?
            <p className={styles.statI}>{t("incomplete")}</p>
            :
            <p className={styles.statC}>{t("complete")}</p>
            }

        </div>

    </div>
)}

