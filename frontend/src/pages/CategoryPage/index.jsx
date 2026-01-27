import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {useCategoryContext} from "../../context/CategoryContext";
import { useCartContext } from "../../context/CartContext";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Tooltip,
    Button,
    OverlayTrigger
} from "react-bootstrap";
import { PiMinusLight, PiPlusLight } from "react-icons/pi";
import Header from "../../components/Header";
import NotFound from "../../components/NotFount";
import Footer from "../../components/Footer";
import "./index.css";

const CategoryPage = () => {
    const { id } = useParams();
    const { getCategory } = useCategoryContext();
    const { cart, addQuantity, removeQuantity, addToCart } = useCartContext();

    const [category, setCategory] = useState(null);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ================= FETCH CATEGORY ================= */

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await getCategory(id);

                if (result.statusCode === 200) {

                    const data = result.data.products.filter((el, index) => { return el.colorVariants.length > 0 })
                    setCategory(data);
                    // default variant per product
                    const defaults = {};
                    const defaultsIndex = {};
                    data.forEach((product) => {
                        if (product.colorVariants?.length > 0) {
                            defaults[product.id] = product.colorVariants[0].id;
                            defaultsIndex[product.id] = 0;
                        }
                    });
                    setSelectedVariants(defaults);
                } else {
                    setError({ message: "Category not found", status: result.statusCode });
                }
            } catch (err) {
                setError({
                    message: err.message || "An error occurred",
                    status: err.statusCode || 500
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, getCategory]);

    /* ================= HELPERS ================= */

    const getSelectedVariant = (product) => {
        const variantId = selectedVariants[product.id];
        return product.colorVariants?.find(v => v.id === variantId);
    };

    const getQuantity = (productId, variantId) => {
        const item = cart.items?.find(
            el => el.productId === productId && el.variantId === variantId
        );
        return item?.quantity || 1;
    };

    const handleThumbnailClick = (productId, variant, index) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variant.id }));
    };

    const renderVariantImage = (productId, variant, isActive, index) => {
        return (
            <OverlayTrigger
                key={variant.id}
                placement="top"
                overlay={<Tooltip>{variant.color}</Tooltip>}
            >
                <button
                    type="button"
                    className={`variant-image-swatch ${isActive ? "active" : ""}`}
                    onClick={() => handleThumbnailClick(productId, variant, index)}
                >
                    <img
                        src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${variant.color_image}`}
                        alt={variant.color}
                    />
                </button>
            </OverlayTrigger>
        )
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <>
                <Header />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                    <Spinner animation="border" />
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container className="py-5 text-center">
                    <NotFound errors={error} />
                </Container>
                <Footer />
            </>
        );
    }

    if (!category) {
        return (
            <>
                <Header />
                <Container className="py-5 text-center">
                    <h2>No products found</h2>
                </Container>
                <Footer />
            </>
        );
    }

    /* ================= RENDER ================= */

    return (
        <>
            <Header />

            <Container className="category-page py-5">
                <Row className="g-4">
                    {category.map((product, productIndex) => {
                        const selectedVariant = getSelectedVariant(product);
                        return (
                            <Col xs={12} sm={6} lg={4} xl={3} key={product.id}>
                                <Card className="product-card h-100">
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="link-of-category"
                                    >
                                        <div className="card-image-container">
                                            <Card.Img
                                                key={selectedVariants[product.id]}
                                                src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${selectedVariant?.main_image}`}
                                                alt={product.title}
                                            />
                                        </div>
                                    </Link>

                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="product-title">
                                            {product.title}
                                        </Card.Title>

                                        {product.colorVariants?.length > 0 && (
                                            <div className="variant-section premium-variant">

                                                {/* PRICE + VARIANT IMAGES */}
                                                <div className="premium-variant-header horizontal">
                                                    <span className="premium-price">
                                                        £{selectedVariant?.price || product.price}
                                                    </span>

                                                    <div className="premium-swatches image-swatches">
                                                        {product.colorVariants.map((variant, idx) =>
                                                            renderVariantImage(
                                                                product.id,
                                                                variant,
                                                                selectedVariants[product.id] === variant.id,
                                                                idx
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                {/* CART */}
                                                <div className="premium-cart-section">
                                                    <div className="quantity-selector m-0">
                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() => removeQuantity(selectedVariant)}
                                                            disabled={!selectedVariant}
                                                        >
                                                            <PiMinusLight size={20} />
                                                        </button>

                                                        <span className="quantity-value">
                                                            {getQuantity(product.id, selectedVariants[product.id])}
                                                        </span>

                                                        <button
                                                            className="quantity-btn"
                                                            onClick={() =>
                                                                addQuantity(product.title, selectedVariant)
                                                            }
                                                            disabled={
                                                                selectedVariant?.stock <=
                                                                getQuantity(product.id, selectedVariants[product.id])
                                                            }
                                                        >
                                                            <PiPlusLight size={20} />
                                                        </button>
                                                    </div>

                                                    <Button
                                                        className="add-to-cart-btn p-2"
                                                        onClick={() =>
                                                            addToCart(product, selectedVariant)
                                                        }
                                                        disabled={
                                                            !selectedVariant ||
                                                            selectedVariant.stock <= 0
                                                        }
                                                    >
                                                        Add to cart
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default CategoryPage;
