import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../features/wishlistSlice';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

function Wishlist() {
  const { items: wishlist, status } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const getCookieValue = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };
  const token = getCookieValue("token");

  let userId = null;
  if (token) {
    try {
        const user = JSON.parse(atob(token));
        userId = user._id;
    } catch(e) {}
  }

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlist(userId));
    }
  }, [dispatch, userId]);

  const handleRemove = (productId) => {
    if (userId) {
      dispatch(removeFromWishlist({ userId, productId }));
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: "'Jost', sans-serif", minHeight: '100vh' }}>
      {/* HERO SECTION */}
      <div style={{ 
        height: '240px', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")', 
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, filter: 'grayscale(1)' 
        }}></div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2, paddingTop: '60px' }}>
          <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>WISHLIST</h1>
          <div className="mt-2 d-flex justify-content-center gap-3" style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>
             <Link to="/home" style={{ color: '#aaa', textDecoration: 'none' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>/</span>
             <span style={{ color: '#fff' }}>FAVORITES</span>
          </div>
        </motion.div>
      </div>

      <div className="container py-5">
        {status === 'loading' || status === 'idle' ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '2px' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted" style={{ letterSpacing: '2px', fontSize: '10px', fontWeight: 'bold' }}>SYNCHRONIZING WISHLIST...</p>
          </div>
        ) : status === 'succeeded' && wishlist.length === 0 ? (
          <div className="text-center py-5">
            <span className="material-symbols-outlined mb-3" style={{ fontSize: '48px', color: '#eee' }}>heart_broken</span>
            <p className="text-muted" style={{ letterSpacing: '2px', fontSize: '13px', fontWeight: 'bold' }}>YOUR WISHLIST IS CURRENTLY EMPTY</p>
            <Link to="/shop" className="btn btn-dark rounded-0 mt-3 px-5 py-3" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }}>BROWSE COLLECTION</Link>
          </div>
        ) : (
          <div className="row g-4">
            <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="col-12 col-md-4 col-lg-3" 
                key={product._id}
              >
                <div style={{ backgroundColor: '#fff', position: 'relative', border: '1px solid #eee' }}>
                  <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: window.innerWidth < 768 ? '450px' : '320px', overflow: 'hidden' }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: '0.5s' }}
                        className="hover-scale"
                      />
                    </div>
                    <div className="p-3 text-center">
                        <h6 style={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: '#000', margin: '5px 0' }}>{product.title}</h6>
                        <p style={{ color: '#e64e4e', fontWeight: 'bold', margin: '0' }}>${product.price}</p>
                        <p className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Color: {product.color}</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleRemove(product._id)}
                    style={{ 
                        position: 'absolute', top: '10px', right: '10px', 
                        background: '#fff', border: 'none', width: '35px', height: '35px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%', boxShadow: '0 5px 10px rgba(0,0,0,0.1)' 
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>close</span>
                  </button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

