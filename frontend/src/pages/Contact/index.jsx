import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { sendMessage } from "../../services/contact";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        postal_code: '',
        subject: '',
        message: '',
        attachment_file: []
    });
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await sendMessage(formData);

            if (!result.data.status === 200) {
                throw new Error(result.data.message || 'Request failed');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            setVariant('success');
            setMessage('Your message has been sent successfully!');
            setFormData({ fullname: '', email: '', phone: '', postal_code: '', subject: '', message: '', attachment_file: [] });
        } catch (error) {
            setVariant('danger');
            setMessage('Error sending message. Please try again.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, files, value } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Container fluid="lg" className="flex-grow-1 my-5 py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <i className="bi bi-envelope-paper fs-1 text-primary"></i>
                                    <h2 className="mt-3 mb-2" style={{ color: '#012440' }}>
                                        Contact Us
                                    </h2>
                                    <p className="text-muted">
                                        Have questions? We're here to help!
                                    </p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group controlId="formName">
                                                <Form.Label>Fullname *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group controlId="formEmail">
                                                <Form.Label>Email *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={6}>
                                            <Form.Group controlId="formPhone">
                                                <Form.Label>Phone *</Form.Label>
                                                <Form.Control
                                                    type="string"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={6}>
                                            <Form.Group controlId="formPostalCode">
                                                <Form.Label>Postal Code *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="postal_code"
                                                    value={formData.postal_code}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="formSubject">
                                                <Form.Label>Subject *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="formMessage">
                                                <Form.Label>Message *</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ borderColor: '#d5dee3' }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="formAttachmentFile">
                                                <Form.Label>Attach File *</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    name="attachment_file"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} className="d-grid">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={loading}
                                                size="lg"
                                                style={{ backgroundColor: '#012440', border: 'none' }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="me-2"
                                                        />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send Message'
                                                )}
                                            </Button>
                                        </Col>
                                    </Row>

                                    {message && (
                                        <Alert
                                            variant={variant}
                                            className="mt-4 text-center"
                                            dismissible
                                            onClose={() => setMessage('')}
                                            style={{
                                                backgroundColor: variant === 'success' ? '#e8edef' : '#f8d7da',
                                                borderColor: variant === 'success' ? '#d5dee3' : '#f5c6cb',
                                                color: variant === 'success' ? '#012440' : '#721c24'
                                            }}
                                        >
                                            {message}
                                        </Alert>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer className="mt-auto" />
        </div>
    );
};

export default Contact;