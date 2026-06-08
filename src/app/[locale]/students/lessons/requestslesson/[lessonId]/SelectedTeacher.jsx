import React, { useEffect, useState } from 'react'
import styles from './RequestsLesson.module.css'
import { useTranslations } from 'next-intl';
import Negotiations from '../[lessonId]/Negotiations';
import { AcceptOfferFun, chooseTeacherFun, getLessonDetails, RejectOfferFun, SendMsgFun } from '@/services/lessons.service';
import PaymentMethod from '../[lessonId]/PaymentMethod';

export default function SelectedTeacher({openPayment,threadId,lessonId, selectedTeacher, onClose}) {
    const t = useTranslations("requestsLessonPage");

    const [isOfferAccepted , setIsOfferAccepted] = useState(false)
    
    const [inputData, setInputData] = useState({
        price:0
    });

    const [errorMsg , setErrorMsg] = useState("");
    const [errorsendMsg , setsendErrorMsg] = useState("");
    const [errorMsgP , setErrorMsgP] = useState("");
    const [loading , setLoading] = useState(false);
    const [loadingMsg , setLoadingMsg] = useState(false);
    const [loadingConfirm , setLoadingConfirm] = useState(false);
    const [loadingChoose , setLoadingChoose] = useState(false);
    const [flagPay , setFlagPay] = useState(false);
    const [showPOP , setShowPOP] = useState(true);


    const shouldShowPayment = flagPay || openPayment
    const [dateLesson , setDateLesson] = useState(null);

    
    const getDataLesson = async() => {
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

    useEffect(()=>{
        getDataLesson();
    },[])

    const sendMsg = async()=>{

        setLoadingMsg(true);
        setsendErrorMsg("");
        console.log("id",threadId);
        console.log("ms",inputData);
        
        
        try{
            const res = await SendMsgFun(threadId,inputData);
            console.log("sendedDone");
            setInputData({
                price:0
            });
        }catch(err){
            console.log(err.response);
            setsendErrorMsg(t("failedSend"));
        }finally{
            setLoadingMsg(false);
        }
    }

    const ConfirmOffer = async (messageId)=>{
        setLoadingConfirm(true);
        console.log("ConfirmOffer", messageId);
        
        try{
            await AcceptOfferFun(threadId, messageId);
        }catch(err){
            setErrorMsgP(t("failedConfirm"));
        }finally{
            setLoadingConfirm(false);
        }
    }


    const RejectOffer = async (messageId)=>{
        console.log("RejectOffer", messageId);
        try{
            await RejectOfferFun(messageId);
        }catch(err){
            setErrorMsgP(t("failedConfirm"));
        }
    }

    
    const chooseTeacher = async ()=>{
        setLoadingChoose(true);
        console.log("chooseTeacher", selectedTeacher._id);
        
        try{
            const res = await chooseTeacherFun(lessonId, selectedTeacher._id);
            console.log("choosed Teacher Done",res);
            setFlagPay(true);
        }catch(err){
            console.log(err);
            
            setErrorMsgP(t("failedConfirm"));
        }finally{
            setLoadingChoose(false);
        }
    }

    
console.log("show",shouldShowPayment);

  return (
    <div className={styles.modal}>

        {/* Close */}
        <button
            className={styles.closeBtn}
            onClick={() => onClose()}
        >
            <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Teacher Info */}
        <div className={styles.modalTeacher}>

            <img
            src={selectedTeacher?.imageProfile}
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
                <i className="fa-solid fa-star"></i> {selectedTeacher?.teacherProfile.avgRating}
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


        {/* <h4>{t("titlePopUp")}</h4> */}
        {/* Counter Offer */}
        
        {(shouldShowPayment || isOfferAccepted) && (
            <>
            {
                showPOP && (
                    <div className={styles.acceptedToast}>
                        <div className={styles.toastBox}>
                            <i className={`fa-solid fa-circle-check ${styles.successIcon}`}></i>
                            <h4>تم قبول العرض</h4>
                            <p>يمكنك الآن إكمال عملية الدفع</p>

                            <button
                                className={styles.payBtn}
                                onClick={() => {
                                    setShowPOP(false);
                                }}
                            >
                                الذهاب للدفع
                            </button>
                        </div>
                    </div>
                )
            }
            <PaymentMethod
                lessonId={lessonId}
                teacherId={selectedTeacher?._id}
            />
            </>
        )}
        {
            !isOfferAccepted &&(
                <div className={styles.counterBox}>

                    <label>{t("titleInput")}</label>

                    <div className={styles.counterInput}>
                    <input
                        type="number"
                        value={inputData.price}
                        placeholder={t("inputplaceholder")}
                        onChange={(e)=> {setInputData({...inputData, price: parseFloat(e.target.value) || 0})}}
                    />
                    
                    <button className={styles.sendBtn} onClick={()=> sendMsg()}>
                        {loadingMsg ? <span className="spinner"></span> : t("btnSend")}
                    </button>
                    </div>
                    {errorsendMsg && <div className='errMsg'>{errorsendMsg}</div>}
                    <div>
                        <Negotiations  threadId={threadId}  onAccept={ConfirmOffer} onReject={RejectOffer} lessonId={lessonId}
                        teacherId={selectedTeacher?._id} onAccepted={() => setIsOfferAccepted(true)}/>
                    </div>
                </div>
            )
        }
        
        {
            errorMsgP && <div className='errMsg'>{errorMsgP}</div>
        }

        {
            !shouldShowPayment && !isOfferAccepted && (
                <button className={styles.confirmBtn} onClick={()=> chooseTeacher()}>
                    {loadingChoose ? <span className="spinner"></span> : t("bookBtn")}
                </button>
            )
        }
    </div>
)}
