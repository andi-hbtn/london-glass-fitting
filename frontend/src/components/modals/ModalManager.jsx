import { useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import AlertMessage from "../AlertMessage";

const ModalManager = ({ open, categories, close, case_modal, fields, create, update, data, setData }) => {

	const [resMsg, setResMsg] = useState({ error: false, message: "", status: 0 });
	const initialProductData = {
		title: "",
		description: "",
		category_id: 0,
		image: "",
		pdf_file: "", // PDF field
		is_active: true
	};

	const initialCategorytData = {
		id: 0,
		title: "",
		description: "",
		image: "",
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let response;

			if (case_modal.create) {
				response = await create(data);
			} else {
				response = await update(data);
			}

			setData(initialProductData || initialCategorytData);
			close();
			setResMsg({ error: true, message: response.message, status: response.status });
		} catch (error) {
			setResMsg({ error: true, message: error.message, status: error.statusCode })
		}
	}

	return (
		<>
			<Modal
				show={open}
				onHide={close}
				backdrop="static"
				keyboard={false}
			>
				<Form onSubmit={onSubmit} encType="multipart/form-data">
					<Modal.Header closeButton>
						<Modal.Title>{case_modal.title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{
							fields.map((field, index) => {
								return (
									<Form.Group key={index} className="mb-3">
										{
											field.name === "category_id" ?
												<Form.Select
													name={field.name}
													onChange={(e) => setData({ ...data, [field.name]: Number(e.target.value) })}
													value={data[field.name]}
													aria-label="Default select example"
												>
													{
														categories.map((category, i) => (
															<option key={i} value={category.id}>{category.title}</option>
														))
													}
												</Form.Select>
												: field.name === "image" || field.name === "pdf_file" ?
													<>
														<Form.Label>{field.label}</Form.Label>
														<Form.Control
															type={field.type}
															name={field.name}
															onChange={(e) => setData({ ...data, [field.name]: e.target.files[0] })}
														/>
													</>
													: field.name === "is_active" ?
														<Form.Check
															name={field.name}
															type={field.type}
															label={field.label}
															checked={data[field.name]}
															onChange={(e) => setData({ ...data, [field.name]: e.target.checked })}
														/>
														:
														<>
															<Form.Label>{field.label}</Form.Label>
															<Form.Control
																type={field.type}
																name={field.name}
																placeholder={field.placeholder}
																onChange={(e) => setData({ ...data, [field.name]: e.target.value })}
																value={data[field.name]}
															/>
														</>
										}
									</Form.Group>
								)
							})
						}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={close}>
							Close
						</Button>
						<Button variant="primary" type="submit">{case_modal.button}</Button>
					</Modal.Footer>
				</Form>
				{resMsg.error &&
					<AlertMessage
						message={resMsg.message}
						status={resMsg.status}
					/>
				}
			</Modal>
		</>
	);
}

export default ModalManager;
