import { Row, Col, Button } from "react-bootstrap";
import { FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router";

const EmptyCart = () => {
    return (
        <Row className="justify-content-center" style={{ margin: "50px" }}>
            <Col md={8} className="text-center">
                <div className="empty-cart-icon">
                    <FaShoppingBag size={64} />
                </div>
                <h2 className="empty-cart-title">Your cart is empty</h2>
                <p className="empty-cart-message">
                    Looks like you haven't added anything to your cart yet
                </p>
                <Button as={Link} to="/" variant="dark" className="empty-cart-button">
                    Continue Shopping
                </Button>
            </Col>
        </Row>
    );
}

export default EmptyCart;