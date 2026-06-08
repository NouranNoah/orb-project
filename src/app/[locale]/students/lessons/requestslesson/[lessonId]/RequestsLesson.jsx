'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import styles from './RequestsLesson.module.css'
import { CreateOrGetThread, getLessonDetails, RequestLessons } from '@/services/lessons.service'
import { useTranslations } from 'next-intl'
import SelectedTeacher from '../[lessonId]/SelectedTeacher'
import { connectSocket } from '@/services/socket.service'

import { useParams } from 'next/navigation'
import TeacherCardSkeleton from './CardSkeleton'

export default function RequestsLesson() {

  const [teachersData, setTeachersData] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [threadId, setThreadId] = useState(null)
  const [sortType, setSortType] = useState("rating")
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [openPayment, setOpenPayment] = useState(false)

  const idLessonO = useParams();
  const idLesson = idLessonO.lessonId;
  console.log('ded',idLesson);
  

  const t = useTranslations("requestsLessonPage")

  /* ============================= */
  /* Fetch Teachers (Single Source of Truth) */
  /* ============================= */
  const getTeacherData = useCallback(async () => {
    if (!idLesson) return

    setLoading(true)
    setErrorMsg("")

    try {
      const res = await RequestLessons(idLesson)
      setTeachersData(res.data.data || [])
    } catch (err) {
      setErrorMsg(t("fail"))
    } finally {
      setLoading(false)
    }
  }, [idLesson, t])

  /* ============================= */
  /* Initial Fetch */
  /* ============================= */
  useEffect(() => {
    getTeacherData()
  }, [getTeacherData])

  /* ============================= */
  /* Real-Time Socket */
  /* ============================= */
  useEffect(() => {
    if (!idLesson) return

    const socket = connectSocket()
    console.log("ss",socket);
    
    const joinRoom = () => socket.emit("joinLesson", idLesson)

    if (socket.connected) {
      joinRoom()
    }
    socket.on("connect", joinRoom)

    socket.on("interestedTeachersUpdated", (data) => {
      if (data?.lessonId === idLesson) {
        getTeacherData()
      }
    })

    return () => {
      socket.off("connect", joinRoom)
      socket.off("interestedTeachersUpdated")
    }
  }, [idLesson, getTeacherData])

  /* ============================= */
  /* Sorting (Optimized) */
  /* ============================= */
  const sortedTeachers = useMemo(() => {
    return [...teachersData].sort((a, b) => {
      if (sortType === "rating") {
        return (b.teacherProfile?.avgRating || 0) - (a.teacherProfile?.avgRating || 0)
      }
      if (sortType === "price") {
        return (a.pricePerHour || 0) - (b.pricePerHour || 0)
      }
      return 0
    })
  }, [teachersData, sortType])

  /* ============================= */
  /* Thread Creation */
  /* ============================= */
  const getThreadId = async (lessonId, teacherId) => {
    try {
      const res = await CreateOrGetThread(lessonId, teacherId)
      console.log("start Thread",res.data.data._id);
      setThreadId(res.data.data._id)
    } catch (err) {
      console.log(err)
    }
  }

  const [dateLesson , setDateLesson] = useState(null);
  
  console.log("o",idLesson);
  const getDataLesson = async()=>{
    
      try{
          const res = await getLessonDetails(idLesson);
          setDateLesson(res.data.data);
      }catch(err){
          console.log(err);
      }finally{
      }
  }

  useEffect(()=>{
    getDataLesson();
  },[])

  useEffect(()=>{
    if(dateLesson?.acceptedTeacher){
      setSelectedTeacher(dateLesson.acceptedTeacher)
    }
    if(dateLesson?.meetingRoomId === null){
      console.log("opened");
      
      setOpenPayment(true)
    }
  },[dateLesson])

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h2>{t("title")}</h2>

        <select
          className={styles.sortSelect}
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="rating">{t("mostrating")}</option>
          <option value="price">{t("lowestPrice")}</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <TeacherCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="errorContainer">
              <p>{errorMsg}</p>
            </div>
          )}

          {sortedTeachers.length > 0 ? (
            <div className={styles.grid}>
              {sortedTeachers.map((teacher) => (
                <div key={teacher._id} className={`${styles.card} ${styles.fadeIn}`}>

                  <div className={styles.cardTop}>
                    <div>
                      <h3>{teacher.firstName} {teacher.lastName}</h3>

                      {teacher.teacherProfile?.subjects?.map((sub, i) => (
                        <p key={i}>{sub}</p>
                      ))}

                      <p className={styles.price}>
                        {t("price")} {teacher.proposedPrice || 0} {t("currency")}
                      </p>
                    </div>

                    <img
                      src={teacher.imageProfile || "/images/defultImg.jpg"}
                      alt="teacher"
                    />
                  </div>

                  <div className={styles.cardBottom}>
                    <span className={styles.rating}>
                      <i className="fa-solid fa-star"></i>{" "}
                      {teacher.teacherProfile?.avgRating || 0}
                    </span>

                    <button
                      className={styles.chooseBtn}
                      onClick={() => {
                        setSelectedTeacher(teacher)
                        setShowModal(true)
                        getThreadId(idLesson, teacher._id)
                      }}
                    >
                      {t("btnChoose")}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>
              <p>{t("noOffers")}</p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {(showModal || openPayment) && selectedTeacher && (

        <div className={styles.modalOverlay}>

          <SelectedTeacher
          openPayment={openPayment}
          lessonId={idLesson}
          threadId={threadId}
          selectedTeacher={selectedTeacher}
          onClose={()=>{
            setShowModal(false)
            setOpenPayment(false)
          }}
          />

        </div>

      )}

    </div>
  )
}
