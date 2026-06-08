'use client'
import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import { useParams } from 'next/navigation'
import { getReviwsForTeacher, getSingleTeachers } from '@/services/teachers.service'
import { useTranslations } from 'next-intl'
import Cookies from "js-cookie";

export default function ProfileTeacher() {

  const t = useTranslations("profilePage");
  const params = useParams();
  const teacherId = params?.teacherId;
  const token = Cookies.get("token");
  console.log(token);
  
  const [dataProfile, setDataProfile] = useState(null)
  const [reviews, setDataReviews] = useState([])

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)

  const [errorProfile, setErrorProfile] = useState('')
  const [errorReviews, setErrorReviews] = useState('')

  useEffect(() => {
    if (!teacherId) return;

    const getProfileData = async () => {
      try {
        const res = await getSingleTeachers(teacherId);
        setDataProfile(res.data.data[0]);
        
      } catch (err) {
        setErrorProfile(t("failedData"));
      } finally {
        setLoadingProfile(false);
      }
    }

    const getReviewsData = async () => {
      try {
        const res = await getReviwsForTeacher(teacherId);
        setDataReviews(res.data.data);
      } catch (err) {
        setErrorReviews(t("failedReviewsData"));
      } finally {
        setLoadingReviews(false);
      }
    }

    getProfileData();
    getReviewsData();

  }, [teacherId])

  const profile = dataProfile?.teacherProfile || {};
  console.log(profile.education_system);
  

  return (
    <div className={styles.teacherPage}>

      {/* ================= HERO ================= */}

      {loadingProfile ? (
        <div className={styles.heroSkeleton}></div>
      ) : errorProfile ? (
        <div className={styles.errorBox}>{errorProfile}</div>
      ) : (
        <>
        <section className={styles.hero}>

          <div className={styles.heroContent}>

            <div className={styles.profileImageWrapper}>
              <img
                src={dataProfile?.imageProfile || "/images/defultImg.jpg"}
                alt="teacher"
              />
            </div>

            <div className={styles.heroText}>
              <h1>{dataProfile?.firstName} {dataProfile?.lastName}</h1>

              <div className={styles.rating}>
                <i className="fa-solid fa-star"></i>
                <span>{dataProfile?.avgRating || 0}</span>
              </div>

              <div className={styles.subjects}>
                {profile.subjects?.map((sub, index) => (
                  <span key={index} className={styles.chip}>{sub}</span>
                ))}
              </div>

            </div>

          </div>

        </section>
        {/* ================= CONTENT ================= */}
        <section className={styles.infoCards}>

          <div className={styles.infoCard}>
            <h4>{t("education_system")}</h4>
            {profile.education_system?.map((sys, i) => (
              <span key={i} className={styles.smallChip}>{sys}</span>
            ))}
          </div>

          <div className={styles.infoCard}>
            <h4>{t("academic_stages")}</h4>
            {profile.academic_stages?.map((stage, i) => (
              <span key={i} className={styles.smallChip}>{stage}</span>
            ))}
          </div>

          <div className={styles.infoCard}>
            <h4>{t("school")}</h4>
            <p>{profile.school}</p>
          </div>

          <div className={styles.priceCard}>
            <h3>{profile.pricePerHour} EGP</h3>
            <span>{t("pricePerHour")}</span>
          </div>

        </section>
        </>
      )}


      <div className={styles.container}>

        {/* ABOUT */}
        {loadingProfile ? (
          <div className={styles.skeletonBlock}></div>
        ) : (
          <section className={styles.about}>
            <h2>{t("about")}</h2>
            <p>{profile.bio}</p>
          </section>
        )}

        {/* ================= REVIEWS ================= */}

        <section className={styles.reviews}>
          <h2>{t("Reviews")}</h2>

          {loadingReviews ? (
            <div className={styles.skeletonBlock}></div>
          ) : errorReviews ? (
            <div className={styles.errorBox}>{errorReviews}</div>
          ) : reviews.length === 0 ? (
            <div className={styles.emptyState}>
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                <h4>{review?.student?.firstName} {review?.student?.lastName}</h4>
                <p>⭐ {review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  )
}
