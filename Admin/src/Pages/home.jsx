import React, { useEffect, useState } from "react";
import '../Styles/style.css';
import PieChart from "../Component/piechart";
import SalesOverviewChart from '../Component/SalesOverviewChart';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from "../Component/Spinner";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    subscribers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, usersRes, productsRes, subscribersRes] = await Promise.allSettled([
          axios.get("https://mern-store-server.onrender.com/api/orders/all"),
          axios.get("https://mern-store-server.onrender.com/api/users"),
          axios.get("https://mern-store-server.onrender.com/api/products"),
          axios.get("https://mern-store-server.onrender.com/api/newsletters"),
        ]);

        // --- Process Orders ---
        const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        // Sort by date and take last 5
        const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentOrders(sorted.slice(0, 5));

        // --- Process Users ---
        const users = usersRes.status === 'fulfilled' ? usersRes.value.data : [];

        // --- Process Products ---
        const products = productsRes.status === 'fulfilled' ? productsRes.value.data : [];
        // Top products by rating
        const top = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
        setTopProducts(top);

        // --- Process Subscribers ---
        const subscribers = subscribersRes.status === 'fulfilled' ? subscribersRes.value.data : [];

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalProducts: products.length,
          pendingOrders,
          subscribers: subscribers.length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "ALL-TIME VALUATION",
      value: loading ? "—" : `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: "bi-cash-coin",
      color: "#e64e4e",
      sub: "Total revenue generated",
    },
    {
      title: "TOTAL ORDERS",
      value: loading ? "—" : stats.totalOrders.toLocaleString(),
      icon: "bi-bag-heart",
      color: "#3498db",
      sub: `${loading ? "—" : stats.pendingOrders} pending`,
    },
    {
      title: "Kushi CLIENTS",
      value: loading ? "—" : stats.totalUsers.toLocaleString(),
      icon: "bi-people",
      color: "#f39c12",
      sub: "Registered users",
    },
    {
      title: "CURRENT CURATION",
      value: loading ? "—" : stats.totalProducts.toLocaleString(),
      icon: "bi-award",
      color: "#2ecc71",
      sub: "Active products",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":   return { color: '#f39c12', bg: 'rgba(243,156,18,0.1)' };
      case "Shipped":   return { color: '#3498db', bg: 'rgba(52,152,219,0.1)' };
      case "Delivered": return { color: '#27ae60', bg: 'rgba(39,174,96,0.1)' };
      case "Cancelled": return { color: '#e64e4e', bg: 'rgba(230,78,78,0.1)' };
      default:          return { color: '#888',    bg: '#f9f9f9' };
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="home-dashboard p-0 overflow-hidden">
      <div className="text-head">
        <div>
          DASHBOARD OVERVIEW
          <span className="d-block mt-1 mt-md-0 d-md-inline ms-md-3">Real-time curation insights</span>
        </div>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="row g-3 dashboard-container">
        {statCards.map((stat, idx) => (
          <div className="col-12 col-md-6 col-lg-3" key={idx}>
            <div className="stat-card" style={{ borderTop: `4px solid ${stat.color}`, padding: '20px' }}>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <h5 className="mb-1" style={{ fontSize: '10px', color: '#aaa', letterSpacing: '1.5px' }}>{stat.title}</h5>
                  <p className="card-text mb-0" style={{ color: stat.color, fontSize: '24px', fontWeight: '900' }}>{stat.value}</p>
                </div>
                <div 
                  style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '10px', 
                    background: `${stat.color}15`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <i className={`bi ${stat.icon}`} style={{ fontSize: '18px', color: stat.color }}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="row g-4 mt-2">
        <div className="col-12 col-lg-8">
          <div className="table-wrap">
            <h5 className="table-title text-center text-lg-start">
              Weekly Revenue Trend
            </h5>
            <div className="chart-container-mobile" style={{ height: '280px', width: '100%', position: 'relative' }}>
              <SalesOverviewChart />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="table-wrap h-100">
            <h5 className="table-title text-center text-lg-start">
              Monthly Breakdown
            </h5>
            <div style={{ height: '220px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PieChart />
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENT ORDERS + TOP PRODUCTS ===== */}
      <div className="row g-4 mt-2">

        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="table-wrap">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-2">
              <h5 className="table-title mb-0">
                Recent Orders
              </h5>
              <button
                onClick={() => navigate('/order')}
                style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: '#e64e4e', cursor: 'pointer', textTransform: 'uppercase' }}
              >
                View All →
              </button>
            </div>
            <table className="custom-table responsive-card-table">
              <thead>
                <tr>
                  <th className="text-center">Order ID</th>
                  <th>Client</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>No orders found</td></tr>
                ) : (
                  recentOrders.map((order) => {
                    const s = getStatusStyle(order.status || "Pending");
                    return (
                      <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order._id}`)}>
                        <td className="text-center" data-label="ID" style={{ fontWeight: '800', color: '#000', letterSpacing: '1px', fontSize: '12px' }}>
                          #{(order.orderId || order._id.slice(-6)).toUpperCase()}
                        </td>
                        <td data-label="Client">
                          <div style={{ fontWeight: '600', fontSize: '13px' }}>{order.user?.fullName || "Private Client"}</div>
                          <div className="d-none d-sm-block" style={{ fontSize: '11px', color: '#aaa' }}>{order.user?.email || "—"}</div>
                        </td>
                        <td className="text-center" data-label="Date" style={{ fontSize: '12px', color: '#888' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="text-center" data-label="Total" style={{ fontWeight: '800', fontSize: '13px' }}>₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="text-center" data-label="Status">
                          <span style={{ padding: '5px 12px', borderRadius: '50px', fontSize: '9px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: s.color, backgroundColor: s.bg }}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="table-wrap">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 gap-2">
              <h5 className="table-title mb-0">
                Top Rated
              </h5>
              <button
                onClick={() => navigate('/product')}
                style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: '#e64e4e', cursor: 'pointer', textTransform: 'uppercase' }}
              >
                View All →
              </button>
            </div>
            <div className="d-flex flex-column gap-3">
              {topProducts.length === 0 ? (
                <p className="text-center text-muted" style={{ fontSize: '13px' }}>No products found</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product._id} className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product._id}`)}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <div className="flex-grow-1" style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</div>
                      <div style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</div>
                      <div className="d-flex align-items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <i key={s} className={`bi ${s <= Math.round(product.rating || 0) ? 'bi-star-fill' : 'bi-star'}`} style={{ fontSize: '10px', color: '#ffc107' }}></i>
                        ))}
                        <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '4px' }}>({product.numReviews || 0})</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '13px', whiteSpace: 'nowrap', color: '#e64e4e', flexShrink: 0 }}>₹{product.price?.toLocaleString('en-IN')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ===== SUMMARY FOOTER ===== */}
      <div className="row g-3 mt-1 pb-4">
        <div className="col-12">
          <div className="table-wrap py-4 px-3">
            <div className="row g-0 text-center">
              <div className="col-12 col-md-4 border-end-md py-3">
                <p className="mb-2" style={{ fontSize: '10px', fontWeight: '800', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Pending Orders</p>
                <div className="d-flex justify-content-center">
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#f39c12', margin: 0 }}>{loading ? "—" : stats.pendingOrders}</p>
                </div>
              </div>
              <div className="col-12 col-md-4 border-end-md py-3">
                <p className="mb-2" style={{ fontSize: '10px', fontWeight: '800', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Subscribers</p>
                <div className="d-flex justify-content-center">
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#3498db', margin: 0 }}>{loading ? "—" : stats.subscribers}</p>
                </div>
              </div>
              <div className="col-12 col-md-4 py-3">
                <p className="mb-2" style={{ fontSize: '10px', fontWeight: '800', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Avg. Value</p>
                <div className="d-flex justify-content-center">
                    <p style={{ fontSize: '28px', fontWeight: '900', color: '#2ecc71', margin: 0 }}>
                        {loading || stats.totalOrders === 0 ? "—" : `₹${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString('en-IN')}`}
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
