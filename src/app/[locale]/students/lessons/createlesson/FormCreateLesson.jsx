'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useImagePath } from '@/lib/useImagePath'
import styles from '../lessons.module.css'
import { useTranslations } from 'next-intl'
import { CreateNewLesson } from '@/services/lessons.service'
import { usePathname } from 'next/navigation'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import PopUp from './PopUp'
import { SUBJECTS_AR, SUBJECTS_EN } from '@/lib/subjects'

// منفصل responsibility: مجرد دالة للتحقق من صحة البيانات
const validateLessonData = ({ title, subject, price, duration,requestedDate, requestedTime }) => {
  const errors = {}
  if (!title) errors.title = true
  if (!subject) errors.subject = true
  if (!price || price <= 0) errors.price = true
  if (!duration) errors.duration = true
  if(!requestedDate) errors.requestedDate = true
  if (requestedDate !== "now" && !requestedTime) errors.requestedTime = true
//   if (date && !time) errors.time = true
//   if (!date && !time && date !== "now") errors.date = true
  return errors
}

// منفصل responsibility: دالة لتجهيز payload النهائي
const buildPayload = ({ title, subject, price, duration, requestedDate, requestedTime }) => {
  let finalDate
  if (requestedDate === "now") {
    finalDate = new Date().toISOString()
  } else if (requestedDate) {
    const date = new Date(requestedDate)
    if (requestedTime) {
      const [hours, minutes] = requestedTime.split(":")
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(0)
    }
    finalDate = date.toISOString()
  }
  return {
    durationInMinutes: duration,
    requestedDate: finalDate,
    price: Number(price),
    subject,
    title,
  }
}

export default function FormCreateLesson() {
    const t = useTranslations('createLessonForm')
    const locale = usePathname().split('/')[1] || 'ar'
    const subjectOptions = locale === 'ar' ? SUBJECTS_AR : SUBJECTS_EN

  // State للـ data الأساسية
    const [lessonData, setLessonData] = useState({
        title: '',
        subject: '',
        price: 0,
        duration: 0,
        requestedDate: '',
        requestedTime: ''
    })

  // State للـ UI
    const [loading, setLoading] = useState(false)
    const [showModel, setShowModel] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [activeNow, setActiveNow] = useState(false)
    const [activePick, setActivePick] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [errors, setErrors] = useState({})
    const [errorMsg, setErrorMsg] = useState('')

    const [lessonId , setLessonId]= useState(null);


    const clearForm = ()=>{
        setLessonData({
            title: '',
            subject: '',
            price: 0,
            duration: 0,
            requestedDate: '',
            requestedTime: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validateLessonData(lessonData)
        console.log(validationErrors);
        const d = buildPayload(lessonData)
        console.log("dwd",d);
        

        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        console.log("v",validationErrors);
        
        setErrorMsg(t('required'))
        return
        }

        setLoading(true)
        setErrorMsg('')
        const payload = buildPayload(lessonData)

        try {
        const res = await CreateNewLesson(payload)

        console.log('done',res.data.data._id);
        setLessonId(res.data.data._id);
        

        setShowModel(true)
        clearForm()
        } catch (err) {
        console.error(err)
        setErrorMsg(t('submitError') || 'Error sending lesson request')
        } finally {
        setLoading(false)
        }
    }

  return (
    <div className={styles.createLesson}>
      <div className={styles.formCreate}>
        <h2>{t('title')}</h2>
        <form onSubmit={handleSubmit}>

            <div className="errorContainer">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
            </div>

          <div className={styles.rowinputs}>
            <div className="formGroup">
              <label>{t('subject')}</label>
              <select
                className={errors.subject ? styles.errorInput : ''}
                value={lessonData.subject}
                onChange={e => setLessonData({ ...lessonData, subject: e.target.value })}
              >
                <option value="">{t('selectSuject')}</option>
                {subjectOptions.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>{t('price')}</label>
              <input
                type="number"
                min="0"
                value={lessonData.price}
                onChange={e => setLessonData({ ...lessonData, price: e.target.value })}
                className={errors.price ? styles.errorInput : ''}
              />
            </div>
          </div>

          <div className="formGroup">
            <label>{t('description')}</label>
            <textarea
              className={errors.title ? styles.errorInput : ''}
              value={lessonData.title}
              onChange={e => setLessonData({ ...lessonData, title: e.target.value })}
              rows={4}
              placeholder={t('descriptionPlaceholder')}
            />
          </div>

          <div className="formGroup">
            <label className={errors.duration ? styles.errorp : ''}>{t('duration')}</label>
            <div className={styles.timeDuration}>
              {[30, 45, 60, 90, 120].map(d => (
                <div
                  key={d}
                  onClick={() => setLessonData({ ...lessonData, duration: d })}
                  className={`${styles.durationItem} ${lessonData.duration === d ? styles.active : ''}`}
                >
                  {d} {t('unite')}
                </div>
              ))}
            </div>
          </div>

          <div className="formGroup">
            <label className={errors.requestedDate ? styles.errorp : ''}>{t('timeSubject')}</label>
            <div className={styles.rowiBts}>
              <button
                type="button"
                onClick={() => {
                  setLessonData({ ...lessonData, requestedDate: 'now', requestedTime: '' })
                  setActiveNow(true)
                  setActivePick(false)
                  setShowDatePicker(false)
                  setErrorMsg('')
                }}
                className={`${styles.btn1} ${activeNow ? styles.focusbtn1 : ''}`}
              >
                {t('TimenNow')} <i className="fa-solid fa-bolt"></i>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowDatePicker(true)
                  setActivePick(true)
                  setActiveNow(false)
                }}
                className={`${styles.btn2} ${activePick ? styles.focusbtn2 : ''}`}
              >
                {t('table')} <i className="fa-regular fa-calendar-days"></i>
              </button>
            </div>
          </div>

          {showDatePicker && (
            <div className={styles.rowinputs}>
              <div className="formGroup">
                <label>{t('timeLable')}</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={date => {
                    setSelectedDate(date)
                    setLessonData({ ...lessonData, requestedDate: date })
                  }}
                  dateFormat="yyyy/MM/dd"
                  placeholderText={t('selectDate')}
                  minDate={new Date()}
                  className={`${errors.requestedTime ? styles.errorInput : ''} ${styles.dateInput}`}
                />
              </div>

              <div className="formGroup">
                <label>{t('time')}</label>
                <input
                  type="time"
                  value={lessonData.requestedTime}
                  onChange={e => setLessonData({ ...lessonData, requestedTime: e.target.value })}
                  className={`${errors.requestedTime ? styles.errorInput : ''} ${styles.timeInput}`}
                />
              </div>
            </div>
          )}

          <p className={styles.note}>{t('note')}</p>
          <button type="submit" disabled={loading} className="submitBtn" style={{ width: '40%' }}>
            {loading ? <span className="spinner"></span> : <><i className="fa-solid fa-paper-plane"></i> {t('submit')}</>}
          </button>
        </form>
      </div>

      <div className={styles.cardImg}>
        <div className={styles.bookIcon}><i className="fa-solid fa-book"></i></div>
        <div className={styles.lapIcon}><i className="fa-solid fa-laptop"></i></div>
        <div className={styles.personIcon}><i className="fa-solid fa-person-chalkboard"></i></div>
        <div className={styles.grduIcon}><i className="fa-solid fa-graduation-cap"></i></div>
        <Image src={useImagePath("/images/imgCalenderr.png")} alt='image' width={250} height={450} />
        <div className={styles.chatIcon}><i className="fa-solid fa-comment-dots"></i></div>
        <div className={styles.chemiIcon}><i className="fa-solid fa-flask-vial"></i></div>
        <div className={styles.checkIcon}><i className="fa-solid fa-circle-check"></i></div>
      </div>

      {showModel && <PopUp onClose={() => setShowModel(false)}  lessonId={lessonId}/>}
    </div>
  )
}
