import { useState } from 'react';
import Header from "../../components/Header/index.jsx";
import Footer from '../../components/Footer/index.jsx';
import { Container, Row, Col } from "react-bootstrap";
import faqData from "./data.jsx";
import "./index.css";

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };


    return (
        <div className="luxury-faq-page">
            <Header />

            {/* Hero Section */}
            <section className="faq-hero">
                <div className="hero-overlay"></div>
                <Container>
                    <Row>
                        <Col className="text-center">
                            <h1 className="hero-title">Frequently Asked Questions</h1>
                            <p className="hero-subtitle">Find answers to our most common inquiries</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="faq-container">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="faq-intro">
                            <p>
                                At Londong Glass Fittings, we believe in transparency and clarity. Below you'll find answers to our most frequently asked questions.
                                If you don't find what you're looking for, our dedicated support team is ready to assist you.
                            </p>
                        </div>

                        <div className="faq-accordion">
                            {faqData.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="faq-question">
                                        <h3>{faq.question}</h3>
                                        <div className="accordion-icon">
                                            <span className="plus"></span>
                                            <span className="minus"></span>
                                        </div>
                                    </div>
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="contact-cta">
                            <h3>Still have questions?</h3>
                            <p>Contact our support team for personalized assistance</p>
                            <div className="contact-methods">
                                <a href="tel:+442071234567" className="contact-btn">
                                    <i className="phone-icon"></i> +44 20 7123 4567
                                </a>
                                <a href="mailto:support@luxeglass.com" className="contact-btn">
                                    <i className="email-icon"></i> support@luxeglass.com
                                </a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </div>
    )
}

export default Faq;