import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

interface Comment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
        profile: {
            avatar: string | null;
        };
    };
    created_at: string;
}

interface CommentSectionProps {
    postId: number;
    comments: Comment[];
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`/comments/${comment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ content: editContent }),
        });

        if (response.ok) {
            setIsEditing(false);
            window.location.reload();
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const response = await fetch(`/comments/${comment.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                window.location.reload();
            }
        }
    };

    return (
        <div className="comment-item mb-3">
            <div className="d-flex justify-content-between align-items-start">
                <a href={`/users/${comment.user.id}`} className="d-flex align-items-center mb-2 text-decoration-none">
                    <img 
                        src={comment.user.profile?.avatar 
                            ? `/storage/${comment.user.profile.avatar}` 
                            : `https://ui-avatars.com/api/?name=${comment.user.name}`}
                        alt={comment.user.name}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                        <div className="fw-bold text-dark">{comment.user.name}</div>
                        <small className="text-muted">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </small>
                    </div>
                </a>
                {window.auth?.user?.id === comment.user.id && (
                    <div>
                        <Button 
                            variant="link" 
                            className="p-0 text-primary me-2"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="link" 
                            className="p-0 text-danger"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <Form onSubmit={handleEdit}>
                    <Form.Control
                        as="textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mb-2"
                    />
                    <Button type="submit" size="sm">Save</Button>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="ms-2"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </Button>
                </Form>
            ) : (
                <p className="mb-0">{comment.content}</p>
            )}
        </div>
    );
};const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments: initialComments = [] }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ content: newComment }),
        });

        if (response.ok) {
            setNewComment('');
            window.location.reload();
        }
    };

    return (
        <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="p-4">
                <h3 className="mb-4">Comments ({initialComments?.length || 0})</h3>

                {window.auth?.user && (
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-2">
                            Post Comment
                        </Button>
                    </Form>
                )}

                <div className="comments-list">
                    {initialComments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default CommentSection;
