export const validateStudent = (studentProfile, t) => {
    const errors = {};

    if (!studentProfile.education_system)
        errors.studentEducationSystem = t("required");

    if (!studentProfile.grade)
        errors.studentGrade = t("required");

    return errors;
};
