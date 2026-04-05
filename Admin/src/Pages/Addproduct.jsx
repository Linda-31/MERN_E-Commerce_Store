import React, { useState } from "react";
import '../Styles/style.css';
import axios from "axios";
import { toast, Toaster } from 'sonner';

const AddProduct = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        brandName: "",
        category: "",
        price: "",
        originalPrice: "",
        color: "",
        sizes: "",
        stock: "",
        description: "",
        image: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, image: "" });
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/products/add", formData);
            toast.success("Artisanal piece curated successfully");
            setFormData({
                title: "", brandName: "", category: "", price: "",
                originalPrice: "", color: "", sizes: "", stock: "",
                description: "", image: "",
            });
            setImagePreview(null);
        } catch (error) {
            toast.error("Failed to add product to collection");
        }
    };

    return (
        <div className="add-product-page">
            <Toaster richColors position="top-right" />
            <div className="text-head">
                CURATE NEW PIECE
                <span>Artisanal Inventory Curation</span>
            </div>

            <div className="admin-form-container mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-6 text-center">
                            <label className="form-label d-block mb-3">Product Visual</label>
                            <div style={{ 
                                width: '100%', height: '400px', backgroundColor: '#fafafa', 
                                border: '1px dashed #ddd', borderRadius: '4px', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', position: 'relative'
                            }}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div className="text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>NO IMAGE SELECTED</div>
                                )}
                                <input 
                                    type="file" 
                                    onChange={handleImageChange}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                />
                            </div>
                            <small className="text-muted mt-2 d-block" style={{ fontSize: '10px' }}>TAP TO UPLOAD ARTISANAL PHOTOGRAPHY</small>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-4">
                                <label className="form-label">Product Identity</label>
                                <input type="text" name="title" className="form-control" placeholder="E.G. SILK DRAPED MAXI" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            
                            <div className="row">
                                <div className="col-6 mb-4">
                                    <label className="form-label">Valuation (₹)</label>
                                    <input type="number" name="price" className="form-control" placeholder="0.00" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="col-6 mb-4">
                                    <label className="form-label">Original (₹)</label>
                                    <input type="number" name="originalPrice" className="form-control" placeholder="0.00" value={formData.originalPrice} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Collection Category</label>
                                <select className="form-select" name="category" value={formData.category} onChange={handleInputChange} required>
                                    <option value="">SELECT COLLECTION</option>
                                    <option value="men">MEN'S ATELIER</option>
                                    <option value="women">WOMEN'S ATELIER</option>
                                    <option value="accessories">ACCESSORIES</option>
                                    <option value="apparel">APPAREL</option>
                                </select>
                            </div>

                            <div className="row">
                                <div className="col-6 mb-4">
                                    <label className="form-label">Inventory Count</label>
                                    <input type="number" name="stock" className="form-control" placeholder="0" value={formData.stock} onChange={handleInputChange} required />
                                </div>
                                <div className="col-6 mb-4">
                                    <label className="form-label">Color Palette</label>
                                    <input type="text" name="color" className="form-control" placeholder="E.G. NOIR" value={formData.color} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Brand Signature</label>
                                <input type="text" name="brandName" className="form-control" placeholder="KUSHI" value={formData.brandName} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <label className="form-label">Artisanal Story (Description)</label>
                            <textarea name="description" className="form-control" rows={4} placeholder="Describe the craftsmanship and soul of this piece..." value={formData.description} onChange={handleInputChange}></textarea>
                        </div>

                        <div className="col-12 text-end mt-5">
                            <button type="submit" className="btn-admin btn-admin-primary px-5">CURATE COLLECTION PIECE</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
