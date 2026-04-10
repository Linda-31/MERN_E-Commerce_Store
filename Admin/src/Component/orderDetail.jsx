import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`https://mern-store-server.onrender.com/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-detail-page">
      <div className="text-head">
        <div>
          ORDER ARCHIVE
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Detailed transaction insights</span>
        </div>
        <button 
          className="btn btn-sm btn-outline-dark border-0 mt-2 mt-md-0" 
          onClick={() => window.history.back()}
          style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}
        >
          ← BACK
        </button>
      </div>

      <div className="row g-4">
        {/* Client & Order Summary */}
        <div className="col-lg-12">
          <div className="table-wrap">
            <h5 className="table-title">General Information</h5>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <p className="mb-1 text-mutedSmall">Order ID</p>
                <p className="mb-0 fw-bold">#{order.orderId || order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="col-12 col-md-3">
                <p className="mb-1 text-mutedSmall">Client Name</p>
                <p className="mb-0 fw-bold">{order.user?.fullName || "Private Client"}</p>
              </div>
              <div className="col-12 col-md-3">
                <p className="mb-1 text-mutedSmall">Email Address</p>
                <p className="mb-0 fw-bold">{order.user?.email || "—"}</p>
              </div>
              <div className="col-12 col-md-3">
                <p className="mb-1 text-mutedSmall">Date of Curation</p>
                <p className="mb-0 fw-bold">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Curation Table */}
        <div className="col-12">
          <div className="table-wrap">
            <h5 className="table-title">Artisanal Selection</h5>
            <table className="custom-table responsive-card-table">
              <thead>
                <tr>
                  <th>Visual Identity</th>
                  <th className="text-center">Variant</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Product">
                      <div className="fw-bold">{item.product?.title || 'Product Deleted'}</div>
                    </td>
                    <td className="text-center" data-label="Variant">
                      <span className="badge-variant">{item.color}</span>
                    </td>
                    <td className="text-center" data-label="Quantity">{item.quantity}</td>
                    <td className="text-center fw-bold" data-label="Total">₹{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financials */}
        <div className="col-lg-6 ms-auto">
          <div className="table-wrap" style={{ background: '#000', color: '#fff' }}>
             <h5 className="table-title" style={{ color: '#fff', borderBottom: '1px solid #333' }}>Valuation</h5>
             <div className="d-flex justify-content-between mb-2">
                <span className="text-muted" style={{ fontSize: '13px' }}>Platform Fee</span>
                <span className="fw-bold">₹{order.platformFee.toFixed(2)}</span>
             </div>
             <div className="d-flex justify-content-between mt-3 pt-3 border-top border-secondary">
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Total Amount</span>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#e64e4e' }}>₹{order.totalAmount.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
