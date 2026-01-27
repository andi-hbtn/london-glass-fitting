import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/order`;


export const create_order_service = async (data, userInfo) => {
	const payload = {
		...data,
		...userInfo,
	};
	const result = await axios.post(`${url}/create`, payload);
	return result;
}

export const get_orders_service = async () => {
	const result = await axios.get(`${url}/all`);
	return result;
}

export const get_order_service = async (id) => {
	const result = await axios.get(`${url}/${id}`);
	return result;
}

export const get_user_order_items_service = async (id) => {
	const result = await axios.get(`${url}/user_order_items/${id}`);
	return result;
}

export const update_orderStatus_service = async (id, status) => {
	const result = await axios.put(`${url}/update-status/${id}`, { status });
	return result;
}

export const get_orders_status_service = async (status) => {
	const result = await axios.get(`${url}/status/${status}`);
	return result;
}