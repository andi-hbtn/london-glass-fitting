import { useState, useEffect } from "react";
import { Badge, Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { useCustomerContext } from "../../context/CustomerContext";
import NavAdmin from "../../components/NavAdmin";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Customers = () => {
    const { customers } = useCustomerContext();
    const [filteredCustomers, setFilteredCustomers] = useState(customers);


    useEffect(() => {
        setFilteredCustomers(customers)
    }, [customers]);

    const handleEdit = () => {

    }

    const handleDelete = () => {

    }

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase().trim();
        if (value.length <= 3) {
            setFilteredCustomers(customers);
            return
        }
        const result = customers.filter((el, index) => el.email.toLowerCase().includes(value));
        setFilteredCustomers(result);
    }


    const customerRolesBadge = (role) => {
        let variant = "";

        if (role === "admin") variant = "primary";
        else if (role === "user") variant = "success";
        else if (role === "guest") variant = "warning";
        return (
            <Badge bg={variant} className="me-1">{role}</Badge>
        )
    }

    return (
        <>
            <div className="admin-dashboard">
                <NavAdmin />
                <Container fluid className="main-content">
                    <Row>
                        <Col md={12} xl={12} className="p-4 main-content-area">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="page-title">Customers Section</h2>

                                <Col md={4}>
                                    <Form.Group className="mb-4" controlId="appartment">
                                        <Form.Label>Search Order by email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="customer"
                                            onChange={handleSearch}
                                            className="form-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </div>

                            <div className="custom-card p-4 shadow-sm">
                                <Table hover responsive className="customer-table">
                                    <thead className="table-header">
                                        <tr>
                                            <th>#</th>
                                            <th>Full Name</th>
                                            <th>C.Name</th>
                                            <th>C.Address</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Country</th>
                                            <th>Town</th>
                                            <th>Zip Code</th>
                                            <th>Appartment</th>
                                            <th>Message</th>
                                            <th>Role</th>
                                            <th>Registered</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCustomers?.length > 0 ? (
                                            filteredCustomers.map((customer, index) => (
                                                <tr key={customer.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{customer.firstname} {customer.lastname}</td>
                                                    <td>{customer.company_name || '-'}</td>
                                                    <td>{customer.company_address || '-'}</td>
                                                    <td>{customer.email}</td>
                                                    <td>{customer.phone}</td>
                                                    <td>{customer.country || '-'}</td>
                                                    <td>{customer.town || '-'}</td>
                                                    <td>{customer.zipCode || '-'}</td>
                                                    <td>{customer.appartment || '-'}</td>
                                                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {customer.message || '-'}
                                                    </td>
                                                    <td>
                                                        {customerRolesBadge(customer.roles)}
                                                    </td>
                                                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="action-btn"
                                                                onClick={() => handleDelete(customer)}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                className="action-btn"
                                                                onClick={() => handleEdit(customer)}
                                                            >
                                                                <FiEdit />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="15" className="text-center py-4">
                                                    No customers found.
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
        </>
    )
}

export default Customers;
