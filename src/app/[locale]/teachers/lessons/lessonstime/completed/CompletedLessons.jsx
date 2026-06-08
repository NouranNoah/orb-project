"use client"

import React, { useEffect, useMemo, useState } from "react"
import { getCompletedLessons } from "@/services/lessons.service"
import styles from "../lessontime.module.css"
import LessonCard from "@/components/lessoncard/LessonCard"
import { useTranslations } from "next-intl"
import stylesq from "../../../../students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import TeacherCardSkeleton from "@/app/[locale]/students/lessons/requestslesson/[lessonId]/CardSkeleton"

const LIMIT = 10

export default function CompletedLessons() {
  const t = useTranslations("lessonstimepage")
  
  const [dataLessons,setDataLessons] = useState([])
  const [subject,setSubject] = useState("")
  const [sort,setSort] = useState("requestedDate")
  
  const [loading,setLoading] = useState(false)
  const [errorMsg,setErrorMsg] = useState("")
  
  const [page,setPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)
  
  
  // subjects memoized
  const subjects = useMemo(()=>{
      return [...new Set(dataLessons.map(l => l.subject))]
  },[dataLessons])

const mockLessons = [
        {
        _id: "1",
        title: "Algebra Basics",
        subject: "Math",
        price: 200,
        durationInMinutes: 60,
        requestedDate: "2025-01-10T15:00:00.000Z",
        acceptedTeacher: {
        firstName: "Ahmed",
        lastName: "Ali",
        teacherProfile: {
        avgRating: 4.8
        }
        }
        },
        {
        _id: "2",
        title: "Physics Fundamentals",
        subject: "Physics",
        price: 250,
        durationInMinutes: 45,
        requestedDate: "2025-01-08T13:30:00.000Z",
        acceptedTeacher: {
        firstName: "Sara",
        lastName: "Mohamed",
        teacherProfile: {
        avgRating: 4.6
        }
        }
        },
        {
        _id: "3",
        title: "English Grammar",
        subject: "English",
        price: 150,
        durationInMinutes: 30,
        requestedDate: "2025-01-05T11:00:00.000Z",
        acceptedTeacher: {
        firstName: "Omar",
        lastName: "Hassan",
        teacherProfile: {
        avgRating: 4.9
        }
        }
        }
    ]
  const fetchLessons = async ()=>{
    setLoading(true)

    try{
      const params = {
        page,
        limit: 10
      };

      if(sort === "desc"){
        params.sort = "-createdAt";
      } else {
        params.sort = "createdAt";
      }

      const res = await getCompletedLessons(params);
      const { data, totalPages } = res.data;
      setDataLessons(data || []);
      setTotalPages(totalPages || 1);
      console.log('completed',res.data);
      
    }catch(err){
      console.log(err)
      setErrorMsg(t("errorUpcomingLesson"))
    }

    finally{
      setLoading(false)
    }
  }

useEffect(()=>{
  fetchLessons()
},[page, sort])

return(
  <div>
    <div className={styles.filters}>

      <select
      value={subject}
      onChange={(e)=>{
      setPage(1)
      setSubject(e.target.value)
      }}
      >

      <option value="">
      {t("allSubjects")}
      </option>

      {subjects.map((sub,i)=>(
      <option key={i} value={sub}>
      {sub}
      </option>
      ))}

    </select>


    <select
    value={sort}
    onChange={(e)=>{
    setPage(1)
    setSort(e.target.value)
    }}
    >

    <option value="requestedDate">
    {t("oldestFirst")}
    </option>

    <option value="desc">
    {t("latestFirst")}
    </option>

    </select>

    </div>

    {/* lessons grid */}
    <div className={stylesq.grid}>

    {loading &&

    [...Array(LIMIT)].map((_,i)=>(
    <TeacherCardSkeleton key={i}/>
    ))

    }

    {!loading && errorMsg && (

    <div className="errorContainer">
    <p>{errorMsg}</p>
    </div>

    )}

    {!loading && !errorMsg && dataLessons.length === 0 && (

    <div className="noData">
    <p>{t("noLessonsYet")}</p>
    </div>

    )}

    {!loading && !errorMsg && dataLessons.map((lesson)=>(
    <LessonCard
    key={lesson._id}
    lesson={lesson}
    status="completed"
    />
    ))}
    </div>
    {/* pagination */}
    {totalPages > 1 && (

    <div className={styles.pagination}>

    <button
    className={styles.pageBtn}
    disabled={page === 1}
    onClick={()=>setPage(prev=>prev-1)}
    >
    <i className="fa-solid fa-angle-left"></i>
    </button>


    {/* page numbers */}

    <div className={styles.pageNumbers}>

    {Array.from({length: totalPages}, (_,i)=> i+1).map(num => (

    <button
    key={num}
    className={`${styles.pageNumber} ${page === num ? styles.activePage : ""}`}
    onClick={()=>setPage(num)}
    >
    {num}
    </button>

    ))}

    </div>


    <button
    className={styles.pageBtn}
    disabled={page === totalPages}
    onClick={()=>setPage(prev=>prev+1)}
    >
    <i className="fa-solid fa-angle-right"></i>
    </button>

    </div>

    )}
  </div>
)}