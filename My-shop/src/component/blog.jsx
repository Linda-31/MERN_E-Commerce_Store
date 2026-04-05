import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';
import "../Styles/style.css";

function Blog({ searchTerm = '', category = 'all' }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/blogs');
        setBlogs(response.data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-section">
      <div className="row g-4">
        <AnimatePresence mode="popLayout">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((item, index) => (
              <motion.div
                className="col-lg-6 mb-4"
                key={item._id || index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.div
                  className="blog-card"
                  style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #f0f0f0'
                  }}
                  onClick={() => navigate(`/blog/${item._id}`)}
                  whileHover="hover"
                >
                  {/* Image Container */}
                  <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '55%' }}>
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      variants={{ hover: { scale: 1.1 } }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    
                    {/* Category Pill */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '15px', 
                      left: '15px', 
                      background: 'rgba(255,255,255,0.95)', 
                      padding: '5px 12px', 
                      borderRadius: '50px',
                      fontSize: '8px',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                      zIndex: 2
                    }}>
                      {item.category}
                    </div>
                  </div>

                  {/* Content Container */}
                  <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '10px', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaCalendarAlt size={10} style={{ color: '#e64e4e' }} /> {new Date(item.date).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaUser size={10} style={{ color: '#e64e4e' }} /> {item.author || "Atelier"}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.4', marginBottom: '12px', color: '#000', fontFamily: "'Jost', sans-serif" }}>
                      {item.title}
                    </h3>
                    
                    <p style={{ color: '#777', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                      <motion.div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          fontSize: '10px', 
                          fontWeight: 'bold', 
                          textTransform: 'uppercase', 
                          letterSpacing: '2px', 
                          color: '#000' 
                        }}
                        variants={{ hover: { x: 5 } }}
                      >
                        Read Article <FaArrowRight style={{ color: '#e64e4e' }} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-12 text-center py-5">
              <p style={{ color: '#888', fontSize: '15px' }}>No stories match your search criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        .blog-card:hover h3 { color: #e64e4e !important; transition: color 0.3s ease; }
      `}</style>
    </div>
  );
}

export default Blog;