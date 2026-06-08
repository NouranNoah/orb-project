"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getMySupports,
  createSupport,
  updateSupport,
  closeSupport,
  reopenSupport,
} from "@/services";
import styles from "./support.module.css";

export default function SupportPage() {
  const t = useTranslations("support");

  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    problemType: "",
    message: "",
    image: null,
  });

  const [notification, setNotification] = useState(null);
  const [confirmation, setConfirmation] = useState({
    open: false,
    action: "",
    id: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [filter, setFilter] = useState("all"); // all, open, closed

  const problemTypes = [
    { value: "technical", label: t("technicalProblem") },
    { value: "payment", label: t("paymentProblem") },
    { value: "lesson", label: t("lessonProblem") },
    { value: "account", label: t("accountProblem") },
    { value: "other", label: t("other") },
  ];

  const fetchSupports = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMySupports();
      setSupports(res.data.data || []);
    //   console.log("da",res.data);
      
    } catch (err) {
      console.error(err);
      setError(t("failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const openConfirmation = (action, id) => {
    setConfirmation({
      open: true,
      action,
      id,
    });
  };

  const closeConfirmation = () => {
    setConfirmation({
      open: false,
      action: "",
      id: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmation.open) return;

    setConfirmLoading(true);

    try {
      if (confirmation.action === "close") {
        await closeSupport(confirmation.id);
        showNotification("success", t("closeSuccess"));
      } else if (confirmation.action === "reopen") {
        await reopenSupport(confirmation.id, {});
        showNotification("success", t("reopenSuccess"));
      }

      fetchSupports();
    } catch (err) {
      console.error(err);
      showNotification(
        "error",
        err?.response?.data?.message ||
          (confirmation.action === "close" ? t("closeFailed") : t("reopenFailed"))
      );
    } finally {
      setConfirmLoading(false);
      closeConfirmation();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.problemType || !formData.message) {
      showNotification("error", t("required"));
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedSupport) {
        await updateSupport(selectedSupport._id, formData);
        showNotification("success", t("updateSuccess"));
      } else {
        await createSupport(formData);
        showNotification("success", t("createSuccess"));
      }

      setFormData({ problemType: "", message: "", image: null });
      setSelectedSupport(null);
      setShowForm(false);
      fetchSupports();
    } catch (err) {
      console.error(err);
      showNotification("error", err?.response?.data?.message || t("failedSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSupport = async (id) => {
    openConfirmation("close", id);
  };

  const handleReopenSupport = async (id) => {
    openConfirmation("reopen", id);
  };

  const handleEditSupport = (support) => {
    setSelectedSupport(support);
    setFormData({
      problemType: support.problemType || "",
      message: support.message || "",
      image: null,
    });
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const filteredSupports =
    filter === "all"
      ? supports
      : filter === "open"
      ? supports.filter((s) => s.status !== "closed")
      : supports.filter((s) => s.status === "closed");

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return styles.statusOpen;
      case "in_progress":
        return styles.statusProgress;
      case "closed":
        return styles.statusClosed;
      default:
        return styles.statusPending;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return t("open");
      case "in_progress":
        return t("inProgress");
      case "closed":
        return t("closed");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center h-64">
          <span className="spinner"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("title")}</h1>
        <button
          onClick={() => {
            setSelectedSupport(null);
            setFormData({ problemType: "", message: "", image: null });
            setShowForm(true);
          }}
          className={styles.createBtn}
        >
          {t("newRequest")}
        </button>
      </div>

      {notification && (
        <div
          className={`${styles.notification} ${
            notification.type === "success"
              ? styles.notificationSuccess
              : styles.notificationError
          }`}
        >
          {notification.message}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {/* Filter Buttons */}
      <div className={styles.filters}>
        <button
          className={filter === "all" ? styles.filterActive : ""}
          onClick={() => setFilter("all")}
        >
          {t("allRequests")}
        </button>
        <button
          className={filter === "open" ? styles.filterActive : ""}
          onClick={() => setFilter("open")}
        >
          {t("openRequests")}
        </button>
        <button
          className={filter === "closed" ? styles.filterActive : ""}
          onClick={() => setFilter("closed")}
        >
          {t("closedRequests")}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setShowForm(false);
                setSelectedSupport(null);
              }}
            >
              ✕
            </button>

            <h2>
              {selectedSupport ? t("updateRequest") : t("createNewRequest")}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label>{t("problemType")}</label>
                <select
                  value={formData.problemType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      problemType: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">{t("selectProblemType")}</option>
                  {problemTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{t("message")}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder={t("messagePlaceholder")}
                  rows={5}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("image")} ({t("optional")})</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <p className={styles.fileName}>{formData.image.name}</p>
                )}
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting
                    ? t("submitting")
                    : selectedSupport
                    ? t("update")
                    : t("submit")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSupport(null);
                  }}
                  className={styles.cancelBtn}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmation.open && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>
              {confirmation.action === "close"
                ? t("confirmClose")
                : t("confirmReopen")}
            </h2>

            <div className={styles.confirmActions}>
              <button
                onClick={handleConfirmAction}
                disabled={confirmLoading}
                className={styles.submitBtn}
              >
                {confirmLoading ? t("submitting") : t("confirm")}
              </button>
              <button
                onClick={closeConfirmation}
                className={styles.cancelBtn}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Requests List */}
      <div className={styles.supportsList}>
        {filteredSupports.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("noSupports")}</p>
          </div>
        ) : (
          filteredSupports.map((support) => (
            <div key={support._id} className={styles.supportCard}>
              <div className={styles.cardHeader}>
                <h3>{support.title || t("supportRequest")}</h3>
                <span className={`${styles.status} ${getStatusColor(support.status)}`}>
                  {getStatusLabel(support.status)}
                </span>
              </div>

              <div className={styles.cardBody}>
                <p>
                  <strong>{t("problemType")}:</strong> {support.problemType}
                </p>
                <p>
                  <strong>{t("message")}:</strong> {support.message}
                </p>
                {support.image && (
                  <div className={styles.imagePreview}>
                    <img src={support.image} alt="Support" />
                  </div>
                )}
                <p className={styles.date}>
                  {new Date(support.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>

              <div className={styles.cardActions}>
                {support.status !== "closed" ? (
                  <>
                    <button
                      onClick={() => handleEditSupport(support)}
                      className={styles.editBtn}
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => handleCloseSupport(support._id)}
                      className={styles.closeActionBtn}
                    >
                      {t("cancel")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReopenSupport(support._id)}
                    className={styles.reopenBtn}
                  >
                    {t("reopen")}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}