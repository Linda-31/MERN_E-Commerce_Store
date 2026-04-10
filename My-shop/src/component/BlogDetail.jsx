import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaFacebookF, FaTwitter, FaLinkedinIn, FaQuoteLeft } from 'react-icons/fa';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`/api/blogs/${id}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="container py-5 text-center">
                <h2>Article Not Found</h2>
                <Link to="/Blog" className="btn btn-outline-dark mt-3">Back to Journal</Link>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}
        >
            {/* ===== MODERN HERO SECTION ===== */}
            <div style={{ position: 'relative', height: '60vh', minHeight: '400px', width: '100%', overflow: 'hidden' }}>
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ 
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: `url(${blog.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
                }} />
                
                <div className="container" style={{ position: 'relative', height: '100%', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '60px' }}>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <span style={{ 
                            background: '#e64e4e', color: '#fff', padding: '5px 15px', 
                            fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', 
                            letterSpacing: '2px', borderRadius: '2px', marginBottom: '20px', display: 'inline-block' 
                        }}>
                            {blog.category}
                        </span>
                        <h1 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '32px' : '56px', fontWeight: '900', maxWidth: '800px', lineHeight: '1.1', textTransform: 'uppercase' }}>
                            {blog.title}
                        </h1>
                        <div className="d-flex flex-wrap gap-4 mt-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span className="d-flex align-items-center gap-2 font-black "><FaUser style={{ color: '#e64e4e' }} /> {blog.author}</span>
                            <span className="d-flex align-items-center gap-2"><FaCalendarAlt style={{ color: '#e64e4e' }} /> {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container py-lg-5 py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* ===== ARTICLE NAVIGATION ===== */}
                        <div className="mb-5">
                            <Link to="/Blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <FaArrowLeft size={12} /> Back to stories
                            </Link>
                        </div>

                        {/* ===== CONTENT SECTION ===== */}
                        <div className="blog-content shadow-sm p-4  rounded-2" style={{ fontSize: '18px', lineHeight: '1.8', color: '#333' }}>
                           <p className="lead" style={{ fontSize: '22px', fontWeight: '500', color: '#000', marginBottom: '30px', fontStyle: 'italic', borderLeft: '4px solid #e64e4e', paddingLeft: '20px' }}>
                                {blog.description}
                           </p>
                           
                           <div style={{ whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                                {blog.content}
                           </div>

                           {/* Tags Section */}
                           {blog.tags && blog.tags.length > 0 && (
                               <div className="pt-4 border-top d-flex flex-wrap gap-2 mb-5">
                                   {blog.tags.map((tag, idx) => (
                                       <span key={idx} style={{ 
                                           border: '1px solid #eee', padding: '4px 12px', borderRadius: '50px', 
                                           fontSize: '11px', color: '#666', fontWeight: '600' 
                                       }}>
                                           #{tag}
                                       </span>
                                   ))}
                               </div>
                           )}

                           {/* Social Share */}
                           <div className="d-flex align-items-center gap-4 py-4 border-top border-bottom">
                               <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Share this story:</span>
                               <div className="d-flex gap-3">
                                   {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                                       <motion.a 
                                            key={i} href="#" whileHover={{ y: -3, color: '#e64e4e' }}
                                            style={{ color: '#ccc', fontSize: '18px', transition: 'color 0.3s' }}
                                       >
                                           <Icon />
                                       </motion.a>
                                   ))}
                               </div>
                           </div>

                           {/* Author Bio (Placeholder) */}
                           <div className="mt-5 p-4 rounded-3" style={{ backgroundColor: '#f9f9f9', display: 'flex', gap: '20px', alignItems: 'center' }}>
                               <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', flexShrink: 0, backgroundImage: 'url("https://i.pravatar.cc/150?u=kushi")', backgroundSize: 'cover' }}></div>
                               <div>
                                   <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>About {blog.author}</h4>
                                   <p style={{ fontSize: '14px', color: '#777', margin: 0 }}>Editor and Lead Curator at Kushi Atelier. Passionate about sustainable fashion, artisanal craftsmanship, and the stories behind every stitch.</p>
                               </div>
                           </div>
                        </div>

                        {/* Back Button Bottom */}
                        <div className="mt-5 text-center">
                             <Link to="/Blog" className="btn btn-dark px-5 py-3" style={{ fontSize: '13px', fontWeight: 'bold', borderRadius: '0', letterSpacing: '2px' }}>
                                VIEW ALL JOURNAL ENTRIES
                             </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogDetail;
