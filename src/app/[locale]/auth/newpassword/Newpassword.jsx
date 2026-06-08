"use client"

import { resetPasswordRequest } from '@/features/auth/auth.service';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from 'react'
import Cookies from "js-cookie";
import styles from './reset.module.css'
import Image from 'next/image';

export default function Newpassword() {
    const t = useTranslations("newPass");
    const emailUser= Cookies.get("emailUser");
    const [formData, setFormData] = useState({
        email:emailUser,
        newPassword: "",
        passwordConfirm:""
    });
    const [loading ,setLoading]=useState(false);
    const [errorMsg, setErrorMsg]= useState('');
    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname.split('/')[1] || 'ar';

    const [flagPass,setFlagPass]= useState(false);
    const [flagPassCon,setFlagPassCon]= useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.newPassword === ""|| formData.passwordConfirm===""){
            setErrorMsg(t("required"));
            return;
        }
        setLoading(true);
        setErrorMsg('')

        try{
            const res = await resetPasswordRequest(formData);
            console.log('done!');
            router.push(`/${locale}/auth/login`);
        }catch(err){
            console.log(err.response);
            setErrorMsg(t("inValid"));
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className={styles.formAuthreset} dir={locale === "ar" ? "rtl" : "ltr"}>
            <Image
            src='/images/lockimg.png'
            alt='lockImg'
            width={100}
            height={100}
            />
            <div className={styles.bor}>
                <h1>{t("title")}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="errorContainer">
                        {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                    </div>
                    <div className="formGroup">
                        <label>{t("password")}</label>
                        <div className={styles.passInput}>
                            <input
                                type={flagPass ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) =>
                                setFormData({ ...formData, newPassword: e.target.value })
                                }
                            />

                            <i
                                className={`fa-solid ${flagPass ? "fa-eye" : "fa-eye-slash"}`}
                                onClick={() =>  setFlagPass(!flagPass)}
                            ></i>
                        </div>
                    </div>
                    <div className="formGroup">
                        <label>{t("confirmPassword")}</label>
                        <div className={styles.passInput}>
                            <input
                                type={flagPassCon ? "text" : "password"}
                                value={formData.passwordConfirm}
                                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                            />
                            <i
                                className={`fa-solid ${flagPassCon ? "fa-eye" : "fa-eye-slash"}`}
                                onClick={() =>  setFlagPassCon(!flagPassCon)}
                            ></i>
                        </div>
                    </div>

                    <div className="btnBox">
                        <button type="submit" disabled={loading} className="submitBtn">
                            {loading ? <span className="spinner"></span> : t("submit")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}