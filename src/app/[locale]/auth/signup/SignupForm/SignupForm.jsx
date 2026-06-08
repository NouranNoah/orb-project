"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "../signUp.module.css";
import { registerRequest } from "@/features/auth/auth.service";

import CommonFields from "./fields/CommonFields";
import StudentFields from "./fields/StudentFields";
import TeacherFields from "./fields/TeacherFields";

import { validateCommon } from "./validation/common.validation";
import { validateStudent } from "./validation/student.validation";
import { validateTeacher, validateTeacherAcademic, validateTeacherDetails } from "./validation/teacher.validation";

import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { handleImageUpload } from "@/services/cloudinary";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupForm({ role, setErrorMsg, onSuccess, onError }) {
  const t = useTranslations("signup");
  const pathname = usePathname();
  const lan = pathname.split("/")[1];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("next");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    imageProfile: null
  });

  const [studentProfile, setStudentProfile] = useState({
    education_system: "",
    grade: ""
  });

  const [teacherProfile, setTeacherProfile] = useState({
    education_system: [],
    academic_stages: [],
    subjects: [],
    experienceYears: 0,
    bio: "",
    pricePerHour: 0,
    certificate: null
  });

  const isImageFile = (file) => file?.type?.startsWith("image/");

  // ✅ validation per step
  const validateStep = () => {
  let newErrors = {};

  // STEP 1
  if (step === 1) {
    newErrors = validateCommon(formData, t);
  }

  // STEP 2
  if (step === 2) {
    if (role === "student") {
      newErrors = validateStudent(studentProfile, t);
    }

    if (role === "teacher") {
      // 👇 بس الحاجات الأكاديمية
      newErrors = validateTeacherAcademic({
        education_system: teacherProfile.education_system,
        academic_stages: teacherProfile.academic_stages,
        subjects: teacherProfile.subjects
      }, t);
    }
  }

  // STEP 3 (teacher only)
  if (step === 3 && role === "teacher") {
    // 👇 باقي الداتا
    newErrors = validateTeacherDetails({
      experienceYears: teacherProfile.experienceYears,
      bio: teacherProfile.bio,
      pricePerHour: teacherProfile.pricePerHour,
      certificate: teacherProfile.certificate
    }, t);
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  const handleNext = () => {
    if (!validateStep()) return;
    setDirection("next");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection("back");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {
      ...validateCommon(formData, t)
    };

    if (role === "student") {
      newErrors = {
        ...newErrors,
        ...validateStudent(studentProfile, t)
      };
    }

    if (role === "teacher") {
      newErrors = {
        ...newErrors,
        ...validateTeacher(teacherProfile, t)
      };
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setErrorMsg("");

    try {
      let imageUrl;
      if (formData.imageProfile) {
        imageUrl = await handleImageUpload(formData.imageProfile);
      }

      let certificateValue = null;
      if (teacherProfile.certificate) {
        certificateValue = teacherProfile.certificate;
      }

      if (role === "teacher") {
        const formDataToSend = new FormData();

        formDataToSend.append("firstName", formData.firstName);
        formDataToSend.append("lastName", formData.lastName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confirmPassword", formData.confirmPassword);
        formDataToSend.append("teacherProfile.school", formData.school);
        formDataToSend.append("role", "teacher");
        formDataToSend.append("preferredLang", lan);

        if (formData.phone) formDataToSend.append("phone", formData.phone);
        if (formData.gender) formDataToSend.append("gender", formData.gender);
        if (imageUrl) formDataToSend.append("imageProfile", imageUrl);

        teacherProfile.education_system.forEach((s, i) =>
          formDataToSend.append(`teacherProfile.education_system[${i}]`, s)
        );

        teacherProfile.academic_stages.forEach((s, i) =>
          formDataToSend.append(`teacherProfile.academic_stages[${i}]`, s)
        );

        teacherProfile.subjects.forEach((s, i) =>
          formDataToSend.append(`teacherProfile.subjects[${i}]`, s)
        );

        formDataToSend.append("teacherProfile.bio", teacherProfile.bio);
        formDataToSend.append("teacherProfile.pricePerHour", teacherProfile.pricePerHour);
        formDataToSend.append("teacherProfile.experienceYears", teacherProfile.experienceYears);

        if (certificateValue) {
          formDataToSend.append("certificate", certificateValue);
        }

        const res = await registerRequest(formDataToSend);
        Cookies.set("emailUser", formData.email);
        onSuccess?.(res.data);
      } else {
        const res = await registerRequest({
          ...formData,
          role: "student",
          preferredLang: lan,
          studentProfile
        });

        Cookies.set("emailUser", formData.email);
        onSuccess?.(res.data);
      }
    } catch (err) {
      onError?.(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStep(1);
    setErrors({});
  }, [role]);

  const variants = {
    initial: (dir) => ({ x: dir === "next" ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir === "next" ? -100 : 100, opacity: 0 })
  };

  return (
    <div className={styles.formAuth}>
      <form onSubmit={handleSubmit} className={styles.formup}>
        
        {/* ================= STUDENT ================= */}
        {role === "student" && (
          <>
            <div className={styles.iconsActive}>
              <i className={`fa-solid fa-circle ${styles.iconActive}`}></i>
              <i className={`fa-solid fa-circle ${step === 2 ? styles.iconActive : ''}`}></i>
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div key="1" variants={variants} initial="initial" animate="animate" exit="exit" custom={direction}>
                  <CommonFields {...{ formData, setFormData, errors, t }} />
                  <button type="button" className="submitBtn" onClick={handleNext}>
                    {t("next")}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" variants={variants} initial="initial" animate="animate" exit="exit" custom={direction}>
                  <StudentFields {...{ studentProfile, setStudentProfile, formData, setFormData, errors, t }} />
                  <button type="button" className="submitBtn" onClick={handleBack}>
                    {t("back")}
                  </button>
                  <button type="submit" className="submitBtn">
                    {loading ? "..." : "Submit"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ================= TEACHER ================= */}
        {role === "teacher" && (
          <>
            <div className={styles.iconsActive}>
              <i className={`fa-solid fa-circle ${styles.iconActive}`}></i>
              <i className={`fa-solid fa-circle ${step >= 2 ? styles.iconActive : ''}`}></i>
              <i className={`fa-solid fa-circle ${step === 3 ? styles.iconActive : ''}`}></i>
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div key="1" variants={variants} initial="initial" animate="animate" exit="exit" custom={direction}>
                  <CommonFields {...{ formData, setFormData, errors, t }} />
                  <button type="button" className="submitBtn" onClick={handleNext}>
                    {t("next")}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="2" variants={variants} initial="initial" animate="animate" exit="exit" custom={direction}>
                  <TeacherFields {...{ teacherProfile, setTeacherProfile, formData, setFormData, errors, t }} mode="academic" />
                  <div className="dataRow">
                    <button type="button" className="submitBtn" onClick={handleBack}>
                      {t("back")}
                    </button>
                    <button type="button" className="submitBtn" onClick={handleNext}>
                      {t("next")}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="3" variants={variants} initial="initial" animate="animate" exit="exit" custom={direction}>
                  <TeacherFields {...{ teacherProfile, setTeacherProfile, formData, setFormData, errors, t }} mode="details" />
                  <div className="dataRow">
                    <button type="button" className="submitBtn" onClick={handleBack}>
                      {t("back")}
                    </button>
                    <button type="submit" className="submitBtn">
                      {loading ? "..." : "Submit"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </form>
    </div>
  );
}