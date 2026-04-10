import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://mern-store-server.onrender.com/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-details-page">
      <div className="text-head">
        <div>
          PIECE DETAILS
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Artisanal Archive & Specifications</span>
        </div>
        <button 
          className="btn btn-sm btn-outline-dark border-0 mt-2 mt-md-0" 
          onClick={() => window.history.back()}
          style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}
        >
          ← BACK
        </button>
      </div>

      <div className="row g-5">
        {/* Visual Showcase */}
        <div className="col-12 col-lg-5">
          <div className="table-wrap p-0 overflow-hidden" style={{ background: '#f9f9f9', border: '1px solid #f0f0f0', maxWidth: '100%' }}>
            <img
              src={product.image}
              alt={product.title}
              className="product-detail-visual"
            />
          </div>
          
          <div className="mt-4 row g-2">
            {product.thumbnails && product.thumbnails.map((thumb, idx) => (
               <div className="col-6 col-md-4 col-lg-3" key={idx}>
                  <img src={thumb} alt="" className="product-thumbnail-img" />
               </div>
            ))}
          </div>
        </div>

        {/* Curation Details */}
        <div className="col-lg-7">
          <div className="table-wrap h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
               <span style={{ fontSize: '11px', fontWeight: '900', color: '#e64e4e', letterSpacing: '3px', textTransform: 'uppercase' }}>{product.category}</span>
               <span style={{ fontSize: '10px', fontWeight: '800', color: product.stock > 0 ? '#27ae60' : '#e64e4e', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {product.stock > 0 ? `In Inventory (${product.stock})` : 'Sold Out'}
               </span>
            </div>
            
            <h1 className="product-title-detail" style={{ fontWeight: '900', color: '#000', marginBottom: '20px', letterSpacing: '-1px' }}>{product.title}</h1>
            
            <div className="d-flex align-items-baseline gap-3 mb-4">
               <span style={{ fontSize: '28px', fontWeight: '900', color: '#000' }}>₹{product.price.toLocaleString('en-IN')}</span>
               {product.originalPrice > product.price && (
                  <span className="text-muted text-decoration-line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
               )}
            </div>

            <div className="row g-4 border-top pt-4 mb-4">
               <div className="col-6 col-md-4">
                  <label className="text-mutedSmall d-block mb-1">Color Palette</label>
                  <div className="fw-bold">{product.color}</div>
               </div>
               <div className="col-6 col-md-4">
                  <label className="text-mutedSmall d-block mb-1">Atelier Sizes</label>
                  <div className="fw-bold">{Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}</div>
               </div>
               <div className="col-6 col-md-4">
                  <label className="text-mutedSmall d-block mb-1">Brand Signature</label>
                  <div className="fw-bold">{product.brandName}</div>
               </div>
            </div>

            <div className="mb-5">
               <label className="text-mutedSmall d-block mb-2">Artisanal Story</label>
               <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.8', margin: 0 }}>
                  {product.description || "The soul of this piece lies in its unique craftsmanship and timeless silhouette, hand-curated for the modern wardrobe."}
               </p>
            </div>

            <div className="mt-auto pt-4 border-top d-flex flex-column flex-sm-row gap-3">
               <button className="btn btn-dark px-4 px-md-5 py-3 w-100-mobile" style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>
                  REFINE PIECE
               </button>
               <button className="btn btn-outline-danger px-4 py-3 w-100-mobile" style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>
                  RETIRE FROM COLLECTION
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
