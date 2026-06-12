'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './lessontime.module.css'

import UpcomingLessons from './upcoming/UpcomingLessons'
import CompletedLessons from './completed/CompletedLessons'
import ProblemLessons from './issues/ProblemLessons'
import YourOffers from './youroffers/YourOffers'

function LessonsContent() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'upcoming'

  return (
    <div className={styles.content}>
      {activeTab === "yourOffer" && <YourOffers />}
      {activeTab === "upcoming" && <UpcomingLessons />}
      {activeTab === "completed" && <CompletedLessons />}
      {activeTab === "problem" && <ProblemLessons />}
    </div>
  )
}

export default function LessonsTimePage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<div>Loading...</div>}>
        <LessonsContent />
      </Suspense>
    </div>
  )
}
