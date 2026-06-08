import axiosInstance from "./axiosInstance";

export const getFilterTeachers= (params = {})=>{
    return axiosInstance.get('/teachers',{params})
}
//Get Single Teacher + Reviews
export const getSingleTeachers= (id)=>{
    return axiosInstance.get(`teachers/${id}/profile`,)
}

//Get Reviews for Teacher
export const getReviwsForTeacher= (id) =>{
    return axiosInstance.get(`/reviews/teacher/${id}?page=1&limit=10`)
}

// get Benefit lessons for teacher 
export const getBenefitsLessons= (subject, limit = 6) =>{
    return axiosInstance.get(`lessons?subject=${subject}&status=pending&limit=${limit}`)
}

//respond To Lesson Request
export const respondToLessonRequest= (lessonId, data) =>{
    return axiosInstance.post(`lessons/requests/${lessonId}/respond`, data)
}
// get Lessons Requests For Teacher
export const getLessonsRequestsForTeacher = (limit = 6, page = 1) => {
    return axiosInstance.get(`lessons/requests?page=${page}&limit=${limit}`)
}

//get detail of lesson
export const getLessonDetailsT = (lessonId) => {
    return axiosInstance.get(`/lessons/teacher/${lessonId}`)
}

// Get my payouts (Teacher)
export const getMyPayouts = (params = {}) => {
    return axiosInstance.get('/payouts/my-payouts', { params });
}

// Request new payout (Teacher)
export const requestPayout = (data) => {
    return axiosInstance.post('/payouts/request', data);
}