import  axiosInstance  from "@/services/axiosInstance";

//register
export const registerRequest = (data) => {
    // For FormData, axios will automatically set Content-Type
    // For JSON, we need to ensure it's set correctly
    const config = {};
    if (!(data instanceof FormData)) {
        config.headers = {
            'Content-Type': 'application/json'
        };
    }
    return axiosInstance.post("/auth/signup", data, config);
};
//VerifyAccount
export const verifyAccountRequest = ({ email, code }) =>
    axiosInstance.post("/auth/verifyEmailUser", {
        email,
        code,
    });

export const resendCodeRequest =({email})=>
    axiosInstance.post("/auth/resendVerificationCode", {email});


//login
export const loginRequest = (data) =>
    axiosInstance.post("/auth/login", data);

// forgotPass
export const ForgotPassRequest = ({email}) =>
    axiosInstance.post("/auth/forgetPassword", {email});

//verify Forgot Password Code
export const verifyForgotPassCodeRequest = ({ email, code }) =>
    axiosInstance.post("/auth/verifyForgotPasswordCode", {
        email,
        code
    });

//New Password 
export const resetPasswordRequest = ({ email, newPassword ,passwordConfirm }) =>
    axiosInstance.post("/auth/resetPassword", {
        email,
        newPassword,
        passwordConfirm
    });