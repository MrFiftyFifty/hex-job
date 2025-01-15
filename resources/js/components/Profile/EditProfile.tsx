import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Container, Form, Button, Row, Col, Card, Alert, Modal, ButtonGroup } from 'react-bootstrap';
import { 
    FaSave, 
    FaCamera, 
    FaTrash, 
    FaBold, 
    FaItalic, 
    FaUnderline, 
    FaAlignLeft, 
    FaAlignCenter, 
    FaAlignRight 
} from 'react-icons/fa';
import Navigation from '../Blog/Navigation';
import './EditProfile.css';

interface User {
    id: number;
    name: string;
    email: string;
    profile: {
        bio: string;
        avatar: string | null;
        location: string | null;
    };
}

interface EditProfileProps {
    user: User;
}

const EditProfile: React.FC<EditProfileProps> = ({ user }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(user.profile.avatar);
    const [location, setLocation] = useState(user.profile.location || '');
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
        ],
        content: user.profile.bio || '',
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('bio', editor?.getHTML() || '');
        formData.append('location', location);
        formData.append('_method', 'PATCH');
        
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('/profile', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData
            });

            if (response.ok) {
                setAlert({ type: 'success', message: 'Profile updated successfully!' });
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'Error updating profile.' });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword
                })
            });

            if (response.ok) {
                setAlert({ type: 'success', message: 'Password updated successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'Error updating password.' });
        }
    };

    const handleAccountDeletion = async () => {
        try {
            const response = await fetch('/profile', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                setAlert({
                    type: 'danger',
                    message: 'Failed to delete account. Please try again.'
                });
            }
        } catch (error) {
            setAlert({
                type: 'danger',
                message: 'An error occurred while deleting your account.'
            });
        }
    };

    return (
        <>
            <Navigation />
            <Container className="py-5">
                {alert && (
                    <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
                        {alert.message}
                    </Alert>
                )}

                <Row>
                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Profile Information</Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleProfileUpdate}>
                                    <div className="avatar-upload mb-4">
                                        <div className="avatar-preview">
                                            <img 
                                                src={avatarPreview || '/default-avatar.jpg'} 
                                                alt={name}
                                                className="avatar-image"
                                            />
                                        </div>
                                        <div className="avatar-edit">
                                            <Form.Label className="btn btn-primary mt-2">
                                                <FaCamera className="me-2" />
                                                Change Avatar
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    hidden
                                                />
                                            </Form.Label>
                                        </div>
                                    </div>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Bio</Form.Label>
                                        <div className="bio-editor">
                                            <div className="editor-toolbar">
                                                <ButtonGroup className="me-2">
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().toggleBold().run()}
                                                        className={editor?.isActive('bold') ? 'is-active' : ''}
                                                    >
                                                        <FaBold />
                                                    </Button>
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                                                        className={editor?.isActive('italic') ? 'is-active' : ''}
                                                    >
                                                        <FaItalic />
                                                    </Button>
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                                                        className={editor?.isActive('underline') ? 'is-active' : ''}
                                                    >
                                                        <FaUnderline />
                                                    </Button>
                                                </ButtonGroup>

                                                <ButtonGroup>
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                                                        className={editor?.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                                                    >
                                                        <FaAlignLeft />
                                                    </Button>
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                                                        className={editor?.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                                                    >
                                                        <FaAlignCenter />
                                                    </Button>
                                                    <Button 
                                                        variant="light"
                                                        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                                                        className={editor?.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                                                    >
                                                        <FaAlignRight />
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                            <EditorContent editor={editor} className="editor-content" />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g., New York, USA"
                                        />
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="d-flex align-items-center">
                                        <FaSave className="me-2" />
                                        Save Changes
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="mb-4">
                            <Card.Header>Email Settings</Card.Header>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4">
                            <Card.Header>Change Password</Card.Header>
                            <Card.Body>
                                <Form onSubmit={handlePasswordUpdate}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary">Update Password</Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="border-danger">
                            <Card.Header className="bg-danger text-white">Danger Zone</Card.Header>
                            <Card.Body>
                                <Button 
                                    variant="danger" 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="d-flex align-items-center"
                                >
                                    <FaTrash className="me-2" />
                                    Delete Account
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleAccountDeletion}>
                            Delete Account
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default EditProfile;
