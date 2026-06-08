import axiosInstance from "./axiosInstance";

// الحصول على جميع طلبات الدعم الخاصة بالمستخدم
export const getMySupports = async () => {
  return axiosInstance.get("/support/my-requests");
};

// إنشاء طلب دعم جديد
export const createSupport = async (data) => {
  const formData = new FormData();
  
  if (data.problemType) formData.append("problemType", data.problemType);
  if (data.message) formData.append("message", data.message);
  if (data.image) formData.append("image", data.image);
  
  return axiosInstance.post("/support", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// تحديث طلب دعم
export const updateSupport = async (id, data) => {
  const formData = new FormData();
  
  if (data.problemType) formData.append("problemType", data.problemType);
  if (data.message) formData.append("message", data.message);
  if (data.image) formData.append("image", data.image);
  
  return axiosInstance.put(`/support/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// إغلاق طلب دعم
export const closeSupport = async (id) => {
  return axiosInstance.put(`/support/${id}/close`);
};

// إعادة فتح طلب دعم
export const reopenSupport = async (id, data) => {
  return axiosInstance.put(`/support/${id}/reopen`, data);
};
