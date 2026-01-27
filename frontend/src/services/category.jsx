import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/category`;

const create_category_service = async (data) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("image", data.image);
	const result = await axios.post(`${url}/create`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return result;
}

const get_categories_service = async () => {
	const result = await axios.get(`${url}/all`);
	return result;
}

const get_category_service = async (id) => {
	const result = await axios.get(`${url}/${id}`);
	return result;
}

const update_category_service = async (data) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("image", data.image);
	const result = await axios.put(`${url}/update/${data.id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return result;
}

const delete_category_service = async (id) => {
	const result = await axios.delete(`${url}/delete/${id}`);
	return result;
}

export { create_category_service, get_categories_service, get_category_service, update_category_service, delete_category_service }