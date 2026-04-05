import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../Styles/style.css";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif", paddingTop: '100px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}
      >
        <div style={{ position: 'relative', marginBottom: '40px' }}>
             <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
               style={{ width: '120px', height: '120px', backgroundColor: '#f9f9f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
             >
                <span className="material-symbols-outlined" style={{ fontSize: '60px', color: '#e64e4e' }}>check_circle</span>
             </motion.div>
        </div>

        <motion.span 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
          style={{ color: '#e64e4e', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}
        >
          Valued Selection Secured
        </motion.span>
        
        <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#000', margin: '20px 0', letterSpacing: '-2px' }}>THANK YOU</h1>
        
        <div style={{ marginBottom: '40px' }}>
            <p style={{ color: '#666', fontSize: '15px', letterSpacing: '0.5px', lineHeight: '1.8' }}>
              Your artisanal choice is now being curated for delivery. We have received your order and our Kushi store is beginning the preparation process.
            </p>
            {orderId && (
                <div style={{ display: 'inline-block', backgroundColor: '#f9f9f9', padding: '15px 30px', marginTop: '10px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', letterSpacing: '2px', display: 'block', marginBottom: '5px' }}>CONCIERGE TRACKING ID</span>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: '#000', letterSpacing: '1px' }}>#{orderId}</span>
                </div>
            )}
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center pt-4 border-top">
            <Link to="/home" style={{ textDecoration: 'none' }}>
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#000', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        background: '#e64e4e', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '18px 40px', 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                        width: '100%'
                    }}
                >
                    RETURN TO HOME
                </motion.button>
            </Link>
            <Link to="/shop" style={{ textDecoration: 'none' }}>
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        background: 'transparent', 
                        color: '#000', 
                        border: '1px solid #000', 
                        padding: '18px 40px', 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        borderRadius: '0',
                        width: '100%'
                    }}
                >
                    CONTINUE CURATION
                </motion.button>
            </Link>
        </div>
        
        <p className="mt-5 text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
          Confirmation and shipment details have been dispatched to your profile.
        </p>
      </motion.div>
    </div>
  );
}

export default Success;
