"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getMyPayments } from "@/services";
import styles from "./payments.module.css";

export default function PaymentsPage() {
  const t = useTranslations("payments");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    minAmount: "",
    maxAmount: "",
    fromDate: "",
    toDate: "",
  });
  const [pagination, setPagination] = useState({});

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.status) params.status = filters.status;
      if (filters.minAmount) params.minAmount = filters.minAmount;
      if (filters.maxAmount) params.maxAmount = filters.maxAmount;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const res = await getMyPayments(params);
      setPayments(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "فشل في تحميل المدفوعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="spinner"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button onClick={fetchPayments} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>{t("myPayments")}</h1>

      {/* Filters */}
      <div className={styles.filters}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">{t("allStatuses")}</option>
          <option value="pending">{t("pending")}</option>
          <option value="paid">{t("paid")}</option>
          <option value="failed">{t("failed")}</option>
          <option value="refunded">{t("refunded")}</option>
        </select>

        <input
          type="number"
          name="minAmount"
          placeholder={t("minAmount")}
          value={filters.minAmount}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="maxAmount"
          placeholder={t("maxAmount")}
          value={filters.maxAmount}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Payments List */}
      <div className={styles.paymentsList}>
        {payments.length === 0 ? (
          <p>{t("noPayments")}</p>
        ) : (
          payments.map((payment) => (
            <div key={payment._id} className={styles.paymentCard}>
              <div className={styles.paymentInfo}>
                <h3>{payment.lessonId?.title || t("lesson")}</h3>
                <p>{t("amount")}: {payment.amount} EGP</p>
                <p>{t("status")}: <span className={styles[payment.status]}>{t(payment.status)}</span></p>
                <p>{t("date")}: {new Date(payment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
          >
            {t("previous")}
          </button>
          <span>{t("page")} {pagination.page} {t("of")} {pagination.totalPages}</span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= pagination.totalPages}
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
}