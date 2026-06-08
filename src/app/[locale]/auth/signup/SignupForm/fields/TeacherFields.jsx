import styles from "../../signUp.module.css";
import { EDUCATION_SYSTEMS, ACADEMIC_STAGES, SUBJECTS } from "../constants";
import Select from "react-select";

export default function TeacherFields({mode, formData, setFormData, setTeacherProfile, teacherProfile, errors, t }) {
    // SUBJECTS قد تحتوي تكرار (زي Physical Education) — نعرضها مرة واحدة فقط في الـ UI
    const subjectOptions = [...new Set(SUBJECTS)].map((s) => ({ value: s, label: s }));
    const selectedSubjects = (teacherProfile.subjects || [])
      .filter((s) => typeof s === "string" && s.trim().length > 0)
      .map((s) => ({ value: s, label: s }));

    const toggleAcademicStage = (stage) => {
        const stages = [...teacherProfile.academic_stages];
        const index = stages.indexOf(stage);
        if (index > -1) {
            stages.splice(index, 1);
        } else {
            stages.push(stage);
        }
        setTeacherProfile({ ...teacherProfile, academic_stages: stages });
    };

    const toggleEducationSystem = (system) => {
        const systems = [...teacherProfile.education_system];
        const index = systems.indexOf(system);
        if (index > -1) {
            systems.splice(index, 1);
        } else {
            systems.push(system);
        }
        setTeacherProfile({ ...teacherProfile, education_system: systems });
    };

    if (mode === "academic") {
        return (
        <>
            {/* Multi-select Education System */}
            <div className={styles.formGroup}>
            <label>{t("educationSystem")}</label>
            <div className={errors.teacherEducationSystem ? styles.checkboxGroupError : styles.checkboxGroup}>
                {EDUCATION_SYSTEMS.map((system) => (
                <label key={system} className={styles.checkboxLabel}>
                    <input
                    type="checkbox"
                    checked={teacherProfile.education_system.includes(system)}
                    onChange={() => toggleEducationSystem(system)}
                    />
                    {system}
                </label>
                ))}
            </div>
            {errors.teacherEducationSystem && (
                <span className={styles.errorText}>{errors.teacherEducationSystem}</span>
            )}
            </div>

            {/* Academic Stages */}
            <div className={styles.formGroup}>
                <label>{t("academicStages")}</label>
                <div className={errors.academicStages ? styles.checkboxGroupError : styles.checkboxGroup}>
                {ACADEMIC_STAGES.map((stage) => (
                    <label key={stage} className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={teacherProfile.academic_stages.includes(stage)}
                        onChange={() => toggleAcademicStage(stage)}
                    />
                    {stage}
                    </label>
                ))}
                </div>
                {errors.academicStages && <span className={styles.errorText}>{errors.academicStages}</span>}
            </div>

            {/* Subjects */}
            <div className={styles.formGroup}>
                <label>{t("subjects")}</label>
                <div className={styles.subCenBtn}>
                  <div style={{ width: "100%" }}>
                    <Select
                      isMulti
                      options={subjectOptions}
                      value={selectedSubjects}
                      onChange={(values) =>
                        setTeacherProfile({
                          ...teacherProfile,
                          subjects: (values || []).map((v) => v.value),
                        })
                      }
                      classNamePrefix="rs"
                      placeholder={t("subjects")}
                      closeMenuOnSelect={false}
                      isOptionDisabled={() =>
                        (teacherProfile.subjects || []).filter((s) => s && String(s).trim()).length >= 3
                      }
                    />
                    {errors.subjects && (
                      <span className={styles.errorText}>{errors.subjects}</span>
                    )}
                    {(teacherProfile.subjects || []).filter((s) => s && String(s).trim()).length >= 3 && (
                      <span className={styles.errorText}>{t("maxSubjects")}</span>
                    )}
                  </div>
                </div>
            </div>
        </>
        )
    }

    if (mode === "details") {
    return (
        <>
            <div className={styles.rowinputs}>
            
                {/* Experience Years */}
                <div className={styles.formGroup}>
                    <label>{t("experienceYears")}</label>
                    <input
                    type="number"
                    min="0"
                    value={teacherProfile.experienceYears || 0}
                    onChange={(e) =>
                        setTeacherProfile({ ...teacherProfile, experienceYears: e.target.value })
                    }
                    />
                </div>

                {/* Price */}
                <div className={styles.formGroup}>
                    <label>{t("pricePerHour")}</label>
                    <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={teacherProfile.pricePerHour || 0}
                    onChange={(e) =>
                        setTeacherProfile({ ...teacherProfile, pricePerHour: e.target.value })
                    }
                    className={errors.pricePerHour ? styles.error : ""}
                    />
                    {errors.pricePerHour && <span className={styles.errorText}>{errors.pricePerHour}</span>}
                </div>
            </div>

            {/* Bio */}
            <div className={styles.formGroup}>
                <label>{t("bio")}</label>
                <textarea
                value={teacherProfile.bio}
                onChange={(e) =>
                    setTeacherProfile({ ...teacherProfile, bio: e.target.value })
                }
                rows="4"
                className={errors.bio ? styles.error : ""}
                />
                {errors.bio && <span className={styles.errorText}>{errors.bio}</span>}
            </div>


            <div className={styles.rowinputs}>
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

                {/* Certificate */}
                <div className={styles.formGroup}>
                    <label>{t("certificate")}</label>
                    <div className={errors.certificate ? styles.errorchooseimgProfile : styles.chooseimgProfile}>
                    {teacherProfile.certificate ? (
                        <div>
                        <i
                            className="fa-solid fa-xmark close"
                            onClick={() =>
                            setTeacherProfile({ ...teacherProfile, certificate: null })
                            }
                        ></i>

                        {teacherProfile.certificate.type.startsWith("image/") ? (
                            <img
                            src={URL.createObjectURL(teacherProfile.certificate)}
                            alt="certificate"
                            className={styles.profileImagePreview}
                            />
                        ) : (
                            <div className={styles.pdfPreview}>
                            <i className="fa-solid fa-file-pdf"></i>
                            <p>{teacherProfile.certificate.name}</p>
                            </div>
                        )}
                        </div>
                    ) : (
                        <div>
                        <p>{t("Upload")}</p>
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            className={styles.fileInput}
                            onChange={(e) => {
                            setTeacherProfile({
                                ...teacherProfile,
                                certificate: e.target.files[0],
                            });
                            }}
                        />
                        </div>
                    )}
                    </div>
                    {errors.certificate && (
                    <span className={styles.errorText}>{errors.certificate}</span>
                    )}
                </div>
            </div>
        </>
    )} 
}
