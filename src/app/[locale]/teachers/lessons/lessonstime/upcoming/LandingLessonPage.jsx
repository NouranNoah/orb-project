"use client"
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../RequestsLesson/RequestsLesson.module.css'
import { getLessonDetails, RequestLessons } from '@/services/lessons.service';

export default function LandingLessonPage({idLesson}) {
    const t = useTranslations("requestsLessonPage");

    const [dateLesson , setDateLesson] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    

    const [errorMsg , setErrorMsg] = useState("");
    const [loading , setLoading] = useState(false);
    

    const getDataLesson = async()=>{
        setLoading(true);
        setErrorMsg("");

        try{
            const res = await getLessonDetails(lessonId);
            console.log(res.data.data);
            
            setDateLesson(res.data.data);
        }catch(err){
            console.log(err);
            setErrorMsg(t("failedLessonData"))
        }finally{
            setLoading(false);
        }
    }

    const formatDateParts = (dateString, locale = "ar-EG") => {
        if (!dateString) return {};

        const date = new Date(dateString);

        const dayMonth = date.toLocaleDateString(locale, {
            day: "numeric",
            month: "long"
        });

        const time = date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });


        return {
            dayMonth,
            time
        };
    };
    
    const { dayMonth, time } = formatDateParts(dateLesson?.requestedDate || null);


    const getTeacherData = (async () => {
        if (!idLesson) return
    
        setLoading(true)
        setErrorMsg("")
    
        try {
          const res = await RequestLessons(idLesson)
          setSelectedTeacher(res.data.data || [])
        } catch (err) {
          setErrorMsg(t("fail"))
        } finally {
          setLoading(false)
        }
    }, [idLesson, t])


    useEffect(()=>{
        getTeacherData();
        getDataLesson();
    },[])
  return (
    <div>
        <div className={styles.modalTeacher}>

            <img
            src={selectedTeacher?.imageProfile || "/images/defultImg.jpg"}
            alt="teacher"
            />

            <div>
            <h3>
                {selectedTeacher?.firstName} {selectedTeacher?.lastName}
            </h3>

            <p className={styles.modalPrice}>
                {t("price")} {selectedTeacher?.proposedPrice} {t("currency")}
            </p>

            <span className={styles.modalRating}>
                <i className="fa-solid fa-star"></i> {selectedTeacher?.teacherProfile?.avgRating}
            </span>
            </div>

        </div>

        {/* Lesson Info */}
        <div className={styles.lessonInfo}>
            {
                errorMsg && <div className='errMsg'>{errorMsg}</div>
            }
            {
                loading ? 
                <div className={styles.loading}>Loading...</div>
                :
                <>
                    <div>
                        <i className="fa-solid fa-calendar-days"></i>
                        {dayMonth}
                    </div>

                    <div>
                        <i className="fa-regular fa-clock"></i>
                        {time}
                    </div>

                    <div>
                        <i className="fa-solid fa-hourglass-half"></i>
                        {dateLesson?.durationInMinutes || 0} {t("unite")}
                    </div>
                
                </>
            }


        </div>
    </div>
  )
}
