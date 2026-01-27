import { useState, useEffect } from 'react';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";
import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { createPaymentIntent, confirmStripePayment } from "../../services/stripe";
import { useCartContext } from '../../context/CartContext';
import OrderConfirmed from '../OrderConfirmed';
import EmptyCart from '../EmptyCart';
import dateTime from "../../helpers";
import Header from '../Header';
import Footer from '../Footer';
import AlertMessage from "../AlertMessage";
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { FaLock, FaMapMarkerAlt, FaEnvelope, FaUser } from "react-icons/fa";
import { PiShoppingCart } from "react-icons/pi";
import amex from "../../images/card-amex.svg";
import discover from "../../images/card-discover.svg";
import jcb from "../../images/card-jcb.svg";
import mastercard from "../../images/card-mastercard.svg";
import visa from "../../images/card-visa.svg";
import "./index.css";

const Checkout = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { authUser } = useAuthenticateContext();
    const { createOrder, finalCart, setFinalCart, setCart, cart } = useCartContext();
    const [order, setOrder] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [values, setValues] = useState({
        firstname: "",
        lastname: "",
        company_name: "",
        company_address: "",
        email: "",
        password: "",
        phone: "",
        country: "GB",
        town: "",
        zipCode: "",
        address: "",
        appartment: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState({ status: false, message: "" });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || '{"items": []}';
        loadItems(storedCart);
    }, [finalCart]);

    const loadItems = (items) => {
        const result = items.items.map((el, index) => {
            return {
                product_id: el.productId,
                variantId: el.variantId,
                color: el.color,
                color_image: el.color_image,
                main_image: el.main_image,
                price: el.price,
                quantity: el.quantity,
                title: el.title
            };
        });
        setOrder(result);
    }

    const handleChange = (event) => {
        const { value, name } = event.target;
        setValues((prev) => {
            return { ...prev, [name]: value };
        });
    }

    const isDisabled = (order.length === 0 ||
        (Object.entries(values).some(([key, value]) => {
            if (key === "message" || key === "appartment") return false;
            return !authUser && (value || "").toString().trim().length === 0;
        }))
    );

    const subtotal = order.reduce((acc, item) => {
        return acc + (Number(item.price) * Number(item.quantity))
    }, 0);

    const vat = +(subtotal * 0.20);
    const delivery = 4.99;
    const total_price = +(subtotal + vat + delivery).toFixed(2);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError({ status: true, message: "Stripe is not loaded yet. Pleas etry again" });
            return
        };

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);
        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
            setError({ status: true, message: "Stripe card fields are not loaded" });
            return
        }

        setLoading(true);

        const items = order.map(el => ({
            product_id: el.product_id,
            variantId: el.variantId,
            color: el.color,
            color_image: el.color_image,
            main_image: el.main_image,
            price: el.price,
            quantity: el.quantity,
        }));

        const order_product = {
            user_id: authUser?.id || 0,
            items,
            total_price,
            status: "pending",
            created_at: dateTime.formatDate()
        }

        setLoading(true);
        setError({ status: false, message: "" });

        try {
            //1 Merr elementet e kartës
            const cardNumberElement = elements.getElement(CardNumberElement);

            //2 CKrijo PaymentIntent në backend dhe merr clientSecret
            const clientSecret = await createPaymentIntent(total_price);

            //3 Prit përdoruesin të konfirmojë pagesën
            const paymentResult = await confirmStripePayment(stripe, cardNumberElement, values, clientSecret);
            if (paymentResult.error) {
                setError({ status: true, message: paymentResult.error.message });
                return;
            }
            if (paymentResult.status === "succeeded") {
                await createOrder(order_product, values);
                setOrderSuccess(true);
                setFinalCart(0);

                setCart({
                    items: [],
                    total_price: 0,
                    user_id: authUser.id || null
                });
                localStorage.setItem("cart", JSON.stringify({
                    items: [],
                    total_price: 0,
                    user_id: authUser.id || null
                }));
            }
        } catch (error) {
            setError({ status: true, message: error.message });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (authUser) {
            setValues((prev) => ({
                ...prev,
                firstname: authUser.firstname || "",
                lastname: authUser.lastname || "",
                company_name: authUser.company_name || "",
                company_address: authUser.company_address || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
                country: authUser.country || "united-kingdom",
                town: authUser.town || "",
                zipCode: authUser.zipCode || "",
                appartment: authUser.appartment || "",
                address: authUser.address || "",
                message: authUser.message || ""
            }));
        }
    }, [authUser]);

    return (
        <>
            <Header />
            <Container className="checkout-page-container">
                {errors.status && (
                    <AlertMessage status={true} message={errors.message} />
                )}
                {orderSuccess ? (
                    <OrderConfirmed />
                ) : cart.items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        <Row className="checkout-header">
                            <Col>
                                <h1 className="page-title">
                                    <PiShoppingCart className="me-2" />
                                    Checkout
                                    <Badge bg="primary" className="ms-3 item-count-badge">
                                        {order.length} {order.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </h1>
                            </Col>
                        </Row>

                        {loading && (
                            <div className="loading-overlay">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Processing...</span>
                                </div>
                                <p>Processing your payment, please wait...</p>
                            </div>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Row className="checkout-content">
                                <Col lg={7} className="pe-lg-4">
                                    <Card className="shipping-form-card">
                                        <Card.Body>
                                            <h2 className="form-section-title">
                                                <FaUser className="me-2" />
                                                Billing address
                                            </h2>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="firstname">
                                                        <Form.Label>First name *</Form.Label>
                                                        <Form.Control
                                                            name="firstname"
                                                            value={values.firstname}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter first name"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="lastname">
                                                        <Form.Label>Last name *</Form.Label>
                                                        <Form.Control
                                                            name="lastname"
                                                            value={values.lastname}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter last name"
                                                            className="form-input"
                                                            required

                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="company_name">
                                                        <Form.Label>Company name</Form.Label>
                                                        <Form.Control
                                                            name="company_name"
                                                            value={values.company_name}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter Company name"
                                                            className="form-input"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="company_address">
                                                        <Form.Label>Company address</Form.Label>
                                                        <Form.Control
                                                            name="company_address"
                                                            value={values.company_address}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter Company address"
                                                            className="form-input"
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="email">
                                                        <Form.Label>Email address *</Form.Label>
                                                        <Form.Control
                                                            name="email"
                                                            value={values.email}
                                                            onChange={handleChange}
                                                            type="email"
                                                            placeholder="Enter email"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="phoneNumber">
                                                        <Form.Label>Phone number *</Form.Label>
                                                        <Form.Control
                                                            name="phone"
                                                            value={values.phone}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Phone number"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <h2 className="form-section-title mt-5">
                                                <FaMapMarkerAlt className="me-2" />
                                                Shipping Address
                                            </h2>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="country">
                                                        <Form.Label>Country / Region *</Form.Label>
                                                        <Form.Select
                                                            name="country"
                                                            value={values.country}
                                                            onChange={handleChange}
                                                            className="form-input"
                                                            disabled={!!authUser}
                                                        >
                                                            <option value={values.country}>United Kingdom (UK)</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="town">
                                                        <Form.Label>Town/City *</Form.Label>
                                                        <Form.Control
                                                            name="town"
                                                            value={values.town}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter town/city"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-4" controlId="zip">
                                                        <Form.Label>Postal Code *</Form.Label>
                                                        <Form.Control
                                                            name="zipCode"
                                                            value={values.zipCode}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter postal code"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group className="mb-4" controlId="address">
                                                        <Form.Label>Address *</Form.Label>
                                                        <Form.Control
                                                            name="address"
                                                            value={values.address}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter address"
                                                            className="form-input"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={12}>
                                                    <Form.Group className="mb-4" controlId="appartment">
                                                        <Form.Label>Apartment, suite, unit, etc.</Form.Label>
                                                        <Form.Control
                                                            name="appartment"
                                                            value={values.appartment}
                                                            onChange={handleChange}
                                                            type="text"
                                                            placeholder="Enter apartment/suite/unit"
                                                            className="form-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <h2 className="form-section-title mt-5">
                                                <FaEnvelope className="me-2" />
                                                Additional Information
                                            </h2>

                                            <Form.Group className="mb-4" controlId="information">
                                                <Form.Label>Order notes (optional)</Form.Label>
                                                <Form.Control
                                                    name="message"
                                                    value={values.message}
                                                    onChange={handleChange}
                                                    as="textarea"
                                                    placeholder="Notes about your order, e.g. special delivery instructions"
                                                    style={{ height: '120px' }}
                                                    className="form-input"
                                                />
                                            </Form.Group>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={5} className="ps-lg-4">
                                    <div className="order-summary-container">
                                        <Card className="order-summary-card">
                                            <Card.Body>
                                                <h2 className="summary-title">Order Summary</h2>

                                                <div className="order-items">
                                                    {order.map((item, index) => (
                                                        <div key={index} className="order-item">
                                                            <div className="item-image">
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item.main_image}`}
                                                                    alt={item.title}
                                                                    loading="lazy"
                                                                />
                                                                <span className="item-quantity">{item.quantity}</span>
                                                            </div>
                                                            <div className="item-details">
                                                                <h4 className="item-title">{item.title}</h4>
                                                                <div className="item-variant">
                                                                    <span>{item.color}</span>
                                                                </div>
                                                            </div>
                                                            <div className="item-price">£{(item.price * item.quantity).toFixed(2)}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="order-totals">
                                                    <div className="total-row">
                                                        <span>Subtotal</span>
                                                        <span>£{subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="total-row">
                                                        <span>VAT (20%)</span>
                                                        <span>£{vat.toFixed(2)}</span>
                                                    </div>
                                                    <div className="total-row">
                                                        <span>Delivery</span>
                                                        <span>£{delivery}</span>
                                                    </div>
                                                    <div className="total-row grand-total">
                                                        <span>Total</span>
                                                        <span>£{total_price}</span>
                                                    </div>
                                                </div>

                                                <div className="secure-checkout">
                                                    <FaLock className="me-2" />
                                                    <span>Secure checkout</span>
                                                </div>


                                                <div className="card-input mb-3 card-number-label-wrapper">
                                                    <label>Card Number</label>
                                                    <ul className="card-icons-list">
                                                        <li><img src={visa} alt="Visa" /></li>
                                                        <li><img src={mastercard} alt="Mastercard" /></li>
                                                        <li><img src={amex} alt="Amex" /></li>
                                                        <li><img src={discover} alt="Discover" /></li>
                                                        <li><img src={jcb} alt="JCB" /></li>
                                                    </ul>
                                                </div>

                                                <div className="card-number-wrapper mb-3">
                                                    <CardNumberElement className="stripe-input" />
                                                </div>

                                                <div className="card-input mb-3">
                                                    <label>Expiry Date</label>
                                                    <CardExpiryElement className="stripe-input" />
                                                </div>
                                                <div className="card-input mb-3">
                                                    <label>CVC / CVV</label>
                                                    <CardCvcElement className="stripe-input" />
                                                </div>
                                                <div className="card-input mb-3">
                                                    <label>Name on Card</label>
                                                    <Form.Control type="text" placeholder="Cardholder name" required />
                                                </div>

                                                <Button
                                                    variant="primary"
                                                    className="place-order-btn"
                                                    type="submit"
                                                    disabled={order.length === 0 || isDisabled || !stripe || loading}
                                                >
                                                    {loading ? "Processing..." : "Place Order"}

                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </>
                )}
            </Container>
            <Footer />
        </>
    )
}

export default Checkout;