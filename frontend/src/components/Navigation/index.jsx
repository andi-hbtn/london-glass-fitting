import { useState } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { useCategoryContext } from "../../context/CategoryContext";
import { useProductContext } from '../../context/ProductContext';
import Login from '../AuthModal/login';
import Register from '../AuthModal/register';
import { Link } from 'react-router';
import { Navbar, Container, Nav, Button, Form, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaUser, FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import "./index.css";

const Navigation = ({ onSearchChange }) => {
    const { finalCart } = useCartContext();
    const { authUser, logout } = useAuthenticateContext();
    const { allCategories } = useCategoryContext();
    const { allProducts } = useProductContext();
    const [loginModal, setLoginModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [search, setSearch] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const handleChange = (event) => {
        const value = event.target.value.trim().toLowerCase();
        setSearch(value);

        const matchedCategories = allCategories.filter(c => c.title.toLowerCase().includes(value));
        const matchedProducts = allProducts.filter(p => {
            const inTitle = p.title.toLowerCase().includes(value);
            const inReference = p.colorVariants?.some(variant =>
                variant.reference.toLowerCase().includes(value)
            );
            return inTitle || inReference;
        });

        if (typeof onSearchChange === "function") {
            onSearchChange({ categories: matchedCategories, products: matchedProducts });
        }
    }

    const handleLogout = async () => {
        return await logout();
    }
    const [productsOpen, setProductsOpen] = useState(false);

    return (
        <>
            {/* Main Navigation */}
            <Navbar expand="lg" className="navbar-container">
                <Container className="nav-cnt">
                    {/* Mobile Menu Toggle */}

                    <div className='mobile-menu-container'>
                        <Button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            variant='dark'
                        >
                            {mobileMenuOpen ? <IoMdClose /> : <FaBars />}
                        </Button>
                        <>
                            <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
                                <FaSearch className="search-icon" />
                                <Form.Control
                                    type="search"
                                    placeholder="Search products..."
                                    className="luxe-search"
                                    onChange={handleChange}
                                    value={search}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                            </div>

                            <Nav.Link as={Link} to="/cart" className="luxe-cart">
                                <FaShoppingCart className="cart-icon" />
                                <Badge pill className="cart-badge">
                                    {finalCart === 0 ? "" : finalCart}
                                </Badge>
                            </Nav.Link>
                        </>

                    </div>


                    {/* Desktop Navigation */}
                    <Navbar.Collapse id="navbarScroll" className={`${mobileMenuOpen ? 'show' : ''}`}>
                        <Nav className="nav-menu">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                            <div
                                className="products-hover-zone"
                                onMouseEnter={() => setProductsOpen(true)}
                                onMouseLeave={() => setProductsOpen(false)}
                            >
                                <Nav.Link className="products-link">Products</Nav.Link>
                                {productsOpen && (
                                    <div className="products-dropdown">
                                        <ul className="categories-list-vertical">
                                            {allCategories.map(category => (
                                                <li
                                                    key={category.id}
                                                    className="category-item-li-vertical"
                                                >
                                                    <Link
                                                        to={`/category/${category.id}`}
                                                        className="category-link-vertical"
                                                    >
                                                        <span className="category-title-vertical">
                                                            <img src={`${import.meta.env.VITE_API_URL}api/category/uploads/${category.image}`} alt='category-title' />
                                                            {category.title}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
                            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        </Nav>

                        {/* Right Side Elements */}
                        <div className="nav-right-elements">
                            {/* Search Bar */}

                            {!mobileMenuOpen ?
                                <div className={`search-container ${searchFocused ? 'focused' : ''}`}>
                                    <FaSearch className="search-icon" />
                                    <Form.Control
                                        type="search"
                                        placeholder="Search products..."
                                        className="luxe-search"
                                        onChange={handleChange}
                                        value={search}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                    />
                                </div>
                                : ""}
                            {/* User Actions */}
                            <div className="user-actions">
                                {!authUser?.id ? (
                                    <>
                                        <Button
                                            variant="link"
                                            className="auth-link"
                                            onClick={() => setLoginModal(!loginModal)}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="register-btn"
                                            onClick={() => setRegisterModal(!registerModal)}
                                        >
                                            Register
                                        </Button>
                                    </>
                                ) : (
                                    <div className="user-profile">
                                        <div className="user-greeting">
                                            <FaUser className="user-icon" />
                                            <span>Hi, {authUser.firstname}</span>
                                        </div>
                                        <div className="profile-dropdown">
                                            <Link
                                                to={authUser.roles === 'admin' ? '/admin-products' : '/profile'}
                                                className="dropdown-link"
                                            >
                                                My Account
                                            </Link>
                                            <button
                                                className="dropdown-link"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {
                                    !mobileMenuOpen ?
                                        <Nav.Link as={Link} to="/cart" className="luxe-cart">
                                            <FaShoppingCart className="cart-icon" />
                                            <Badge pill className="cart-badge">
                                                {finalCart === 0 ? "" : finalCart}
                                            </Badge>
                                        </Nav.Link>
                                        : ""}

                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Modal Components */}
            <Login openLogin={loginModal} closeLogin={() => setLoginModal(false)} />
            <Register openRegister={registerModal} closeRegister={() => setRegisterModal(false)} closeLogin={() => setLoginModal(false)} />
        </>
    )
}

export default Navigation;