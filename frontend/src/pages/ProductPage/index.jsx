import { useEffect, useState } from "react";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { useParams } from "react-router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NotFount from "../../components/NotFount";
import {
    PiMinusLight,
    PiPlusLight,
    PiCaretLeftLight,
    PiCaretRightLight,
    PiCheckCircleFill
} from "react-icons/pi";
import { FaFilePdf } from "react-icons/fa";

import ZoomVariant from "../../components/ZoomVariant";

import { useProductContext } from "../../context/ProductContext";
import { useCartContext } from "../../context/CartContext";
import useWindowWidth from "../../helpers/windowWidth";
import "./index.css";

const ProductPage = () => {
    const { id } = useParams();
    const { getProduct } = useProductContext();
    const { addQuantity, removeQuantity, cart, addToCart } = useCartContext();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState({ message: "", status: 0 });
    const [selectedVariantId, setSelectedVariantId] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const width = useWindowWidth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProduct(id);
                if (result.status === 200) {
                    const fetchedProduct = result.data;
                    setProduct(fetchedProduct);
                    if (fetchedProduct.colorVariants?.length > 0) {
                        setSelectedVariantId(fetchedProduct.colorVariants[0].id);
                    }
                }
            } catch (err) {
                setError({ message: err.message, status: err.statusCode || 500 });
            }
        };
        fetchProduct();
    }, [id, getProduct]);

    const selectedVariant = product?.colorVariants.find(v => v.id === selectedVariantId);

    const getQuantity = (productId, variantId) => {
        const item = cart.items?.find(
            (el) => el.productId === productId && el.variantId === variantId
        );
        return item?.quantity || 1;
    };

    const getVariantImages = () => {
        if (!product) return [];

        return product.colorVariants.map(variant => ({
            type: "variant",
            src: `${import.meta.env.VITE_API_URL}api/product/uploads/colors/${variant.main_image}`,
            variantId: variant.id
        }));
    };

    const images = getVariantImages();

    const handleNextImage = () => {
        const nextIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setSelectedVariantId(images[nextIndex].variantId);
    };

    const handlePrevImage = () => {
        const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedVariantId(images[prevIndex].variantId);
    };

    const handleAddToCart = () => {
        addToCart(product, selectedVariant);
    };

    // Image modal functions
    const openModal = () => {
        setShowModal(true);
        setPosition({ x: 0, y: 0 });
    };

    if (error.message) {
        return (
            <>
                <Header />
                <Container className="py-5">
                    <Row>
                        <Col md={10} className="p-4">
                            <NotFount errors={error} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    if (!product) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <Container className="product-page-container">
                <Row className="g-5">
                    {/* Product Images Column */}
                    <Col md={6} lg={6} className="pe-lg-5">
                        <div className="product-gallery">
                            <div className="main-image-container"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                                    e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                                }}>
                                <div className="image-wrapper">
                                    <img
                                        src={images[currentImageIndex]?.src}
                                        className="main-product-image"
                                        alt={product.title}
                                        onClick={openModal}
                                        loading="lazy"
                                    />
                                    <div className="image-overlay"></div>
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            className="image-nav-btn prev-btn"
                                            onClick={handlePrevImage}
                                        >
                                            <PiCaretLeftLight size={28} />
                                        </button>
                                        <button
                                            className="image-nav-btn next-btn"
                                            onClick={handleNextImage}
                                        >
                                            <PiCaretRightLight size={28} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {images.length > 1 && (
                                <>
                                    <div className="thumbnail-container">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                                onClick={() => {
                                                    setCurrentImageIndex(index);
                                                    setSelectedVariantId(img.variantId);
                                                }}
                                            >
                                                <img
                                                    src={img.src}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    loading="lazy"
                                                />
                                                <div className="thumbnail-overlay"></div>
                                            </div>
                                        ))}
                                    </div>
                                    {
                                        width <= 425 ?
                                            <div className="product-header">
                                                <h1 className="product-title">{product.title}</h1>
                                                <div className="product-meta">
                                                    <Badge bg={selectedVariant?.stock > 0 ? "success" : "danger"} className="stock-badge">
                                                        {selectedVariant?.stock > 0 ?
                                                            `${selectedVariant?.stock} available` :
                                                            'Out of stock'}
                                                    </Badge>
                                                    <span className="product-sku">Reference Number: {selectedVariant?.reference}</span>
                                                </div>
                                            </div>
                                            : ""
                                    }
                                </>
                            )}
                        </div>

                        {/* Product Description */}
                        <div className="description-section">
                            <div className="description-header d-flex align-items-center justify-content-between">
                                <h3 className="section-title mb-0">
                                    <span className="section-title-decoration"></span>
                                    Product Details
                                </h3>

                                {product.pdf_file ? (
                                    <a
                                        href={`${import.meta.env.VITE_API_URL}api/product/uploads/${product.pdf_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-primary pdf-btn"
                                    >
                                        <FaFilePdf />  View PDF
                                    </a>
                                ) : (
                                    <span className="text-muted">No PDF</span>
                                )}
                            </div>

                            <div className="description-content mt-3">
                                <ul>
                                    {product.description.split('. ').map((line, index) => (
                                        <li key={index}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Col>

                    {/* Product Details Column */}
                    <Col md={6} lg={6} className="ps-lg-5 pdc">
                        <div className="product-details-container">
                            {
                                width <= 425 ?
                                    ""
                                    :
                                    <div className="product-header">
                                        <h1 className="product-title">{product.title}</h1>
                                        <div className="product-meta">
                                            <Badge bg={selectedVariant?.stock > 0 ? "success" : "danger"} className="stock-badge">
                                                {selectedVariant?.stock > 0 ?
                                                    `${selectedVariant?.stock} available` :
                                                    'Out of stock'}
                                            </Badge>
                                            <span className="product-sku">Reference Number: {selectedVariant?.reference}</span>
                                        </div>
                                    </div>
                            }

                            <div className="price-section">
                                <div className="current-price">
                                    £{selectedVariant?.price ?? "N/A"}
                                </div>
                            </div>
                            {/* Color Variants */}
                            <div className="variant-section">
                                <h3 className="section-title">
                                    <span className="section-title-decoration"></span>
                                    Colour Options
                                </h3>
                                <div className="color-variants">
                                    {product.colorVariants.map((variant) => (
                                        <div
                                            key={variant.id}
                                            className={`color-variant ${selectedVariantId === variant.id ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelectedVariantId(variant.id);
                                                const idx = images.findIndex(img => img.variantId === variant.id);
                                                if (idx !== -1) setCurrentImageIndex(idx);
                                            }}
                                            title={variant.color}
                                        >
                                            <div className="color-swatch-container">
                                                <img
                                                    className="color-swatch"
                                                    src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${variant.color_image}`}
                                                    alt={variant.color}
                                                />
                                                {selectedVariantId === variant.id && (
                                                    <div className="selected-indicator">
                                                        <PiCheckCircleFill size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="color-name">{variant.color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="cart-section">
                                <div className="quantity-selector">
                                    <h3 className="section-title">
                                        <span className="section-title-decoration"></span>
                                        Quantity
                                    </h3>
                                    <div className="quantity-control">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => removeQuantity(selectedVariant)}
                                            disabled={getQuantity(product.id, selectedVariantId) <= 0}
                                        >
                                            <PiMinusLight size={20} />
                                        </button>
                                        <span className="quantity-value">
                                            {getQuantity(product.id, selectedVariantId)}
                                        </span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => addQuantity(product.title, selectedVariant)}
                                            disabled={selectedVariant?.stock <= getQuantity(product.id, selectedVariantId)}
                                        >
                                            <PiPlusLight size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="add-to-cart-container">
                                    <Button
                                        className="add-to-cart-btn c-w-b"
                                        onClick={handleAddToCart}
                                        disabled={selectedVariant?.stock <= 0}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div >
                    </Col>
                </Row>
            </Container>
            <ZoomVariant showModal={showModal} setShowModal={setShowModal} position={position} setPosition={setPosition} product={product} currentImageIndex={currentImageIndex} images={images} />
            <Footer />
        </>
    );
};
export default ProductPage;