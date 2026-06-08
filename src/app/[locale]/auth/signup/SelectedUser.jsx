"use client";
import styles from "./signUp.module.css";
import { useState } from "react";
import { useTranslations } from "next-intl";
import SignupForm from "./SignupForm/SignupForm";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
export default function SelectedUser() {
    
    const [role, setRole] = useState("student");
    const t = useTranslations("signup");
    const router = useRouter();
    const pathname = usePathname();
    const [errorMsg ,setErrorMsg] = useState("");

    const handleSuccess = (data) => {
        console.log("Signup successful:", data);
        // Redirect to login or verification page
        const locale = pathname.split('/')[1] || 'ar';
        router.push(`/${locale}/auth/verifyaccount`);
    };

    const handleError = (error) => {
        console.error("Signup error:", error);
        setErrorMsg(error);
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupContainerd}>
                <h1>{t("title")}</h1>
                <div className={styles.selectBtns}>
                    <button
                    className={`${styles.selectBtn} ${role === "student" ? styles.active : ""}`}
                    onClick={() => setRole("student")}
                    >
                    {t("student")}
                    </button>
                    <button
                    className={`${styles.selectBtn} ${role === "teacher" ? styles.active : ""}`}
                    onClick={() => setRole("teacher")}
                    >
                    {t("teacher")}
                    </button>
                </div>
                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
                <SignupForm role={role} setErrorMsg={setErrorMsg} onSuccess={handleSuccess} onError={handleError} />
            </div>
            <div className={styles.signupContainerdd}>
                <img
                src='/images/signUpST.png'
                alt="sign up image"
                
                />
            </div>
        </div>
    );
}
