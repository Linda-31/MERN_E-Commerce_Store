import React, { useEffect, useState, useCallback } from 'react';
import "../Styles/style.css";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast, Toaster } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setCartCount } from '../features/productSlice';

function Cart() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const totalQuantity = useSelector((state) => state.product.cartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCartItems = useCallback(() => {
    const token = getTokenFromCookie();
    if(!token) return;
    const decoded = JSON.parse(atob(token));
    const userId = decoded?._id;
    axios.get(`/api/carts/${userId}`).then((response) => {
      setCartItems(response.data);
      const totalQuantity = response.data.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      dispatch(setCartCount(totalQuantity));
    }).catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  const getTokenFromCookie = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const getCookieValue = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  if (cartItems?.products?.length === 0) {
    return (
      <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
        <img src="https://images.unsplash.com/photo-1591348113527-71633e51c884?q=80&w=2072&auto=format&fit=crop" alt="Empty Cart" style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px', opacity: 0.9, filter: 'grayscale(1)' }} />
        <h4 style={{ fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase' }}>YOUR BAG IS EMPTY</h4>
        <p className="text-muted mb-4" style={{ letterSpacing: '1px' }}>Discover our latest artisanal collections.</p>
        <Link to="/shop">
            <button className="btn btn-dark rounded-0 px-5 py-3" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '3px' }}>EXPLORE SHOP</button>
        </Link>
      </div>
    );
  }

  const subtotal = cartItems?.products?.reduce((total, item) => total + item.product?.price * item.quantity, 0);
  const fee = 5;
  const total = subtotal + fee;

  const handlePlaceOrder = async () => {
    try {
      const token = getCookieValue("token");
      if (!token) return;
      const user = JSON.parse(atob(token));
      const userId = user._id;
      const userName = user.fullName;

      const orderData = {
        user: userId,
        userName: userName,
        products: cartItems?.products?.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          totalPrice: item.product.price * item.quantity
        })),
        platformFee: 5,
        totalAmount: total
      };

      const response = await axios.post('/api/orders/add', orderData);
      toast.success("Order curated successfully");
      navigate("/payment", { state: { totalAmount: total, orderId: response.data.orderId } });
    } catch (error) {
      toast.error("Process failed.");
    }
  };

  const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "#fff", padding: "40px", width: "400px", textAlign: "center" }}>
          <h4 style={{ fontWeight: "900", textTransform: 'uppercase', letterSpacing: '2px', marginBottom: "20px" }}>Finalize Order</h4>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px" }}>Proceed to checkout and finalize your artisanal selection?</p>
          <div className="d-flex gap-3">
            <button className="btn btn-outline-dark rounded-0 flex-grow-1 py-3" style={{ fontSize: '11px', fontWeight: '900' }} onClick={onClose}>BACK</button>
            <button className="btn btn-dark rounded-0 flex-grow-1 py-3" style={{ fontSize: '11px', fontWeight: '900' }} onClick={onConfirm}>CONFIRM</button>
          </div>
        </motion.div>
      </div>
    );
  };

  function handleRemoveProduct(itemId) {
    const token = getCookieValue("token");
    if (!token) return;
    const user = JSON.parse(atob(token));
    const userId = user._id;

    axios.delete(`/api/carts/cart/${userId}/item/${itemId}`)
      .then(() => getCartItems())
      .catch(console.error);
  }

  const updateQuantity = async (productId, delta) => {
    setCartItems(prev => {
        const newProducts = prev.products.map(item => {
          if (item.product._id === productId) {
             const newQty = Math.max(1, item.quantity + delta);
             return { ...item, quantity: newQty };
          }
          return item;
        });
        return { ...prev, products: newProducts };
    });
    const token = getCookieValue("token");
    if (!token) return;
    const user = JSON.parse(atob(token));
    const userId = user._id;
    try {
      await axios.put('/api/carts/update', { productId, delta, userId });
      getCartItems();
    } catch (e) {}
  };

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: "'Jost', sans-serif", minHeight: '100vh' }}>
      <Toaster position="bottom-right" richColors />
      
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop")', 
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, filter: 'grayscale(1)' 
        }}></div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2, paddingTop: '60px' }}>
          <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>SHOPPING BAG</h1>
          <div className="mt-2 d-flex justify-content-center gap-3" style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>
             <Link to="/home" style={{ color: '#aaa', textDecoration: 'none' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>/</span>
             <span style={{ color: '#fff' }}>CHECKOUT</span>
          </div>
        </motion.div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* ITEMS LIST */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              <AnimatePresence>
              {cartItems?.products?.map((item, index) => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: 10 }}
                    key={`${item.product?._id}-${index}`} 
                    className="p-4" 
                    style={{ border: '1px solid #eee' }}
                >
                  <div className="row align-items-center g-4">
                    <div className="col-4 col-md-2">
                        <Link to={`/products/${item.product?._id}`}>
                            <img src={item.product?.image} alt={item.product?.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                        </Link>
                    </div>
                    
                    <div className="col-8 col-md-5">
                        <h6 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>{item.product?.title}</h6>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            SIZE: {item?.size} | COLOR: {item?.color}
                        </div>
                        <div className="mt-3 d-flex align-items-center gap-3">
                            <button className="btn btn-sm" onClick={() => updateQuantity(item.product._id, -1)} style={{ background: '#eee', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                            <span style={{ fontWeight: '900', fontSize: '14px' }}>{item?.quantity}</span>
                            <button className="btn btn-sm" onClick={() => updateQuantity(item.product._id, 1)} style={{ background: '#eee', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                        </div>
                    </div>

                    <div className="col-md-3 text-md-center">
                        <div style={{ color: '#e64e4e', fontWeight: '900', fontSize: '18px' }}>₹{item.product?.price}</div>
                        <div style={{ fontSize: '11px', color: '#bbb', textDecoration: 'line-through' }}>₹{item.product?.originalPrice}</div>
                    </div>

                    <div className="col-md-2 text-end">
                        <button className="btn p-0" onClick={() => handleRemoveProduct(item._id)}>
                            <span className="material-symbols-outlined" style={{ color: '#000', fontSize: '20px' }}>delete</span>
                        </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="col-lg-4">
            <div className="p-5" style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
              <h5 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '30px' }}>ORDER SUMMARY</h5>
              
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>
                <span style={{ letterSpacing: '1px' }}>BAG SUBTOTAL</span>
                <span>₹{subtotal?.toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-4" style={{ fontSize: '13px', fontWeight: 'bold', color: '#666' }}>
                <span style={{ letterSpacing: '1px' }}>PLATFORM FEE</span>
                <span>₹{fee?.toFixed(0)}</span>
              </div>
              
              <hr style={{ borderTop: '1px solid #ddd', margin: '30px 0' }} />
              
              <div className="d-flex justify-content-between mb-5">
                <h6 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>ESTIMATED TOTAL</h6>
                <h6 style={{ fontSize: '20px', fontWeight: '900', color: '#000' }}>₹{total?.toFixed(0)}</h6>
              </div>

              <button className="btn btn-dark w-100 rounded-0 py-3" style={{ fontWeight: '900', letterSpacing: '3px', fontSize: '12px' }} onClick={() => setIsModalOpen(true)}>
                SECURE CHECKOUT
              </button>

              <div className="mt-4 text-center">
                 <p className="text-muted" style={{ fontSize: '10px', letterSpacing: '1px', lineHeight: '1.6' }}>
                   ✅ Secure Encrypted Transactions<br />
                   Free Returns on all Artisanal Pieces
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          handlePlaceOrder();
        }}
      />
    </div>
  );
}

export default Cart;

