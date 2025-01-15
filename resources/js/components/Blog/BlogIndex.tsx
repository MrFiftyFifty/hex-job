import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import PostCard from './PostCard';
import Navigation from './Navigation';
import { FaSearch, FaTags, FaPlus, FaHeart, FaEye, FaClock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../../../css/blog.css';

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: any;
    tags: Tag[];
    formatted_date: string;
    comments_count: number;
    likes_count: number;
    views_count: number;
    created_at: string;
}

interface BlogIndexProps {
    posts: {
        data: Post[];
    };
    tags: Tag[];
}

const BlogIndex: React.FC<BlogIndexProps> = ({ posts, tags }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tagSearchTerm, setTagSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState(posts.data);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        let filtered = posts.data.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Add tag filtering
        if (selectedTags.length > 0) {
            filtered = filtered.filter(post => 
                selectedTags.every(selectedTag => 
                    post.tags.some(postTag => postTag.id === selectedTag.id)
                )
            );
        }

        setFilteredPosts(filtered);
    }, [searchTerm, selectedTags, posts.data]);

    // Update the tag selection handler
    const handleTagSelect = (tag: Tag) => {
        const isSelected = selectedTags.some(t => t.id === tag.id);
        if (isSelected) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // Filter tags based on search term length
    const filteredTags = tagSearchTerm.length >= 2 
        ? tags.filter(tag => 
            tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())
          )
        : [];

    const handleSort = (type: string) => {
        setSortBy(type);
        let sorted = [...filteredPosts];
        
        switch(type) {
            case 'most-liked':
                sorted.sort((a, b) => b.likes_count - a.likes_count);
                break;
            case 'most-viewed':
                sorted.sort((a, b) => b.views_count - a.views_count);
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }
        
        setFilteredPosts(sorted);
    };

    return (
        <div className="modern-blog-container">
            <Navigation />
            
            <Container className="py-5">
                <Row>
                    <Col md={3}>
                        <div className="search-sidebar">
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={() => window.location.href = '/posts/create'}
                                className="w-100 mb-4 create-post-button"
                            >
                                <FaPlus className="me-2" />
                                Create New Post
                            </Button>

                            <div className="sort-options mb-4">
                                <h4 className="gradient-text mb-3">Sort Posts</h4>
                                <ButtonGroup vertical className="w-100">
                                    <Button
                                        variant={sortBy === 'newest' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleSort('newest')}
                                        className="mb-2"
                                    >
                                        <FaClock className="me-2" />
                                        Newest First
                                    </Button>
                                    <Button
                                        variant={sortBy === 'most-liked' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleSort('most-liked')}
                                        className="mb-2"
                                    >
                                        <FaHeart className="me-2" />
                                        Most Liked
                                    </Button>
                                    <Button
                                        variant={sortBy === 'most-viewed' ? 'primary' : 'outline-primary'}
                                        onClick={() => handleSort('most-viewed')}
                                    >
                                        <FaEye className="me-2" />
                                        Most Viewed
                                    </Button>
                                </ButtonGroup>
                            </div>

                            <Form>
                                <div className="search-box mb-4">
                                    <h4 className="gradient-text mb-3">Search Posts</h4>
                                    <InputGroup>
                                        <InputGroup.Text className="search-icon">
                                            <FaSearch />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by title..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="modern-input"
                                        />
                                    </InputGroup>
                                </div>

                                <div className="tag-search-box">
                                    <h4 className="gradient-text mb-3">Search Tags</h4>
                                    <InputGroup>
                                        <InputGroup.Text className="search-icon">
                                            <FaTags />
                                        </InputGroup.Text>
                                        <Typeahead
                                            id="tags-typeahead"
                                            multiple
                                            options={filteredTags}
                                            labelKey="name"
                                            placeholder="Type at least 2 characters..."
                                            onChange={setSelectedTags}
                                            selected={selectedTags}
                                            onInputChange={setTagSearchTerm}
                                            minLength={2}
                                            className="modern-typeahead"
                                            renderMenuItemChildren={(option) => (
                                                <span className="tag-option">{(option as Tag).name}</span>
                                            )}
                                        />
                                    </InputGroup>
                                </div>
                            </Form>
                        </div>
                    </Col>

                    <Col md={9}>
                        <Row className="g-4">
                            {filteredPosts.map(post => (
                                <Col key={post.id} md={6}>
                                    <PostCard post={post} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BlogIndex;