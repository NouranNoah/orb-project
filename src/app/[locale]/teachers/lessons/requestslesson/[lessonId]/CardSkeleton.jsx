import styles from './RequestsLesson.module.css'

export default function TeacherCardSkeleton() {
  return (
    <div className={`${styles.card} ${styles.skeletonCard}`}>
        <div className={styles.cardTop}>
            <div className={styles.skeletonTextGroup}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonText}></div>
            <div className={styles.skeletonText}></div>
            </div>

            <div className={styles.skeletonAvatar}></div>
        </div>

        <div className={styles.cardBottom}>
            <div className={styles.skeletonSmall}></div>
            <div className={styles.skeletonButton}></div>
        </div>
    </div>
  )
}
