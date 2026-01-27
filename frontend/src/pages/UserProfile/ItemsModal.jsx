import { useMemo } from 'react';
import { Modal, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { FiPackage, FiPrinter } from 'react-icons/fi';
import { FaPoundSign } from "react-icons/fa";
import { AiOutlinePercentage } from "react-icons/ai";

const ItemsModal = ({ open, close, selectedOrderItems }) => {
    const items = useMemo(() => selectedOrderItems || [], [selectedOrderItems]);
    const formatPrice = (price) => `£${parseFloat(price || 0).toFixed(2)}`;

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);
    }, [items]);

    const vatRate = 0.20;
    const vatAmount = totalPrice * vatRate;
    const totalWithVat = totalPrice + vatAmount;
    const handlePrint = () => {
        if (!items.length) return;

        const width = 800;
        const height = 600;
        // Llogarisim pozicionin për ta vendosur në qendër të ekranit
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const printWindow = window.open(
            '',
            '_blank',
            `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
        );

        if (!printWindow) return;

        const htmlContent = `
        <html>
        <head>
            <title>Order Items</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { margin-bottom: 20px; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
                img { max-width: 100px; display: block; margin: auto; }
                h3 { text-align: right; }
            </style>
        </head>
        <body>
            <h2>Order Items (${items.length})</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Reference</th>
                        <th>Color</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><img src="${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item?.main_image}" /></td>
                            <td>${item?.variant?.reference || 'Unnamed'}</td>
                            <td>${item?.color || item?.variant?.color || 'N/A'}</td>
                            <td>${item.quantity}</td>
                            <td>£${parseFloat(item.price).toFixed(2)}</td>
                            <td>£${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h3>Total: £${totalWithVat.toFixed(2)}</h3>
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
                    Order Items ({items.length})
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-0">
                {items.length > 0 ? (
                    <div className="order-details">
                        <Row className="mb-4">
                            <Col md={6}>
                                <div className="d-flex align-items-center mb-3">
                                    <FaPoundSign className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">Total Amount</small>
                                        <h4 className="mb-0">{formatPrice(totalPrice)}</h4>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-3">
                                    <AiOutlinePercentage className="me-2 text-muted" />
                                    <div>
                                        <small className="text-muted">VAT</small>
                                        <h4 className="mb-0">{(vatRate * 100).toFixed(0)}%</h4>
                                    </div>
                                </div>
                            </Col>

                            <Col md={6} className="text-md-end">
                                {/* Nuk kemi më status nga API, mund të vendosim default ose ta heqim */}
                                <Badge bg="secondary" className="fs-6">N/A</Badge>
                            </Col>
                        </Row>

                        <h6 className="mb-3">Items ({items.length})</h6>
                        <ListGroup variant="flush">
                            {items.map((item) => (
                                <ListGroup.Item key={item.id} className="px-0">
                                    <Row className="align-items-center">
                                        <Col xs={3} md={4}>
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item?.main_image}`}
                                                alt={`Product Variant ${item?.variant?.reference || 'Image'}`}
                                                className="img-fluid rounded"
                                                style={{ width: "150px" }}
                                            />
                                        </Col>
                                        <Col xs={6} md={4}>
                                            <div className="text-muted small">
                                                <div>
                                                    <strong>
                                                        Reference Number:
                                                    </strong>
                                                    {item?.variant?.reference || 'Unnamed Product'}</div>
                                                <div>Stock: {item?.variant?.stock ?? 'N/A'} available</div>
                                                <div>Color: {item?.color || item?.variant?.color || 'N/A'}</div>
                                            </div>
                                            <div className="mt-1">
                                                <small className="text-muted">
                                                    {item.quantity} × {formatPrice(item.price)}
                                                </small>
                                            </div>
                                        </Col>
                                        <Col xs={3} md={4} className="text-end">
                                            <div className="h6 mb-0">
                                                {formatPrice(item.quantity * parseFloat(item.price))}
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <div className="mt-4 d-flex justify-content-between">
                            <small className="text-muted">Total + VAT</small>
                            <h5 className="mb-0">{formatPrice(totalWithVat)}</h5>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted">No items found for this order.</p>
                )}
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
        </Modal>
    );
};

export default ItemsModal;
