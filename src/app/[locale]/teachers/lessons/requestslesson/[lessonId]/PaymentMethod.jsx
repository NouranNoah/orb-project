import { chooseTeacherFun } from "@/services/lessons.service";
import styles from "./RequestsLesson.module.css"
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

export default function PaymentMethod({lessonId,teacherId}) {
    const t = useTranslations("requestsLessonPage");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    

    const choosePayment = async()=>{
        setLoading(true);
        setErrorMsg("");
        try{
            const res = await chooseTeacherFun(lessonId,teacherId );
            console.log("choosed Payment Done",res);
            
        }catch(err){
            setErrorMsg(t("failedPayment"));
        }finally{
            setLoading(false);
        }
    }
  return (
    <div>
        <h4>{t("paymentTitle")}</h4>
        {errorMsg && <div className='errMsg'>{errorMsg}</div>}
        <div className={styles.PayOptions}>
            <button>{t("Payment1")}</button>
            <button>{t("Payment2")}</button>
            <button>{t("Payment3")}</button>
            <button>{t("Payment4")}</button>
        </div>
        <p className={styles.note}>{t("paymentDescription")}</p>
        <button className={styles.confirmBtn} onClick={()=> choosePayment()}>
            {
                loading ? 
                    <span className="spinner"></span>
                :
                    t("submit")
            }
        </button>
    </div>
  )
}
