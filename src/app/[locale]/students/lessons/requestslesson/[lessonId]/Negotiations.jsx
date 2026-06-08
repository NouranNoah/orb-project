'use client'
import { GetAllMsgs } from '@/services/lessons.service'
import { connectSocket } from '@/services/socket.service'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState, useRef } from 'react'
import styles from "./RequestsLesson.module.css"
import Cookies from "js-cookie"
import PaymentMethod from './PaymentMethod'

export default function Negotiations({ threadId ,onAccept ,onReject , lessonId, teacherId, onAccepted}) {

    const t = useTranslations("requestsLessonPage")
    const currentUserId = Cookies.get("idUser")
    
    const [activeMsgId, setActiveMsgId] = useState(null)
    const [msgStatus, setMsgStatus] = useState({})

    const [loadingMsgs, setLoadingMsgs] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [msgList, setMsgList] = useState([])

    const bottomRef = useRef(null)
    const socketRef = useRef(null)

    const [showAccepted, setShowAccepted] = useState(false)
    const [flagPay , setFlagPay] = useState(false);

    /* ================= Format Time ================= */
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    /* ================= Fetch Messages ================= */
    const getMsgs = async () => {
        if (!threadId) return

        setLoadingMsgs(true)
        setErrorMsg("")

        try {
            const res = await GetAllMsgs(threadId)
            setMsgList(res.data.data || [])
        } catch (err) {
            console.log("err", err)
            setErrorMsg(t("failedGetMsgs"))
        } finally {
            setLoadingMsgs(false)
        }
    }

    useEffect(() => {
        getMsgs()
    }, [threadId])

    /* ================= Socket ================= */
    useEffect(() => {
        if (!threadId) return

        const socket = connectSocket()
        socketRef.current = socket

        const joinThread = () => {
            socket.emit("joinThread", threadId)
        }

        if (socket.connected) joinThread()
        socket.on("connect", joinThread)

        /* ================= New Message ================= */
        socket.on("newMessage", (newMsg) => {

            setMsgList(prev => {
                const exists = prev.some(msg => msg._id === newMsg._id)
                if (exists) return prev
                return [...prev, newMsg]
            })

            /* Auto Reject Previous Offers */
            setMsgStatus(prev => {
                const updated = { ...prev }

                msgList.forEach(msg => {
                    const isDifferentUser =
                        msg.sender._id !== newMsg.sender._id

                    const isOffer =
                        msg.price && !prev[msg._id]

                    if (isDifferentUser && isOffer) {
                        updated[msg._id] = "rejected"
                    }
                })

                return updated
            })

        })
        /* ================= Offer Accepted ================= */
        socket.on("offerAccepted", (data) => {
            console.log("Offer Accepted:", data)

            setMsgStatus(prev => {
                const updated = { ...prev }

                let lastMsgId = null

                msgList.forEach(msg => {
                    const isMatch =
                        msg.price === data.price &&
                        msg.sender._id === data.acceptedBy

                    if (isMatch) {
                        lastMsgId = msg._id
                    }
                })

                if (lastMsgId) {
                    updated[lastMsgId] = "accepted"
                }

                return updated
            })

            /* show toast */
            
            onAccepted && onAccepted()
            setActiveMsgId(null)
        })

        /* ================= Offer Rejected ================= */
        socket.on("offerRejected", (data) => {
            console.log("Offer Rejected:", data)

            if (data.messageId) {
                setMsgStatus(prev => ({
                    ...prev,
                    [data.messageId]: "rejected"
                }))
            }

            setActiveMsgId(null)
        })

        return () => {
            socket.off("connect", joinThread)
            socket.off("newMessage")
            socket.off("offerAccepted")
            socket.off("offerRejected")
        }

    }, [threadId, msgList])

    /* ================= Auto Scroll ================= */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [msgList])

    /* ================= UI ================= */
    return (
        <div className={styles.negoWrapper}>
        {showAccepted && (
            <div className={styles.acceptedToast}>
                <div className={styles.toastBox}>
                    <i className={`fa-solid fa-circle-check ${styles.successIcon}`}></i>
                    <h4>تم قبول العرض</h4>
                    <p>يمكنك الآن إكمال عملية الدفع</p>

                    <button
                        className={styles.payBtn}
                        onClick={() => {
                            setShowAccepted(false)
                            setFlagPay(true)
                        }}
                    >
                        الذهاب للدفع
                    </button>
                </div>
            </div>
        )}
        {
            flagPay ? 
                <PaymentMethod
                    lessonId={lessonId}
                    teacherId={teacherId}
                />
            :
            msgList.length > 0 &&
            (
                <>
                {!loadingMsgs && errorMsg && (
                    <div className={styles.errorMsg}>{errorMsg}</div>
                )}

                {!loadingMsgs && !errorMsg && (
                    <>
                        <h5 className={styles.negoTitle}>{t("negoTitle")}</h5>

                        <div className={styles.msgListScrollable}>
                        {msgList.map((msg) => {
                            const isMe = msg.sender._id === currentUserId

                            return (
                            <div
                                key={msg._id}
                                className={`${styles.msgItem} ${isMe ? styles.myMsg : styles.otherMsg}`}
                            >
                                
                                <img
                                    src={msg.sender?.imageProfile || "/images/defultImg.jpg"}
                                    alt="user"
                                    className={styles.msgAvatar}
                                />

                                <div 
                                className={`
                                    ${styles.msgBubble}
                                    ${msgStatus[msg._id] === "accepted" ? styles.acceptedMsg : ""}
                                    ${msgStatus[msg._id] === "rejected" ? styles.rejectedMsg : ""}
                                `}
                                onClick={() => setActiveMsgId(msg._id)}
                                >

                                    <div className={styles.msgRow}>
                                        {!isMe ? (
                                            <>
                                                <p className={styles.msgName}>
                                                    {msg.sender.firstName} {msg.sender.lastName}
                                                </p>
                                                <p className={styles.msgText}>
                                                    {msg.message || `${t("offerT")} : ${msg.price}`}
                                                </p>
                                            </>
                                        ) : (
                                            <p className={styles.msgText}>
                                                {msg.message || `${t("Youroffer")} : ${msg.price}`}
                                            </p>
                                        )}

                                        {!isMe &&
                                            activeMsgId === msg._id &&
                                            !msgStatus[msg._id] && (
                                                <div className={styles.offerActions}>

                                                    <button
                                                        className={styles.rejectBtn}
                                                        onClick={() => {
                                                            setMsgStatus(prev => ({
                                                                ...prev,
                                                                [msg._id]: "rejected"
                                                            }))
                                                            onReject(msg._id)
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>

                                                    <button
                                                        className={styles.acceptBtn}
                                                        onClick={() => {
                                                            setMsgStatus(prev => ({
                                                                ...prev,
                                                                [msg._id]: "accepted"
                                                            }))
                                                            onAccept(msg._id)
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>

                                                </div>
                                            )}
                                    </div>

                                    {msgStatus[msg._id] === "accepted" && (
                                        <div className={styles.acceptedBadge}>
                                            تم قبول العرض ✓
                                        </div>
                                    )}

                                    {msgStatus[msg._id] === "rejected" && (
                                        <div className={styles.rejectedBadge}>
                                            تم رفض العرض ✕
                                        </div>
                                    )}

                                    <span className={styles.msgTime}>
                                        {formatTime(msg.createdAt)}
                                    </span>

                                </div>
                            </div>
                            )
                        })}
                        <div ref={bottomRef} />
                        </div>
                    </>
                )}
                </>
            )
        }
        </div>
    )
}