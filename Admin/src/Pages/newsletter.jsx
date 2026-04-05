import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/newsletters');
      setSubscribers(res.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this client from the newsletter list?")) {
      try {
        await axios.delete(`http://localhost:4000/api/newsletters/delete/${id}`);
        toast.success("Subscriber removed from collection");
        setSubscribers(prev => prev.filter(s => s._id !== id));
      } catch (err) {
        toast.error("Process failed");
      }
    }
  };

  return (
    <div className="newsletter-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        NEWSLETTER CURATION
        <span>Boutique Subscriber Management</span>
      </div>

      <div className="table-wrap">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Subscription Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" className="text-center py-5 text-muted">Retrieving subscriber collection...</td></tr>
            ) : subscribers.length === 0 ? (
               <tr><td colSpan="4" className="text-center py-5 text-muted">No subscribers in the collection</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td style={{ fontWeight: '700', fontSize: '15px' }}>{sub.email}</td>
                  <td style={{ fontSize: '13px' }}>{new Date(sub.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <span style={{ 
                        padding: '6px 14px', 
                        borderRadius: '50px', 
                        fontSize: '9px', 
                        fontWeight: '800', 
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: '#000',
                        backgroundColor: 'rgba(0,0,0,0.05)'
                    }}>
                      Subscribed
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                       <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(sub._id)}>
                        <i className="bi bi-person-x"></i>
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
}

export default NewsletterSubscribers;
