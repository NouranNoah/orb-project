import { useState } from "react";
import styles from "../../signUp.module.css";

export default function CommonFields({ formData, setFormData, errors, t }) {
    const [flagPass,setFlagPass]= useState(false);
    const [flagPassCon,setFlagPassCon]= useState(false);
    return (
    <>
        <div className={styles.rowinputs}>
            <div className={styles.formGroup}>
                <label>{t("firstName")}</label>
                <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                    }
                    className={errors.firstName ? styles.error : ""}
                    // placeholder="Enter First Name"
                />
                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.formGroup}>
                <label>{t("lastName")}</label>
                <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={errors.lastName ? styles.error : ""}
                />
                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
        </div>

        <div className={styles.rowinputs}>
            <div className={styles.formGroup}>
                <label>{t("email")}</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                    }
                    className={errors.email ? styles.error : ""}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>
            {/* School */}
            <div className={styles.formGroup}>
                <label>{t("school")}</label>
                <input
                type="text"
                value={formData.school || ""}
                onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                }
                className={errors.school ? styles.error : ""}
                />
                {errors.school && <span className={styles.errorText}>{errors.school}</span>}
            </div>
        </div>

        <div className={styles.rowinputs}>
            <div className={styles.formGroup}>
                <label>{t("password")}</label>
                <div className={styles.passInput}>
                    <input
                        type={flagPass ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                        }
                        className={errors.password ? styles.error : ""}
                    />

                    <i
                        className={`fa-solid ${flagPass ? "fa-eye" : "fa-eye-slash"}`}
                        onClick={() =>  setFlagPass(!flagPass)}
                    ></i>
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
            <div className={styles.formGroup}>
                <label>{t("confirmPassword")}</label>
                <div className={styles.passInput}>
                    <input
                        type={flagPassCon ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={errors.confirmPassword ? styles.error : ""}
                    />
                    <i
                        className={`fa-solid ${flagPassCon ? "fa-eye" : "fa-eye-slash"}`}
                        onClick={() =>  setFlagPassCon(!flagPassCon)}
                    ></i>
                </div>
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
        </div>

        <div className={styles.rowinputs}>
            <div className={styles.formGroup}>
                <label>{t("phone")}</label>
                <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className={styles.formGroup}>
                <label>{t("gender")}</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                </select>
            </div>
        </div>

        {/* <div className={styles.formGroup}>
            <label>{t("preferredLang")}</label>
            <select
                value={formData.preferredLang}
                onChange={(e) => setFormData({ ...formData, preferredLang: e.target.value })}
            >
                <option value="en">English</option>
                <option value="ar">عربي</option>
            </select>
        </div> */}
        
        
        
        {/* <div className={styles.formGroup}>
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
        </div> */}
    </>
    );
}
