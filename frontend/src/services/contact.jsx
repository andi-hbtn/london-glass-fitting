import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/contact`;

const sendMessage = async (data) => {

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("postal_code", data.postal_code);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append("file", data.attachment_file);

    const result = await axios.post(`${url}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return result;
}

export { sendMessage };