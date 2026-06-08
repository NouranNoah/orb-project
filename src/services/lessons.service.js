import axiosInstance from "./axiosInstance";

//createLessons for student
export const CreateNewLesson= (data)=>{
    return axiosInstance.post('/lessons',data)
}

//RequestLessons from teachers to student
export const RequestLessons= (idLesson)=>{
    return axiosInstance.get(`/lessons/${idLesson}/interested-teachers`)
}

//Create Or Get Thread
export const CreateOrGetThread = (lessonId, idTeacher) =>{
    return axiosInstance.post(`/negotiations/lessons/${lessonId}/thread?teacherId=${idTeacher}`)
}

// send Msg 
export const SendMsgFun = (threadID, msg) =>{
    return axiosInstance.post(`/negotiations/threads/${threadID}/messages`, msg)
}

// get all Msgs 
export const GetAllMsgs = (threadID) =>{
    return axiosInstance.get(`/negotiations/threads/${threadID}/messages?page=1`)
}

//Reject Offer
export const RejectOfferFun = (messageId) =>{
    return axiosInstance.patch(`/negotiations/messages/${messageId}/reject`)
}

//Accept Offer
export const AcceptOfferFun = (threadId, messageId) =>{
    return axiosInstance.patch(`/negotiations/threads/${threadId}/messages/${messageId}/accept`)
}

//choose-teacher
export const chooseTeacherFun = (lessonId, idTeacher) =>{
    return axiosInstance.post(`/lessons/${lessonId}/choose-teacher/${idTeacher}`)
}

//get detail of lesson
export const getLessonDetails = (lessonId) => {
    return axiosInstance.get(`/lessons/student/${lessonId}`)
}

//upcoming lesson
export const upcomingLessonFun = (params)=>{
    return axiosInstance.get(`/lessons/upcoming-lessons`,{params})
}

// Completed Lessons
export const getCompletedLessons = (params = {}) => {
    return axiosInstance.get("/completeLessons/pastCompletedLessons", {
        params
    })
}

//Problematic Lessons
export const getProblematicLessons = (params = {}) => {
    return axiosInstance.get("/completeLessons/problematicPastLessons", {
        params
    })
}

// CREATE MEETING FOR LESSON
export const CREATEMEETINGFORLESSON = (lessonId) => {
    return axiosInstance.post(`/lessons/${lessonId}/create-meeting`)
}
//Send Completion 
export const sendCompletion = (lessonId , data) => {
    const formData = new FormData();
    formData.append("completionStatus", data.completionStatus);

    if (data.reasonForIncomplete) {
        formData.append("reasonForIncomplete", data.reasonForIncomplete);
    }

    if (data.description) {
        formData.append("description", data.description);
    }

    if (data.proofImage) {
        formData.append("proofImage", data.proofImage);
    }

    return axiosInstance.post(`/completeLessons/${lessonId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
//Create Review
export const CreateReview = (data) => {
    return axiosInstance.post(`/reviews`,data)
}

//cancel lesson
export const cancelLessonFun = (lessonId) =>{
    return axiosInstance.delete(`/lessons/${lessonId}/cancel`)
}
