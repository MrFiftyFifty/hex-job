import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Navigation from '../Blog/Navigation';
import '../Dashboard/PostManagement.css';

interface Post {
    id: number;
    title: string;
    status: 'draft' | 'published';
    created_at: string;
    views_count: number;
    comments_count: number;
}

interface PostManagementProps {
    posts: Post[];
}

const PostManagement: React.FC<PostManagementProps> = ({ posts: initialPosts }) => {
    const [posts, setPosts] = useState(Array.isArray(initialPosts) ? initialPosts : []);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    // Add this function to fetch updated posts
    const refreshPosts = async () => {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
    };

    useEffect(() => {
        refreshPosts();
    }, []);

    const handleDelete = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            });

            if (response.ok) {
                setPosts(posts.filter(post => post.id !== postId));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    const filteredPosts = posts
        .filter(post => post.title.toLowerCase().includes(search.toLowerCase()))
        .filter(post => filter === 'all' ? true : post.status === filter);

    return (
        <>
            <Navigation />
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Manage Posts</h1>
                    <Button href="/posts/create" variant="primary">
                        Create New Post
                    </Button>
                </div>
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </Col>
                    <Col md={6}>
                        <Form.Select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Posts</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Table responsive hover className="posts-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th>Likes</th>
                            <th>Comments</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map(post => (
                            <tr key={post.id}>
                                <td>{post.title}</td>
                                <td>
                                    <Badge bg={post.status === 'published' ? 'success' : 'warning'}>
                                        {post.status}
                                    </Badge>
                                </td>
                                <td>{post.views_count}</td>
                                <td>{post.likes_count}</td>
                                <td>{post.comments_count}</td>
                                <td>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            href={`/blog/${post.id}`}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            href={`/posts/${post.id}/edit`}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default PostManagement;