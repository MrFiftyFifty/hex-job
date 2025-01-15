import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../resources/css/welcome.css';

export const Welcome: React.FC = () => {
    return (
        <div className="hero-section">
            <div className="hero-overlay"></div>
            
            <Navbar bg="transparent" variant="dark" expand="lg" className="px-4">
                <Navbar.Brand href="/" className="gradient-text">Blog Platform</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Link href="/login" className="animated-button">Login</Nav.Link>
                        <Nav.Link href="/register" className="animated-button">Register</Nav.Link>
                        <Nav.Link href="/blog" className="animated-button">Blog</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Container className="content-wrapper py-5">
                <Row className="align-items-center justify-content-center min-vh-75 text-center">
                    <Col md={8}>
                        <h1 className="display-3 fw-bold mb-4">Welcome to Our Blog Platform</h1>
                        <p className="lead mb-5">
                            Share your thoughts, engage with others, and discover amazing content 
                            created by our community.
                        </p>
                        <Button variant="primary" size="lg" href="/register" className="animated-button me-3">
                            Get Started
                        </Button>
                        <Button variant="outline-light" size="lg" href="/blog" className="animated-button">
                            Read Posts
                        </Button>
                    </Col>
                </Row>

                <Row className="py-5 mt-5">
                    <Col md={4} className="mb-4">
                        <Card className="feature-card text-white">
                            <Card.Body className="p-4">
                                <h3 className="gradient-text">Create</h3>
                                <p>Write and publish your stories with our powerful editor.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="feature-card text-white">
                            <Card.Body className="p-4">
                                <h3 className="gradient-text">Connect</h3>
                                <p>Engage with readers through comments and discussions.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="feature-card text-white">
                            <Card.Body className="p-4">
                                <h3 className="gradient-text">Grow</h3>
                                <p>Build your audience and track your content's performance.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Welcome;
