import React, { useEffect, useState } from 'react';
import "../Styles/style.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist } from '../features/wishlistSlice';
import { setCartCount } from '../features/productSlice';
import StarRating from '../component/StarRating';
import { Toaster, toast } from 'sonner';
import { motion } from "framer-motion";

function Productlist() {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState([]);
  const wishlist = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/products/")
      .then((response) => {
        const remainingProducts = response.data.slice(4);
        setProducts(remainingProducts);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  const visibleProducts = showAll ? products : products.slice(0, 6);

  const handleClick = (product) => {
    const exists = wishlist.find(item => item.id === product._id);
    if (!exists) {
      dispatch(addToWishlist(product));
      toast.success('Product added to wishlist!');
    } else {
      toast.error('Already in wishlist!');
    }
  };

  const getTokenFromCookie = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const handleAddToCart = async (product) => {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        toast.error("Please login to add items to cart");
        return;
      }

      const decoded = JSON.parse(atob(token));
      const userId = decoded?._id;

      const response = await axios.post('/api/carts/save', {
        userId,
        product,
      });
      toast.success('Product added to Cart!');
      const totalQuantity = response.data.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      dispatch(setCartCount(totalQuantity));
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  const handleView = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="container px-0">
        <div className="row g-4">
          {visibleProducts.map((product, index) => (
            <div className="col-lg-4 col-md-4 col-6" key={`${product._id}-${index}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover="hover"
                style={{ position: 'relative' }}
              >
                {/* Image Container with Editorial Details */}
                <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '130%', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                    variants={{ hover: { scale: 1.08 } }}
                    transition={{ duration: 0.8 }}
                    onClick={() => handleView(product._id)}
                  />
                  
                  {/* Floating Glass Pill Removed to fix image overlay */}

                  {/* Quick Action Floating Icons */}
                  <motion.div 
                    variants={{ hover: { opacity: 1, x: 0 } }}
                    initial={{ opacity: 0, x: 20 }}
                    style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}
                  >
                     <motion.button
                       onClick={(e) => { e.stopPropagation(); handleClick(product); }}
                       whileHover={{ scale: 1.1, backgroundColor: '#e64e4e', color: '#fff' }}
                       style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                     >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite</span>
                     </motion.button>
                     <motion.button
                       onClick={(e) => { e.stopPropagation(); handleView(product._id); }}
                       whileHover={{ scale: 1.1, backgroundColor: '#000', color: '#fff' }}
                       style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                     >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                     </motion.button>
                  </motion.div>

                  {/* Add to Cart Floating Pill */}
                  <motion.div 
                    variants={{ hover: { opacity: 1, y: 0 } }}
                    initial={{ opacity: 0, y: 20 }}
                    style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}
                  >
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      style={{ 
                        width: '100%', height: '45px', borderRadius: '50px', background: '#000', color: '#fff', border: 'none',
                        fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.02, backgroundColor: '#e64e4e' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span> Add to Cart
                    </motion.button>
                  </motion.div>
                </div>

                {/* Info Container */}
                <div style={{ padding: '20px 5px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: '#e64e4e', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Quality</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }} onClick={() => handleView(product._id)}>
                    {product.title}
                  </h4>
                  <div className="d-flex align-items-center justify-content-between">
                     <span style={{ fontSize: '17px', fontWeight: '800', color: '#e64e4e', fontFamily: "'Jost', sans-serif" }}>₹{product.price}</span>
                     <div className="d-flex align-items-center gap-1">
                        <StarRating staticRating={product.rating || 0} />
                        <span style={{ fontSize: '10px', color: '#888', fontWeight: '700' }}>({product.numReviews || 0})</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* View All Toggle Button */}
        {products.length > 6 && (
          <div className="text-center mt-5">
            <motion.button 
              onClick={() => setShowAll(!showAll)}
              style={{ 
                background: 'transparent', color: '#000', border: '2px solid #000', 
                padding: '14px 45px', fontSize: '11px', fontWeight: 'bold', 
                letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '0', 
                cursor: 'pointer', fontFamily: "'Jost', sans-serif"
              }}
              whileHover={{ backgroundColor: '#000', color: '#fff' }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? 'Show Less' : 'View All Collection'}
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}

export default Productlist;

