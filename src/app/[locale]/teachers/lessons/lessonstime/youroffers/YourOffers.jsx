import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useState } from 'react'
import styles from "../lessontime.module.css"
import stylesq from "../../../../students/lessons/requestslesson/[lessonId]/RequestsLesson.module.css"
import TeacherCardSkeleton from "@/app/[locale]/students/lessons/requestslesson/[lessonId]/CardSkeleton"
import { upcomingLessonFun } from "@/services/lessons.service"
import LessonCard from '../upcoming/LessonCard'


export default function YourOffers() {

    const t = useTranslations("lessonstimepage")
    
    const [dataLessons,setDataLessons] = useState([])
    const [subject,setSubject] = useState("")
    const [sort,setSort] = useState("requestedDate")

    const [loading,setLoading] = useState(false)
    const [errorMsg,setErrorMsg] = useState("")

    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)

    const LIMIT = 6;

    const subjects = useMemo(()=>{
        return [...new Set(dataLessons.map(l => l.subject))]
    },[dataLessons])

    const getUpComingLessons = async()=>{
    
    setLoading(true)
        setErrorMsg("")
    
        const params = {
            page,
            limit: LIMIT,
            sort
        }
    
        if(subject){
            params.subject = subject
        }
    
        try{
            const res = await upcomingLessonFun(params)
            const { data } = res.data;
            const lessons = (data || []).filter(l => 
                ["price_received"].includes(l.lessonState)
            );
            const calculatedTotalPages = Math.ceil(lessons.length / LIMIT) || 1;

            setDataLessons(lessons);
            setTotalPages(calculatedTotalPages);
            console.log('e',res.data);
        }catch(err){
            console.log(err)
            setErrorMsg(t("errorUpcomingLesson"))
        }finally{
            setLoading(false)
        }
    
    }
    
    
    useEffect(()=>{
        getUpComingLessons()
    },[page,subject,sort])
  return(
  
      <div>
  
      {/* filters */}
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
  
      )
  
  }