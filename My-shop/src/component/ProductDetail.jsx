import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import "../Styles/style.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (product) => {
    const token = getTokenFromCookie();
    if (!token) {
        toast.error("Please login to shop");
        return;
    }

    const decoded = JSON.parse(atob(token));
    const userId = decoded?._id;

    const productToAdd = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity
    };

    try {
        await axios.post('http://localhost:4000/api/carts/save', {
          userId,
          product: productToAdd,
        });
        toast.success('Added to your collection!');
        navigate("/cart");
    } catch (err) {
        toast.error("Failed to add to cart");
    }
  };

  const getTokenFromCookie = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!product) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: '#fff', fontFamily: "'Jost', sans-serif", paddingTop: '120px' }}>
      <Toaster position="bottom-right" richColors />
      
      <div className="container py-5">
        {/* Breadcrumb */}
        <div className="mb-5 d-flex align-items-center gap-2" style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
             <Link to="/home" style={{ color: '#888', textDecoration: 'none' }}>HOME</Link>
             <span style={{ color: '#eee' }}>/</span>
             <Link to="/shop" style={{ color: '#888', textDecoration: 'none' }}>SHOP</Link>
             <span style={{ color: '#eee' }}>/</span>
             <span style={{ color: '#000' }}>{product.title?.toUpperCase()}</span>
        </div>

        <div className="row g-5">
          {/* IMAGE SECTION */}
          <div className="col-lg-7">
            <div className="row g-3">
              <div className="col-2 d-flex flex-column gap-3">
                {product.thumbnails?.map((thumb, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(thumb)}
                    style={{ 
                        cursor: 'pointer', 
                        aspectRatio: '1/1.2', 
                        overflow: 'hidden',
                        border: selectedImage === thumb ? '1px solid #000' : '1px solid transparent',
                        padding: '4px'
                    }}
                  >
                    <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                ))}
              </div>
              <div className="col-10">
                 <div style={{ aspectRatio: '1/1.2', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                    <motion.img 
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={selectedImage} 
                        alt={product.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="col-lg-5">
            <div className="ps-lg-4">
                <span style={{ color: '#e64e4e', letterSpacing: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '15px 0', letterSpacing: '-1px' }}>{product.title}</h1>
                
                <div className="d-flex align-items-center gap-3 mb-4">
                    <span style={{ fontSize: '28px', fontWeight: '800' }}>₹{product.price}</span>
                    {product.originalPrice && (
                        <span style={{ textDecoration: 'line-through', color: '#ccc', fontSize: '18px' }}>₹{product.originalPrice}</span>
                    )}
                </div>

                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', marginBottom: '40px' }}>
                    {product.description || "Elevate your everyday style with this premium piece from our latest collection. Crafted for those who appreciate fine details and timeless design."}
                </p>

                {/* SELECTORS */}
                <div className="mb-4">
                    <h6 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Select Size</h6>
                    <div className="d-flex gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                style={{
                                    width: '45px', height: '45px', border: selectedSize === size ? '1px solid #000' : '1px solid #eee',
                                    background: selectedSize === size ? '#000' : '#fff',
                                    color: selectedSize === size ? '#fff' : '#000',
                                    fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                                }}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-5">
                    <h6 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Select Color</h6>
                    <div className="d-flex gap-2">
                        {['White', 'Blue', 'Red', 'Black', 'Brown'].map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    padding: '8px 20px', border: selectedColor === color ? '1px solid #000' : '1px solid #eee',
                                    background: selectedColor === color ? '#000' : '#fff',
                                    color: selectedColor === color ? '#fff' : '#000',
                                    fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', transition: '0.3s'
                                }}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* QUANTITY & ACTIONS */}
                <div className="d-flex gap-3 mb-5">
                    <div style={{ display: 'flex', border: '1px solid #eee', height: '55px', alignItems: 'center' }}>
                        <button onClick={decrement} style={{ border: 'none', background: 'none', width: '40px', fontSize: '18px' }}>-</button>
                        <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                        <button onClick={increment} style={{ border: 'none', background: 'none', width: '40px', fontSize: '18px' }}>+</button>
                    </div>
                    
                    <button 
                        onClick={() => handleAddToCart(product)}
                        style={{ 
                            flex: 1, background: '#000', color: '#fff', border: 'none', 
                            fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px' 
                        }}
                    >
                        Add to Collection
                    </button>
                </div>

                {/* EXTRA INFO */}
                <div className="pt-5 border-top">
                    <div className="d-flex flex-column gap-3" style={{ fontSize: '13px' }}>
                        <div className="d-flex gap-2">
                            <span style={{ fontWeight: 'bold' }}>Category:</span>
                            <span style={{ color: '#666' }}>{product.category?.toUpperCase()}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <span style={{ fontWeight: 'bold' }}>Availability:</span>
                            <span style={{ color: '#e64e4e' }}>In Stock (Elite Edition)</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

