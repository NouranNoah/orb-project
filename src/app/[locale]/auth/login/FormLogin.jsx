"use client"
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import styles from "./Login.module.css"
import { loginRequest } from '@/features/auth/auth.service';
import Cookies from "js-cookie";
import { usePathname,useRouter  } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/useAuth';
import { getFcmToken } from '@/lib/getFcmToken';
import { handleNotfifcations } from '@/services/notifications';

export default function FormLogin() {
    const t = useTranslations("login");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading ,setLoading]=useState(false);
    const [flagPass,setFlagPass]= useState(false);
    const [errorMsg, setErrorMsg]= useState('');
    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname.split('/')[1] || 'ar';
    const {login} = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.email === "" || formData.password === ""){
            setErrorMsg(t("required"));
            return;
        }
        
        
        setLoading(true);
        setErrorMsg('')
        console.log(formData);
        try{
            const res = await loginRequest(formData);
            Cookies.set("nameUser", res.data.user.firstName);
            Cookies.set("idUser", res.data.user._id);
            Cookies.set("roleUser", res.data.user.role);
            console.log(res.data.token, res.data.user.role);
            
            login(res.data.token, res.data.user.role);
            const fcmToken = await getFcmToken();
            console.log('done!', fcmToken);
            if(fcmToken){
                await handleNotfifcations(fcmToken);
            }
            
            if(res.data.user.role === "student") router.push(`/${locale}/students/home`);
            else router.push(`/${locale}/teachers/home`);
        }catch(err){
            console.log(err);
            if(err.response.status === 403) setErrorMsg(t("pending"));
            else setErrorMsg(t("inValid"));
        }finally{
            setLoading(false);
        }
    };
    
    return (
        <div className="formAuth bgForm" dir={locale === "ar" ? "rtl" : "ltr"}>
            <h1>{t("title")}</h1>
            <form onSubmit={handleSubmit}>
                <div className="errorContainer">
                    {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                </div>
                <div className="formGroup">
                    <label>{t("email")}</label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled={loading}
                        onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>

                <div className="formGroup">
                    <label>{t("password")}</label>
                    <div className="passInput">
                        <input
                            type={flagPass ? "text" : "password"}
                            value={formData.password}
                            disabled={loading}
                            onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                            }
                        />

                        <i
                            className={`fa-solid ${flagPass ? "fa-eye" : "fa-eye-slash"}`}
                            onClick={() => !loading && setFlagPass(!flagPass)}
                        ></i>
                    </div>
                    <p className={styles.forgotPassword}>
                        <Link href={`/${pathname.split("/")[1]}/auth/forgot-password`}>
                            {t("forgotPassword")}
                        </Link>
                    </p>

                </div>

                <div className={styles.btnBox}>
                    <button type="submit" disabled={loading} className="submitBtn">
                        {loading ? <span className="spinner"></span> : t("submit")}
                    </button>
                </div>
                <p className={styles.noAcc}>
                    {t("noAccount")} 
                    <Link href={`/${pathname.split("/")[1]}/auth/signup`}>
                        {t("signup")}
                    </Link>
                </p>
            </form>
        </div>
    );
}
    
