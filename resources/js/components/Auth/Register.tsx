import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/login.css';

const Register: React.FC = () => {
    return (
        <Container fluid className="login-container d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="login-card">
                        <Card.Body className="p-5">
                            <h2 className="login-title text-center">Create Account</h2>
                            
                            <Form method="POST" action="/register">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                                
                                <Form.Group className="mb-4">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Enter your name"
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Enter your email"
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Create a password"
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        placeholder="Confirm your password"
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Button type="submit" className="btn-login w-100">
                                    Create Account
                                </Button>

                                <div className="divider"></div>
                                
                                <div className="auth-links text-center">
                                    <p className="mb-0">
                                        Already have an account? <a href="/login">Sign In</a>
                                    </p>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
