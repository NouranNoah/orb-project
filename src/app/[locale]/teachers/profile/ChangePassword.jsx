"use client";

import { changePassword } from "@/services/profile";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Profile.module.css";
import { usePathname, useRouter } from "next/navigation";

export default function ChangePassword({
  onClose,
  onSuccess,
}) {
  const t = useTranslations("yourProfile");

    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname.split('/')[1] || 'ar';

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        passwordConfirm: formData.confirmPassword,
      });
      
      onSuccess();
      onClose();
      router.push(`/${locale}/auth/login`);
    } catch (err) {
        console.log(err);
      setError(t("failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalCard}>
      <div className={styles.modalHeader}>
        <h3>{t("changePassword")}</h3>

        <button onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className={styles.modalBody}>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder={t("currentPassword")}
        />

        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder={t("newPassword")}
        />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder={t("confirmNewPassword")}
        />
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