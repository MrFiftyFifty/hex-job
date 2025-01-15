import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaHome, FaNewspaper, FaUser, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navigation: React.FC = () => {
    return (
        <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
            <Container>
                <Navbar.Brand href="/" className="fw-bold">
                    <FaHome className="me-2" />
                    Blog Platform
                </Navbar.Brand>
                
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link href="/blog" className="d-flex align-items-center">
                            <FaNewspaper className="me-1" />
                            Blog
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        {window.auth?.user ? (
                            <>
                                <Nav.Link 
                                    href="/profile/posts" 
                                    className="d-flex align-items-center me-2"
                                >
                                    <FaNewspaper className="me-1" />
                                    My Posts
                                </Nav.Link>
                                
                                <Nav.Link 
                                    href={`/users/${window.auth.user.id}`}
                                    className="d-flex align-items-center me-2"
                                >
                                    <FaUser className="me-1" />
                                    Profile
                                </Nav.Link>
                                
                                <Nav.Link 
                                    href="/profile/edit"
                                    className="d-flex align-items-center me-2"
                                >
                                    <FaCog className="me-1" />
                                    Settings
                                </Nav.Link>

                                <Button 
                                    variant="outline-danger"
                                    className="d-flex align-items-center"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('logout-form')?.submit();
                                    }}
                                >
                                    <FaSignOutAlt className="me-1" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link 
                                    href="/login"
                                    className="d-flex align-items-center me-2"
                                >
                                    <FaSignInAlt className="me-1" />
                                    Login
                                </Nav.Link>
                                
                                <Nav.Link 
                                    href="/register"
                                    className="d-flex align-items-center"
                                >
                                    <FaUserPlus className="me-1" />
                                    Register
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
