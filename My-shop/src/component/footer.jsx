import React from 'react';
import { Link } from 'react-router-dom';
import "../Styles/style.css";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter, FaArrowUp } from 'react-icons/fa';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkStyle = {
    color: '#888',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.3s ease',
    fontFamily: "'Jost', sans-serif",
    letterSpacing: '1px'
  };

  const headerStyle = {
    textTransform: 'uppercase', 
    letterSpacing: '4px', 
    fontSize: '11px', 
    fontWeight: '800', 
    marginBottom: '20px', 
    color: '#fff',
    fontFamily: "'Jost', sans-serif"
  };

  return (
    <footer style={{ 
      backgroundColor: "#050505", 
      color: "#fff", 
      padding: window.innerWidth < 768 ? '50px 0 30px' : '60px 0 40px', 
      borderTop: '4px solid #e64e4e' 
    }}>
      <div className="container">
        <div className="row g-4 g-lg-5">
          {/* Brand Info */}
          <div className="col-lg-3 col-md-6 col-12 mb-lg-0 mb-4 text-center text-lg-start">
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: '900', fontSize: '24px', letterSpacing: '4px', marginBottom: '15px' }}>
              KUSHI<span style={{ color: '#e64e4e' }}>.</span>
            </h2>
            <p style={{ color: '#888', lineHeight: '2', fontSize: '14px', marginBottom: '25px', padding: window.innerWidth < 992 ? '0 15px' : '0' }}>
              Curating the finest artisanal fashion since 2025. Experience the pinnacle of modern craftsmanship and elegance.
            </p>
            <div className="d-flex gap-4 justify-content-center justify-content-lg-start">
              <a href="#" className="social-icon-minimal"><FaFacebookF /></a>
              <a href="#" className="social-icon-minimal"><FaInstagram /></a>
              <a href="#" className="social-icon-minimal"><FaPinterestP /></a>
              <a href="#" className="social-icon-minimal"><FaTwitter /></a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="col-lg-2 col-md-4 col-6 mb-4 mb-lg-0">
            <h6 style={headerStyle}>Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/shop" style={linkStyle}>Women Elite</Link></li>
              <li><Link to="/shop" style={linkStyle}>Men Signature</Link></li>
              <li><Link to="/shop" style={linkStyle}>Essentials</Link></li>
              <li><Link to="/shop" style={linkStyle}>New Arrivals</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-6 mb-4 mb-lg-0">
            <h6 style={headerStyle}>General</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/home" style={linkStyle}>Home</Link></li>
              <li><Link to="/shop" style={linkStyle}>Shop All</Link></li>
              <li><Link to="/Blog" style={linkStyle}>Our Blog</Link></li>
              <li><Link to="/About" style={linkStyle}>About Us</Link></li>
              <li><Link to="/Contact" style={linkStyle}>Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 col-6 mb-4 mb-lg-0">
            <h6 style={headerStyle}>Concierge</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/cart" style={linkStyle}>Track Shipment</Link></li>
              <li><Link to="/cart" style={linkStyle}>Returns Portal</Link></li>
              <li><Link to="/cart" style={linkStyle}>Privacy Center</Link></li>
              <li><Link to="/faq" style={linkStyle}>FAQ & Assistance</Link></li>
              <li><Link to="/Contact" style={linkStyle}>The Studio</Link></li>
            </ul>
          </div>

          {/* Boutique Locations */}
          <div className="col-lg-3 col-md-6 col-12 text-center text-lg-start">
            <h6 style={headerStyle}>Contact</h6>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.8', marginBottom: '25px' }}>
              8th Floor, 379 Hudson St, <br/>
              New York, NY 10018 <br/>
              <span style={{ color: '#fff', display: 'block', marginTop: '10px' }}>(+1) 96 716 6879</span>
            </p>
            <div className="d-flex align-items-center gap-2 mt-4 op-7 justify-content-center justify-content-lg-start">
               <img src="/images/icon-pay-01.png" alt="Pay" style={{ height: '20px', filter: 'grayscale(1) brightness(2)' }} />
               <img src="/images/icon-pay-02.png" alt="Pay" style={{ height: '20px', filter: 'grayscale(1) brightness(2)' }} />
               <img src="/images/icon-pay-03.png" alt="Pay" style={{ height: '20px', filter: 'grayscale(1) brightness(2)' }} />
               <img src="/images/icon-pay-04.png" alt="Pay" style={{ height: '20px', filter: 'grayscale(1) brightness(2)' }} />
            </div>
          </div>
        </div>

        {/* Legal & Back to Top */}
        <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: '1px solid #1a1a1a', position: 'relative' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
            <p style={{ color: '#444', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
              © 2025 <span style={{ color: '#e64e4e' }}>KUSHI</span>. New York. All rights reserved. 
            </p>
            
            {/* Page Up Button - Side Aligned */}
            <div className="d-flex align-items-center gap-3">
              <span style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>To the top</span>
              <button 
                 onClick={scrollToTop}
                 className="back-to-top-btn"
                 style={{ 
                   background: '#111', color: '#fff', border: '1px solid #222', 
                   width: '50px', height: '50px', borderRadius: '50%', 
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   cursor: 'pointer', transition: 'all 0.3s ease'
                 }}
              >
                <FaArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .social-icon-minimal { color: #555; transition: all 0.3s ease; font-size: 16px; }
        .social-icon-minimal:hover { color: #e64e4e; transform: translateY(-3px); cursor: pointer; }
        .back-to-top-btn:hover { background-color: #e64e4e !important; border-color: #e64e4e !important; transform: scale(1.1); }
        footer a:hover { color: #fff !important; }
      `}</style>
    </footer>
  );
}

export default Footer;
