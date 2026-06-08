"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import stylesS from "../../students/profile/Profile.module.css";
import { useTranslations } from "next-intl";
import { getProfile, updateImageProfile } from "@/services/profile";
import { useRouter } from "next/navigation";
import Edit from "../../students/profile/Edit";
import ChangePassword from "./ChangePassword";
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

  if (loading) return <div className={stylesS.loader}><span className="spinner"></span></div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const profile = dataProfile?.teacherProfile;

  return (
    <div className={styles.page}>
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>

          {/* IMAGE */}
          <div className={styles.imageWrapper}>
            <img
              src={dataProfile?.imageProfile || "/images/default.jpg"}
              alt="profile"
            />

            {/* EDIT IMAGE ICON */}
            <button
              className={styles.imageEditBtn}
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
          

          {/* INFO */}
          <div className={styles.heroInfo}>
            <h1>
              {dataProfile?.firstName} {dataProfile?.lastName}
            </h1>

            <p className={styles.email}>{dataProfile?.email}</p>

            <div className={styles.meta}>
              <span><i className="fa-solid fa-star"></i> {profile?.avgRating || 0}</span>
              <span>{profile?.verificationStatus}</span>
              <span>{dataProfile?.level}</span>
            </div>

            <div className={styles.tags}>
              {profile?.subjects?.map((sub, i) => (
                <span key={i} className={styles.tag}>
                  {sub}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ================= GRID ================= */}
      <section className={styles.grid}>

        <div className={styles.card}>
          <h3>{t("education_system")}</h3>
          {profile?.education_system?.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>

        <div className={styles.card}>
          <h3>{t("academic_stages")}</h3>
          {profile?.academic_stages?.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>

        <div className={styles.card}>
          <h3>{t("school")}</h3>
          <p>{profile?.school}</p>
        </div>

        <div className={styles.priceCard}>
          <h2>{profile?.pricePerHour} EGP</h2>
          <p>{t("pricePerHour")}</p>
        </div>

      </section>

      {/* ================= ABOUT ================= */}
      <section className={styles.about}>
        <h2>{t("about")}</h2>
        <p>{profile?.bio}</p>
      </section>

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
              <div className={stylesS.editProfileModal}>
                <div className={stylesS.editProfileContent}>
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
              <div className={stylesS.editProfileModal}>
                <div className={stylesS.editProfileContent}>
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