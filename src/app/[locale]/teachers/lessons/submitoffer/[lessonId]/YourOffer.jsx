"use client";
import React, { useEffect, useState } from "react";
import styles from "../YourOffer.module.css";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import stylesq from "../../../../students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import { getLessonDetailsT, respondToLessonRequest } from "@/services";
import { useTranslations } from "next-intl";
import PopUp from "./PopUp";

export default function YourOffer() {

  const idLessonO = useParams();
  const idLesson = idLessonO.lessonId;
  console.log('ded',idLesson);

  const searchParams = useSearchParams();
  const lessonData = searchParams.get("data");
  const parsedLesson = lessonData ? JSON.parse(decodeURIComponent(lessonData)) : null;
  
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')
  const [errorMsgsub, setErrorMsgsub] = useState('')

  
  const t = useTranslations("TeacherOffer");

  const [showModel, setShowModel] = useState(false)
  

  const handleSubmit = async () => {
    if(!price) {
      setErrorMsgsub(t("requiredPrice"));
      return;
    }
    try {
      setLoading(true);

      await respondToLessonRequest(idLesson, {
        response: "accept",
        proposedPrice: price,
      });
      console.log("done submit offer",price);
      setShowModel(true)
    } catch (err) {
      console.error(err);
      setErrorMsgsub(t("failedSend"));
    } finally {
      setLoading(false);
    }
  };


  const [dateLesson , setDateLesson] = useState(parsedLesson);
  const getDataLesson = async()=>{
          setLoading(true);
          setErrorMsg("");
  
          try{
              const res = await getLessonDetailsT(idLesson);
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
  
  useEffect(() => {
    if (!parsedLesson) {
      getDataLesson()
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* student info */}
        <div className={styles.header}>
          <img
            src={dateLesson?.student?.imageProfile || "/images/default-avatar.png"}
            className={styles.avatar}
          />

          <div>
            <p className={styles.studentName}>
              {dateLesson?.student?.firstName} {dateLesson?.student?.lastName}
            </p>
            <h3 className={styles.dateLessonTitle}>
              {dateLesson?.subject} . {dateLesson?.title}
            </h3>
            <p className={styles.grade}>
              {dateLesson?.student?.studentProfile?.grade}
            </p>
          </div>
        </div>

        <div className={styles.meta}>
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

      {/* price input */}
      <div className={styles.priceSection}>
        <label>{t("price")}</label>

        <input
          type="number"
          placeholder={t("pricePlaceholder")}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.input}
          required
        />

        <p className={stylesq.note} style={{marginTop:"3%"}}>
          {t("noteP")}
        </p>
      </div>

      <div className="errorContainer">
        {errorMsgsub && <p className="errorMsg">{errorMsgsub}</p>}
      </div>
      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? t("loadingS") : t("submitOffer")}
      </button>

      {showModel && <PopUp onClose={() => setShowModel(false)}/>}
    </div>
  );
}