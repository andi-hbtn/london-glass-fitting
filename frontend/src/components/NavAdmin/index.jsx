import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { useNavigate } from "react-router";
import { Link } from 'react-router';

import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FiLogOut, FiBox, FiList, FiShoppingBag, FiHome } from "react-icons/fi";
import { CiLock } from "react-icons/ci";

const NavAdmin = () => {
    const navigate = useNavigate();
    const { authUser, logout } = useAuthenticateContext();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar">
            <Container fluid>
                <Navbar.Brand as={Link} to="/admin-products" className="d-flex align-items-center">
                    <FiBox className="me-2" />
                    <span className="brand-text">Admin Panel</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/admin-category" className="nav-link">
                            <FiList className="me-1" />
                            Categories
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin-products" className="nav-link">
                            <FiShoppingBag className="me-1" />
                            Products
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin-product-with-colors" className="nav-link">
                            <FiBox className="me-1" />
                            Product Colors
                        </Nav.Link>
                        <Nav.Link as={Link} to="/admin-orders" className="nav-link">
                            <FiBox className="me-1" />
                            Orders
                        </Nav.Link>

                        <Nav.Link as={Link} to="/admin-customers" className="nav-link">
                            <FiBox className="me-1" />
                            Customers
                        </Nav.Link>

                        <Nav.Link as={Link} to="/" className="nav-link">
                            <FiHome className="me-1" />
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/forgot-password" className="nav-link">
                            <CiLock className="me-1" />
                            Forgot password
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {authUser && (
                            <Button variant="outline-light" onClick={handleLogout} className="logout-btn">
                                <FiLogOut className="me-2" />
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavAdmin;