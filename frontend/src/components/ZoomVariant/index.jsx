import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./index.css";

import {
    PiMagnifyingGlassPlusLight,
    PiMagnifyingGlassMinusLight
} from "react-icons/pi";

const ZoomVariant = ({ showModal, setShowModal, position, setPosition, product, currentImageIndex, images }) => {

    const [zoomLevel, setZoomLevel] = useState(1);

    const zoomIn = () => {
        if (zoomLevel < 3) {
            setZoomLevel(prev => prev + 0.25);
        }
    };

    const zoomOut = () => {
        if (zoomLevel > 0.5) {
            setZoomLevel(prev => prev - 0.25);
        }
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const closeModal = () => {
        setZoomLevel(1);
        setShowModal(!showModal);
    }

    return (
        <Modal
            show={showModal}
            onHide={closeModal}
            centered
            size="xl"
            className="image-modal"
        >
            <Modal.Header closeButton className="modal-header-custom">
                <div className="zoom-controls">
                    <button onClick={zoomIn} className="zoom-btn">
                        <PiMagnifyingGlassPlusLight size={24} />
                    </button>
                    <button onClick={zoomOut} className="zoom-btn" disabled={zoomLevel <= 0.5}>
                        <PiMagnifyingGlassMinusLight size={24} />
                    </button>
                    <button onClick={resetZoom} className="zoom-btn">
                        Reset
                    </button>
                    <div className="zoom-level">Zoom: {(zoomLevel * 100).toFixed(0)}%</div>
                </div>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div className="zoomed-image-container" >
                    <img
                        src={images[currentImageIndex]?.src}
                        alt={product.title}
                        className="zoomed-image"
                        style={{
                            transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                            transformOrigin: 'center center'
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ZoomVariant;