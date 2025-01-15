import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaHeart, FaEye, FaComment } from 'react-icons/fa';

interface Tag {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    user: User;
    tags: Tag[];
    formatted_date: string;
    comments_count: number;
    likes_count: number;
    views_count: number;
    is_liked: boolean;
}
interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    const handleClick = () => {
        window.location.href = `/blog/${post.id}`;
    };

    const avatarUrl = post.user.profile?.avatar 
        ? `/storage/${post.user.profile.avatar}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}`;

    return (
        <Card 
            className="post-card h-100 shadow-sm hover-lift cursor-pointer"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {post.image && (
                <Card.Img 
                    variant="top" 
                    src={`/storage/${post.image}`} 
                    className="object-fit-cover" 
                    style={{ height: '200px' }}
                />
            )}
            <Card.Body>
                <Card.Title className="h4 mb-3">{post.title}</Card.Title>
                
                <div className="mb-3">
                    {post.tags.map(tag => (
                        <Badge 
                            key={tag.id} 
                            bg="primary" 
                            className="me-2 mb-2"
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>

                <div 
                    className="post-content mb-3"
                    dangerouslySetInnerHTML={createMarkup(post.content)}
                />
            </Card.Body>

            <Card.Footer className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <img 
                            src={avatarUrl}
                            alt={`${post.user.name}'s avatar`}
                            className="rounded-circle me-2"
                            width="30"
                            height="30"
                        />
                        <small className="text-muted">
                            {post.user.name}
                        </small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center text-muted">
                            <FaHeart className={`me-1 ${post.is_liked ? 'text-danger' : ''}`} />
                            <small>{post.likes_count}</small>
                        </div>
                        <div className="d-flex align-items-center text-muted">
                            <FaEye className="me-1" />
                            <small>{post.views_count}</small>
                        </div>
                        <div className="d-flex align-items-center text-muted">
                            <FaComment className="me-1" />
                            <small>{post.comments_count}</small>
                        </div>
                        <small className="text-muted">
                            {post.formatted_date}
                        </small>
                    </div>
                </div>
            </Card.Footer>
        </Card>
    );
};
export default PostCard;
