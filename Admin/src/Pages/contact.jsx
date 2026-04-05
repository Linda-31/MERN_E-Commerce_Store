import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/contacts');
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Archive this client inquiry?")) {
      try {
        await axios.delete(`http://localhost:4000/api/contacts/delete/${id}`);
        toast.success("Inquiry archived successfully");
        setMessages(prev => prev.filter(m => m._id !== id));
      } catch (err) {
        toast.error("Process failed");
      }
    }
  };

  return (
    <div className="contact-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        CLIENT INQUIRIES
        <span>Customer Communications Curation</span>
      </div>

      <div className="table-wrap">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Client Identity</th>
              <th>Subject & Inquiry</th>
              <th>Date Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="4" className="text-center py-5 text-muted">Retrieving artisanal inquiries...</td></tr>
            ) : messages.length === 0 ? (
               <tr><td colSpan="4" className="text-center py-5 text-muted">No pending inquiries in the collection</td></tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{msg.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{msg.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '800', color: '#e64e4e' }}>{msg.subject}</div>
                    <p style={{ fontSize: '13px', color: '#555', margin: '5px 0 0', maxWidth: '500px' }}>{msg.message}</p>
                  </td>
                  <td style={{ fontSize: '13px' }}>{new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <div className="d-flex gap-2">
                       <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(msg._id)}>
                        <i className="bi bi-archive"></i>
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

export default ContactMessages;
