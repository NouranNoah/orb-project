'use client'
import React from 'react'
import styles from '../../../../students/lessons/lessons.module.css'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl';

export default function PopUp({ onClose }) {

    const router = useRouter();
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'ar';
    const t = useTranslations("createlessonOffer")
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <div className={styles.iconWrapper}>
                    <i className="fa-solid fa-circle-check"></i>
                </div>

                <h2>{t("titlePopUp")}</h2>

                <p>{t("descriptionPopUp")}</p>

                <div className={styles.actions}>

                    <button
                        className={styles.primaryBtn}
                        onClick={() => router.push(`/${locale}/teachers/home`)}
                    >
                      {t("btnBack")}
                    </button>

                    <button
                        className={styles.secondaryBtn}
                        onClick={onClose}
                    >
                      {t("btnShow")}
                    </button>

                </div>

                <span className={styles.close} onClick={onClose}>✕</span>

            </div>
        </div>
    )
}
