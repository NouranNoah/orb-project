import { paymentFunction } from "@/services";
import styles from "./RequestsLesson.module.css"
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

export default function PaymentMethod({lessonId,teacherId}) {
    const t = useTranslations("requestsLessonPage");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [method, setMethod] = useState(""); 
    

    const choosePayment = async () => {
        if (!method) {
            setErrorMsg("اختاري طريقة الدفع");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await paymentFunction(lessonId);

            console.log("Payment Created:", res.data);
            localStorage.setItem("paymentId", res.data.data.paymentId);


            window.location.href = res.data.data.redirectUrl;

        } catch (err) {
            setErrorMsg(
            err?.response?.data?.message || err.message || t("failedPayment")
            );
        } finally {
            setLoading(false);
        }
    };
  return (
    <div>
        <h4>{t("paymentTitle")}</h4>
        {errorMsg && <div className='errMsg'>{errorMsg}</div>}
        <div className={styles.PayOptions}>
            <button onClick={() => setMethod("wallet")}
                className={method === "wallet" ? styles.active : ""}
                >{t("Payment1")}</button>
            <button onClick={() => setMethod("card")}
                className={method === "card" ? styles.active : ""}
                >{t("Payment2")}</button>
            <button onClick={() => setMethod("cash")}
                className={method === "cash" ? styles.active : ""}
                >{t("Payment3")}</button>
            <button onClick={() => setMethod("bank")}
                className={method === "bank" ? styles.active : ""}
                >{t("Payment4")}</button>
        </div>
        <p className={styles.note}>{t("paymentDescription")}</p>
        <button
            className={styles.confirmBtn}
            onClick={choosePayment}
            disabled={loading}
        >
            {loading ? <span className="spinner"></span> : t("submit")}
        </button>
    </div>
  )
}
