import React from 'react';
import "../Styles/style.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

function About() {
  const members = [
    { name: "Johnson", role: "Designer", image: "/images/member1.jpg" },
    { name: "Mark Smith", role: "Stylist", image: "/images/member2.jpg" },
    { name: "Sara Lee", role: "Manager", image: "/images/member3.jpg" },
    { name: "David Brown", role: "Marketing", image: "/images/member4.jpg" },
  ];
  const [customers, setCustomers] = useState(0);
  const [orders, setOrders] = useState(0);
  const [sales, setSales] = useState(0);

  const animateCounter = (setter, endValue, duration = 3000) => {
    let start = 0;
    const increment = endValue / (duration / 20);
    const interval = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setter(endValue);
        clearInterval(interval);
      } else {
        setter(Math.floor(start));
      }
    }, 20);
  };

  useEffect(() => {
    animateCounter(setCustomers, 50000);
    animateCounter(setOrders, 80000);
    animateCounter(setSales, 38);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: "'Jost', sans-serif" }}>
      {/* ===== HERO BANNER ===== */}
      <div style={{ 
        height: window.innerWidth < 768 ? '220px' : '350px', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25, filter: 'grayscale(1)' }}></div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '32px' : '64px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', margin: 0, marginTop: window.innerWidth < 992 ? '40px' : '0' }}>OUR STORY</h1>
          <div className="mt-3 d-flex justify-content-center gap-3">
             <Link to="/home" style={{ color: '#888', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>•</span>
             <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>ABOUT US</span>
          </div>
        </motion.div>
      </div>

      {/* ===== MISSION SECTION ===== */}
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
             <span style={{ color: '#e64e4e', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}>Bespoke Craftsmanship</span>
             <h2 style={{ fontSize: window.innerWidth < 768 ? '26px' : '48px', fontWeight: '900', color: '#000', margin: '15px 0 25px', lineHeight: '1.1' }}>REDEFINING ARTISANAL ELEGANCE</h2>
             <p style={{ color: '#666', lineHeight: '1.8', fontSize: '16px', marginBottom: '30px' }}>
                At KUSHI, we prioritize consistency in both product quality and customer experience. From sourcing the finest fabrics to maintaining fair pricing, our goal is to ensure that every visit feels reliable and satisfying. Founded with a passion for fashion, we combine fashion knowledge with a keen understanding of our customers’ preferences.
             </p>
             <div className="p-4 border-start border-4 border-danger bg-light text-start" style={{ fontStyle: 'italic', color: '#444' }}>
                "Our mission is to empower individuals to express their true selves through beautiful, high-quality dresses. We strive to blend style, comfort, and affordability."
             </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative">
                <motion.img 
                    src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop" 
                    alt="KUSHI Creative Process" 
                    className="img-fluid"
                    style={{ 
                      width: '100%', 
                      height: window.innerWidth < 768 ? '350px' : '600px', 
                      objectFit: 'cover', 
                      borderRadius: '4px', 
                      boxShadow: window.innerWidth < 768 ? '15px 15px 0 #000' : '30px 30px 0 #000' 
                    }}
                    whileHover={{ scale: 1.02 }}
                />
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION ===== */}
      <div style={{ backgroundColor: '#000', padding: '100px 0', color: '#fff' }}>
        <div className="container">
            <div className="row g-4 text-center">
                <div className="col-md-4">
                    <h3 style={{ fontSize: '48px', fontWeight: '900', color: '#e64e4e' }}>{(customers / 1000).toLocaleString()}K+</h3>
                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>Valued Collection</p>
                </div>
                <div className="col-md-4">
                    <h3 style={{ fontSize: '48px', fontWeight: '900', color: '#e64e4e' }}>{(orders / 1000).toLocaleString()}K+</h3>
                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>Global Shipping</p>
                </div>
                <div className="col-md-4">
                    <h3 style={{ fontSize: '48px', fontWeight: '900', color: '#e64e4e' }}>{sales.toLocaleString()}+</h3>
                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>Exclusive Events</p>
                </div>
            </div>
        </div>
      </div>

      {/* ===== TEAM SECTION ===== */}
      <div className="container py-5">
        <div className="text-center mb-5">
             <span style={{ color: '#e64e4e', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>The Curators</span>
             <h2 style={{ fontSize: window.innerWidth < 768 ? '28px' : '42px', fontWeight: '900', color: '#000', marginTop: '10px' }}>MEET OUR VISIONARIES</h2>
        </div>
        <div className="row g-4">
          {members.map((member, index) => (
            <motion.div 
              key={index} 
              className="col-lg-3 col-md-6 col-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="mb-3 overflow-hidden" style={{ borderRadius: '0', aspectRatio: '3/4' }}>
                  <motion.img 
                    src={member.image} 
                    alt={member.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <h5 style={{ fontWeight: '800', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>{member.name}</h5>
                <p style={{ fontSize: '12px', color: '#e64e4e', fontWeight: 'bold', textTransform: 'uppercase' }}>{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
