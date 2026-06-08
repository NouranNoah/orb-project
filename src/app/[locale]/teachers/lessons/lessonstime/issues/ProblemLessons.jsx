// "use client"

// import React,{useEffect,useState} from "react"
// import { getProblematicLessons } from "@/services/lessons.service"

// export default function IssuesLessons(){

// const [issues,setIssues] = useState([])
// const [loading,setLoading] = useState(false)

// const fetchIssues = async()=>{

// setLoading(true)

// try{

// const res = await getProblematicLessons({
// page:1,
// limit:10
// })

// setIssues(res.data.data)

// }catch(err){
// console.log(err)
// }

// finally{
// setLoading(false)
// }

// }

// useEffect(()=>{
// fetchIssues()
// },[])

// return(

// <div>

// <h2>Problematic Lessons</h2>

// {loading && <p>Loading...</p>}

// {issues.map((issue)=>{

// const lesson = issue.lesson

// return(

// <div key={issue._id} className="lessonCard">

// <h3>{lesson.title}</h3>

// <p>{lesson.subject}</p>

// <p>{lesson.price}</p>

// <p>Status: {issue.reviewStatus}</p>

// <p>{issue.description}</p>

// </div>

// )

// })}

// </div>

// )

// }
"use client"

import React, { useEffect, useMemo, useState } from "react"
import styles from "../lessontime.module.css"
import LessonCard from "@/components/lessoncard/LessonCard"
import { useTranslations } from "next-intl"
import stylesq from "../../../../students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import TeacherCardSkeleton from "@/app/[locale]/students/lessons/requestslesson/[lessonId]/CardSkeleton"
import { getProblematicLessons } from "@/services"

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
          _id: "65ab1234cd89ef0011223344",
          reviewStatus: "disputed",
          completionStatus: "incomplete",
          description: "Teacher did not join the session.",
          createdAt: "2025-01-10T15:30:00.000Z",
          lesson: {
            _id: "6740123abc12de4567f00001",
            title: "Algebra Basics",
            subject: "Math",
            price: 200,
            durationInMinutes: 60,
            requestedDate: "2025-01-09T18:00:00.000Z"
            },
            acceptedTeacher: {
            firstName: "Ahmed",
            lastName: "Ali",
            email: "teacher@example.com"
        }
        },
        {
          _id: "65ab1234cd89ef0011223341",
          reviewStatus: "disputed",
          completionStatus: "incomplete",
          description: "Teacher did not join the session.",
          createdAt: "2025-01-10T15:30:00.000Z",
          lesson: {
            _id: "6740123abc12de4567f00001",
            title: "Algebra Basics",
            subject: "Math",
            price: 200,
            durationInMinutes: 60,
            requestedDate: "2025-01-09T18:00:00.000Z"
            },
            acceptedTeacher: {
            firstName: "Ahmed",
            lastName: "Ali",
            email: "teacher@example.com"
        }
        },
        {
          _id: "65ab1234cd89ef0011223342",
          reviewStatus: "disputed",
          completionStatus: "incomplete",
          description: "Teacher did not join the session.",
          createdAt: "2025-01-10T15:30:00.000Z",
          lesson: {
            _id: "6740123abc12de4567f00001",
            title: "Algebra Basics",
            subject: "Math",
            price: 200,
            durationInMinutes: 60,
            requestedDate: "2025-01-09T18:00:00.000Z"
            },
            acceptedTeacher: {
            firstName: "Ahmed",
            lastName: "Ali",
            email: "teacher@example.com"
        }
        },
        {
          _id: "65ab1234cd89ef0011223343",
          reviewStatus: "disputed",
          completionStatus: "incomplete",
          description: "Teacher did not join the session.",
          createdAt: "2025-01-10T15:30:00.000Z",
          lesson: {
            _id: "6740123abc12de4567f00001",
            title: "Algebra Basics",
            subject: "Math",
            price: 200,
            durationInMinutes: 60,
            requestedDate: "2025-01-09T18:00:00.000Z"
            }
            ,
            acceptedTeacher: {
            firstName: "Ahmed",
            lastName: "Ali",
            email: "teacher@example.com"
        }
        },
        {
          _id: "65ab1234cd89ef0011223345",
          reviewStatus: "disputed",
          completionStatus: "incomplete",
          description: "Teacher did not join the session.",
          createdAt: "2025-01-10T15:30:00.000Z",
          lesson: {
            _id: "6740123abc12de4567f00001",
            title: "Algebra Basics",
            subject: "Math",
            price: 200,
            durationInMinutes: 60,
            requestedDate: "2025-01-09T18:00:00.000Z"
            },
            acceptedTeacher: {
            firstName: "Ahmed",
            lastName: "Ali",
            email: "teacher@example.com"
        }
        }
    ]
  const fetchIssues = async()=>{
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

      const res = await getProblematicLessons(params);
      const { data, totalPages } = res.data;
      setDataLessons(data || []);
      setTotalPages(totalPages || 1);
      console.log('problems',res.data);
        
    }catch(err){
      console.log(err)
      setErrorMsg(t("errorUpcomingLesson"))
    }finally{
      setLoading(false)
    }
  }

useEffect(()=>{
  fetchIssues()
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
    <p className={stylesq.note} style={{marginBottom:"3%"}}>{t("noteP")}</p>
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
    status="incomplete"
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