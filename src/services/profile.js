import axiosInstance from "./axiosInstance";

export const getProfile = ()=>{
    return axiosInstance.get('/auth/me')
}
export const updateProfile = (formData)=>{
    return axiosInstance.patch('/auth/updateProfile', formData)
}
export const updateImageProfile = (imageProfile)=>{
    return axiosInstance.patch('/auth/updateImageProfile', imageProfile,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    })
}
export const updateLanguage = ()=>{
    return axiosInstance.patch('/auth/updateLanguage')
}
export const changePassword = (data) => {
  return axiosInstance.put('/auth/changePassword', data);
};