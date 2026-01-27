import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Collapse } from "react-bootstrap";
import { useProductContext } from "../../context/ProductContext.jsx";
import NavAdmin from "../../components/NavAdmin/index.jsx";
import { FiPlus, FiEdit, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaTrash } from 'react-icons/fa';
import ProductVariantsModal from "./ProductVariantsModal.jsx";
import EditProductVariants from "./EditProductVariants.jsx";
import "./index.css";

const ProductVariants = () => {
    const { deleteProductVariant } = useProductContext();
    const [open, setOpen] = useState(false);
    const { products } = useProductContext();
    const [id, setId] = useState(0);
    const [expandedRows, setExpandedRows] = useState([]);

    const [openEdit, setOpenEdit] = useState(false);
    const [productVariant, setProductVariant] = useState(null);

    const handleCreate = (data) => {
        setId(data.id);
        setOpen(!open);
    }

    const handleClose = () => { setOpen(!open); }
    const handleEdit = (product) => {
        setProductVariant(product);
        setOpenEdit(!openEdit);
    }

    const deleteVariantProduct = async (id, index) => {
        return await deleteProductVariant(id);
    }

    const toggleRow = (productId) => {
        if (expandedRows.includes(productId)) {
            setExpandedRows(expandedRows.filter(id => id !== productId));
        } else {
            setExpandedRows([...expandedRows, productId]);
        }
    };

    return (
        <div className="admin-dashboard">
            <NavAdmin />
            <Container fluid className="main-content">
                <Row>
                    <Col md={12} xl={12} className="p-4 main-content-area">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="page-title">Product Color Management</h2>
                        </div>

                        <div className="custom-card p-4 shadow-sm">
                            <Table hover responsive className="product-table">
                                <thead className="table-header">
                                    <tr>
                                        <th></th>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Color Variants</th>
                                        <th>Add Variant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <React.Fragment key={product.id}>
                                            <tr key={index} className="table-row">
                                                <td>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => toggleRow(product.id)}
                                                        aria-expanded={expandedRows.includes(product.id)}
                                                    >
                                                        {expandedRows.includes(product.id) ?
                                                            <FiChevronUp /> : <FiChevronDown />}
                                                    </Button>
                                                </td>
                                                <td className="text-muted">#{product.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {
                                                            product.image ?
                                                                <img
                                                                    src={`${import.meta.env.VITE_API_URL}api/product/uploads/${product.image}`}
                                                                    alt="product"
                                                                    className="product-img rounded-circle me-3"
                                                                />
                                                                : ""
                                                        }
                                                        <div>
                                                            <h6 className="mb-0">{product.title}</h6>
                                                            <small className="text-muted">
                                                                {product.description.substring(0, 40)}...
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {product.colorVariants?.length || 0} variants
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2 action-btn"
                                                        onClick={() => handleCreate(product)}
                                                    >
                                                        <FiPlus />
                                                    </Button>
                                                </td>
                                            </tr>

                                            <tr key={index + 1}>
                                                <td colSpan={5} className="p-0">
                                                    <Collapse in={expandedRows.includes(product.id)}>
                                                        <div className="variant-details p-3 bg-light">
                                                            {product.colorVariants?.length > 0 ? (
                                                                <Table bordered size="sm" className="variant-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Color</th>
                                                                            <th>Color Name</th>
                                                                            <th>Price</th>
                                                                            <th>Stock</th>
                                                                            <th>Main Image</th>
                                                                            <th>Action </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {product.colorVariants.map((variant, vIndex) => (
                                                                            <tr key={vIndex}>
                                                                                <td>
                                                                                    <img
                                                                                        src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${variant.color_image}`}
                                                                                        alt="variant"
                                                                                        className="variant-img"
                                                                                        style={{ width: "80px" }}
                                                                                    />
                                                                                </td>
                                                                                <td>{variant.color}</td>
                                                                                <td>&#163;{variant.price}</td>
                                                                                <td>{variant.stock}</td>
                                                                                <td>
                                                                                    <img
                                                                                        src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${variant.main_image}`}
                                                                                        alt="variant"
                                                                                        className="variant-img"
                                                                                        style={{ width: "80px" }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <div className="d-flex flex-wrap">
                                                                                        {variant.images?.map((img, imgIndex) => (
                                                                                            <img
                                                                                                key={imgIndex}
                                                                                                src={`${import.meta.env.VITE_API_URL}api/product/uploads/colors/${img}`}
                                                                                                alt="variant"
                                                                                                className="variant-img me-2 mb-2"
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                    <Button
                                                                                        variant="outline-primary"
                                                                                        size="sm"
                                                                                        className="me-2 action-btn"
                                                                                        onClick={() => { handleEdit(variant) }}
                                                                                    >
                                                                                        <FiEdit />
                                                                                    </Button>


                                                                                    <Button
                                                                                        variant="outline-primary"
                                                                                        size="sm"
                                                                                        className="me-2 action-btn"
                                                                                        onClick={() => { deleteVariantProduct(variant.id, vIndex) }}
                                                                                    >
                                                                                        <FaTrash />
                                                                                    </Button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            ) : (
                                                                <div className="text-center text-muted py-3">
                                                                    No color variants available for this product
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Collapse>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ProductVariantsModal show={open} close={handleClose} productId={id} />
            <EditProductVariants show={openEdit} close={() => { return setOpenEdit(!openEdit) }} product={productVariant} />
        </div>
    )
}

export default ProductVariants;