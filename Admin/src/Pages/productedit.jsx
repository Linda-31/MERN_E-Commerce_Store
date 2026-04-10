import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';
import Spinner from "../Component/Spinner";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    color: "",
    sizes: "",
    image: "",
    brandName: "",
    category: "",
    description: "",
    stock: "",
    thumbnails: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://mern-store-server.onrender.com/api/products/${id}`);
        const data = res.data;
        setFormData({
          ...data,
          sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : data.sizes,
          thumbnails: data.thumbnails || [],
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load piece details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailsChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(images => {
      setFormData(prev => ({
        ...prev,
        thumbnails: [...prev.thumbnails, ...images]
      }));
    });
  };

  const removeThumbnail = (index) => {
    setFormData(prev => {
      const newThumbs = [...prev.thumbnails];
      newThumbs.splice(index, 1);
      return { ...prev, thumbnails: newThumbs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...formData,
      sizes: typeof formData.sizes === 'string' ? formData.sizes.split(",").map(size => size.trim()) : formData.sizes
    };
    try {
      await axios.put(`https://mern-store-server.onrender.com/api/products/${id}`, updatedProduct);
      toast.success("Artisanal curation updated");
      setTimeout(() => navigate('/product'), 1500);
    } catch (err) {
      toast.error("Process failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="product-edit-page">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        REFINE PIECE
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-dark border-0 mt-2 mt-sm-0" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
            <i className="bi bi-arrow-left me-2"></i> BACK TO INVENTORY
        </button>
      </div>

      <div className="admin-form-container mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="row g-5">
            <div className="col-lg-5">
                <label className="form-label d-block mb-3">Primary Visual</label>
                <div style={{ width: '100%', height: '450px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                    <img src={formData.image} alt={formData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <div className="mt-4">
                    <label className="form-label">Artisanal Story (Description)</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="8" required />
                </div>
            </div>

            <div className="col-lg-7">
                <div className="row g-4">
                    <div className="col-12">
                        <label className="form-label">Product Identity</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Valuation (₹)</label>
                        <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Original (₹)</label>
                        <input type="number" className="form-control" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Color Palette</label>
                        <input type="text" className="form-control" name="color" value={formData.color} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Available Sizes</label>
                        <input type="text" className="form-control" name="sizes" value={formData.sizes} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Collection Category</label>
                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Inventory Count</label>
                        <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Atelier Thumbnails</label>
                        <input type="file" multiple accept="image/*" className="form-control mb-3" onChange={handleThumbnailsChange} />
                        <div className="d-flex flex-wrap gap-3">
                            {formData.thumbnails.map((thumb, idx) => (
                                <div key={idx} style={{ position: 'relative', width: 70, height: 70 }}>
                                    <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeThumbnail(idx)}
                                        style={{ position: 'absolute', top: -5, right: -5, background: '#e64e4e', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <button type="submit" className="btn-admin btn-admin-primary w-100">UPDATE CURATION</button>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductEdit;
