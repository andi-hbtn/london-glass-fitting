import { useState } from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import {useCategoryContext} from "../../context/CategoryContext.jsx";
import NavAdmin from "../../components/NavAdmin/index.jsx";
import ModalManager from "../../components/modals/ModalManager.jsx";
import { fields } from "./fields.jsx";
import ConfirmDeleteModal from "./DeleteModal.jsx";
import helpers from "../../helpers/index.jsx";
import "./index.css";

const Categories = () => {
	const { categories, createCategories, updateCategory, deleteCategorie } = useCategoryContext();
	const [open, setOpen] = useState(false);
	const [caseModal, setCaseModal] = useState({ title: "", create: false, button: "" });
	const [formData, setFormData] = useState({ id: 0, title: "", description: "", image: "" });
	const [deleteModal, setDeleteModal] = useState(false);
	const [categoryId, setCategoryId] = useState(0);

	const close = () => setOpen(!open);

	const handleCreate = () => {
		setFormData({});
		setCaseModal({ title: "Create Category", create: true, button: "Create" });
		setOpen(!open);
	}

	const handleEdit = (category) => {
		setFormData(
			{ id: category.id, title: category.title, description: category.description, image: category.image }
		);
		setCaseModal({ title: "Edit Category", create: false, button: "Update" })
		setOpen(!open);
	}
	const handleDelete = async (id) => {
		try {
			setCategoryId(id);
			setDeleteModal(true);
		} catch (error) {
			console.log("error----", error);
		}
	};

	const confirmDeleteModal = async () => {
		if (categoryId !== null) {
			const result = await deleteCategorie(categoryId);
			setDeleteModal(false);
			return result;
		}
	}



	return (
		<div className="admin-dashboard">
			<NavAdmin />
			<Container fluid className="main-content">
				<Row>
					<Col md={12} xl={12} className="p-4 main-content-area">
						<div className="d-flex justify-content-between align-items-center mb-4">
							<h2 className="page-title">Category Management</h2>
							<Button variant="primary" className="rounded-pill" onClick={handleCreate}>
								<FiPlus className="me-2" />
								Add New Category
							</Button>
						</div>

						<div className="custom-card p-4 shadow-sm">
							<Table hover responsive className="category-table">
								<thead className="table-header">
									<tr>
										<th>ID</th>
										<th>Category</th>
										<th>Created At</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{categories.map((category, index) => (
										<tr key={index} className="table-row">
											<td className="text-muted">#{category.id}</td>
											<td>
												<div className="d-flex align-items-center">
													<img
														src={`${import.meta.env.VITE_API_URL}api/category/uploads/${category.image}`}
														alt="category"
														className="category-img rounded-circle me-3"
													/>
													<h6 className="mb-0">{category.title}</h6>
												</div>
											</td>
											<td>
												<Badge bg="secondary">
													{helpers.formatIsoDateTime(category.created)}
												</Badge>
											</td>
											<td>
												<div className="d-flex gap-2">
													<Button
														variant="outline-primary"
														size="sm"
														className="action-btn"
														onClick={() => handleEdit(category)}
													>
														<FiEdit />
													</Button>
													<Button
														variant="outline-danger"
														size="sm"
														className="action-btn"
														onClick={() => handleDelete(category.id)}
													>
														<FiTrash2 />
													</Button>
												</div>
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
				create={createCategories}
				update={updateCategory}
				data={formData}
				setData={setFormData}
			/>}

			<Button
				variant="primary"
				className="floating-action-btn rounded-circle"
				onClick={handleCreate}
			>
				<FiPlus size={24} />
			</Button>

			<ConfirmDeleteModal
				open={deleteModal}
				close={() => { return setDeleteModal(false) }}
				onConfirm={confirmDeleteModal} />
		</div>
	)
}

export default Categories;