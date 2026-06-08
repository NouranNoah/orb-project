import styles from "../../signUp.module.css";
import { EDUCATION_SYSTEMS, GRADES } from "../constants";
export default function StudentFields({ formData, setFormData,setStudentProfile, studentProfile, errors, t }) {
  return (
    <div>
        <div className={styles.rowinputs}>
            <div className={styles.formGroup}>
                <label>{t("educationSystem")} </label>
                <select
                    value={studentProfile.education_system}
                    onChange={(e) =>
                        setStudentProfile({ ...studentProfile, education_system: e.target.value })
                    }
                    className={errors.studentEducationSystem ? styles.error : ""}
                >
                    <option value="">{t("selectEducationSystem")}</option>
                    {EDUCATION_SYSTEMS.map((system) => (
                        <option key={system} value={system}>
                            {system}
                        </option>
                    ))}
                </select>
                {errors.studentEducationSystem && (
                    <span className={styles.errorText}>{errors.studentEducationSystem}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label>{t("grade")} </label>
                <select
                    value={studentProfile.grade}
                    onChange={(e) =>
                        setStudentProfile({ ...studentProfile, grade: e.target.value })
                    }
                    className={errors.studentGrade ? styles.error : ""}
                >
                    <option value="">{t("selectGrade")}</option>
                    {GRADES.map((grade) => (
                        <option key={grade} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
                {errors.studentGrade && (
                    <span className={styles.errorText}>{errors.studentGrade}</span>
                )}
            </div>
        </div>

        {/* <div className={styles.formGroup}>
            <label>{t("school")}</label>
            <input
                type="text"
                value={studentProfile.school}
                onChange={(e) =>
                setStudentProfile({ ...studentProfile, school: e.target.value })
                }
            />
        </div> */}
        <div className={styles.formGroup}>
            <label>{t("imageProfile")}</label>
            <div className={styles.chooseimgProfile}>
                {formData.imageProfile ? (
                    <div>
                        <i className="fa-solid fa-xmark close" onClick={() => setFormData({...formData, imageProfile: null})}></i>
                        <img
                        src={URL.createObjectURL(formData.imageProfile)}
                        alt="Profile Preview"
                        className={styles.profileImagePreview}/>
                    </div>
                ):
                <div>
                    <p>{t("Upload")}</p>
                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                    <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={(e) => setFormData({ ...formData, imageProfile: e.target.files[0] })}
                    />
                </div>
                }
            </div>
        </div>
    </div>
  )
}
