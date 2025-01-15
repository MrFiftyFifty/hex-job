import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface ReportModalProps {
    show: boolean;
    onHide: () => void;
    userId: number;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, onHide, userId }) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    reported_user_id: userId,
                    reason,
                    description
                }),
            });

            if (response.ok) {
                onHide();
                // Show success message
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Report User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason</Form.Label>
                        <Form.Select 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        >
                            <option value="">Select a reason</option>
                            <option value="inappropriate_content">Inappropriate Content</option>
                            <option value="harassment">Harassment</option>
                            <option value="spam">Spam</option>
                            <option value="other">Other</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button 
                        type="submit" 
                        variant="danger"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReportModal;