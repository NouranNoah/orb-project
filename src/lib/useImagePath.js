"use client";

import { usePathname } from "next/navigation";

/**
 * مسارات `public/` مع بادئة اللغة: `/ar/logo.svg` ← الـ middleware يعيد كتابتها إلى `/logo.svg`.
 * بدون البادئة، طلبات مثل `/logo.svg` قد تتعارض مع `next-intl` ولا تُعرض في `<Image />` كما يجب.
 */
export function useImagePath(path) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "ar";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}
