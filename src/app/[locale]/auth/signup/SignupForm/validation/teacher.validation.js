export const validateTeacherAcademic = (teacherProfile, t) => {
    const errors = {};

    if (!Array.isArray(teacherProfile.education_system) || teacherProfile.education_system.length === 0)
        errors.teacherEducationSystem = t("required");

    if (!Array.isArray(teacherProfile.academic_stages) || teacherProfile.academic_stages.length === 0)
        errors.academicStages = t("required");

    if (!Array.isArray(teacherProfile.subjects) || teacherProfile.subjects.filter(s => String(s).trim()).length === 0)
        errors.subjects = t("required");

    return errors;
};

export const validateTeacherDetails = (teacherProfile, t) => {
    const errors = {};

    if (!teacherProfile.pricePerHour)
        errors.pricePerHour = t("required");

    if (!teacherProfile.certificate)
        errors.certificate = t("required");

    if (!teacherProfile.bio)
        errors.bio = t("required");

    return errors;
};

export const validateTeacher = (teacherProfile, t) => ({
    ...validateTeacherAcademic(teacherProfile, t),
    ...validateTeacherDetails(teacherProfile, t),
});
