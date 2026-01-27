import { useEffect, useState } from 'react';
import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { useCartContext } from '../../context/CartContext';
import Header from "../Header";
import Footer from '../Footer';
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import EmptyCart from '../EmptyCart';
import { FaTrashAlt, FaMinus, FaPlus, FaArrowRight } from "react-icons/fa";
import { PiShoppingCart } from "react-icons/pi";
import "./index.css";

const Cart = () => {
    const { authUser } = useAuthenticateContext();
    const { cart, setCart, setFinalCart } = useCartContext();
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        const cartFromStorage = JSON.parse(localStorage.getItem("cart") || '{"items": []}');
        const items = Array.isArray(cartFromStorage.items) ? cartFromStorage.items : [];
        const newQtu = items.reduce((total, item) => total + item.quantity, 0);
        setFinalCart(newQtu);
    }, [cart, setFinalCart]);

    const subTotal = cart.items?.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const totalWithVat = +(subTotal * 0.20);
    const delivery = 4.99;
    const totalPrice = +(subTotal + totalWithVat + delivery).toFixed(2);

    const addQuantity = (item) => {
        setCart((prevState) => {
            const newItems = [...prevState.items];
            const existingIndex = newItems.findIndex(
                (cartItem) => cartItem.productId === item.productId && cartItem.variantId === item.variantId
            );
            if (existingIndex !== -1) {
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + 1,
                };
            }

            const newTotalPrice = newItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const updatedCart = {
                ...prevState,
                items: newItems,
                total_price: newTotalPrice,
            };
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeQuantity = (item) => {
        setCart((prevState) => {
            const newItems = [...prevState.items];
            const existingIndex = newItems.findIndex(
                (cartItem) => cartItem.productId === item.productId && cartItem.variantId === item.variantId
            );
            if (existingIndex !== -1) {
                if (newItems[existingIndex].quantity === 1) {
                    newItems.splice(existingIndex, 1);
                } else {
                    newItems[existingIndex].quantity -= 1;
                }
            }

            const newTotalPrice = newItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            const updatedCart = {
                ...prevState,
                items: newItems,
                total_price: newTotalPrice,
            };
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const deleteItem = (item) => {
        setIsRemoving(true);
        setTimeout(() => {
            setCart((prevState) => {
                const newItems = prevState.items.filter(
                    (cartItem) => cartItem.productId !== item.productId || cartItem.variantId !== item.variantId
                );

                const newTotalPrice = newItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );

                const updatedCart = {
                    ...prevState,
                    items: newItems,
                    total_price: newTotalPrice,
                    user_id: authUser.id || null,
                };
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                setIsRemoving(false);
                return updatedCart;
            });
        }, 300);
    };

    return (
        <>
            <Header />
            <Container className="cart-page-container">
                {cart.items?.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <>
                        <Row className="cart-header">
                            <Col>
                                <h1 className="page-title">
                                    <PiShoppingCart className="me-2" />
                                    Your Shopping Cart
                                    <Badge bg="primary" className="ms-3 item-count-badge">
                                        {cart.items?.length} {cart.items?.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </h1>
                            </Col>
                        </Row>

                        <Row className="cart-content">
                            <Col xs={12} lg={8}>
                                <div className="cart-items-container">
                                    <Table borderless className="cart-table">
                                        <thead>
                                            <tr className="table-header">
                                                <th className="product-col">Product</th>
                                                <th className="product-col">Reference</th>
                                                <th className="price-col">Price</th>
                                                <th className="quantity-col">Quantity</th>
                                                <th className="subtotal-col">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.items?.map((item, index) => (

                                                <tr
                                                    key={index}
                                                    className={`cart-item ${isRemoving ? 'removing' : ''}`}
                                                >
                                                    <td className="product-cell">
                                                        <div className="product-info">
                                                            <div className="product-image">
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${item.main_image}`}
                                                                    alt={item.title}
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="product-details">
                                                                <h3 className="product-title">{item.productTitle}</h3>
                                                                <spna className="product-title">{item.color}</spna>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="reference-cell">
                                                        {item.reference}
                                                    </td>
                                                    <td className="price-cell">
                                                        <span className="price">£{item.price}</span>
                                                    </td>
                                                    <td className="quantity-cell">
                                                        <div className="quantity-control">
                                                            <button
                                                                className="quantity-btn minus-btn"
                                                                onClick={() => removeQuantity(item)}
                                                            >
                                                                <FaMinus />
                                                            </button>
                                                            <span className="quantity-value">{item.quantity}</span>
                                                            <button
                                                                className="quantity-btn plus-btn"
                                                                onClick={() => addQuantity(item)}
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="subtotal-cell">
                                                        <div className="subtotal-content">
                                                            <span className="subtotal">£{(item.price * item.quantity).toFixed(2)}</span>
                                                            <button
                                                                className="remove-btn"
                                                                onClick={() => deleteItem(item)}
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>

                            <Col xs={12} lg={4}>
                                <div className="cart-summary">
                                    <div className="summary-header">
                                        <h2>Order Summary</h2>
                                    </div>
                                    <div className="summary-content">
                                        <div className="summary-row">
                                            <span>Subtotal</span>
                                            <span>£{subTotal?.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>VAT (20%)</span>
                                            <span>£{totalWithVat.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span>Delivery</span>
                                            <span>£{delivery}</span>
                                        </div>
                                        <div className="summary-row total-row">
                                            <span>Total</span>
                                            <span className="total-price">£{totalPrice}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="checkout-btn"
                                        href="/checkout"
                                    >
                                        Proceed to Checkout
                                        <FaArrowRight className="ms-2" />
                                    </Button>
                                    <div className="continue-shopping">
                                        <a href="/products">← Continue Shopping</a>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default Cart;