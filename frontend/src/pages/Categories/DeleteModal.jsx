import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteModal = ({ open, close, onConfirm }) => {
    return (
        <Modal
            show={open}
            onHide={close}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Delete Category</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-0">
                    Are you sure you want to delete this category?
                </p>
                <p className="text-danger mt-2 mb-0">
                    This action cannot be undone.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={close}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;
