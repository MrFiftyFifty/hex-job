import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Navigation from './Navigation';
import CommentSection from './CommentSection';
import LikeButton from './LikeButton';
import { FaCalendar, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../../css/post-detail.css';
import DOMPurify from 'dompurify';

interface User {
    id: number;
    name: string;
    profile: {
        avatar: string | null;
    };
}

interface Post {
    id: number;
    title: string;
    content: string;
    views_count: number;
    likes: any[];
    is_liked: boolean;
    image?: string;
    user: {
        id: number;
        name: string;
        profile: {
            avatar: string | null;
        };
    };
    tags: Array<{
        id: number;
        name: string;
    }>;
    comments: Array<{
        id: number;
        content: string;
        user: {
            name: string;
        };
        created_at: string;
    }>;
    formatted_date: string;
}

interface PostDetailProps {
    post: Post;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
    const isAuthor = window.auth?.user?.id === post.user.id;
    const [currentLikesCount, setCurrentLikesCount] = useState(post.likes?.length || 0);
    const [isCurrentlyLiked, setIsCurrentlyLiked] = useState(post.is_liked);

    const handleLikeUpdate = (newCount: number, newLikedState: boolean) => {
        setCurrentLikesCount(newCount);
        setIsCurrentlyLiked(newLikedState);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await fetch(`/posts/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            if (response.ok) {
                window.location.href = '/blog';
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const authorAvatarUrl = post.user.profile?.avatar
        ? `/storage/${post.user.profile.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}`;

    return (
        <div className="min-vh-100 bg-light">
            <Navigation />
            
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm post-card">
                            {post.image && (
                                <Card.Img
                                    variant="top"
                                    src={`/storage/${post.image}`}
                                    className="post-image"
                                    alt={post.title}
                                />
                            )}
                            
                            <Card.Body className="p-4">
                                <div className="mb-3">
                                    {post.tags.map(tag => (
                                        <Badge
                                            key={tag.id}
                                            bg="primary"
                                            className="me-2 tag-badge"
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h1 className="display-4 mb-0">{post.title}</h1>
                                    {isAuthor && (
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                href={`/posts/${post.id}/edit`}
                                            >
                                                <FaEdit /> Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={handleDelete}
                                            >
                                                <FaTrash /> Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center">
                                        <a 
                                            href={`/users/${post.user.id}`}
                                            className="text-decoration-none"
                                        >
                                            <img
                                                src={authorAvatarUrl}
                                                alt={`${post.user.name}'s avatar`}
                                                className="rounded-circle me-2"
                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                            />
                                        </a>
                                        <div>
                                            <a 
                                                href={`/users/${post.user.id}`}
                                                className="text-decoration-none text-dark fw-bold"
                                            >
                                                {post.user.name}
                                            </a>
                                            <div className="text-muted small">
                                                <FaCalendar className="me-1" />
                                                {post.formatted_date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-3">
                                            <FaEye className="me-1" />
                                            {post.views_count} views
                                        </span>
                                        <LikeButton
                                            postId={post.id}
                                            initialIsLiked={isCurrentlyLiked}
                                            initialLikesCount={currentLikesCount}
                                            onLikeUpdate={handleLikeUpdate}
                                        />
                                    </div>
                                </div>
                                <div
                                    className="post-content"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(post.content)
                                    }}
                                />
                            </Card.Body>
                        </Card>

                        <CommentSection
                            postId={post.id}
                            comments={post.comments}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PostDetail;
