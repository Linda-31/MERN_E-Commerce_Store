import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

const AddBlog = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        category: "Fashion",
        author: "Admin",
        description: "",
        content: "",
        image: "",
        tags: "",
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
            const tagsArray = formData.tags.split(",").map(t => t.trim());
            const dataToSend = { ...formData, tags: tagsArray };
            await axios.post("http://localhost:4000/api/blogs/save", dataToSend);
            toast.success("Journal article published successfully");
            navigate("/blogs");
        } catch (error) {
            toast.error("Failed to publish article");
        }
    };

    return (
        <div className="add-blog-page">
            <Toaster richColors position="top-right" />
            
            <div className="text-head">
                PUBLISH JOURNAL
                <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-dark border-0" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                    <i className="bi bi-arrow-left me-2"></i> BACK TO LIST
                </button>
            </div>

            <div className="admin-form-container mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="row g-5">
                        <div className="col-lg-8">
                            <div className="mb-4">
                                <label className="form-label">Story Identity (Title)</label>
                                <input type="text" name="title" className="form-control" placeholder="ENTER ARTICLE TITLE" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label">Short Editorial Hook (Description)</label>
                                <textarea name="description" className="form-control" rows={2} placeholder="A FEW WORDS TO DRAW READERS IN..." value={formData.description} onChange={handleInputChange} required></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Lead Author</label>
                                    <input type="text" name="author" className="form-control" placeholder="E.G. ATELIER EDITORIAL" value={formData.author} onChange={handleInputChange} required />
                                </div>
                                <div className="col-md-6 mb-4">
                                    <label className="form-label">Journal Category</label>
                                    <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Collections">Collections</option>
                                        <option value="Behind the Scenes">Behind the Scenes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label">Collection Tags (Comma-separated)</label>
                                <input type="text" name="tags" className="form-control" placeholder="E.G. SUMMER, LUXE, ATELIER" value={formData.tags} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <label className="form-label d-block mb-3">Hero Photography</label>
                            <div 
                                style={{ 
                                    width: '100%', height: '320px', backgroundColor: '#fafafa', 
                                    border: '1px dashed #ddd', borderRadius: '4px', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden', position: 'relative', cursor: 'pointer'
                                }}
                                onClick={() => document.getElementById('imageField').click()}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                ) : (
                                    <div className="text-center">
                                        <i className="bi bi-cloud-upload fs-1 text-muted"></i>
                                        <p className="text-muted mt-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>UPLOAD COVER</p>
                                    </div>
                                )}
                                <input type="file" id="imageField" className="d-none" onChange={handleImageChange} />
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Full Journal Narrative (Content)</label>
                            <textarea name="content" className="form-control" rows={12} placeholder="WEAVE YOUR STORY..." value={formData.content} onChange={handleInputChange} required></textarea>
                        </div>

                        <div className="col-12 text-end mt-5">
                            <button type="submit" className="btn-admin btn-admin-primary px-5">PUBLISH TO JOURNAL</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;
