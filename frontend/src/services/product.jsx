import axios from "axios";
const url = `${import.meta.env.VITE_API_URL}api/product`;

const create_product_service = async (data) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("description", data.description);
	formData.append("reference_number", data.reference_number);
	formData.append("category_id", data.category_id);
	formData.append("image", data.image);
	formData.append("pdf_file", data.pdf_file);
	formData.append("is_active", data.is_active);
	const result = await axios.post(`${url}/create`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return result.data;
}

const create_product_variants_service = async (data) => {

	const formData = new FormData();

	data.productVariants.forEach((variant, index) => {
		formData.append('images', variant.color_image);
		formData.append('images', variant.main_image);
	});

	const cleanedVariants = data.productVariants.map(variant => {
		const cleanVariant = { ...variant };
		delete cleanVariant.color_image;
		delete cleanVariant.main_image;
		return cleanVariant;
	});

	formData.append("productVariants", JSON.stringify(cleanedVariants));
	const result = await axios.post(`${url}/product-variants/${data.product_id}`,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		});
	return result.data;
};

const update_product_variants_service = async (data) => {
	const formData = new FormData();
	formData.append('color', data.color);
	formData.append('price', data.price);
	formData.append('stock', data.stock);
	formData.append('reference', data.reference);
	formData.append('color_image', data.color_image);
	formData.append('main_image', data.main_image);
	const result = await axios.put(`${url}/product-variants/${data.id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return result.data;
};

const delete_product_variants_service = async (id) => {
	console.log("id---", id);
	const result = await axios.delete(`${url}/product-variants/${id}`);
	return result.data;
}

const get_products_service = async () => {
	const result = await axios.get(`${url}/all`);
	return result.data;
}

const get_product_service = async (id) => {
	const result = await axios.get(`${url}/${id}`);
	return result.data;
}

const update_product = async (data) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("description", data.description);
	formData.append("reference_number", data.reference_number);
	formData.append("category_id", data.category_id);
	formData.append("image", data.image);
	formData.append("pdf_file", data.pdf_file);
	formData.append("is_active", data.is_active);
	const result = await axios.put(`${url}/update/${data.id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	return result.data;
}

const delete_product_service = async (id) => {
	const result = await axios.delete(`${url}/delete/${id}`);
	return result.data;
}

export {
	create_product_service,
	create_product_variants_service,
	update_product_variants_service,
	delete_product_variants_service,
	get_products_service,
	get_product_service,
	update_product,
	delete_product_service
}