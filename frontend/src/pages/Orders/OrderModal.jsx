import { useEffect, useState } from 'react';
import { useOrderContext } from "../../context/OrderContext";
import { Modal, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { FiPackage, FiCalendar, FiUser, FiPrinter } from 'react-icons/fi';
import { FaPoundSign } from "react-icons/fa";
import { AiOutlinePercentage } from "react-icons/ai";

const OrdersModal = ({ open, close, id }) => {

    const { getOrderById } = useOrderContext();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await getOrderById(id);
                if (result.statusCode === 200) {
                    setOrders(result.data);
                }
            } catch (error) {
                console.log("error in order modal");
            }
        };
        if (id) fetchOrder();
    }, [id, getOrderById]);

    // Llogarit 20% të shumës dhe shtoje te total_price
    const totalPrice = parseFloat(orders?.total_price || 0);
    const vat_price = totalPrice * 0.20;
    const totalWithVat = totalPrice + vat_price;

    const handlePrint = () => {
        if (!orders || !orders.orderItems?.length) return;

        const width = 800;
        const height = 600;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const printWindow = window.open(
            '',
            '_blank',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
        );

        if (!printWindow) return;

        // Gjenerojmë HTML për printim
        const htmlContent = `
        <html>
        <head>
            <title>Order #${orders.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2, h3, h4 { margin: 0 0 10px 0; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                img { max-width: 60px; display: block; margin: auto; }
                .total { text-align: right; font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Order #${orders.id}</h2>
            <p><strong>Customer:</strong> ${orders.user ? orders.user.firstname + ' ' + orders.user.lastname : 'Guest'}</p>
            <p><strong>Order Date:</strong> ${new Date(orders.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${orders.status?.toUpperCase()}</p>

            <h3>Items (${orders.orderItems.length})</h3>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Reference</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.orderItems.map(item => `
                        <tr>
                            <td><img src="${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item?.main_image}" /></td>
                            <td>${item.variant?.reference || 'N/A'}</td>
                            <td>${item.variant?.product?.category?.title || 'N/A'}</td>
                            <td>${item.product?.stock || 'N/A'}</td>
                            <td>${item.quantity}</td>
                            <td>£${parseFloat(item.price).toFixed(2)}</td>
                            <td>£${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <h4 class="total">Total + 20% VAT: £${totalWithVat.toFixed(2)}</h4>
        </body>
        </html>
    `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();

        close(); // mbyll modal
    };

    return (
        <Modal show={open} onHide={close} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton className="border-bottom-0">
                <Modal.Title className="fw-bold">
                    <FiPackage className="me-2" />
                    Orders ({orders?.orderItems?.length})
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-0">
                <div className="order-details">
                    {/* Loop through all orders */}
                    <div className="mb-4">
                        <Row className="mb-4">
                            <Col md={6}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaPoundSign className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">Total Amount</small>
                                        <h4 className="mb-0">&#163;{totalPrice.toFixed(2)}</h4>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <AiOutlinePercentage className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">VAT</small>
                                        <h4 className="mb-0">20%</h4>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <FiCalendar className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">Order Date</small>
                                        <h6 className="mb-0">
                                            {new Date(orders?.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h6>
                                    </div>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="d-flex align-items-center mb-3">
                                    <Badge
                                        bg={
                                            orders?.status === 'pending' ? 'warning' :
                                                orders?.status === 'shipped' ? 'info' :
                                                    orders?.status === 'delivered' ? 'success' : 'danger'
                                        }
                                        className="me-2 fs-6"
                                    >
                                        {orders?.status?.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="d-flex align-items-center">
                                    <FiUser className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">Customer</small>
                                        <h6 className="mb-0">
                                            {orders?.user ? `${orders.user.firstname} ${orders.user.lastname}` : 'Guest Customer'}
                                        </h6>

                                        {orders?.user && (
                                            <>
                                                <ul className="list-unstyled mb-0">
                                                    <li>
                                                        <small className="text-muted">
                                                            <strong>Email:</strong> {orders.user.email}
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small>
                                                            <strong>Phone:</strong> {orders.user.phone}
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small>
                                                            {orders.user.appartment && `, ${orders.user.appartment}`}
                                                        </small>
                                                    </li>
                                                    <li>
                                                        <small>
                                                            {orders.user.zipCode}, {orders.user.town}, {orders.user.country}
                                                        </small>
                                                    </li>
                                                    {orders.user.message && (
                                                        <li>
                                                            <small className="text-muted">
                                                                <strong>Message:</strong> {orders.user.message}
                                                            </small>
                                                        </li>
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                </div>

                            </Col>
                        </Row>

                        {/* Order Items */}
                        <h6 className="mb-3">Order Items ({orders?.orderItems?.length || 0})</h6>
                        <ListGroup variant="flush">
                            {orders.orderItems?.map((item) => (
                                <ListGroup.Item key={item.id} className="px-0">
                                    <Row className="align-items-center">
                                        <Col xs={3} md={2}>
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item?.main_image}`}
                                                alt={item.product?.title}
                                                className="img-fluid rounded"
                                                style={{
                                                    maxHeight: '60px',
                                                    objectFit: 'cover',
                                                    aspectRatio: '1/1'
                                                }}
                                            />
                                        </Col>
                                        <Col xs={6} md={7}>
                                            <h6 className="mb-1">{item.variant?.product?.title}</h6>
                                            <div className="text-muted small">
                                                <div>Reference: #{item.variant?.reference}</div>
                                                <div>Category: {item.variant?.product?.category?.title}</div>
                                                <div>Stock: {item.product?.stock} available</div>
                                            </div>
                                            <div className="mt-1">
                                                <small className="text-muted">
                                                    {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                </small>
                                            </div>
                                        </Col>

                                        <Col xs={3} md={3} className="text-end">
                                            <div className="h6 mb-0">
                                                &#163;{(item.quantity * parseFloat(item.price)).toFixed(2)}
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        {/* New Total Price with 20% */}
                        <div className="mt-4 d-flex justify-content-between">
                            <div>
                                <small className="text-muted">Total + 20%</small>
                            </div>
                            <h5 className="mb-0">
                                &#163;{totalWithVat.toFixed(2)}
                            </h5>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top-0 d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={close}>
                    Close
                </Button>

                <Button variant="outline-secondary" onClick={handlePrint}>
                    <FiPrinter />
                    Print
                </Button>
            </Modal.Footer >
        </Modal >
    );
};

export default OrdersModal;
