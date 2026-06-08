"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaymentById, verifyPaymentManually, notifyTeacherPayment } from "@/services";
import { connectSocket } from "@/services";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function PaymentResult() {
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations("payments");
  const { lessonId } = useParams();

  useEffect(() => {
    const paymentId = localStorage.getItem("paymentId");

    if (!paymentId) {
      setStatus("failed");
      setError("لا يمكن العثور على بيانات الدفع");
      return;
    }

    // أول check
    checkPayment();

    // الاتصال بـ socket للتحديثات الفورية
    const socket = connectSocket();
    socket.emit("join_payment_room", paymentId);

    socket.on("payment_updated", (data) => {
      if (data.paymentId === paymentId) {
        if (data.status === "paid") {
          setStatus("success");
          localStorage.removeItem("paymentId");

          // إرسال إشعار للمدرس
          notifyTeacher(lessonId, data.amount);

          socket.disconnect();
        } else if (data.status === "failed") {
          setStatus("failed");
          socket.disconnect();
        }
      }
    });

    // fallback polling كل 10 ثواني
    const interval = setInterval(checkPayment, 10000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const notifyTeacher = async (lessonId, amount) => {
    try {
      await notifyTeacherPayment(lessonId, amount);
    } catch (error) {
      console.log("Failed to notify teacher:", error);
    }
  };

  const checkPayment = async () => {
    const paymentId = localStorage.getItem("paymentId");
    if (!paymentId) return;

    try {
      const res = await getPaymentById(paymentId);
      const payment = res.data.data;

      if (payment.status === "paid") {
        setStatus("success");
        localStorage.removeItem("paymentId");
      } else if (payment.status === "failed") {
        setStatus("failed");
      } else {
        setStatus("loading"); // pending
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "حصل خطأ أثناء التحقق من الدفع"
      );
      setStatus("failed");
    }
  };

  // 🟡 loading
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <span className="spinner mb-4"></span>
        <p>جاري التحقق من الدفع...</p>
        <button
          onClick={checkPayment}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("manualCheck")}
        </button>
      </div>
    );
  }

  // 🟢 success
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-green-600 text-2xl mb-2">
          ✅ تم الدفع بنجاح
        </h2>
        <p>تم تأكيد حجز الدرس 🎉</p>

        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded"
          onClick={() => router.push("/student/lessons")}
        >
          الذهاب للدروس
        </button>
      </div>
    );
  }

  // 🔴 failed
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-red-600 text-2xl mb-2">
        ❌ فشل الدفع
      </h2>
      <p>{error || "حاولي مرة تانية"}</p>

      <button
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        onClick={() => router.push("/lessons")}
      >
        حاول مرة تانية
      </button>
    </div>
  );
}