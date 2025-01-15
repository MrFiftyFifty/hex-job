import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './components/Welcome';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BlogIndex from './components/Blog/BlogIndex';
import PostDetail from './components/Blog/PostDetail';
import PublicProfile from './components/Profile/PublicProfile';
import PostManagement from './components/Dashboard/PostManagement';
import EditPost from './components/Blog/EditPost';
import CreatePost from './components/Blog/CreatePost';
import EditProfile from './components/Profile/EditProfile';

declare global {
    interface Window {
        posts: any;
        tags: any;
        post: any;
        userData: any;
        auth: {
            user: any;
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure CSRF token is available for all requests
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }

    // Handle profile editing
    const profileEditRoot = document.getElementById('profile-edit-root');
    if (profileEditRoot) {
        const userData = JSON.parse(profileEditRoot.getAttribute('data-user') || '{}');
        const root = createRoot(profileEditRoot);
        root.render(
            <React.StrictMode>
                <EditProfile user={userData} />
            </React.StrictMode>
        );
        return;
    }

    // Handle create post page
    const createPostRoot = document.getElementById('create-post-root');
    if (createPostRoot) {
        const root = createRoot(createPostRoot);
        root.render(
            <React.StrictMode>
                <CreatePost />
            </React.StrictMode>
        );
        return;
    }

    // Handle edit post page
    const editPostRoot = document.getElementById('edit-post-root');
    if (editPostRoot) {
        const post = JSON.parse(editPostRoot.getAttribute('data-post') || '{}');
        const root = createRoot(editPostRoot);
        root.render(
            <React.StrictMode>
                <EditPost post={post} />
            </React.StrictMode>
        );
        return;
    }

    // Handle dashboard/posts management
    const dashboardRoot = document.getElementById('dashboard-root');
    if (dashboardRoot) {
        const posts = JSON.parse(dashboardRoot.getAttribute('data-posts') || '[]');
        const root = createRoot(dashboardRoot);
        root.render(
            <React.StrictMode>
                <PostManagement posts={posts} />
            </React.StrictMode>
        );
        return;
    }

    // Handle profile page
    const profileRoot = document.getElementById('profile-root');
    if (profileRoot) {
        const userData = JSON.parse(profileRoot.getAttribute('data-user') || '{}');
        const root = createRoot(profileRoot);
        root.render(
            <React.StrictMode>
                <PublicProfile user={userData} />
            </React.StrictMode>
        );
        return;
    }

    // Handle other routes
    const app = document.getElementById('app');
    if (!app) return;

    const root = createRoot(app);
    const currentPath = window.location.pathname;
    
    switch (true) {
        case currentPath === '/login':
            root.render(
                <React.StrictMode>
                    <Login />
                </React.StrictMode>
            );
            break;
            
        case currentPath === '/register':
            root.render(
                <React.StrictMode>
                    <Register />
                </React.StrictMode>
            );
            break;
            
        case currentPath === '/blog':
            root.render(
                <React.StrictMode>
                    <BlogIndex 
                        posts={window.posts} 
                        tags={window.tags}
                    />
                </React.StrictMode>
            );
            break;
            
        case /^\/blog\/\d+$/.test(currentPath):
            root.render(
                <React.StrictMode>
                    <PostDetail post={window.post} />
                </React.StrictMode>
            );
            break;
            
        case /^\/users\/\d+$/.test(currentPath):
            const profileRoot = document.getElementById('profile-root');
            if (profileRoot && window.userData) {
                const root = createRoot(profileRoot);
                root.render(
                    <React.StrictMode>
                        <PublicProfile user={window.userData} />
                    </React.StrictMode>
                );
            }
            break;
        default:
            root.render(
                <React.StrictMode>
                    <Welcome />
                </React.StrictMode>
            );
    }
});
