import axiosInstance from "./axiosInstance";

export const handleNotfifcations = async (fcmToken) => {
    return axiosInstance.post('/auth/updateFcmToken',{fcmToken : fcmToken})
};

export const getAllNotifications = async () => {
    return axiosInstance.get('notifications/all')
};

export const getNotification = async (id) => {
    return axiosInstance.get(`/user/notifications/${id}`)
};

export const markNotificationAsRead = async (id) => {
    return axiosInstance.put(`/notifications/read/${id}`)
};

// للرجعية (Backward compatibility)
export const readedNotification = async (id) => {
    return axiosInstance.put(`/notifications/read/${id}`)
};

export const deleteNotification = async (id) => {
    return axiosInstance.delete(`/notifications/${id}`)
};

export const deleteAllNotifications = async () => {
    return axiosInstance.delete(`/notifications/all`)
};
