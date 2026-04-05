import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/blogs');
            setBlogs(response.data.reverse());
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Archive this artisanal narrative?')) {
            try {
                await axios.delete(`http://localhost:4000/api/blogs/delete/${id}`);
                toast.success("Journal story archived");
                fetchBlogs();
            } catch (error) {
                toast.error("Process failed");
            }
        }
    };

    const getCategoryStyle = (cat) => {
        switch(cat) {
            case 'Fashion': return { color: '#e64e4e' };
            case 'Lifestyle': return { color: '#000' };
            default: return { color: '#666' };
        }
    };

    return (
        <div className="blog-management">
            <Toaster richColors position="top-right" />
            
            <div className="text-head">
                JOURNAL & MAGAZINE
                <Link to="/add-blog" className="btn-admin btn-admin-primary" style={{ padding: '10px 25px' }}>
                    + CREATE STORY
                </Link>
            </div>
            
            <div className="table-wrap">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Hero Visual</th>
                            <th>Artisanal Narrative</th>
                            <th>Lead Author</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length === 0 ? (
                             <tr><td colSpan="4" className="text-center py-5 text-muted">No journal stories published in the collection</td></tr>
                        ) : (
                          blogs.map((blog) => (
                              <tr key={blog._id}>
                                  <td>
                                      <img src={blog.image} alt={blog.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '2px' }} />
                                  </td>
                                  <td>
                                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{blog.title}</div>
                                      <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '5px', ...getCategoryStyle(blog.category) }}>
                                        {blog.category} <span style={{ color: '#ccc', margin: '0 5px' }}>|</span> <span style={{ color: '#888', fontWeight: '400' }}>{new Date(blog.date).toLocaleDateString()}</span>
                                      </div>
                                  </td>
                                  <td style={{ fontSize: '13px', fontWeight: '600' }}>{blog.author}</td>
                                  <td>
                                      <div className="d-flex gap-2">
                                          <Link to={`/blogs/edit/${blog._id}`} className="btn btn-sm btn-outline-dark border-0">
                                              <i className="bi bi-pencil-square"></i>
                                          </Link>
                                          <button onClick={() => handleDelete(blog._id)} className="btn btn-sm btn-outline-danger border-0">
                                              <i className="bi bi-trash3"></i>
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogList;
