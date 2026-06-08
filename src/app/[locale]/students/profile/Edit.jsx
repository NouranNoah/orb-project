"use client";

import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { updateProfile, getProfile } from "@/services/profile";
import { useTranslations } from "next-intl";

export default function Edit({ onClose, onSuccess ,fetchProfile, data }) {
  const t = useTranslations("yourProfile");

  const [formData, setFormData] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    studentProfile: {
        education_system: data?.studentProfile?.education_system || "",
        grade: data?.studentProfile?.grade || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("studentProfile")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
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
      console.log('doneeeeeeee');
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

        <select
          name="studentProfile.education_system"
          value={formData.studentProfile.education_system}
          onChange={handleChange}
        >
            
          <option>National</option>
          <option>American</option>
          <option>British</option>
          <option>International</option>
          <option>Other</option>
        </select>

        <select
          name="studentProfile.grade"
          value={formData.studentProfile.grade}
          onChange={handleChange}
        >
          <option>KG1</option>
          <option>KG2</option>
          <option>Grade 1</option>
          <option>Grade 2</option>
          <option>Grade 3</option>
          <option>Grade 4</option>
          <option>Grade 5</option>
          <option>Grade 6</option>
          <option>Grade 7</option>
          <option>Grade 8</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
          <option>Grade 11</option>
          <option>Grade 12 (Secondary 3)</option>
          <option>University</option>
          <option>Other</option>
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