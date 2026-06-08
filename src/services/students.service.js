import axiosInstance from "./axiosInstance";

export const getFilterTeachers= (params = {})=>{
    return axiosInstance.get('/teachers',{params})
}
export const paymentFunction= (lessonId) =>{
    return axiosInstance.post('/payments/create',{
        lessonId: lessonId,
        SUCCESS_REDIRECT_URL: `${window.location.origin}/payment-result`,
    })
}

export const getPaymentById = (paymentId) =>{ 
    return axiosInstance.get(`/payments/${paymentId}`);
}

export const getMyPayments = (params = {}) => {
    return axiosInstance.get('/payments/my-payments', { params });
}

export const verifyPaymentManually = (paymentId) => {
    return axiosInstance.post('/payments/verify', { paymentId });
}

export const notifyTeacherPayment = (lessonId, amount) => {
    return axiosInstance.post('/notifications/teacher-payment', {
        lessonId,
        amount
    });
};

