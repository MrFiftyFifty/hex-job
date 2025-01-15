import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';

interface FollowButtonProps {
    userId: number;
    initialIsFollowing: boolean;
    onFollowChange: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ 
    userId, 
    initialIsFollowing, 
    onFollowChange 
}) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        if (!window.auth?.user) {
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/users/${userId}/follow`, {
                method: isFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setIsFollowing(!isFollowing);
                onFollowChange(!isFollowing);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isFollowing ? 'secondary' : 'primary'}
            onClick={handleFollow}
            disabled={isLoading}
            className="d-flex align-items-center gap-2"
        >
            {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    );
};

export default FollowButton;