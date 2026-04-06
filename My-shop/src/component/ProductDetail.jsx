import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import "../Styles/style.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(window.innerWidth < 992);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Tab and Review States
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobileOrTablet(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);
        
        const allProducts = await axios.get('http://localhost:4000/api/products/');
        const related = allProducts.data.filter(p => p.category === response.data.category && p._id !== id);
        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div style={{ minHeight: "100vh", backgroundColor: '#fff', fontFamily: "'Jost', sans-serif", paddingTop: isMobileOrTablet ? '80px' : '120px' }}>
      <Toaster position="bottom-right" richColors />
      
      <div className="container py-lg-5 py-4 px-md-4 px-3">
     
        <div className="row g-5">
          {/* IMAGE SECTION */}
          <div className="col-lg-7">
            <div className={`row g-3 ${isMobileOrTablet ? 'flex-column-reverse' : ''}`}>
              <div className={`col-12 col-lg-2 d-flex ${isMobileOrTablet ? 'flex-row justify-content-center' : 'flex-column'} gap-2 overflow-auto`}>
                {product.thumbnails?.map((thumb, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(thumb)}
                    style={{ 
                        cursor: 'pointer', 
                        width: isMobileOrTablet ? '65px' : '100%',
                        height: isMobileOrTablet ? '65px' : '80px',
                        overflow: 'hidden',
                        border: selectedImage === thumb ? '2px solid #000' : '1px solid #e5e5e5',
                        padding: '3px',
                        flexShrink: 0,
                        backgroundColor: '#f9f9f9',
                        borderRadius: '2px'
                    }}
                  >
                    <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </motion.div>
                ))}
              </div>
              <div className="col-12 col-lg-10">
                 <div style={{ aspectRatio: '1/1.2', overflow: 'hidden', backgroundColor: '#f9f9f9', margin: '0 auto', maxWidth: isMobileOrTablet ? '100%' : 'none' }}>
                    <motion.img 
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={selectedImage} 
                        alt={product.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} 
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="col-lg-5">
            <div className={`ps-lg-4 ${isMobileOrTablet ? 'text-center' : ''}`}>
                <span style={{ color: '#e64e4e', letterSpacing: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                <h1 style={{ fontSize: isMobileOrTablet ? '28px' : '42px', fontWeight: '900', margin: '15px 0', letterSpacing: '-1px', lineHeight: 1.1 }}>{product.title}</h1>
                
                <div className={`d-flex align-items-center gap-3 mb-4 ${isMobileOrTablet ? 'justify-content-center' : ''}`}>
                    <span style={{ fontSize: '28px', fontWeight: '800' }}>₹{product.price}</span>
                    {product.originalPrice && (
                        <span style={{ textDecoration: 'line-through', color: '#ccc', fontSize: '18px' }}>₹{product.originalPrice}</span>
                    )}
                </div>

                {/* DYNAMIC PRODUCT RATING */}
                <div className={`d-flex align-items-center gap-2 mb-4 ${isMobileOrTablet ? 'justify-content-center' : ''}`}>
                    <StarRating staticRating={product.rating || 0} />
                    <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>({product.numReviews || 0} Reviews)</span>
                </div>

                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '15px', marginBottom: '40px' }}>
                    {product.description || "Elevate your everyday style with this premium piece from our latest collection. Crafted for those who appreciate fine details and timeless design."}
                </p>

                {/* SELECTORS */}
                <div className="mb-4">
                    <h6 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>Select Size</h6>
                    <div className="d-flex gap-2" style={{ flexWrap: 'wrap', justifyContent: isMobileOrTablet ? 'center' : 'flex-start' }}>
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
                    <div className="d-flex gap-2" style={{ flexWrap: 'wrap', justifyContent: isMobileOrTablet ? 'center' : 'flex-start' }}>
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
                <div className="d-flex mb-5" style={{ flexDirection: isMobileOrTablet ? 'column' : 'row', gap: '15px' }}>
                    <div style={{ display: 'flex', border: '1px solid #eee', height: '55px', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={decrement} style={{ border: 'none', background: 'none', width: '40px', fontSize: '18px' }}>-</button>
                        <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                        <button onClick={increment} style={{ border: 'none', background: 'none', width: '40px', fontSize: '18px' }}>+</button>
                    </div>
                    
                    <button 
                        onClick={() => handleAddToCart(product)}
                        style={{ 
                            flex: isMobileOrTablet ? 'none' : 1, width: '100%', background: '#000', color: '#fff', border: 'none', 
                            fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px',
                            minHeight: isMobileOrTablet ? '70px' : '55px', whiteSpace: 'nowrap'
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

        {/* TABS SECTION */}
        <div style={{ marginTop: '80px', borderTop: '1px solid #eee' }}>
            {/* Scrollable Tabs for Mobile */}
            <div className="d-flex justify-content-lg-center" style={{ borderBottom: '1px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <button 
                  onClick={() => setActiveTab('description')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'description' ? '2px solid #e64e4e' : '2px solid transparent', padding: '20px 30px', fontSize: '14px', fontWeight: activeTab === 'description' ? 'bold' : 'normal', color: activeTab === 'description' ? '#000' : '#888', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab('additional')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'additional' ? '2px solid #e64e4e' : '2px solid transparent', padding: '20px 30px', fontSize: '14px', fontWeight: activeTab === 'additional' ? 'bold' : 'normal', color: activeTab === 'additional' ? '#000' : '#888', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  Additional Information
                </button>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'reviews' ? '2px solid #e64e4e' : '2px solid transparent', padding: '20px 30px', fontSize: '14px', fontWeight: activeTab === 'reviews' ? 'bold' : 'normal', color: activeTab === 'reviews' ? '#000' : '#888', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  Reviews ({product?.reviews?.length || 0})
                </button>
            </div>

            <div style={{ padding: '40px 0', minHeight: '300px' }}>
                {activeTab === 'description' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Product Description</h4>
                        <p style={{ color: '#666', lineHeight: '1.8', fontSize: '14px' }}>
                            {product.description || "Designed for the modern professional, this piece pairs seamlessly with both everyday wear and upscale looks. Manufactured under precise specifications using premium fabrics to ensure maximum comfort without sacrificing visual aesthetic. It runs true to size and maintains its structure after washing."}
                        </p>
                    </motion.div>
                )}
                
                {activeTab === 'additional' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Technical Specs</h4>
                        <table className="table table-bordered" style={{ fontSize: '14px', width: '100%', maxWidth: '600px' }}>
                            <tbody>
                                <tr><td style={{ width: '40%', fontWeight: 'bold', background: '#f9f9f9', padding: '15px' }}>Weight</td><td style={{ padding: '15px' }}>0.5 kg</td></tr>
                                <tr><td style={{ fontWeight: 'bold', background: '#f9f9f9', padding: '15px' }}>Dimensions</td><td style={{ padding: '15px' }}>15 x 10 x 5 cm</td></tr>
                                <tr><td style={{ fontWeight: 'bold', background: '#f9f9f9', padding: '15px' }}>Materials</td><td style={{ padding: '15px' }}>Cotton, Polyester Blend</td></tr>
                            </tbody>
                        </table>
                    </motion.div>
                )}
                
                {activeTab === 'reviews' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="row">
                        <div className="col-md-6 mb-5">
                            <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Customer Reviews</h4>
                            {(!product?.reviews || product.reviews.length === 0) ? (
                                <p style={{ color: '#888', fontSize: '14px' }}>There are no reviews for this product yet.</p>
                            ) : (
                                <div className="d-flex flex-column gap-4">
                                    {product.reviews.map((review, idx) => (
                                        <div key={idx} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <StarRating staticRating={review.rating} />
                                                <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>- {review.name}</span>
                                            </div>
                                            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '4px' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Add a Review</h4>
                                <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>Your email address will not be published. Required fields are marked *</p>
                                
                                <div className="mb-4">
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Your Rating *</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setReviewRating(star)}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    fontSize: '24px', 
                                                    color: (hoverRating || reviewRating) >= star ? '#ffc107' : '#e4e5e9',
                                                    transition: 'color 0.2s',
                                                    lineHeight: 1
                                                }}
                                            >
                                                &#9733;
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Your Review *</label>
                                    <textarea 
                                        rows="4" 
                                        className="form-control rounded-0 border-0" 
                                        style={{ fontSize: '14px', padding: '15px' }}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="What did you like or dislike?"
                                    ></textarea>
                                </div>
                                <button 
                                    onClick={async () => {
                                        if (reviewRating === 0) return toast.error("Please select a star rating!");
                                        if (!reviewText) return toast.error("Please enter a review message!");
                                        
                                        try {
                                            const token = getTokenFromCookie();
                                            let name = "Anonymous";
                                            if (token) {
                                                try {
                                                    const decoded = JSON.parse(atob(token));
                                                    if (decoded.name) name = decoded.name;
                                                    else if (decoded.email) name = decoded.email.split('@')[0];
                                                } catch(e) {}
                                            }
                                            const response = await axios.post(`http://localhost:4000/api/products/${id}/reviews`, {
                                                rating: reviewRating,
                                                comment: reviewText,
                                                name: name
                                            });
                                            setProduct(response.data.product);
                                            toast.success("Review submitted for moderation!");
                                            setReviewRating(0); setReviewText('');
                                        } catch (error) {
                                            toast.error("Failed to submit review");
                                            console.error(error);
                                        }
                                    }}
                                    style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 30px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '120px' }}>
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <span style={{ color: '#e64e4e', letterSpacing: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Explore More</span>
                  <h3 style={{ fontSize: isMobileOrTablet ? '26px' : '36px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', margin: '15px 0' }}>YOU MAY ALSO LIKE</h3>
                  <div style={{ width: '60px', height: '4px', backgroundColor: '#000', margin: '0 auto' }}></div>
              </div>

              <div className="row g-4 overflow-hidden">
                  {relatedProducts.map((relProduct, index) => (
                      <div className="col-lg-3 col-md-4 col-6 mb-3" key={relProduct._id}>
                          <motion.div
                              whileHover="hover"
                              style={{ position: 'relative', cursor: 'pointer' }}
                              onClick={() => navigate(`/products/${relProduct._id}`)}
                          >
                              {/* Image Container */}
                              <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '135%', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                                  <motion.img
                                      src={relProduct.image}
                                      alt={relProduct.title}
                                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                      variants={{ hover: { scale: 1.08 } }}
                                      transition={{ duration: 0.8, ease: 'easeOut' }}
                                  />
                              </div>

                              {/* Product Details */}
                              <div style={{ padding: '20px 5px', textAlign: 'center' }}>
                                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#000', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.4' }}>{relProduct.title}</h4>
                                  <div className="d-flex align-items-center justify-content-center gap-3">
                                      <span style={{ fontSize: '15px', fontWeight: '800', color: '#000' }}>₹{relProduct.price}</span>
                                      {relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (
                                          <span style={{ textDecoration: "line-through", color: "#ccc", fontSize: '12px' }}>
                                              ₹{relProduct.originalPrice}
                                          </span>
                                      )}
                                  </div>
                                  <div style={{ marginTop: '10px', opacity: 0.8, display: 'flex', justifyContent: 'center' }}>
                                      <StarRating staticRating={relProduct.rating || 0} />
                                  </div>
                              </div>
                          </motion.div>
                      </div>
                  ))}
              </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;

