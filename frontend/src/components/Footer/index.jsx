import { Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, } from 'react-icons/fa';
import "./index.css";

const Footer = () => {
    return (
        <footer className="luxury-footer">
            {/* Top Section */}
            <div className="footer-top">
                <Row className="g-4 justify-content-center">
                    {/* Quick Links */}
                    <Col lg={4} md={4} className="text-center text-md-start">
                        <div className="footer-column">
                            <h4 className="footer-heading">Quick Links</h4>
                            <ul className="footer-links">
                                <li><a href="/">Home</a></li>
                                <li><a href="/about-us">About Us</a></li>
                                <li><a href="/faq">FAQ</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                    </Col>

                    {/* Address */}
                    <Col lg={4} md={4} className="text-center text-md-start">
                        <div className="footer-column">
                            <h4 className="footer-heading">Address</h4>
                            <ul className="contact-info list-unstyled mb-0">
                                <li className="d-flex">
                                    <FaMapMarkerAlt className="contact-icon mt-1" />
                                    <span>
                                        Premier Business Centre<br />
                                        47-49 Park Royal Road<br />
                                        London, NW10 7LQ<br />
                                        United Kingdom
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </Col>

                    {/* Contact Details */}
                    <Col lg={4} md={4} className="text-center text-md-start">
                        <div className="footer-column">
                            <h4 className="footer-heading">Contact Details</h4>
                            <ul className="contact-info list-unstyled mb-0">
                                <li className="d-flex">
                                    <FaPhone className="contact-icon mt-1" />
                                    <span>+44 123456</span>
                                </li>
                                <li className="d-flex">
                                    <FaEnvelope className="contact-icon mt-1" />
                                    <span>sales@londonglassfittings.co.uk</span>
                                </li>
                                <li className="d-flex">
                                    <FaClock className="contact-icon mt-1" />
                                    <span>
                                        Monday-Friday: 09:00 - 17:00<br />
                                        (By Appointment Only)
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>


            {/* Divider */}
            <div className="footer-divider"></div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <Row className="align-items-center">
                    <Col md={6} className="copyright text-center text-md-start">
                        <p>&copy; {new Date().getFullYear()} London Glass Fittings. All rights reserved.</p>
                    </Col>
                    <Col md={6} className="footer-links-bottom text-center text-md-end">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms & Conditions</a>
                    </Col>
                </Row>
            </div>

            {/* Decorative Glass Element */}
            <div className="glass-decoration"></div>
        </footer>
    )
}

export default Footer;