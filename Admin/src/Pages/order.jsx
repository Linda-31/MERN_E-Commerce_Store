import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from 'sonner';
import '../Styles/style.css';

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/orders/all");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const searchOrders = async () => {
        try {
          if (searchQuery.trim() === "") {
            fetchOrders();
          } else {
            const res = await axios.get(`http://localhost:4000/api/orders/search?q=${searchQuery}`);
            setOrders(res.data);
          }
        } catch (error) {
          console.error("Search failed:", error);
        }
      };
      searchOrders();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleDelete = async (orderId) => {
    if (window.confirm("Archive this boutique order?")) {
      try {
        await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
        setOrders(prev => prev.filter(order => order._id !== orderId));
        toast.success("Order history updated");
      } catch (error) {
        toast.error("Process failed");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { color: '#f39c12', backgroundColor: 'rgba(243,156,18,0.1)' };
      case "Shipped": return { color: '#3498db', backgroundColor: 'rgba(52,152,219,0.1)' };
      case "Delivered": return { color: '#000', backgroundColor: 'rgba(0,0,0,0.05)' };
      case "Cancelled": return { color: '#e64e4e', backgroundColor: 'rgba(230,78,78,0.1)' };
      default: return { color: '#888', backgroundColor: '#f9f9f9' };
    }
  };

  return (
    <div className="order-management">
      <Toaster richColors position="top-right" />
      
      <div className="text-head">
        <div>
          KUSHI ORDERS
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Managing boutique sales</span>
        </div>
        <div className="d-flex w-100 w-md-auto mt-3 mt-md-0">
           <input
              type="search"
              className="form-control w-100"
              style={{ minWidth: '200px', fontSize: '13px' }}
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="table-wrap">
        <table className="custom-table responsive-card-table">
          <thead>
            <tr>
              <th className="text-center">Concierge ID</th>
              <th>Client Identity</th>
              <th className="text-center">Curated Date</th>
              <th className="text-center">Valuation</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-5 text-muted">Retrieving order history...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No orders found in recent curation</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="text-center" data-label="Order ID" style={{ fontWeight: '800', color: '#000', letterSpacing: '1px' }}>#{order.orderId || order._id.slice(-6).toUpperCase()}</td>
                  <td data-label="Client">
                    <div style={{ fontWeight: '600' }}>{order.user?.fullName || "Private Client"}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{order.user?.email || "No email available"}</div>
                  </td>
                  <td className="text-center" data-label="Date" style={{ fontSize: '13px' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="text-center" data-label="Valuation" style={{ fontWeight: '800' }}>₹{order.totalAmount?.toLocaleString()}</td>
                  <td className="text-center" data-label="Status">
                    <span style={{ 
                        padding: '6px 14px', 
                        borderRadius: '50px', 
                        fontSize: '9px', 
                        fontWeight: '800', 
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        ...getStatusStyle(order.status || "Pending")
                    }}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="text-center" data-label="Actions">
                    <div className="d-flex justify-content-center gap-2">
                       <button className="btn btn-sm btn-outline-dark border-0 p-2" title="View" onClick={() => navigate(`/orders/${order._id}`)}>
                         <i className="bi bi-eye"></i>
                       </button>
                       <button className="btn btn-sm btn-outline-danger border-0 p-2" title="Delete" onClick={() => handleDelete(order._id)}>
                        <i className="bi bi-x-circle"></i>
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

export default Order;
