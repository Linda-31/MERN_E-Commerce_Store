import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import BlogComponent from '../component/blog';
import "../Styles/style.css";
import { FaSearch, FaChevronRight, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const blogCategories = [
    { id: 'all', label: 'All Stories' },
    { id: 'Fashion', label: 'Fashion Trend' },
    { id: 'Lifestyle', label: 'Lifestyle' },
    { id: 'Collections', label: 'Collections' },
    { id: 'Behind the Scenes', label: 'Studio' },
    { id: 'Interviews', label: 'Voices' },
  ];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      
      {/* ===== EDITORIAL BREADCRUMB HEADER ===== */}
      <div style={{ 
        height: window.innerWidth < 768 ? '220px' : '350px', 
        backgroundColor: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop")', 
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.4 
        }}></div>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 20px' }}
        >
          <motion.span 
            initial={{ letterSpacing: '2px', opacity: 0 }}
            animate={{ letterSpacing: '6px', opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{ color: '#e64e4e', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold', display: 'block', marginTop: window.innerWidth < 768 ? '50px' : '60px' }}
          >
            The Kushi Journal
          </motion.span>
          <h1 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '32px' : '64px', fontWeight: '900', letterSpacing: '-1px', textTransform: 'uppercase', margin: '0' }}>MAGAZINE</h1>
          <div style={{ width: '40px', height: '2px', background: '#e64e4e', margin: window.innerWidth < 768 ? '15px auto' : '30px auto' }}></div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
             <Link to="/home" style={{ color: '#aaa', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>/</span>
             <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}>JOURNAL</span>
          </div>
        </motion.div>
      </div>

      <div className="container py-lg-5 py-4 mt-lg-5">
        <div className="row g-5">
          
          {/* ===== MAIN CONTENT: LEFT SIDE ===== */}
          <div className="col-lg-8">
             <div className="mb-5 d-flex flex-column flex-lg-row align-items-center justify-content-lg-between text-center text-lg-start gap-3">
                <div>
                   <h2 style={{ fontSize: '11px', fontWeight: '900', color: '#e64e4e', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>Curated Stories</h2>
                   <h3 style={{ fontSize: window.innerWidth < 768 ? '26px' : '32px', fontWeight: '800', margin: 0, fontFamily: "'Jost', sans-serif" }}>Latest Insights</h3>
                </div>
                <div className="d-none d-lg-block" style={{ width: '100px', height: '1px', background: '#eee' }}></div>
             </div>
             
             {/* Dynamic Blog Component */}
             <BlogComponent searchTerm={searchTerm} category={category} />
          </div>

          {/* ===== SIDEBAR: RIGHT SIDE - MODERN MINIMAL DESIGN ===== */}
          <div className="col-lg-4">
             <div className="sticky-top" style={{ top: '120px', zIndex: 10, paddingLeft: window.innerWidth < 992 ? '0' : '40px', marginTop: window.innerWidth < 992 ? '40px' : '0' }}>
                
                {/* Modern Floating Search */}
                <div style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '12px', 
                  padding: '25px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
                  border: '1px solid #f5f5f5',
                  marginBottom: '40px'
                }}>
                   <h5 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '20px', color: '#e64e4e' }}>Search stories</h5>
                   <div style={{ position: 'relative' }}>
                      <input 
                         type="text" 
                         placeholder="Keyword..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         style={{ 
                           width: '100%', height: '45px', background: '#f9f9f9', 
                           border: 'none', borderRadius: '8px', padding: '0 45px 0 20px', 
                           outline: 'none', fontSize: '14px', color: '#333' 
                         }}
                      />
                      <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: '#ccc' }} />
                   </div>
                </div>

                {/* Modern Categories with Pill Indicators */}
                <div style={{ 
                   backgroundColor: '#fff', 
                   borderRadius: '12px', 
                   padding: '25px', 
                   boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
                   border: '1px solid #f5f5f5',
                   marginBottom: '40px'
                }}>
                   <h5 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '25px', color: '#000' }}>Categories</h5>
                   <div className="d-flex flex-column gap-2">
                      {blogCategories.map((cat) => (
                         <motion.button 
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            whileHover={{ x: 5 }}
                            style={{ 
                               background: category === cat.id ? '#000' : 'none', 
                               border: 'none', 
                               padding: '10px 15px', 
                               borderRadius: '8px',
                               fontSize: '14px', 
                               color: category === cat.id ? '#fff' : '#666', 
                               fontWeight: category === cat.id ? '700' : '500',
                               textAlign: 'left',
                               display: 'flex',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               transition: 'all 0.3s ease'
                            }}
                         >
                            {cat.label}
                            {category === cat.id && <FaChevronRight size={10} />}
                         </motion.button>
                      ))}
                   </div>
                </div>

                {/* Social Connect and Modern Quote Overlay */}
                <div style={{ 
                   backgroundColor: '#000', 
                   color: '#fff',
                   borderRadius: '12px', 
                   padding: '30px', 
                   boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                   overflow: 'hidden',
                   position: 'relative'
                }}>
                   <div style={{ position: 'relative', zIndex: 2 }}>
                      <h5 style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '15px', color: '#e64e4e' }}>The Atelier</h5>
                      <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.8', marginBottom: '25px' }}>
                         Discover the unique narratives and inspirations behind each collection at KUSHI.
                      </p>
                      <div className="d-flex gap-3">
                         {[FaInstagram, FaFacebookF, FaTwitter].map((Icon, idx) => (
                            <motion.a 
                               key={idx} 
                               href="#" 
                               whileHover={{ scale: 1.1, color: '#e64e4e' }}
                               style={{ color: '#fff', fontSize: '16px' }}
                            >
                               <Icon />
                            </motion.a>
                         ))}
                      </div>
                   </div>
                   {/* Decorative Light Glow */}
                   <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: '#e64e4e', filter: 'blur(100px)', opacity: 0.15 }}></div>
                </div>
                
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BlogPage;
