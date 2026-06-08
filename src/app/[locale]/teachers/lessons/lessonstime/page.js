'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './lessontime.module.css'

import UpcomingLessons from './upcoming/UpcomingLessons'
import CompletedLessons from './completed/CompletedLessons'
import ProblemLessons from './issues/ProblemLessons'
import YourOffers from './youroffers/YourOffers'

export default function LessonsTimePage() {

  const t = useTranslations("lessonstimepage")

  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className={styles.page}>

      {/* Tabs */}
      <div className={styles.tabs}>

        <button
          className={activeTab === "yourOffer" ? styles.active : ""}
          onClick={() => setActiveTab("yourOffer")}
        >
          {t("b0")}
        </button>

        <button
          className={activeTab === "upcoming" ? styles.active : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          {t("b1")}
        </button>

        <button
          className={activeTab === "completed" ? styles.active : ""}
          onClick={() => setActiveTab("completed")}
        >
          {t("b2")}
        </button>

        <button
          className={activeTab === "problem" ? styles.active : ""}
          onClick={() => setActiveTab("problem")}
        >
          {t("b3")}
        </button>

      </div>


      {/* Content */}
      <div className={styles.content}>

        {activeTab === "yourOffer" && <YourOffers />}
        {activeTab === "upcoming" && <UpcomingLessons />}

        {activeTab === "completed" && <CompletedLessons />}

        {activeTab === "problem" && <ProblemLessons />}

      </div>

    </div>
  )
}
