"use client";

import React, { useState } from "react";
import styles from "../../students/profile/Profile.module.css";
import { updateProfile } from "@/services/profile";
import { useTranslations } from "next-intl";

export default function EditTeacher({ onClose, onSuccess, fetchProfile, data }) {
  const t = useTranslations("yourProfile");

  const [formData, setFormData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    teacherProfile: {
      school: data?.teacherProfile?.school || "",
      pricePerHour: data?.teacherProfile?.pricePerHour || "",
      bio: data?.teacherProfile?.bio || "",
      experienceYears: data?.teacherProfile?.experienceYears || "",
      education_system: data?.teacherProfile?.education_system || "",
      academic_stages: data?.teacherProfile?.academic_stages || [],
      subjects: data?.teacherProfile?.subjects || [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("teacherProfile")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          [key]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      await updateProfile(formData);

      fetchProfile();
      onSuccess();
      onClose();
    } catch (err) {
      setError(t("failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalCard}>
      
      <div className={styles.modalHeader}>
        <h3>{t("editProfile")}</h3>

        <button onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className={styles.modalBody}>
        
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder={t("firstName")}
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder={t("lastName")}
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("phone")}
        />

        <input
          name="teacherProfile.school"
          value={formData.teacherProfile.school}
          onChange={handleChange}
          placeholder="School"
        />

        <input
          name="teacherProfile.pricePerHour"
          value={formData.teacherProfile.pricePerHour}
          onChange={handleChange}
          placeholder="Price Per Hour"
          type="number"
        />

        <input
          name="teacherProfile.experienceYears"
          value={formData.teacherProfile.experienceYears}
          onChange={handleChange}
          placeholder="Experience Years"
          type="number"
        />

        <textarea
          name="teacherProfile.bio"
          value={formData.teacherProfile.bio}
          onChange={handleChange}
          placeholder="Bio"
        />

        <select
          name="teacherProfile.education_system"
          value={formData.teacherProfile.education_system}
          onChange={handleChange}
        >
          <option>National</option>
          <option>American</option>
          <option>British</option>
          <option>International</option>
        </select>

      </div>

      <div className={styles.modalFooter}>
        
        <button onClick={onClose} className={styles.cancel}>
          {t("cancel")}
        </button>

        <button onClick={handleSubmit} className={styles.save}>
          {loading ? "..." : t("save")}
        </button>

      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}