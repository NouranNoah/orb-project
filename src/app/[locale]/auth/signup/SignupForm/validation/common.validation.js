export const validateCommon = (formData, t) => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = t("required");
    if (!formData.lastName.trim()) errors.lastName = t("required");
    if (!formData.email.trim()) errors.email = t("required");
    if (!formData.password) errors.password = t("required");
    if (!formData.confirmPassword) errors.confirmPassword = t("required");
    if (formData.password.length < 8) errors.password = t("minPassword");
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t("passwordMismatch");
    }

    return errors;
};
