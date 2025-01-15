import React, { useState } from 'react';
import { Container, Button, Tabs, Tab, Nav, Modal, Form, Alert } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck, FaFlag, FaCog, FaNewspaper } from 'react-icons/fa';
import Navigation from '../Blog/Navigation';
import PostCard from '../Blog/PostCard';
import './PublicProfile.css';

interface PublicProfileProps {
    user: {
        id: number;
        name: string;
        created_at: string;
        is_owner: boolean;
        profile: {
            avatar: string | null;
            bio: string | null;
            location: string | null;
        };
        posts: Array<{
            id: number;
            title: string;
            content: string;
            created_at: string;
            likes_count: number;
            views_count: number;
        }>;
        followers_count: number;
        is_followed: boolean;
    };
}

const PublicProfile: React.FC<PublicProfileProps> = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState(user.is_followed);
    const [followersCount, setFollowersCount] = useState(user.followers_count);
    const [showReportModal, setShowReportModal] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [reportForm, setReportForm] = useState({ reason: '', details: '' });
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

    const totalLikesReceived = user.posts.reduce((total, post) => total + post.likes_count, 0);
    const totalViewsReceived = user.posts.reduce((total, post) => total + post.views_count, 0);

    const handleFollow = async () => {
        if (!window.auth?.user) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`/api/users/${user.id}/follow`, {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
                setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Follow action failed:', error);
        }
    };

    const handleReport = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    reportable_type: 'user',
                    reportable_id: user.id,
                    ...reportForm
                })
            });

            if (response.ok) {
                setShowReportModal(false);
                setAlert({ type: 'success', message: 'Report submitted successfully' });
                setReportForm({ reason: '', details: '' });
            } else {
                throw new Error('Report submission failed');
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'Failed to submit report' });
        }
    };

    return (
        <div className="profile-wrapper">
            <Navigation />
            
            {alert && (
                <Alert 
                    variant={alert.type} 
                    onClose={() => setAlert(null)} 
                    dismissible
                    className="m-3"
                >
                    {alert.message}
                </Alert>
            )}
            
            <div className="profile-banner">
                <Container>
                    <div className="profile-header-content">
                        <div className="profile-main-info">
                            <div className="profile-image-wrapper">
                                <img 
                                    src={user.profile.avatar || '/default-avatar.jpg'} 
                                    alt={user.name} 
                                    className="profile-image"
                                />
                            </div>
                            <div className="profile-text">
                                <h1>{user.name}</h1>
                                <div className="profile-stats">
                                    <div className="stat-item">
                                        <span>{user.posts.length}</span> posts
                                    </div>
                                    <div className="stat-item">
                                        <span>{followersCount}</span> followers
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-actions">
                            {user.is_owner ? (
                                <Nav className="owner-navigation">
                                    <Button 
                                        variant="outline-primary"
                                        href="/profile/edit"
                                        className="me-2"
                                    >
                                        <FaCog className="me-1" />
                                        Edit Profile
                                    </Button>
                                    <Button 
                                        variant="outline-secondary"
                                        href="/profile/posts"
                                    >
                                        <FaNewspaper className="me-1" />
                                        Manage Posts
                                    </Button>
                                </Nav>
                            ) : (
                                <>
                                    <Button 
                                        className={`follow-button ${isFollowing ? 'following' : ''}`}
                                        onClick={handleFollow}
                                    >
                                        {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                    
                                    <Button 
                                        variant="light" 
                                        className="report-button"
                                        onClick={() => setShowReportModal(true)}
                                    >
                                        <FaFlag />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="profile-content">
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k || 'posts')}
                    className="profile-tabs"
                >
                    <Tab eventKey="posts" title="Posts">
                        <div className="posts-grid">
                            {user.posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </Tab>
                    <Tab eventKey="about" title="About">
                        <div className="about-section">
                            <div className="about-grid">
                                <div className="about-card bio-card">
                                    <h3>Bio</h3>
                                    <div dangerouslySetInnerHTML={{ __html: user.profile.bio || 'No bio yet' }} />
                                </div>
                                
                                <div className="about-card info-card">
                                    <h3>Information</h3>
                                    <ul className="info-list">
                                        {user.profile.location && (
                                            <li>
                                                <span className="info-icon">📍</span>
                                                <span className="info-text">Lives in {user.profile.location}</span>
                                            </li>
                                        )}
                                        {user.profile.website && (
                                            <li>
                                                <span className="info-icon">🌐</span>
                                                <a href={user.profile.website} target="_blank" rel="noopener noreferrer">
                                                    {user.profile.website}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="about-card stats-card">
                                    <h3>Activity</h3>
                                    <div className="activity-stats">
                                        <div className="activity-item">
                                            <span className="activity-value">{user.posts.length}</span>
                                            <span className="activity-label">Posts Created</span>
                                        </div>
                                        <div className="activity-item">
                                            <span className="activity-value">{totalViewsReceived}</span>
                                            <span className="activity-label">Total Views</span>
                                        </div>
                                        <div className="activity-item">
                                            <span className="activity-value">{totalLikesReceived}</span>
                                            <span className="activity-label">Likes Received</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </Container>

            <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Report User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleReport}>
                        <Form.Group className="mb-3">
                            <Form.Label>Reason</Form.Label>
                            <Form.Select
                                value={reportForm.reason}
                                onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="spam">Spam</option>
                                <option value="harassment">Harassment</option>
                                <option value="inappropriate">Inappropriate Content</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Details</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={reportForm.details}
                                onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={() => setShowReportModal(false)} className="me-2">
                                Cancel
                            </Button>
                            <Button variant="danger" type="submit">
                                Submit Report
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PublicProfile;
