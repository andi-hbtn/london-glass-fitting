import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Footer from '../../components/Footer';
import "./index.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-page">
            <Header />

            {/* Hero Section */}
            <section className="privacy-hero">
                <div className="hero-overlay"></div>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <h1 className="hero-title">Privacy Policy</h1>
                            <p className="hero-subtitle">Your trust is our priority</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="privacy-container">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="privacy-intro">
                            <p>
                                At <strong>London Glass Fittings Ltd</strong>, we are committed to protecting the privacy and security of our customers' personal information.
                                This privacy policy explains how we collect, use, and protect your personal information in connection with your use of our website and services.
                            </p>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Information We Collect</h2>
                            <p className="section-text">
                                When you use our website, we may collect the following types of personal information:
                            </p>
                            <ul className="policy-list">
                                <li>Name, email address, and phone number</li>
                                <li>Billing and shipping address</li>
                                <li>Payment information</li>
                                <li>Details about the products you purchase from us</li>
                            </ul>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">How We Use Your Information</h2>
                            <p className="section-text">
                                We use your personal information for the following purposes:
                            </p>
                            <ul className="policy-list">
                                <li>To process and fulfil your orders</li>
                                <li>To communicate with you about your orders</li>
                                <li>To improve our products and services</li>
                                <li>To analyse how our website is used</li>
                                <li>To prevent fraud and protect our business</li>
                            </ul>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Disclosure of Your Information</h2>
                            <p className="section-text">
                                We do not share your personal information with third parties except in the following circumstances:
                            </p>
                            <ul className="policy-list">
                                <li>With service providers who perform services on our behalf, such as shipping companies and payment processors</li>
                                <li>With law enforcement agencies or government authorities if required by law or if we believe that disclosure is necessary to protect our rights or the rights of others</li>
                                <li>With third parties if we believe that disclosure is necessary to prevent fraud or protect our business</li>
                            </ul>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Cookies</h2>
                            <p className="section-text">
                                We use cookies to enhance your experience on our website. Cookies are small text files that are stored on your computer or mobile device when you visit our website.
                                We use cookies to remember your preferences, analyse how our website is used, and serve you relevant advertisements.
                            </p>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Your Rights</h2>
                            <p className="section-text">
                                You have the following rights with respect to your personal information:
                            </p>
                            <ul className="policy-list">
                                <li>The right to access and receive a copy of the personal information we hold about you</li>
                                <li>The right to have your personal information corrected or updated</li>
                                <li>The right to request that we delete your personal information</li>
                                <li>The right to object to the processing of your personal information</li>
                            </ul>
                            <p className="section-text">
                                If you would like to exercise any of these rights, please contact us using the contact information provided below.
                            </p>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Security</h2>
                            <p className="section-text">
                                We take reasonable steps to protect your personal information from unauthorized access, use, and disclosure.
                                However, no data transmission over the internet or any wireless network can be guaranteed to be 100% secure.
                            </p>
                        </div>

                        <div className="policy-section">
                            <h2 className="section-title">Contact Us</h2>
                            <p className="section-text">
                                If you have any questions or concerns about our privacy policy or our use of your personal information,
                                please contact us at <a href="mailto:sales@londonglassfittings.co.uk" className="contact-link">sales@londonglassfittings.co.uk</a>.
                            </p>
                        </div>

                        <div className="policy-update">
                            <p className="update-text">
                                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    )
}

export default PrivacyPolicy;