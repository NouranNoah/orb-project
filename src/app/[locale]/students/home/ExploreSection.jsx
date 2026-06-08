import { useTranslations } from 'next-intl'
import React from 'react'
import styles from './Home.module.css'
import Image from 'next/image';

export default function ExploreSection() {
  const t = useTranslations("homeStudent");
  return (
    <div className={styles.sectionExplore}>

      <h2>{t("exploreTitle")}</h2>

      <div className={styles.btnsExplore}>

        <div className={styles.boxBtn1}>
          <img src='/images/Ar.png' alt='icon'/>
          <button className={styles.btnExplore}>{t("Arabic")}</button>
        </div>
        
        <div className={styles.boxBtn2}>
          <img src='/images/ch.png' alt='icon'/>
          <button className={styles.btnExplore}>{t("chemistry")}</button>
        </div>

        <div className={styles.boxBtn3}>
          <img src='/images/ph.png' alt='icon'/>
          <button className={styles.btnExplore}>{t("physics")}</button>
        </div>

        <div className={styles.boxBtn4}>
          <img src='/images/En.png' alt='icon'/>
          <button className={styles.btnExplore}>{t("English")}</button>
        </div>

        <div className={styles.boxBtn5}>
          <img src='/images/math.png' alt='icon'/>
          <button className={styles.btnExplore}>{t("mathematics")}</button>
        </div>

      </div>
    </div>
  )
}
