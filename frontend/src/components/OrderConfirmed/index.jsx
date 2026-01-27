import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import Login from "../AuthModal/login";
import "./index.css";
const OrderConfirmed = ({ email }) => {

    const { authUser } = useAuthenticateContext();
    const [loginModal, setLoginModal] = useState(false);

    return (
        <>
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <div className="success-icon">
                        <FaCheckCircle size={64} />
                    </div>
                    <h2 className="success-title">Order Confirmed!</h2>
                    <p className="success-message">
                        Thank you for your purchase. Your order has been received and is being processed.
                        We've sent a confirmation email to {email}.
                    </p>
                    <div className="success-actions">
                        <Button
                            as={Link}
                            to="/"
                            variant="dark"
                            className="continue-shopping-btn"
                        >
                            Continue Shopping
                        </Button>
                        {authUser?.id ? (
                            <Button
                                as={Link}
                                to={authUser?.roles === "admin" ? '/admin-products' : '/profile'}
                                variant="outline-dark"
                                className="view-orders-btn"
                            >
                                View Your Orders
                            </Button>
                        ) : (
                            <Button
                                variant="outline-dark"
                                className="view-orders-btn"
                                onClick={() => setLoginModal(!loginModal)}
                            >
                                Login/Register to view orders
                            </Button>
                        )}

                    </div>
                </Col>
            </Row >

            <Login openLogin={loginModal} closeLogin={() => setLoginModal(false)} />
            {/* <Register openRegister={registerModal} closeRegister={() => setRegisterModal(false)} /> */}
        </>
    )
}

export default OrderConfirmed;