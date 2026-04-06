import React from 'react';
import "../Styles/style.css";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Filter from '../component/filter';
import StarRating from '../component/StarRating';
import { Toaster, toast } from 'sonner';
import { addToWishlist, removeFromWishlist } from '../features/wishlistSlice';
import { setCartCount } from '../features/productSlice';
import Spinner from '../component/spinner';
import { motion, AnimatePresence } from "framer-motion";

function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const wishlist = useSelector((state) => state.wishlist.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.results) {
      setProducts(location.state.results);
      setSearchTerm(location.state.query || "");
      setLoading(false);
    } else {
      axios.get("http://localhost:4000/api/products/")
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setLoading(false);
        });
    }
  }, [location.state]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
        // Option to reload all if empty, or just stay as is. 
        // Existing code had it commented out.
    }

    const delayDebounce = setTimeout(() => {
      axios.get(`http://localhost:4000/api/products/search?q=${searchTerm}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Error searching products:", error);
        });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const getTokenFromCookie = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const handleClick = (product) => {
    const token = getTokenFromCookie();
    if (!token) {
        toast.error("Please login to manage your wishlist");
        return;
    }
    const decoded = JSON.parse(atob(token));
    const userId = decoded?._id;
    const exists = wishlist.find(item => item._id === product._id);
    if (!exists) {
      dispatch(addToWishlist({
        userId,
        productId: product._id
      }));
      toast.success('Product added to wishlist!');
    } else {
      dispatch(removeFromWishlist({
        userId,
        productId: product._id
      }));
      toast.info('Product removed from wishlist!');
    }
  };

  const handleAddToCart = async (product) => {
    const token = getTokenFromCookie();
    if (!token) {
        toast.error("Please login to shop");
        return;
    }
    const decoded = JSON.parse(atob(token));
    const userId = decoded?._id;

    try {
        const response = await axios.post('http://localhost:4000/api/carts/save', {
          userId,
          product
        });
        toast.success('Product added to Cart!');
        const totalQuantity = response.data.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        dispatch(setCartCount(totalQuantity));
    } catch (err) {
        toast.error("Failed to add product to cart");
    }
  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  const filteredProducts = category === 'all'
    ? products
    : products.filter(product => product.category === category);

  const handleCategoryChange = async (newCategory) => {
    setCategory(newCategory);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/products/category/${newCategory}`);
      setProducts(response.data);
      setFiltersApplied(false);
      setFilteredResults([]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setLoading(false);
    }
  };

  const applyFilters = (filteredProducts) => {
    setFiltersApplied(true);
    setFilteredResults(filteredProducts || []);
  };

  const productsToDisplay = filtersApplied ? filteredResults : filteredProducts;

  const categoriesList = [
    { id: 'all', label: 'All Collection' },
    { id: 'women', label: 'Women Elite' },
    { id: 'men', label: 'Men Signature' },
    { id: 'bag', label: 'Artisanal Bags' },
    { id: 'shoe', label: 'Footwear' },
    { id: 'watch', label: 'Timepieces' },
  ];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <Toaster position="bottom-right" richColors />
      
      {/* ===== MODERN BREADCRUMB HEADER ===== */}
      <div style={{ 
        height: window.innerWidth < 768 ? '220px' : '350px', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Decorative Elements */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, filter: 'grayscale(1)' }}></div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 20px' }}
        >
          <span style={{ display: 'block', marginTop: window.innerWidth < 992 ? '60px' : '0', color: '#e64e4e', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}>Our Collection</span>
          <h1 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '32px' : '56px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', margin: '15px 0' }}>THE SHOP</h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
             <Link to="/home" style={{ color: '#888', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>HOME</Link>
             <div style={{ width: '4px', height: '4px', backgroundColor: '#e64e4e', borderRadius: '50%' }}></div>
             <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>SHOP</span>
          </div>
        </motion.div>
      </div>

      <div className="container py-lg-5 py-4 mt-lg-4">
        <div className="row g-5">
          
          {/* ===== SIDEBAR: REFINED FILTER PANEL ===== */}
          <div className="col-lg-3 col-md-4">
             <div className="sticky-top" style={{ top: '120px', zIndex: 10 }}>
                {/* Search Bar Refined */}
                <div style={{ position: 'relative', marginBottom: window.innerWidth < 992 ? '30px' : '50px' }}>
                     <input 
                        type="text" 
                        placeholder="SEARCH PRODUCTS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', height: '50px', background: 'transparent', border: 'none', borderBottom: '2px solid #000', outline: 'none', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}
                     />
                     <span className="material-symbols-outlined" style={{ position: 'absolute', right: 0, top: '15px', fontSize: '20px' }}>search</span>
                </div>

                {/* Categories */}
                <div className={window.innerWidth < 992 ? "mb-4" : "mb-5"}>
                    <h5 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: window.innerWidth < 992 ? '15px' : '30px', color: '#000' }}>Categories</h5>
                    <div style={{ overflowX: window.innerWidth < 992 ? 'auto' : 'visible', paddingBottom: window.innerWidth < 992 ? '10px' : '0', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                        <ul className={window.innerWidth < 992 ? "list-unstyled d-flex gap-2 m-0" : "list-unstyled d-flex flex-column gap-3"}>
                          {categoriesList.map((cat) => (
                            <li key={cat.id}>
                              <button 
                                onClick={() => handleCategoryChange(cat.id)}
                                style={{ 
                                    background: window.innerWidth < 992 ? (category === cat.id ? '#000' : '#f5f5f5') : 'none', 
                                    border: 'none', padding: window.innerWidth < 992 ? '8px 20px' : 0, 
                                    borderRadius: window.innerWidth < 992 ? '50px' : 0,
                                    fontSize: window.innerWidth < 992 ? '11px' : '14px', 
                                    color: window.innerWidth < 992 ? (category === cat.id ? '#fff' : '#666') : (category === cat.id ? '#e64e4e' : '#888'), 
                                    fontWeight: category === cat.id ? '800' : '500',
                                    letterSpacing: '0.5px', transition: 'all 0.3s ease',
                                    borderLeft: window.innerWidth >= 992 ? (category === cat.id ? '2px solid #e64e4e' : '2px solid transparent') : 'none',
                                    paddingLeft: window.innerWidth >= 992 ? (category === cat.id ? '15px' : '0') : (window.innerWidth < 992 ? '20px' : '0'),
                                    textAlign: 'left', whiteSpace: 'nowrap'
                                }}
                              >
                                {cat.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 border-top">
                    {/* Desktop / Tablet Filters */}
                    {window.innerWidth >= 768 && (
                        <Filter onApply={applyFilters}/>
                    )}
                    
                    {/* Mobile Filters Dropdown */}
                    {window.innerWidth < 768 && (
                        <>
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', border: 'none', padding: '15px 20px', borderRadius: '50px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff', marginBottom: '10px' }}
                            >
                                <span>Advanced Filters</span>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showMobileFilters ? 'remove' : 'tune'}</span>
                            </button>
                            <AnimatePresence>
                                {showMobileFilters && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className="mobile-filter-container" style={{ background: '#f9f9f9', padding: '25px 20px', borderRadius: '20px', marginTop: '10px', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.03)' }}>
                                            <style>
                                                {`
                                                    @media (max-width: 767px) {
                                                        .mobile-filter-container form { max-width: 100% !important; display: flex; flex-direction: column; gap: 20px; }
                                                        .mobile-filter-container form > div { margin-top: 0 !important; }
                                                        .mobile-filter-container .form-check { display: inline-block; margin-right: 20px; margin-bottom: 5px; }
                                                        .mobile-filter-container h4 { margin-bottom: 12px !important; }
                                                    }
                                                `}
                                            </style>
                                            <Filter onApply={applyFilters}/>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
             </div>
          </div>

          {/* ===== PRODUCT GRID: EDITORIAL BOUTIQUE ===== */}
          <div className="col-lg-9 col-md-8">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "500px" }}>
                <Spinner />
              </div>
            ) : (
                <div className="row g-4 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        {productsToDisplay.length > 0 ? (
                            productsToDisplay.map((product, index) => (
                                <motion.div 
                                    className="col-lg-4 col-md-6 col-6 mb-lg-4 mb-3" 
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <motion.div
                                        whileHover="hover"
                                        style={{ position: 'relative' }}
                                        onClick={() => handleView(product._id)}
                                    >
                                        {/* Image Container */}
                                        <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '135%', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
                                            <motion.img
                                                src={product.image}
                                                alt={product.title}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                variants={{ hover: { scale: 1.08 } }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                            />
                                            
                                            {/* Labels (New/Sale) */}
                                            <div style={{ position: 'absolute', top: window.innerWidth < 768 ? '8px' : '15px', left: window.innerWidth < 768 ? '8px' : '15px', zIndex: 5 }}>
                                                <div style={{ 
                                                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', 
                                                    padding: window.innerWidth < 768 ? '4px 8px' : '6px 14px', borderRadius: '50px', 
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                                                }}>
                                                    <div style={{ width: window.innerWidth < 768 ? '3px' : '4px', height: window.innerWidth < 768 ? '3px' : '4px', background: '#e64e4e', borderRadius: '50%' }}></div>
                                                    <span style={{ fontSize: window.innerWidth < 768 ? '8px' : '9px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: window.innerWidth < 768 ? '0.5px' : '1px' }}>
                                                        {product.category === 'new' ? 'New' : 'Elite'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Wishlist Icon Overlay */}
                                            <motion.button
                                                className="wishlist-btn"
                                                onClick={(e) => { e.stopPropagation(); handleClick(product); }}
                                                style={{ 
                                                    position: 'absolute', top: window.innerWidth < 768 ? '8px' : '15px', right: window.innerWidth < 768 ? '8px' : '15px', zIndex: 10,
                                                    background: '#fff', border: 'none', width: window.innerWidth < 768 ? '26px' : '36px', height: window.innerWidth < 768 ? '26px' : '36px', 
                                                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                                                    justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                    color: wishlist.find(item => item._id === product._id) ? '#e64e4e' : '#ccc',
                                                    transition: 'color 0.3s ease'
                                                }}
                                                whileHover={{ scale: 1.1, color: '#000' }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: window.innerWidth < 768 ? '14px' : '20px', fontVariationSettings: wishlist.find(item => item._id === product._id) ? "'FILL' 1" : "'FILL' 0", color: 'inherit' }}>favorite</span>
                                            </motion.button>

                                            {/* Animated Overlay for Buttons - Responsive visibility */}
                                            {window.innerWidth >= 992 && (
                                                <motion.div 
                                                    variants={{ hover: { opacity: 1 } }}
                                                    initial={{ opacity: 0 }}
                                                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.3s ease' }}
                                                >
                                                    <motion.button
                                                        variants={{ hover: { y: 0, opacity: 1 } }} initial={{ y: 20, opacity: 0 }}
                                                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                                        style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                                                        whileHover={{ backgroundColor: '#e64e4e', scale: 1.05 }}
                                                    >
                                                        Add to Collection
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                            
                                            {/* Mobile Add to Cart Button */}
                                            {window.innerWidth < 992 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                                                    style={{ 
                                                        position: 'absolute', bottom: '10px', right: '10px', zIndex: 10,
                                                        background: '#000', border: 'none', width: '32px', height: '32px', 
                                                        borderRadius: '50%', display: 'flex', alignItems: 'center', 
                                                        justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div style={{ padding: '20px 5px', textAlign: 'center' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#000', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.4' }}>{product.title}</h4>
                                            <div className="d-flex align-items-center justify-content-center gap-3">
                                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#000' }}>₹{product.price}</span>
                                                {product.originalPrice && product.originalPrice > product.price && (
                                                    <span style={{ textDecoration: "line-through", color: "#ccc", fontSize: '13px' }}>
                                                        ₹{product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ marginTop: '10px', opacity: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                                <StarRating staticRating={product.rating || 0} />
                                                <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>({product.numReviews || 0})</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-12 text-center py-5">
                                <p style={{ color: '#888', fontSize: '16px', letterSpacing: '1px' }}>No items found in this curation.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Shop;