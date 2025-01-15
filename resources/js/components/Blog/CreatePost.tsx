import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import { Container, Form, Button, ButtonGroup, Dropdown, Alert } from 'react-bootstrap';
import { 
    FaSave, FaImage, FaLink, FaBold, FaItalic, FaUnderline, 
    FaStrikethrough, FaListUl, FaListOl, FaQuoteRight, 
    FaCode, FaTable, FaYoutube, FaHighlighter,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
    FaHeading, FaTimes
} from 'react-icons/fa';
import Navigation from './Navigation';
import './CreatePost.css';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('draft');
    const [tagList, setTagList] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Strike,
            Highlight,
            CodeBlock,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            Youtube.configure({
                width: 840,
                height: 472.5,
            }),
        ],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', editor?.getHTML() || '');
        formData.append('status', status);
        formData.append('tag_list', tagList);
        
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch('/posts', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create post');
            }

            setAlert({ type: 'success', message: 'Post created successfully!' });
            setTimeout(() => window.location.href = '/profile/posts', 1500);
        } catch (error) {
            console.error('Error details:', error);
            setAlert({ type: 'danger', message: error.message || 'Error creating post' });
        }
    };

    // Editor helper functions
    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    };

    const addYoutubeVideo = () => {
        const url = window.prompt('Enter YouTube video URL:');
        if (url) {
            editor?.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const addTable = () => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
    };

    return (
        <>
            <Navigation />
            <Container className="py-5">
                <h1 className="mb-4">Create New Post</h1>

                {alert && (
                    <Alert variant={alert.type} dismissible>
                        {alert.message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter post title"
                        />
                    </Form.Group>

                    <div className="editor-wrapper mb-4">
                        {/* Editor Toolbar */}
                        <div className="editor-toolbar">
                            <ButtonGroup className="me-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="heading-dropdown">
                                        <FaHeading />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[1, 2, 3, 4, 5, 6].map(level => (
                                            <Dropdown.Item 
                                                key={level}
                                                onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
                                                active={editor?.isActive('heading', { level })}
                                            >
                                                Heading {level}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </ButtonGroup>

                            {/* Text Formatting */}
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
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                    className={editor?.isActive('strike') ? 'is-active' : ''}
                                >
                                    <FaStrikethrough />
                                </Button>
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleHighlight().run()}
                                    className={editor?.isActive('highlight') ? 'is-active' : ''}
                                >
                                    <FaHighlighter />
                                </Button>
                            </ButtonGroup>

                            {/* Alignment */}
                            <ButtonGroup className="me-2">
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
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                                    className={editor?.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                                >
                                    <FaAlignJustify />
                                </Button>
                            </ButtonGroup>

                            {/* Lists and Quotes */}
                            <ButtonGroup className="me-2">
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                    className={editor?.isActive('bulletList') ? 'is-active' : ''}
                                >
                                    <FaListUl />
                                </Button>
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                    className={editor?.isActive('orderedList') ? 'is-active' : ''}
                                >
                                    <FaListOl />
                                </Button>
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                                    className={editor?.isActive('blockquote') ? 'is-active' : ''}
                                >
                                    <FaQuoteRight />
                                </Button>
                                <Button 
                                    variant="light"
                                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                                    className={editor?.isActive('codeBlock') ? 'is-active' : ''}
                                >
                                    <FaCode />
                                </Button>
                            </ButtonGroup>

                            {/* Media */}
                            <ButtonGroup>
                                <Button variant="light" onClick={addImage}>
                                    <FaImage />
                                </Button>
                                <Button variant="light" onClick={addLink}>
                                    <FaLink />
                                </Button>
                                <Button variant="light" onClick={addTable}>
                                    <FaTable />
                                </Button>
                                <Button variant="light" onClick={addYoutubeVideo}>
                                    <FaYoutube />
                                </Button>
                            </ButtonGroup>
                        </div>

                        <EditorContent editor={editor} className="editor-content" />
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Tags (comma separated)</Form.Label>
                        <Form.Control
                            type="text"
                            value={tagList}
                            onChange={(e) => setTagList(e.target.value)}
                            placeholder="technology, programming, laravel"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Featured Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                        />
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Button type="submit" variant="primary">
                            <FaSave className="me-2" />
                            Create Post
                        </Button>
                        
                        <Button 
                            variant="outline-secondary"
                            href="/profile/posts"
                        >
                            <FaTimes className="me-2" />
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default CreatePost;
