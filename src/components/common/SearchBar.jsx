"use client";
import React from "react";
import styles from "./SearchBar.module.css";
import { useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations("header"); // Reusing translations from header for "search"
  
  return (
    <div className={styles.searchContainer}>
      <i className="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder={t("search")} />
    </div>
  );
}
