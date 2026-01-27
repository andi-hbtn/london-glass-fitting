import { useState } from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import { useProductContext } from "../../context/ProductContext";
import { useCategoryContext } from "../../context/CategoryContext.jsx";
import NavAdmin from "../../components/NavAdmin";
import ModalManager from "../../components/modals/ModalManager";
import { fields } from "./fields";

const ProductModal = () => {
	const { products, createProduct, updateProduct, deleteProduct } = useProductContext();
	const { categories } = useCategoryContext();
	const [open, setOpen] = useState(false);
	const [caseModal, setCaseModal] = useState({ title: "", create: false, button: "" });

	const initialProductData = {
		title: "",
		description: "",
		category_id: 0,
		price: 0,
		stock: 0,
		image: "",
		pdf_fiile: "",
		is_active: true
	};

	const initialCategorytData = {
		id: 0,
		title: "",
		description: "",
		image: "",
	};

	const [formData, setFormData] = useState(
		{
			title: "",
			description: "",
			category_id: 0,
			image: "",
			pdf_fiile: "",
			is_active: true
		}
	);

	const close = () => {
		setFormData(initialProductData || initialCategorytData);
		setOpen(!open);
	};

	const handleCreate = () => {
		setFormData({ ...formData, category_id: categories[0].id, });
		setCaseModal({ title: "Create product", create: true, button: "Create" });
		setOpen(!open);
	}

	const handleEdit = (product) => {
		setFormData(
			{
				id: product.id,
				title: product.title,
				description: product.description,
				reference_number: product.reference_number,
				category_id: product.category_id,
				is_active: product.is_active
			}
		);
		setCaseModal({ title: "Edit product", create: false, button: "Update" })
		setOpen(!open);
	}

	const handleDelete = async (id) => {
		await deleteProduct(id);
	}

	return (
		<>
			<div className="admin-dashboard">
				<NavAdmin />
				<Container fluid className="main-content">
					<Row>
						<Col md={12} xl={12} className="p-4 main-content-area">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h2 className="page-title">Product Management</h2>
								<Button variant="primary" className="rounded-pill" onClick={handleCreate}>
									<FiPlus className="me-2" />
									Add New Product
								</Button>
							</div>

							<div className="custom-card p-4 shadow-sm">
								<Table hover responsive className="product-table">
									<thead className="table-header">
										<tr>
											<th>ID</th>
											<th>Product</th>
											<th>Reference</th>
											<th>Category</th>
											<th>Status</th>
											<th>Image</th>
											<th>Pdf</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{products.map((product, index) => (
											<tr key={index} className="table-row">
												<td className="text-muted">#{product.id}</td>
												<td>
													<div className="d-flex align-items-center">
														<div>
															<h6 className="mb-0">{product.title}</h6>
															<small className="text-muted">
																{product.description.substring(0, 40)}...
															</small>
														</div>
													</div>
												</td>
												<td>{product?.reference_number}</td>
												<td>
													<Badge bg="secondary" className="category-badge">
														{product.category.title}
													</Badge>
												</td>
												<td>
													<Badge bg={product.is_active === true ? 'success' : 'secondary'}>
														{product.is_active === true ? 'Active' : 'Not Active'}
													</Badge>
												</td>
												<td>
													<img src={`${import.meta.env.VITE_API_URL}api/product/uploads/${product.image}`} alt="figure" width={"100px"} height={"100px"} />
												</td>
												<td>
													{product.pdf_file ? (
														<a
															href={`${import.meta.env.VITE_API_URL}api/product/uploads/${product.pdf_file}`}
															target="_blank"
															rel="noopener noreferrer"
															className="btn btn-sm btn-outline-primary"
														>
															View PDF
														</a>
													) : (
														<span className="text-muted">No PDF</span>
													)}
												</td>
												<td>
													<Button
														variant="outline-primary"
														size="sm"
														className="me-2 action-btn"
														onClick={() => handleEdit(product)}
													>
														<FiEdit />
													</Button>
													<Button
														variant="outline-primary"
														size="sm"
														className="me-2 action-btn"
														onClick={() => handleDelete(product.id)}
													>
														<FiTrash />
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</Col>
					</Row>
				</Container>

				{open && <ModalManager
					open={open}
					close={close}
					fields={fields}
					case_modal={caseModal}
					create={createProduct}
					update={updateProduct}
					data={formData}
					setData={setFormData}
					categories={categories}
				/>}

				<Button
					variant="primary"
					className="floating-action-btn rounded-circle"
					onClick={handleCreate}
				>
					<FiPlus size={24} />
				</Button>
			</div>
		</>
	)
}

export default ProductModal;
