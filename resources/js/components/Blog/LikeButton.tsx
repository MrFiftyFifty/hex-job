import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface LikeButtonProps {
    postId: number;
    initialIsLiked: boolean;
    initialLikesCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
    postId, 
    initialIsLiked, 
    initialLikesCount 
}) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const handleLike = async () => {
        if (!window.auth?.user) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
                setLikesCount(data.likesCount);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="d-flex align-items-center">
            <Button 
                variant={isLiked ? "danger" : "outline-danger"}
                onClick={handleLike}
                className="me-2"
            >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
            </Button>
            <span>{likesCount} likes</span>
        </div>
    );
};

export default LikeButton;