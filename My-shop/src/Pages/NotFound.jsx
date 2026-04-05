import React from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import "../Styles/style.css";

function NotFound() {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ 
          fontSize: window.innerWidth < 768 ? '120px' : '220px', 
          fontWeight: '900', 
          letterSpacing: '-5px', 
          color: '#000', 
          margin: 0,
          lineHeight: '0.8',
          opacity: 0.05,
          position: 'absolute',
          left: '50%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0
        }}>
          404
        </h1>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
              style={{ color: '#e64e4e', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
            >
              The KUSHI Lost its Path
            </motion.span>
            
            <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#000', margin: '20px 0', letterSpacing: '1px' }}>CURATION NOT FOUND</h2>
            
            <p style={{ color: '#666', fontSize: '16px', letterSpacing: '0.5px', maxWidth: '400px', margin: '0 auto 40px', lineHeight: '1.8' }}>
              The piece you are looking for has either been archived or exists in another collection.
            </p>
            
            <Link to="/home" style={{ textDecoration: 'none' }}>
                <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: '#000', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        background: '#e64e4e', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '18px 50px', 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        borderRadius: '0'
                    }}
                >
                    RETURN TO Home
                </motion.button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
