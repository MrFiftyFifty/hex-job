import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/login.css';

const Login: React.FC = () => {
    return (
        <Container fluid className="login-container d-flex align-items-center justify-content-center">
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="login-card">
                        <Card.Body className="p-5">
                            <h2 className="login-title text-center">Welcome Back</h2>
                            
                            <Form method="POST" action="/login">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
                                
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
                                        placeholder="Enter your password"
                                        className="form-control"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        name="remember"
                                        label="Remember me"
                                        className="form-check"
                                    />
                                </Form.Group>

                                <Button type="submit" className="btn-login w-100">
                                    Sign In
                                </Button>

                                <div className="divider"></div>
                                
                                <div className="auth-links text-center">
                                    <p className="mb-2">
                                        <a href="/forgot-password">Forgot your password?</a>
                                    </p>
                                    <p className="mb-0">
                                        Don't have an account? <a href="/register">Create Account</a>
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

export default Login;