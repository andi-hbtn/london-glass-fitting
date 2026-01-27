import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/`;


const get_customers_service = async () => {
    const result = await axios.get(`${url}user/all`);
    return result;
}

export { get_customers_service }