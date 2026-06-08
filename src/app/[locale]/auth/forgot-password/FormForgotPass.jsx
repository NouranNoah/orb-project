"use client"
import { ForgotPassRequest } from '@/features/auth/auth.service';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from 'react'
import Cookies from "js-cookie";

export default function FormForgotPass() {
    const t = useTranslations("forgotPass");
    const [formData, setFormData] = useState({
        email: "",
    });
    const [loading ,setLoading]=useState(false);
    const [errorMsg, setErrorMsg]= useState('');
    const pathname = usePathname();
    const router = useRouter();
    const locale = pathname.split('/')[1] || 'ar';
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.email === ""){
            setErrorMsg(t("required"));
            return;
        }
        setLoading(true);
        setErrorMsg('')

        try{
            const res = await ForgotPassRequest(formData);
            console.log('done!');
            Cookies.set("emailUser", formData.email)
            
            router.push(`/${locale}/auth/verifyForgotPasswordCode`);
        }catch(err){
            console.log(err.response);
            setErrorMsg(t("inValid"));
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="formAuth bgFormF" dir={locale === "ar" ? "rtl" : "ltr"}>
            <h1>{t("title")}</h1>
            <p className='formp'>{t("instruction")}</p>
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

                <div className="btnBox">
                    <button type="submit" disabled={loading} className="submitBtn">
                        {loading ? <span className="spinner"></span> : t("submit")}
                    </button>
                </div>
            </form>
        </div>
    );
}