import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css'; // Make sure to use your existing CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}api/auth/forgot-password`, { email });
            setVariant('success');
            setMessage(`Password reset link sent to ${email}. Please check your inbox.`);
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            setVariant('danger');
            setMessage(error.response?.data?.message || 'Error sending reset link');
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <Container fluid="lg" className="my-5 py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <i className="bi bi-shield-lock fs-1 text-primary"></i>
                                    <h2 className="mt-3 mb-2" style={{ color: '#012440' }}>
                                        Forgot Your Password?
                                    </h2>
                                    <p className="text-muted">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{ borderColor: '#d5dee3' }}
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2">
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
                                                'Send Reset Link'
                                            )}
                                        </Button>
                                    </div>

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
            <Footer />
        </>
    );
};

export default ForgotPassword;