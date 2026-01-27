import { useState, useEffect } from "react";
import { useOrderContext } from "../../context/OrderContext.jsx";
import NavAdmin from "../../components/NavAdmin/index.jsx";
import { Container, Row, Col, Table, Button, Badge, Form, Alert} from "react-bootstrap";
import { FiEye } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io";
import { LuPackageCheck } from "react-icons/lu";
import { MdOutlineLocalShipping } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import helpers from "../../helpers/index.jsx";
import OrderModal from "./OrderModal";

const StatusNav = ({ getOrdersByStatus }) => {
	const [activeStatus, setActiveStatus] = useState("all");

	const statusOptions = [
		{ key: "all", label: "All", icon: <IoCartOutline size={18} /> },
		{ key: "pending", label: "Pending", icon: <IoIosTimer size={18} /> },
		{ key: "shipped", label: "Shipped", icon: <MdOutlineLocalShipping size={18} /> },
		{ key: "delivered", label: "Delivered", icon: <LuPackageCheck size={18} /> },
		{ key: "cancelled", label: "Cancelled", icon: <FaRegTrashCan size={18} /> },
	];

	const handleSelect = (key) => {
		setActiveStatus(key);
		getOrdersByStatus(key);
	};

	return (
		<div className="d-flex flex-wrap gap-2 mb-4">
			{statusOptions.map((status) => (
				<Button
					key={status.key}
					variant={activeStatus === status.key ? "primary" : "outline-light"}
					onClick={() => handleSelect(status.key)}
					className={`d-flex align-items-center gap-2 px-3 py-2 shadow-sm rounded-pill ${activeStatus === status.key
						? "fw-semibold"
						: "text-secondary border-secondary"
						}`}
					style={{
						backgroundColor: activeStatus === status.key ? "#0d6efd" : "#212529",
						color: activeStatus === status.key ? "white" : "#adb5bd",
						border: "1px solid #444",
						transition: "all 0.2s ease-in-out",
					}}
				>
					{status.icon}
					<span>{status.label}</span>
				</Button>
			))}
		</div>
	);
};

const Orders = () => {
	const { orders, updateOrderStatus, getOrdersByStatus, filteredOrders, statusOrder, status } = useOrderContext();
	const [orderId, setOrderId] = useState(0);
	const [searchResults, setSearchResults] = useState(filteredOrders);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setSearchResults(filteredOrders);
	}, [filteredOrders]);

	const handleOpen = (id) => {
		setOrderId(id);
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			await updateOrderStatus(orderId, newStatus);
			statusOrder(!status);
		} catch (error) {
			console.error("Error updating order status:", error);
			return error;
		}
	};

	const handleSearch = (event) => {
		const term = event.target.value.toLowerCase().trim();

		if (term === "" || term.length <= 2) {
			setSearchResults(filteredOrders);
			return;
		}

		const results = orders.filter((order) => {
			const sku = helpers.generateId(order.id).toLowerCase();
			const email = order.user?.email?.toLowerCase() || "";
			return sku.includes(term) || email.includes(term);
		});

		setSearchResults(results);
	};

	const statusBadge = (status) => {
		let variant = "";
		if (status === "pending") variant = "warning";
		else if (status === "shipped") variant = "info";
		else if (status === "delivered") variant = "success";
		else if (status === "cancelled") variant = "danger";
		return <Badge bg={variant} className="me-1">{status}</Badge>;
	};

	return (
		<>
			<div className="admin-dashboard bg-light min-vh-100">
				<NavAdmin />
				<Container fluid className="main-content">
					<Row>
						{/* Pjesa kryesore */}
						<Col md={12} xl={12} className="p-4 main-content-area">
							{/* Titulli */}
							<div className="d-flex justify-content-between align-items-center mb-3">
								<h2 className="fw-bold text-dark">Order Management</h2>
								<Col md={4}>
									<Form.Group controlId="searchOrder">
										<Form.Label className="fw-semibold text-secondary">
											Search Order
										</Form.Label>
										<Form.Control
											type="text"
											name="orderNumber"
											placeholder="Type email or order number..."
											onChange={handleSearch}
										/>
									</Form.Group>
								</Col>
							</div>

							{/* Filtrat e statusit */}
							<StatusNav getOrdersByStatus={getOrdersByStatus} />

							{/* Tabela e porosive */}
							<div className="custom-card p-4 bg-white rounded-4 shadow-sm">
								<Table hover responsive className="align-middle">
									<thead className="table-light">
										<tr>
											<th>ID</th>
											<th>Order Number</th>
											<th>Fullname</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Zip Code</th>
											<th>Appartment</th>
											<th>Address</th>
											<th>Price</th>
											<th>Created at</th>
											<th>Status</th>
											<th>Open</th>
											<th>Edit</th>
										</tr>
									</thead>
									<tbody>
										{searchResults.length > 0 ? (
											searchResults.map((order, index) => (
												<tr key={order.id}>
													<td className="text-muted text-center">#{order.id}</td>
													<td className="text-center">{helpers.generateId(order.id)}</td>
													<td className="text-center">
														{order.user.firstname} {order.user?.lastname}
													</td>
													<td className="text-center">{order.user.email}</td>
													<td className="text-center">{order.user.phone}</td>
													<td className="text-center">{order.user.zipCode}</td>
													<td className="text-center">{order.user.appartment}</td>
													<td className="text-center">{order.user.address}</td>
													<td className="text-center fw-semibold">
														${order.total_price}
													</td>
													<td className="text-center text-secondary">
														{new Date(order.created_at).toLocaleDateString()}
													</td>
													<td className="text-center">
														{statusBadge(order.status)}
													</td>
													<td className="text-center">
														<Button
															variant="outline-primary"
															size="sm"
															onClick={() => handleOpen(order.id)}
														>
															<FiEye />
														</Button>
													</td>
													<td className="text-center">
														<Form.Select
															value={order.status}
															onChange={(e) =>
																handleStatusChange(order.id, e.target.value)
															}
															style={{
																cursor: "pointer",
																width: "fit-content",
																appearance: "none",
																padding:
																	"0.25rem 1.5rem 0.25rem 0.75rem",
															}}
														>
															<option value="pending">Pending</option>
															<option value="shipped">Shipped</option>
															<option value="delivered">Delivered</option>
															<option value="cancelled">Cancelled</option>
														</Form.Select>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan="13">
													<div className="d-flex justify-content-center py-4">
														<Alert variant="secondary" className="mb-0 text-center w-75">
															No orders found for this status.
														</Alert>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</div>
						</Col>
					</Row>
				</Container>
			</div>

			<OrderModal open={open} close={handleClose} orders={orders} id={orderId} />
		</>
	);
};

export default Orders;
