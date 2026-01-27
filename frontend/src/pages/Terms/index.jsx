import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Footer from '../../components/Footer';

import "./index.css";

const TermsAndConditions = () => {
    return (
        <div className="terms-page">
            <Header />

            {/* Hero Section */}
            <section className="terms-hero">
                <div className="hero-overlay"></div>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <h1 className="hero-title">Terms & Conditions</h1>
                            <p className="hero-subtitle">Our commitment to transparency and quality</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="terms-container">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="terms-intro">
                            <p>
                                Welcome to <strong>London Glass Fittings Ltd</strong>. These Terms and Conditions govern your use of our website and services.
                                By accessing or using our services, you agree to be bound by these terms.
                            </p>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">1</span>
                                Ordering Process
                            </h2>
                            <ul className="terms-list">
                                <li>Customers must place orders through the company's website or other approved channels.</li>
                                <li>Orders are subject to acceptance and availability of products.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">2</span>
                                Pricing and Payment
                            </h2>
                            <ul className="terms-list">
                                <li>All prices are in GBP (£) and inclusive of VAT unless otherwise specified.</li>
                                <li>Payment must be made in full at the time of ordering.</li>
                                <li>We accept Visa, MasterCard, American Express, and PayPal.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">3</span>
                                Delivery
                            </h2>
                            <ul className="terms-list">
                                <li>Delivery will be made to the address specified by the customer.</li>
                                <li>Delivery timescales vary depending on the option selected and your location (typically 2-3 working days within Greater London).</li>
                                <li>We reserve the right to use third-party delivery services.</li>
                                <li>Additional charges may apply for special delivery requirements or remote locations.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">4</span>
                                Product Quality and Returns
                            </h2>
                            <ul className="terms-list">
                                <li>We guarantee the quality of all our glass products.</li>
                                <li>You may return products within 14 days of receipt for a refund or exchange.</li>
                                <li>Returned items must be unused, in original packaging, and in resalable condition.</li>
                                <li>To initiate a return, please contact our customer service at returns@londonglassfittings.co.uk.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">5</span>
                                Cancellation
                            </h2>
                            <ul className="terms-list">
                                <li>You may cancel orders within 24 hours of placement without penalty.</li>
                                <li>We reserve the right to cancel orders due to product unavailability or delivery restrictions.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">6</span>
                                Intellectual Property
                            </h2>
                            <ul className="terms-list">
                                <li>All website content, designs, and product images are protected by copyright.</li>
                                <li>Unauthorized use, reproduction, or distribution of our content is prohibited.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">7</span>
                                Privacy Policy
                            </h2>
                            <ul className="terms-list">
                                <li>We collect and process personal data in accordance with UK GDPR regulations.</li>
                                <li>Your data is used solely for order processing and service improvement.</li>
                                <li>For details, please see our <a href="/privacy-policy" className="policy-link">Privacy Policy</a>.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">8</span>
                                Liability
                            </h2>
                            <ul className="terms-list">
                                <li>Our liability is limited to the value of the products purchased.</li>
                                <li>We are not liable for indirect or consequential damages.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">9</span>
                                Governing Law
                            </h2>
                            <ul className="terms-list">
                                <li>These Terms are governed by English law.</li>
                                <li>Any disputes shall be resolved in the courts of England and Wales.</li>
                            </ul>
                        </div>

                        <div className="terms-section">
                            <h2 className="section-title">
                                <span className="section-number">10</span>
                                Changes to Terms
                            </h2>
                            <ul className="terms-list">
                                <li>We may update these terms periodically.</li>
                                <li>Continued use of our services constitutes acceptance of any changes.</li>
                            </ul>
                        </div>

                        <div className="terms-contact">
                            <h3 className="contact-title">Questions?</h3>
                            <p className="contact-text">
                                Contact our customer service team at <a href="mailto:support@londonglassfittings.co.uk" className="contact-link">support@londonglassfittings.co.uk</a> or call us at <a href="tel:+442071234567" className="contact-link">+44 20 7123 4567</a>.
                            </p>
                        </div>

                        <div className="terms-update">
                            <p className="update-text">
                                <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    )
}

export default TermsAndConditions;