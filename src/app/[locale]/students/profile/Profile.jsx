"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import { getProfile, updateImageProfile } from "@/services/profile";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Edit from "./Edit";
import ChangePassword from "../../teachers/profile/ChangePassword";
import LanguageSelector from "../../i18n/LanguageSelector";

export default function Profile() {
  const t = useTranslations("yourProfile");
  const router = useRouter();

  const [dataProfile, setDataProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  // upDate profile img
  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("imageProfile", file);

    await updateProfileData(formData);
  };

  const updateProfileData = async (updatedData) => {
    try {
      setLoading(true);
      setErrorMsg("");
      await updateImageProfile(updatedData);
      fetchProfile();
    } catch (err) {
      console.log(err);
      setErrorMsg(t("failedUpdateImg"));
    } finally {
      setLoading(false);
    }
  };


  





  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      console.log("dataaaa",res.data.data.user);
      
      setDataProfile(res.data.data.user);
    } catch (err) {
      setError(t("failedData"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className={styles.loader}><span className="spinner"></span></div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const profile = dataProfile?.studentProfile;

return (
  <div className={styles.container}>
    {errorMsg && <div className={styles.error}>{errorMsg}</div>}
    {/* image */}
    <div className={styles.imageWrapper}>
      <img
        src={dataProfile?.imageProfile || "/images/default.jpg"}
        alt="profile"
      />

      <button 
        className={styles.editImage}
        onClick={handleImageClick}
      >
        <i className="fa-solid fa-pen"></i>
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>


  {/* form */}
  <div className={styles.form}>

  <div className={styles.row}>
      <div className={styles.inputGroup}>
          <label>{t("firstName")}</label>
          <input
              value={dataProfile?.firstName || ""}
              readOnly
          />
      </div>

      <div className={styles.inputGroup}>
          <label>{t("lastName")}</label>
          <input
              value={dataProfile?.lastName || ""}
              readOnly
          />
      </div>
  </div>

  <div className={styles.inputGroup}>
      <label>{t("email")}</label>
      <input
          value={dataProfile?.email || ""}
          disabled
      />
  </div>

  <div className={styles.inputGroup}>
      <label>{t("phone")}</label>
      <input
          value={dataProfile?.phone || ""}
          readOnly
      />
  </div>
  <div className={styles.inputGroup}>
      <label>{t("points")}</label>
      <input
          value={dataProfile?.points}
          readOnly
      />
  </div>

  <div className={styles.inputGroup}>
      <label>{t("educationalSystem")}</label>
      <select disabled>
          <option>{dataProfile?.studentProfile?.education_system || ""}</option>
      </select>
  </div>

  <div className={styles.inputGroup}>
      <label>{t("academicYear")}</label>
      <select disabled>
          <option>{dataProfile?.studentProfile?.grade || ""}</option>
      </select>
  </div>

  </div>
  {/* ================= TOP ACTIONS ================= */}
          <div className={styles.topActions}>

              <button
              className={styles.editBtn}
              onClick={() => setOpenEditProfile(true)}
              >
              <i className="fa-solid fa-user-pen"></i> {t("editProfile")}
              </button>

              <button
              className={styles.editBtn}
              onClick={() => setOpenChangePassword(true)}
              >
              <i className="fa-solid fa-key"></i> {t("changePassword")}
              </button>

              <div className={styles.languageSelector}>
                <LanguageSelector />
              </div>

          </div>
          {
            openEditProfile && (
              <div className={styles.editProfileModal}>
                <div className={styles.editProfileContent}>
                  <Edit 
                  onClose={() => setOpenEditProfile(false)}
                  onSuccess={fetchProfile}
                  fetchProfile={fetchProfile}
                  data={dataProfile}
                  />
                </div>
              </div>
            )

          }
          {
            openChangePassword && (
              <div className={styles.editProfileModal}>
                <div className={styles.editProfileContent}>
                  <ChangePassword
                  onClose={() => setOpenChangePassword(false)}
                  onSuccess={fetchProfile}
                  data={dataProfile}
                  />
                </div>
              </div>
            )

        }

  </div>
  );
}