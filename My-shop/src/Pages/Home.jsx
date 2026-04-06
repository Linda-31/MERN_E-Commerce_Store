import React from 'react';
import "../Styles/style.css";
import Productlist from '../component/Productlist';
import Blog from '../component/blog';
import Slide from '../component/slide';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCartCount } from '../features/productSlice';
import StarRating from '../component/StarRating';
import DiscountTimer from '../component/timer';
import { Toaster, toast } from 'sonner';
import { motion } from "framer-motion";
import axios from 'axios';
import "../Styles/style.css";

const categories = [
  {
    name: "Bottom",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=400",
    count: "04",
  },
  {
    name: "Hand Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&h=400",
    count: "20",
  },
  {
    name: "Jackets",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&h=400",
    count: "10",
  },
  {
    name: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=400",
    count: "16",
  },
  {
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&h=400",
    count: "30",
  },
  {
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=400",
    count: "45",
  },
  {
    name: "Dresses",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&h=400",
    count: "12",
  },
  {
    name: "Watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&h=400",
    count: "08",
  },
  {
    name: "Activewear",
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=400&h=400",
    count: "22",
  },
  {
    name: "Fragrances",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&h=400",
    count: "15",
  },
];
function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [userName, setUserName] = useState('');
  
  // Triple the list for seamless infinite looping
  const tripleCategories = [...categories, ...categories, ...categories];
  // Start at the middle set
  const [categoryIndex, setCategoryIndex] = useState(categories.length);
  const [isAnimating, setIsAnimating] = useState(false);

  const [itemsToShow, setItemsToShow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else {
        setItemsToShow(5);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNextCategory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCategoryIndex(prev => prev + 1);
  };

  const handlePrevCategory = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCategoryIndex(prev => prev - 1);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    if (categoryIndex >= categories.length * 2) {
      setCategoryIndex(categoryIndex - categories.length);
    } else if (categoryIndex <= categories.length - 1) {
      setCategoryIndex(categoryIndex + categories.length);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products/")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          const featured = data.slice(0, 4);
          setFeaturedProducts(featured);
        } else {
          console.error("Response is not an array:", data);
        }
      })
      .catch((err) => console.error("Failed to load featured products", err));

    axios
      .get("http://localhost:4000/api/blogs")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBlogs(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  const getTokenFromCookie = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const handleAddToCart = async (product) => {
    const token = getTokenFromCookie();
    if (!token) throw new Error("User token not found");

    const decoded = JSON.parse(atob(token));
    const userId = decoded?._id;

    const productToAdd = {
      ...product,
    };

    const response = await axios.post('http://localhost:4000/api/carts/save', {
      userId,
      product: productToAdd,
    });
    toast.success('product is added to the Cart!');
    const totalQuantity = response.data.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    dispatch(setCartCount(totalQuantity));

  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };


  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    try {
      await axios.post('http://localhost:4000/api/newsletters/subscribe', { email });
      toast.success('Thanks for subscribing to our curation!');
      e.target.reset();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Email is already part of our curation');
      } else {
        toast.error('Failed to confirm subscription');
      }
    }
  };

  return (

    <>
      <Toaster position="bottom-right" richColors />
      <div style={{ fontFamily: "'Jost', sans-serif", overflowX: 'hidden' }}>
        <Slide />

        {/* ===== FEATURES ROW ===== */}
        <div style={{ backgroundColor: '#fff', padding: '40px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div className="container">
            <div className="row text-center">
              {[
                { icon: 'local_shipping', title: 'FREE SHIPPING', desc: 'On orders over $150' },
                { icon: 'support_agent', title: '24/7 SUPPORT', desc: 'Get help when you need' },
                { icon: 'monetization_on', title: '100% MONEY BACK', desc: '30 days money back' },
                { icon: 'lock', title: 'SECURE PAYMENT', desc: '100% secure payment' },
              ].map((item, idx) => (
                <div className="col-md-3 col-6 mb-3 mb-md-0" key={idx}>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#000' }}>{item.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <h6 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0, letterSpacing: '1px' }}>{item.title}</h6>
                      <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SHOP BY CATEGORY - Carousel ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '40px 0' : '80px 0', backgroundColor: '#fff' }}>
          <div className="container" style={{ position: 'relative' }}>

            {/* Section Header */}
            <div className="text-center mb-5">
              <motion.h2
                style={{ color: '#000', fontWeight: '800', fontSize: window.innerWidth < 768 ? '30px' : '38px', marginBottom: '12px', fontFamily: "'Jost', sans-serif" }}
                initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }} viewport={{ once: true }}
              >Shop By Category</motion.h2>
              <p style={{ color: '#aaa', fontSize: window.innerWidth < 768 ? '13px' : '15px', maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
                 Crafting a unique narrative through curated essentials and high-end fashion.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Left Arrow */}
              <motion.button
                onClick={handlePrevCategory}
                style={{
                  position: 'absolute',
                  left: window.innerWidth < 768 ? '10px' : '-25px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: window.innerWidth < 768 ? '35px' : '50px',
                  height: window.innerWidth < 768 ? '35px' : '50px',
                  borderRadius: '50%',
                  background: '#fff',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#fff' }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>chevron_left</span>
              </motion.button>

              {/* Slider Viewport */}
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <motion.div
                  style={{ display: 'flex' }}
                  animate={{ x: `-${categoryIndex * (100 / itemsToShow)}%` }}
                  transition={isAnimating ? { type: 'spring', stiffness: 200, damping: 25 } : { duration: 0 }}
                  onAnimationComplete={handleAnimationComplete}
                >
                  {tripleCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      style={{ 
                        flex: `0 0 ${100 / itemsToShow}%`,
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        cursor: 'pointer',
                        padding: '0 10px'
                      }}
                      onClick={() => navigate('/shop')}
                    >
                      <motion.div
                        style={{
                          width: '100%',
                          maxWidth: itemsToShow === 5 ? '180px' : '160px',
                          aspectRatio: '1/1',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          backgroundColor: '#f5f5f5',
                          marginBottom: '20px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                          position: 'relative'
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </motion.div>
                      <h6 style={{ fontSize: '13px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                        {category.name} <sup style={{ color: '#888', fontWeight: '400', fontSize: '10px' }}>{category.count}</sup>
                      </h6>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Arrow */}
              <motion.button
                onClick={handleNextCategory}
                style={{
                  position: 'absolute',
                  right: window.innerWidth < 768 ? '10px' : '-25px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: window.innerWidth < 768 ? '35px' : '50px',
                  height: window.innerWidth < 768 ? '35px' : '50px',
                  borderRadius: '50%',
                  background: '#fff',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#fff' }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>chevron_right</span>
              </motion.button>
            </div>

          </div>
        </div>

        {/* ===== SEASONAL HIGHLIGHTS — MODERN EDITORIAL COLLAGE ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '120px 0', backgroundColor: '#fff' }}>
          <div className="container">
            {/* Minimalist Section Header */}
            <div className="row mb-5 pb-2">
              <div className="col-12 text-center">
                 <motion.h2 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} 
                  style={{ fontSize: '13px', fontWeight: 'bold', color: '#e64e4e', textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '15px' }}
                >The Edit</motion.h2>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{ fontSize: window.innerWidth < 768 ? '32px' : '42px', fontWeight: '800', color: '#000', margin: 0, fontFamily: "'Jost', sans-serif" }}
                >Seasonal Highlights</motion.h3>
              </div>
            </div>

            <div className="row g-5 align-items-stretch">
              {/* Left Column: Two Stacked with Overlap Labels */}
              <div className="col-lg-5 col-md-12">
                <div className="row g-4 h-100">
                  <div className="col-12">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                      style={{ position: 'relative', height: '290px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}
                      whileHover="hover"
                      onClick={() => navigate('/shop')}
                    >
                      <motion.div 
                        style={{ width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}
                        variants={{ hover: { scale: 1.1 } }} transition={{ duration: 1 }}
                      />
                      {/* Modern Floating Pill Label */}
                      <motion.div 
                        style={{ 
                          position: 'absolute', bottom: '24px', left: '24px', 
                          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', 
                          padding: '16px 28px', borderRadius: '50px', 
                          display: 'flex', alignItems: 'center', gap: '12px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.3)'
                        }}
                        variants={{ hover: { y: -8, scale: 1.02 } }}
                      >
                         <div style={{ width: '6px', height: '6px', background: '#e64e4e', borderRadius: '50%' }}></div>
                         <div>
                            <h4 style={{ color: '#000', fontSize: '14px', fontWeight: '800', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>ACCENT ACCESSORIES</h4>
                            <span style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>EXPLORE PIECES</span>
                         </div>
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <div className="col-12 mt-4 mt-lg-5">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                      style={{ position: 'relative', height: '290px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}
                      whileHover="hover"
                      onClick={() => navigate('/shop')}
                    >
                      <motion.div 
                        style={{ width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }}
                        variants={{ hover: { scale: 1.1 } }} transition={{ duration: 1 }}
                      />
                      {/* Modern Floating Pill Label */}
                      <motion.div 
                        style={{ 
                          position: 'absolute', bottom: '24px', left: '24px', 
                          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', 
                          padding: '16px 28px', borderRadius: '50px', 
                          display: 'flex', alignItems: 'center', gap: '12px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.3)'
                        }}
                        variants={{ hover: { y: -8, scale: 1.02 } }}
                      >
                         <div style={{ width: '6px', height: '6px', background: '#e64e4e', borderRadius: '50%' }}></div>
                         <div>
                            <h4 style={{ color: '#000', fontSize: '14px', fontWeight: '800', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>LUXE ESSENTIALS</h4>
                            <span style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>VIEW CURATION</span>
                         </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right Column: Large Interactive Image */}
              <div className="col-lg-7 col-md-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                  style={{ position: 'relative', height: window.innerWidth < 768 ? '400px' : '640px', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}
                  whileHover="hover"
                  onClick={() => navigate('/shop')}
                >
                  <motion.div 
                    style={{ width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center top' }}
                    variants={{ hover: { scale: 1.05 } }} transition={{ duration: 1.5 }}
                  />
                  {/* Subtle Grainy Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)', mixBlendMode: 'overlay' }}></div>
                  
                  <div style={{ position: 'absolute', top: window.innerWidth < 768 ? '30px' : '50px', left: window.innerWidth < 768 ? '30px' : '50px' }}>
                    <div style={{ borderLeft: '3px solid #e64e4e', paddingLeft: '20px' }}>
                      <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>New Season</span>
                      <h3 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '36px' : '56px', fontWeight: '900', marginBottom: '15px', lineHeight: '1', textShadow: '0 5px 30px rgba(0,0,0,0.3)' }}>URBAN <br/>MINIMALIST</h3>
                    </div>
                  </div>

                  <div style={{ position: 'absolute', bottom: window.innerWidth < 768 ? '30px' : '50px', left: window.innerWidth < 768 ? '30px' : '50px' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      style={{ background: '#000', color: '#fff', border: 'none', padding: window.innerWidth < 768 ? '12px 25px' : '15px 40px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '0' }}
                    >
                       EXPLORE '25 SHOP
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        {/* ===== FEATURED PRODUCTS — EDITORIAL BOUTIQUE GRID ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '120px 0', backgroundColor: '#fff' }}>
          <div className="container">
            {/* Section Header (Editorial Style) */}
            <div className="text-center mb-5 pb-4">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                style={{ color: '#e64e4e', letterSpacing: '5px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}
              >New Arrivals</motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ color: '#000', fontWeight: '800', fontSize: '42px', margin: 0, fontFamily: "'Jost', sans-serif" }}
              >Featured Products</motion.h2>
              <div style={{ width: '40px', height: '2px', background: '#e64e4e', margin: '25px auto 0' }}></div>
            </div>

            <div className="row g-4">
              {featuredProducts.map((product, index) => (
                <div className="col-lg-3 col-md-4 col-6" key={`${product._id}-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover="hover"
                    style={{ position: 'relative' }}
                    onClick={() => handleView(product._id)}
                  >
                    {/* Image Container */}
                    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '130%', borderRadius: '4px', cursor: 'pointer' }}>
                      <motion.img
                        src={product.image}
                        alt={product.title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        variants={{ hover: { scale: 1.08 } }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                      
                      {/* Floating Category Label Removed to avoid hiding image */}

                      {/* Animated Overlay for Buttons */}
                      <motion.div 
                        variants={{ hover: { opacity: 1 } }}
                        initial={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                      >
                         <motion.button
                           variants={{ hover: { y: 0, opacity: 1 } }} initial={{ y: 20, opacity: 0 }}
                           onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                           style={{ background: '#000', color: '#fff', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                           whileHover={{ scale: 1.1, backgroundColor: '#e64e4e' }}
                         >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                         </motion.button>
                         <motion.button
                           variants={{ hover: { y: 0, opacity: 1 } }} initial={{ y: 20, opacity: 0 }}
                           transition={{ delay: 0.05 }}
                           onClick={(e) => { e.stopPropagation(); handleView(product._id); }}
                           style={{ background: '#fff', color: '#000', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                           whileHover={{ scale: 1.1 }}
                         >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                         </motion.button>
                      </motion.div>
                    </div>

                    {/* Product Details (Clean & Minimal) */}
                    <div style={{ padding: '15px 5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ width: '4px', height: '4px', background: '#e64e4e', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>New Arrival</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.title}</h4>
                      <div className="d-flex flex-column gap-1">
                          <span style={{ fontSize: '16px', fontWeight: '800', color: '#e64e4e' }}>₹{product.price}</span>
                          <div className="d-flex align-items-center gap-2">
                             <StarRating staticRating={product.rating || 0} />
                             <span style={{ fontSize: '10px', color: '#888', fontWeight: '700' }}>({product.numReviews || 0})</span>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Modern "View All" Footer Button */}
            <div className="text-center mt-5 pt-4">
              <motion.button
                onClick={() => navigate('/shop')}
                style={{ 
                  background: 'transparent', color: '#000', border: '2px solid #000', 
                  padding: '14px 40px', fontSize: '11px', fontWeight: 'bold', 
                  letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '15px' 
                }}
                whileHover={{ backgroundColor: '#000', color: '#fff' }}
              >
                Explore Full Collection <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
              </motion.button>
            </div>
          </div>
        </div>
        {/* ===== OUR BRAND STORY — MINIMALIST EDITORIAL ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '140px 0', backgroundColor: '#fff', overflow: 'hidden' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <motion.div 
                  initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                  style={{ position: 'relative', textAlign: window.innerWidth < 768 ? 'center' : 'left' }}
                >
                  <div style={{ 
                    position: 'absolute', top: '-60px', left: window.innerWidth < 768 ? '0' : '-40px', right: window.innerWidth < 768 ? '0' : 'auto', textAlign: window.innerWidth < 768 ? 'center' : 'left', fontSize: '130px', 
                    fontWeight: '900', color: '#f7f7f7', zIndex: 0, fontFamily: "'Jost', sans-serif" 
                  }}>2025</div>
                  <div style={{ position: 'relative', zIndex: 1, paddingRight: window.innerWidth < 768 ? '0' : '40px', paddingLeft: window.innerWidth < 768 ? '15px' : '0', paddingRight: window.innerWidth < 768 ? '15px' : '40px' }}>
                    <div style={{ width: '50px', height: '3px', background: '#e64e4e', marginBottom: '40px', marginLeft: window.innerWidth < 768 ? 'auto' : '0', marginRight: window.innerWidth < 768 ? 'auto' : '0' }}></div>
                    <span style={{ color: '#888', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>Our Heritage</span>
                    <h2 style={{ fontSize: window.innerWidth < 768 ? '36px' : '56px', fontWeight: '800', lineHeight: '1.1', color: '#000', marginBottom: '30px', fontFamily: "'Jost', sans-serif" }}>Defining <br/>Modern Style</h2>
                    <p style={{ color: '#666', fontSize: window.innerWidth < 768 ? '15px' : '18px', lineHeight: '1.8', maxWidth: '500px', margin: window.innerWidth < 768 ? '0 auto 35px' : '0 0 35px 0' }}>
                      KUSHI was born from a desire to merge timeless craftsmanship with the fluid nature of modern life. We create pieces that don't just fill a wardrobe, but tell a story of quality, ethics, and unparalleled design.
                    </p>
                    <motion.button
                      whileHover={{ x: window.innerWidth < 768 ? 0 : 10, y: window.innerWidth < 768 ? -5 : 0 }}
                      style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #000', padding: '0 0 5px 0', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '15px', margin: window.innerWidth < 768 ? '0 auto' : '0' }}
                    >
                       DISCOVER OUR JOURNEY <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_right_alt</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              <div className="col-lg-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                  style={{ position: 'relative', height: window.innerWidth < 768 ? '350px' : '620px' }}
                >
                   {/* Offset Decorative Frame - Matches Asymmetric Shape */}
                   <div style={{ 
                      position: 'absolute', top: '20px', left: '20px', right: '-20px', bottom: '-20px', 
                      border: '1px solid #ddd', borderRadius: '180px 4px 180px 4px', zIndex: 0 
                   }}></div>
                   
                   {/* Asymmetric Image Container */}
                   <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '180px 4px 180px 4px', overflow: 'hidden', zIndex: 1, boxShadow: '0 25px 60px rgba(0,0,0,0.05)' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1976&auto=format&fit=crop" 
                        alt="Signature Style" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                   </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== EDITORIAL STORY — SIGNATURE OUTERWEAR — RESPONSIVE ===== */}
        <div style={{ backgroundColor: '#fafafa', padding: window.innerWidth < 768 ? '50px 0' : '140px 0' }}>
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', height: window.innerWidth < 768 ? '450px' : '680px' }}>
                   {/* Background Decorative Element */}
                   <div style={{ position: 'absolute', top: '-15px', left: '-15px', right: '15px', bottom: '15px', border: '1px solid #eee', zIndex: 0 }}></div>
                   
                   {/* Main Image */}
                   <motion.div 
                      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      style={{ 
                        position: 'absolute', top: 0, right: 0, 
                        width: window.innerWidth < 768 ? '90%' : '85%', 
                        height: '90%', overflow: 'hidden', borderRadius: '4px', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.08)' 
                      }}
                   >
                     <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Outerwear" />
                   </motion.div>

                   {/* Overlapping Detail Image with Glass Label */}
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.9, x: -50 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3 }}
                      style={{ 
                        position: 'absolute', bottom: 0, left: 0, 
                        width: window.innerWidth < 768 ? '50%' : '45%', 
                        height: window.innerWidth < 768 ? '220px' : '380px', 
                        overflow: 'hidden', borderRadius: '4px', border: window.innerWidth < 768 ? '5px solid #fff' : '10px solid #fff', zIndex: 2, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' 
                      }}
                   >
                     <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2070&auto=format&fit=crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Detail" />
                     <div style={{ 
                        position: 'absolute', bottom: window.innerWidth < 768 ? '10px' : '20px', left: window.innerWidth < 768 ? '10px' : '20px', 
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', 
                        padding: window.innerWidth < 768 ? '8px 12px' : '12px 20px', borderRadius: '50px', 
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                      }}>
                         <div style={{ width: '4px', height: '4px', background: '#e64e4e', borderRadius: '50%' }}></div>
                         <span style={{ fontSize: window.innerWidth < 768 ? '7px' : '9px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '1px' }}>Signature detail</span>
                      </div>
                   </motion.div>
                </div>
              </div>

              <div className="col-lg-5">
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
                  style={{ textAlign: window.innerWidth < 768 ? 'center' : 'left' }}
                >
                  <span style={{ color: '#e64e4e', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>Seasonal Edition</span>
                  <h2 style={{ 
                    fontSize: window.innerWidth < 768 ? '32px' : '52px', 
                    fontWeight: '800', lineHeight: '1.2', color: '#000', marginBottom: '25px', fontFamily: "'Jost', sans-serif" 
                  }}>Signature <br/>Outerwear</h2>
                  <p style={{ color: '#777', fontSize: window.innerWidth < 768 ? '14px' : '16px', lineHeight: '1.9', marginBottom: '40px', padding: window.innerWidth < 768 ? '0 15px' : '0' }}>
                    Indulge in our curated selection of bespoke outerwear. Crafted with precision and an eye for timeless elegance, each piece represents the pinnacle of modern craftsmanship.
                  </p>
                  
                  <div style={{ marginBottom: '50px', display: 'flex', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start' }}>
                    <DiscountTimer />
                  </div>

                  <motion.button
                    whileHover={{ backgroundColor: '#000', color: '#fff', scale: 1.05 }}
                    style={{ background: 'transparent', color: '#000', border: '2px solid #000', padding: '16px 45px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2.5px', textTransform: 'uppercase', borderRadius: '0' }}
                  >
                     Explore Collection
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        {/* ===== HOT SELLING / BEST SELLERS — EDITORIAL STYLE ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '120px 0', backgroundColor: '#fff' }}>
          <div className="container">
            <div className="text-center mb-5 pb-4">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                style={{ color: '#e64e4e', letterSpacing: '5px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}
              >Top Trending</motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ color: '#000', fontWeight: '800', fontSize: window.innerWidth < 768 ? '32px' : '42px', margin: 0, fontFamily: "'Jost', sans-serif" }}
              >Best Sellers</motion.h2>
              <div style={{ width: '40px', height: '2px', background: '#e64e4e', margin: '25px auto 0' }}></div>
            </div>
            <Productlist />
          </div>
        </div>

        {/* ===== TESTIMONIALS SECTION — MODERN MINIMALST ===== */}
        <div style={{ backgroundColor: '#fafafa', padding: window.innerWidth < 768 ? '50px 0' : '150px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '200px', color: '#f0f0f0', fontWeight: '900', zIndex: 0, fontFamily: "'Jost', sans-serif", opacity: 0.5 }}>“</div>
          
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '5px' }}>
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: '#e64e4e', fontSize: '18px' }}>star</span>)}
                </div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  style={{ fontSize: window.innerWidth < 768 ? '18px' : '26px', color: '#222', lineHeight: '1.6', fontWeight: '500', marginBottom: '45px', fontFamily: "'Jost', sans-serif" }}
                >
                  "The quality of the clothing is absolutely top-notch. I've bought several items spanning from their jacket collection to standard t-shirts, and each piece feels premium and fits perfectly. Truly a brand I trust for all my wardrobe needs."
                </motion.p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: '50px', height: '1px', background: '#000', marginBottom: '20px' }}></div>
                   <h5 style={{ fontWeight: '800', fontSize: '14px', color: '#000', marginBottom: '5px', letterSpacing: '2px', textTransform: 'uppercase' }}>Alexa Muller</h5>
                   <p style={{ color: '#e64e4e', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold' }}>Verified Collector</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== EDITORIAL FEED: SHOP THE LOOK — BOUTIQUE GALLERY ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '150px 0', backgroundColor: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.span 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
              style={{ color: '#e64e4e', letterSpacing: '5px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}
            >Social Inspiration</motion.span>
            <h2 style={{ fontSize: window.innerWidth < 768 ? '32px' : '42px', fontWeight: '800', color: '#000', marginBottom: '15px', fontFamily: "'Jost', sans-serif" }}>Shop The Look</h2>
            <div style={{ width: '40px', height: '2px', background: '#000', margin: '20px auto' }}></div>
          </div>
          <div className="container-fluid px-1">
            <div className="row g-2">
              {[
                'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop',
              ].map((img, idx) => (
                <div className="col-lg-2 col-md-4 col-6" key={idx}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                    style={{ position: 'relative', paddingTop: '140%', overflow: 'hidden', cursor: 'pointer', borderRadius: '2px' }}
                    whileHover="hover"
                  >
                    <motion.img 
                       src={img} 
                       alt={`Style ${idx}`} 
                       variants={{ hover: { scale: 1.15 } }}
                       transition={{ duration: 1.2, ease: 'easeOut' }}
                       style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <motion.div 
                      variants={{ hover: { opacity: 1 } }}
                      initial={{ opacity: 0 }}
                      style={{ 
                        position: 'absolute', inset: 0, 
                        background: 'rgba(0,0,0,0.15)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        backdropFilter: 'blur(3px)', transition: 'opacity 0.4s ease'
                      }}
                    >
                       <div style={{ 
                         background: '#fff', width: '45px', height: '45px', borderRadius: '50%', 
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                       }}>
                         <span className="material-symbols-outlined" style={{ color: '#000', fontSize: '18px' }}>shopping_cart</span>
                       </div>
                    </motion.div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
        {/* ===== LATEST BLOG / NEWS — EDITORIAL CARDS ===== */}
        <div style={{ padding: window.innerWidth < 768 ? '50px 0' : '150px 0', backgroundColor: '#fff' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <motion.span 
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                style={{ color: '#e64e4e', letterSpacing: '5px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}
              >From the Atelier</motion.span>
              <h2 style={{ fontSize: window.innerWidth < 768 ? '32px' : '42px', fontWeight: '800', color: '#000', marginBottom: '15px', fontFamily: "'Jost', sans-serif" }}>Latest News</h2>
              <div style={{ width: '40px', height: '2px', background: '#e64e4e', margin: '20px auto' }}></div>
            </div>

            <div className="row g-4">
              {blogs.map((news, index) => (
                <div className="col-lg-4 col-md-6" key={news._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }} whileHover="hover"
                    style={{ cursor: 'pointer', background: '#fff', borderRadius: '8px', transition: 'all 0.3s ease' }}
                    onClick={() => navigate(`/blog/${news._id}`)}
                  >
                    <div style={{ overflow: 'hidden', height: '280px', borderRadius: '6px', position: 'relative', marginBottom: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}>
                      <motion.img
                        src={news.image} alt={news.title}
                        variants={{ hover: { scale: 1.08 } }} transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Floating Category Pill - Sophisticated Polish */}
                      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10 }}>
                        <div style={{ 
                          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', 
                          padding: '5px 12px', borderRadius: '4px', 
                          display: 'flex', alignItems: 'center', gap: '8px', 
                          boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                          border: '1px solid rgba(255,255,255,0.5)'
                        }}>
                           <div style={{ width: '5px', height: '5px', background: '#e64e4e', borderRadius: '50%' }}></div>
                           <span style={{ fontSize: '10px', fontWeight: '800', color: '#000', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{news.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ padding: '0 10px' }}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                         <span style={{ fontSize: '10px', color: '#e64e4e', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>{new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         <div style={{ width: '30px', height: '1px', background: '#ddd' }}></div>
                         <span style={{ fontSize: '10px', color: '#888', fontWeight: 'bold', letterSpacing: '1px' }}>ATELIER JOURNAL</span>
                      </div>
                      
                      <h4 style={{ fontWeight: '800', fontSize: '20px', color: '#000', marginBottom: '15px', lineHeight: '1.3', fontFamily: "'Jost', sans-serif", letterSpacing: '-0.5px' }}>{news.title}</h4>
                      
                      <p style={{ fontSize: '14px', color: '#777', lineHeight: '1.8', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.description}</p>
                      
                      <motion.div
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}
                        whileHover="hover"
                      >
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#000', textTransform: 'uppercase', letterSpacing: '2px' }}>Explore Story</span>
                        <motion.div 
                          variants={{ hover: { x: 10 } }}
                          style={{ width: '35px', height: '1px', background: '#000' }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
        {/* ===== NEWSLETTER — MINIMALIST ZEN BANNER ===== */}
        <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '40px 0' : '60px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                     <div style={{ width: '40px', height: '1px', background: '#e64e4e' }}></div>
                     <span style={{ color: '#e64e4e', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>Stay Inspired</span>
                  </div>
                  
                  <h2 style={{ fontSize: window.innerWidth < 768 ? '36px' : '52px', fontWeight: '800', lineHeight: '1.1', color: '#000', marginBottom: '20px', fontFamily: "'Jost', sans-serif" }}>
                    Newsletter
                  </h2>
                  
                  <p style={{ color: '#777', fontSize: '16px', lineHeight: '1.9', marginBottom: '30px', maxWidth: '550px', margin: '0 auto 30px' }}>
                    Subscribe to receive early access to seasonal drops, exclusive styling guides, and private seasonal invitations.
                  </p>
                  
                  <form onSubmit={handleSubscribe} style={{ 
                    position: 'relative', 
                    maxWidth: '550px', 
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: window.innerWidth < 576 ? 'column' : 'row',
                    gap: window.innerWidth < 576 ? '15px' : '0'
                  }}>
                    <input
                      type="email" placeholder="YOUR EMAIL ADDRESS" required
                      style={{
                        width: '100%', 
                        height: '65px', 
                        padding: window.innerWidth < 576 ? '0 15px' : '0 160px 0 10px', 
                        background: 'transparent', border: 'none', borderBottom: '2px solid #000',
                        fontSize: '13px', outline: 'none', color: '#000', fontFamily: "'Jost', sans-serif",
                        letterSpacing: '2px', textAlign: window.innerWidth < 576 ? 'left' : 'center'
                      }}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, backgroundColor: '#000', color: '#fff' }}
                      style={{
                        position: window.innerWidth < 576 ? 'static' : 'absolute', 
                        top: '7px', right: '0', bottom: '7px',
                        padding: '0 40px', background: '#e64e4e', color: '#fff', 
                        border: 'none', fontWeight: 'bold', textTransform: 'uppercase', 
                        letterSpacing: '2px', fontSize: '11px',
                        height: window.innerWidth < 576 ? '55px' : 'auto'
                      }}
                    >Subscribe</motion.button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>      </div>
        </div>
      </div >
    </>
  );
}
export default Home;