"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

const ROLE_HOME = {
  students: "students",
  teachers: "teachers",
  admin: "dashboard",
};

/**
 * يحمي الصفحة: لو مفيش لوجين يوديك للوجين، لو الرول غلط يعرض رسالة ويرجعك لصفحتك.
 * allowedRole: "students" | "teachers" | "admin"
 */
export default function RouteGuard({ children, allowedRole }) {
  const { token, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [forbidden, setForbidden] = useState(false);

  const locale = pathname.split("/")[1] || "ar";

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.replace(`/${locale}/auth/login`);
      return;
    }

    if (role && role !== allowedRole) {
      setForbidden(true);
      const home = ROLE_HOME[role] || "teachers";
      const t = setTimeout(() => {
        router.replace(`/${locale}/${home}`);
      }, 2500);
      return () => clearTimeout(t);
    }

    setForbidden(false);
  }, [token, role, loading, allowedRole, locale, router, pathname]);

  if (loading) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <p>جاري التحميل...</p>
        </div>
        {children}
      </>
    );
  }

  if (!token) {
    return null;
  }

  if (forbidden) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          maxWidth: "400px",
          margin: "2rem auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>هذه الصفحة غير مسموح لك بدخولها.</strong>
        </p>
        <p style={{ color: "#666" }}>
          سيتم تحويلك تلقائياً إلى صفحتك خلال لحظات.
        </p>
      </div>
    );
  }

  return children;
}
