"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resendCodeRequest, verifyForgotPassCodeRequest } from "@/features/auth/auth.service";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

const OtpForm = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const router = useRouter();
    const t = useTranslations("VerifyAccount");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingres, setLoadingres] = useState(false);
    const email = Cookies.get("emailUser");
    const pathname = usePathname();
    const [msgResent , setMsgResent] = useState('')

    //timer
    const RESEND_TIME = 300; // 5 minutes

    const [timeLeft, setTimeLeft] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsResendDisabled(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
        inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join("");
        
        
        if (code.length < 6){
            setErrorMsg(t("required"));
            return;
        }
        setLoading(true);
        setErrorMsg("");
        setMsgResent("");
        try {            
            const res = await verifyForgotPassCodeRequest({email, code});
            // Cookies.set("verified", res.data.token);
            const locale = pathname.split('/')[1] || 'ar';
            router.push(`/${locale}/auth/newpassword`); 
        } catch (err) {
            console.error(err);
            setErrorMsg(t("inValidCode"));
        }finally{
            setLoading(false);
        }
    };
    const handleResetOtp = () => {
        setOtp(Array(6).fill(""));
        setErrorMsg("");
        inputsRef.current[0]?.focus();
    };

    const handleResend = async (e) => {
        e.preventDefault();

        try {
            setLoadingres(true);
            setErrorMsg("");
            
            await resendCodeRequest({email}); 
            handleResetOtp();
            setMsgResent(t("msgResend"))
            setIsResendDisabled(true);
            setTimeLeft(RESEND_TIME);
        } catch (err) {
            console.log(err.response.data);
            setErrorMsg(t("resendError"));
        } finally {
            setLoadingres(false);
        }
    };


    return (
        <div className="allcenter">
            <h1>{t('title')}</h1>
            <p>{t('instruction')}</p>
            <form onSubmit={handleSubmit}>
                <div className="otpInputs">
                    {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="otpInput"
                    />
                    ))}
                </div>
                <div className="errorContainer">
                    {errorMsg && <span className="errorMsg">{errorMsg}</span>}
                </div>
                <div className="btnBox">
                    <button type="submit" className="submitBtn" disabled={loading || loadingres}>
                        {loading ? <span className="spinner"></span> : t("submit")}
                    </button>
                </div>
            </form>
            <div className="resendContainer">
                <p>
                    {t("msgResent")}  
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResendDisabled || loadingres}
                        className={isResendDisabled? "DisresendBtn" : "resendBtn"}
                    >
                        {t("resend")}
                    </button>
                </p>
                {isResendDisabled &&  <p className="resMsg">{msgResent? msgResent:''}</p> }
            </div>
        </div>
    );
};

export default OtpForm;
