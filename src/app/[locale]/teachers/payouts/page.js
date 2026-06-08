"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getMyPayouts, requestPayout } from "@/services";
import styles from "./payouts.module.css";

export default function PayoutsPage() {
  const t = useTranslations("payouts");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    amount: "",
    method: "wallet"
  });
  const [requesting, setRequesting] = useState(false);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    method: "",
    fromDate: "",
    toDate: "",
  });
  const [pagination, setPagination] = useState({});

  const fetchPayouts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.status) params.status = filters.status;
      if (filters.method) params.method = filters.method;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const res = await getMyPayouts(params);
      setPayouts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err?.response?.data?.message || "فشل في تحميل طلبات الدفع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestData.amount || !requestData.method) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setRequesting(true);
    try {
      await requestPayout(requestData);
      setShowRequestForm(false);
      setRequestData({ amount: "", method: "wallet" });
      fetchPayouts(); // Refresh the list
      alert("تم إرسال طلب الدفع بنجاح");
    } catch (err) {
      alert(err?.response?.data?.message || "فشل في إرسال طلب الدفع");
    } finally {
      setRequesting(false);
    }
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
        <button onClick={fetchPayouts} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t("myPayouts")}</h1>
        <button
          onClick={() => setShowRequestForm(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t("requestPayout")}
        </button>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{t("requestNewPayout")}</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className={styles.formGroup}>
                <label>{t("amount")}</label>
                <input
                  type="number"
                  value={requestData.amount}
                  onChange={(e) => setRequestData({...requestData, amount: e.target.value})}
                  placeholder="مثال: 500"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("method")}</label>
                <select
                  value={requestData.method}
                  onChange={(e) => setRequestData({...requestData, method: e.target.value})}
                >
                  <option value="wallet">{t("wallet")}</option>
                  <option value="bank">{t("bank")}</option>
                </select>
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={requesting}>
                  {requesting ? t("requesting") : t("submit")}
                </button>
                <button type="button" onClick={() => setShowRequestForm(false)}>
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">{t("allStatuses")}</option>
          <option value="pending">{t("pending")}</option>
          <option value="completed">{t("completed")}</option>
          <option value="failed">{t("failed")}</option>
        </select>

        <select name="method" value={filters.method} onChange={handleFilterChange}>
          <option value="">{t("allMethods")}</option>
          <option value="wallet">{t("wallet")}</option>
          <option value="bank">{t("bank")}</option>
        </select>

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

      {/* Payouts List */}
      <div className={styles.payoutsList}>
        {payouts.length === 0 ? (
          <p>{t("noPayouts")}</p>
        ) : (
          payouts.map((payout) => (
            <div key={payout._id} className={styles.payoutCard}>
              <div className={styles.payoutInfo}>
                <h3>{t("payoutRequest")}</h3>
                <p>{t("amount")}: {payout.amount} EGP</p>
                <p>{t("method")}: <span className={styles[payout.method]}>{t(payout.method)}</span></p>
                <p>{t("status")}: <span className={styles[payout.status]}>{t(payout.status)}</span></p>
                <p>{t("date")}: {new Date(payout.createdAt).toLocaleDateString()}</p>
                {payout.processedAt && (
                  <p>{t("processedAt")}: {new Date(payout.processedAt).toLocaleDateString()}</p>
                )}
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