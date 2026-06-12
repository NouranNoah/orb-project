"use client"

import { useEffect, useState } from "react"
import styles from "./ConfirmLesson.module.css"
import { useTranslations } from "next-intl"
import { CreateReview, sendCompletion } from "@/services/lessons.service"
import { useParams, usePathname ,useRouter } from "next/navigation"
import stylesq from "../../../app/[locale]/students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import stylesc from "../../../app/[locale]/students/lessons/lessons.module.css"

export default function ConfirmLesson({role}) {

    //const role = Cookies.get("roleUser");
    console.log("rr",role);

    const idLessonO = useParams();
    const idLesson = idLessonO.lessonId;

    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    const [attendance , setAttendance] = useState("")
    const [reasonForIncomplete , setReasonForIncomplete] = useState("")

    const [dataReview , setDataReview] = useState({
        lessonId: idLesson,
        rating: 0,
        comment: ""
    })

    const [rating , setRating] = useState(0)
    const [description, setDescription] = useState("")
    const [proofImage, setProofImage] = useState(null)

    const t = useTranslations("ConfirmLesson")

    const [loading,setLoading] = useState(false)
    const [errorMsg,setErrorMsg] = useState("")
    const [popUp, setPopUp]= useState(false);
    const [popUpCompletion, setPopUpCompletion]= useState(false);


    const SendAttendance = async ()=>{

        if(attendance === ""){
            setErrorMsg(t("ChosseFirst"));
            return
        }

        if(attendance === "incomplete" && !reasonForIncomplete){
            setErrorMsg(t("chooseReason"))
            return
        }

        if(role === "student" && rating === 0 && attendance === "completed" ){
            setErrorMsg(t("chooseRate"))
            return
        }

        setLoading(true);
        setErrorMsg("");

        try{

            await sendCompletion(idLesson,{
                completionStatus: attendance,
                reasonForIncomplete: attendance === "incomplete" 
                    ? reasonForIncomplete 
                    : undefined,
                description: description || undefined,
                proofImage: proofImage || undefined,
            });

            if(attendance === "completed"){
                await CreateReview(dataReview);
                setPopUp(true);
            }
            else{
                setPopUpCompletion(true);
            }

        }catch(err){
            console.error("sendCompletion error:", err, err?.response?.status, err?.response?.data);
            const status = err?.response?.status;
            if(status === 403){
                setErrorMsg(t("forbiddenError") || `Request failed with status ${status}`)
            } else {
                setErrorMsg(t("failsubmit") )
            }
        }finally{
            setLoading(false);
        }
    }


    useEffect(()=>{
        setDataReview(prev=>({
        ...prev,
        lessonId: idLesson
        }))
    },[idLesson])


return (

    <div className={styles.container}>

        <div className={styles.card}>

        <h2 className={styles.title}>{t("title")}</h2>

        <div className="errorContainer">
        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
        </div>

        <div className={styles.buttons}>

        <button 
        onClick={()=> { 
        setAttendance("completed") 
        setErrorMsg("")
        }}
        className={`${styles.btn} ${attendance === "completed" ? styles.successActive : ""}`}
        >
        {t("attendance")}
        </button>

        <button
        onClick={()=> {
        setAttendance("incomplete")
        setErrorMsg("")
        }}
        className={`${styles.btn} ${attendance === "incomplete" ? styles.dangerActive : ""}`}
        >
        {t("noattendance")}
        </button>

        </div>

        {/* Student only */}
        {role === "student" && attendance === "completed" && (

        <div className={styles.review}>

        <p className={styles.label}>{t("review")}</p>

        <div className={styles.stars}>
        {[1,2,3,4,5].map((star)=>(

        <span
        key={star}
        onClick={()=>{
        setRating(star)
        setDataReview(prev=>({...prev , rating: star}))
        }}
        className={star <= rating ? styles.starActive : ""}
        >
        <i className="fa-solid fa-star"></i>
        </span>

        ))}
        </div>

        <textarea 
        className={styles.textarea}
        placeholder={t("placeholder")}
        onChange={(e)=>setDataReview(prev=>({
        ...prev,
        comment: e.target.value
        }))}
        />

        </div>

        )}

        {/* reason */}
        {attendance === "incomplete" && (

        <div className={styles.selectWrapper}>

        <select 
        className={styles.select}
        onChange={(e)=> setReasonForIncomplete(e.target.value)}
        >

        <option value="">{t("selectWrapper")}</option>

        <option value="no_show_teacher">
        {t("selectWrapper1")}
        </option>
        <option value="no_show_student">
        {t("selectWrapper11")}
        </option>

        <option value="technical_issues_by_teacher">
        {t("selectWrapper2")}
        </option>
        <option value="technical_issues_by_student">
        {t("selectWrapper22")}
        </option>

        <option value="canceled_by_agreement">
        {t("selectWrapper3")}
        </option>

        <option value="other">
        {t("other")}
        </option>

        </select>

        <div className={styles.descriptionGroup}>
          <label className={styles.descriptionLabel}>{t("descriptionLabel")}</label>
          <textarea
            className={styles.textarea}
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.fileGroup}>
          <label className={styles.descriptionLabel}>{t("proofImageLabel")} ({t("optional")})</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofImage(e.target.files?.[0] || null)}
          />
          {proofImage && <p className={styles.fileName}>{proofImage.name}</p>}
        </div>

        <p className={stylesq.note}>{t('note')}</p>

        </div>

        )}

        <button 
        className={styles.submit} 
        onClick={SendAttendance}
        >

        {loading ?<span className="spinner"></span> : t("submit") }

        </button>

        </div>

        {/* popup incomplete */}
        {
            (popUpCompletion && 
                <div className={stylesc.overlay}>
                    <div className={stylesc.modal}>

                        <div className={stylesc.iconWrapper}>
                        <i className="fa-solid fa-circle-check"></i>
                        </div>

                        <h2>{t("titleProb")}</h2>

                        <p>{t("descriptionProb")}</p>

                        <div className={stylesc.actions}>

                        <button
                        className={stylesc.primaryBtn}
                        onClick={() => router.push(`/${locale}/${role}/home`)}
                        >
                        {t("btnBack")}
                        </button>

                        <button
                        className={stylesc.secondaryBtn}
                        onClick={() => setPopUp(true)}
                        >
                        {t("confirm")}
                        </button>

                    </div>

                    <span 
                    className={stylesc.close} 
                    onClick={()=> setPopUpCompletion(false)}
                    >
                    ✕
                    </span>

                    </div>
                </div>
            )
        }

        {/* popup done */}

        {
            (popUp && 
                <div className={stylesc.overlay}>
                    <div className={stylesc.modal}>

                        <div className={stylesc.iconWrapper}>
                        <i className="fa-solid fa-circle-check"></i>
                        </div>

                        <h2>
                        {attendance === "completed" 
                        ? t("titlePopUpDone") 
                        : t("titlePopUpProblem")}
                        </h2>

                        <p>
                        {attendance === "completed"
                        ? t("descriptionPopUpDone")
                        : t("descriptionPopUpProblem")}
                        </p>

                        <button
                        className={stylesc.secondaryBtn}
                        onClick={() => router.push(`/${locale}/${role}s/home`)}
                        >
                        {t("confirm")}
                        </button>

                        <span 
                        className={stylesc.close} 
                        onClick={()=> setPopUp(false)}
                        >
                        ✕
                        </span>

                    </div>
                </div>
            )
        }

    </div>

)

}