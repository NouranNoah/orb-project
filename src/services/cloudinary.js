import axios from "axios";

export const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "orb_project");

    const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcfjrn7ab/image/upload",
        formData
    );

    return res.data.secure_url;
};
