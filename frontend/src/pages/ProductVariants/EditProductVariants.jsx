import { useState, useEffect } from "react";
import { useProductContext } from "../../context/ProductContext";
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';

const EditProductVariants = ({ show, close, product }) => {
    const { updateProductVariants } = useProductContext();

    const [productVarian, setProductVariant] = useState([]);

    useEffect(() => {
        if (product) {
            const productCopy = JSON.parse(JSON.stringify(product));
            setProductVariant(productCopy);
        }
    }, [product]);

    const handleAddVariant = () => {

    }

    const handleChange = (event) => {
        const { name, value, files, type } = event.target;
        setProductVariant((prevState) => ({
            ...prevState,
            [name]: type === "file" ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await updateProductVariants(productVarian);
        close();
        return result;
    }

    return (
        <Modal show={show} onHide={close} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Update products with colors</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Modal.Body>
                    <Row className="g-3">
                        <Col md={12}>
                            <div className="border p-3 rounded">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Color Variants</h5>
                                </div>
                                <div className="mb-3 border-bottom pb-3">
                                    <Form.Group className="mb-2">
                                        <Form.Label>Color Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="color"
                                            value={productVarian.color}
                                            required
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Price (€)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={productVarian.price}
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Stock Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="stock"
                                            value={productVarian.stock}
                                            min="0"
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Reference</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="reference"
                                            value={productVarian.reference}
                                            required
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            name="color_image"
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <Image
                                            src={
                                                productVarian.color_image instanceof File
                                                    ? URL.createObjectURL(productVarian.color_image)
                                                    : `${import.meta.env.VITE_API_URL}api/product/uploads/colors/${productVarian.color_image}`
                                            }
                                            thumbnail
                                            className="mt-2"
                                            style={{ maxHeight: '80px' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Colored Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            name="main_image"
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <Image
                                            src={
                                                productVarian.main_image instanceof File
                                                    ? URL.createObjectURL(productVarian.main_image)
                                                    : `${import.meta.env.VITE_API_URL}api/product/uploads/colors/${productVarian.main_image}`
                                            }
                                            thumbnail
                                            className="mt-2"
                                            style={{ maxHeight: '80px' }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>Cancel</Button>
                    <Button variant="primary" type="submit" onClick={handleAddVariant}>Update</Button>
                </Modal.Footer>
            </Form>
        </Modal >
    )
}

export default EditProductVariants;