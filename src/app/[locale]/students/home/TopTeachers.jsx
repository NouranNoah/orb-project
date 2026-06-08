'use client';

import { useTranslations } from 'next-intl';
import styles from "./Home.module.css";
import { useEffect, useState, useRef } from 'react';
import { getFilterTeachers } from '@/services/teachers.service';
import Image from 'next/image';
import { useImagePath } from '@/lib/useImagePath';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TopTeachers() {
    const t = useTranslations('homeStudent');
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef(null);
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';

    const defaultImg = useImagePath('/images/defultImg.jpg');

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await getFilterTeachers({
                    sort: "rate",
                    minRate:0,
                    limit: 10,
                });
                setTeachers(res.data.data || []);
            }
            catch(err){
                console.log(err);
            }finally {
                setIsLoading(false);
            }
        })();
    }, []);


    const scroll = (dir) => {
        sliderRef.current.scrollBy({
            left: dir === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    };

    function TeacherSkeleton() {
        return (
            <div className={styles.card}>
                <div className={`${styles.skeleton} ${styles.avatarSk}`} />
                <div className={`${styles.skeleton} ${styles.rateSk}`} />
                <div className={`${styles.skeleton} ${styles.nameSk}`} />
                <div className={styles.subjects}>
                    <span className={`${styles.skeleton} ${styles.subSk}`} />
                    <span className={`${styles.skeleton} ${styles.subSk}`} />
                </div>
            </div>
        );
    }


    return (
        <section className={styles.topTeachers}>
            <div className={styles.header}>
                <h2>{t("mostTeacher")}</h2>

                {/* <div className={styles.arrows}>
                    <button onClick={() => scroll('left')}><i class="fa-solid fa-angle-left"></i></button>
                    <button onClick={() => scroll('right')}><i class="fa-solid fa-angle-right"></i></button>
                </div> */}
            </div>

            {isLoading ? (
                <div className={styles.slider}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TeacherSkeleton key={i} />
                    ))}
                </div>
            ) : teachers.length === 0 ? (
                <p>{t("noData")}</p>
            ) : (
                <div ref={sliderRef} className={styles.slider}>
                    {teachers.map((teacher) => (
                        <div className={styles.card} key={teacher._id}>
                            <Image
                                src={
                                    teacher.imageProfile && teacher.imageProfile.startsWith('http')
                                        ? teacher.imageProfile
                                        : defaultImg
                                }
                                alt="Teacher"
                                width={90}
                                height={90}
                                className={styles.avatar}
                            />

                            <span className={styles.rate} dir={locale === "ar" ? "ltr" : "ltr"}>
                                <i className="fa-solid fa-star"></i> {teacher.avgRating || 0}
                            </span>

                            <h4>
                                {teacher.gender === 'female'
                                    ? teacher.preferredLang === 'en' ? 'Ms.' : 'أ.'
                                    : teacher.preferredLang === 'en' ? 'Mr.' : 'أ.'
                                } {teacher.firstName} {teacher.lastName}
                            </h4>

                            <div className={styles.subjects}>
                                {teacher.teacherProfile?.subjects?.slice(0, 3).map((s, i) => (
                                    <span key={i}>{s}</span>
                                ))}
                            </div>
                            <button className={styles.profileBtn}>
                                <Link
                                    key={teacher._id}
                                    href={`/${locale}/students/profile/profileteacher/${teacher._id}`}
                                    className={styles.cardLink}
                                >
                                    {t("viewProfile")} 
                                    <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.arrows} dir={locale === "ar" ? "ltr" : "ltr"}>
                <button onClick={() => scroll('left')}><i className="fa-solid fa-angle-left"></i></button>
                <button onClick={() => scroll('right')}><i className="fa-solid fa-angle-right"></i></button>
            </div>
        </section>
    );
}
