import { useAuthenticateContext } from '../../context/AuthenticateContext.jsx';
import { useOrderContext } from "../../context/OrderContext.jsx";
import helpers from "../../helpers/index.jsx";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import Header from "../../components/Header";
import { FiEye } from "react-icons/fi";
import ItemsModal from './ItemsModal';

import "./index.css";

const UserProfile = () => {
    const { authUser } = useAuthenticateContext();
    const { getUserOrderItems } = useOrderContext();

    const [orders, setOrders] = useState([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    const [error, setError] = useState(null); // used now
    const [loading, setLoading] = useState(true); // used now

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getUserOrderItems(authUser.id);
                if (result.statusCode === 200) {
                    setOrders(result.result);
                } else {
                    setError(result.message || 'Failed to load orders');
                }
            } catch (err) {
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [authUser.id, getUserOrderItems]); // dependencies fixed

    const statusBadge = (status) => {
        let variant = "";
        if (status === "pending") variant = "warning";
        else if (status === "shipped") variant = "info";
        else if (status === "delivered") variant = "success";
        else if (status === "cancelled") variant = "danger";
        return <Badge bg={variant} className="me-1">{status}</Badge>;
    };

    const handleOpen = (id) => {
        const order = orders.find(o => o.id === id);
        setSelectedOrderItems(order?.orderItems || []);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedOrderItems([]);
    }

    return (
        <>
            <Header />
            <Container className="profile-container">
                <Row className="mb-5">
                    <Col md={4}>
                        <Card className="profile-card">
                            <Card.Body className="text-center">
                                <div className="profile-avatar">
                                    <span>
                                        {authUser.firstname.charAt(0)}
                                        {authUser.lastname.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="profile-name">{authUser.firstname} {authUser.lastname}</h3>
                                <p className="profile-email">{authUser.email}</p>
                                <p className="profile-meta">Member since {helpers.formatIsoDateTime(authUser.createdAt)}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <Card className="orders-card">
                            <Card.Header className="orders-header">
                                <h3>Your Orders</h3>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center my-4">
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : error ? (
                                    <Alert variant="danger">{error}</Alert>
                                ) : orders?.length > 0 ? (
                                    <div className="orders-table-container">
                                        <Table hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Price</th>
                                                    <th>Status</th>
                                                    <th>Order Date</th>
                                                    <th>Check Order</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order, index) => (
                                                    <tr key={index}>
                                                        <td>#{order.id}</td>
                                                        <td>{order?.total_price || "No product"}</td>
                                                        <td>{statusBadge(order.status)}</td>
                                                        <td>{helpers.formatIsoDateTime(order?.created_at)}</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="me-2 action-btn"
                                                                onClick={() => handleOpen(order.id)}
                                                            >
                                                                <FiEye />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="no-orders">
                                        <p>You haven't placed any orders yet.</p>
                                        <a href="/products" className="btn btn-primary">
                                            Browse Products
                                        </a>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ItemsModal open={open} close={handleClose} selectedOrderItems={selectedOrderItems} />
        </>
    );
}

export default UserProfile;
