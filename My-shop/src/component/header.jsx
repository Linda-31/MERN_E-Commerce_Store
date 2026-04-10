import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { fetchWishlist } from "../features/wishlistSlice";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "../Styles/style.css";
import axios from "axios";

const navLinks = [
  { label: 'HOME',    path: '/home' },
  { label: 'SHOP',    path: '/shop' },
  { label: 'BLOG',    path: '/Blog' },
  { label: 'ABOUT',   path: '/About' },
  { label: 'CONTACT', path: '/Contact' },
];

function Header() {
  const [userName, setUserName]   = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled]   = useState(false);

  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const wishlist   = useSelector(state => state.wishlist.items);
  const cartcount  = useSelector(state => state.product.cartcount);

  /* ── scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── cookie / user ── */
  useEffect(() => {
    const tok = getCookie('token');
    if (tok) {
      try {
        const u = JSON.parse(atob(tok));
        setUserName(u.fullName);
        dispatch(fetchWishlist(u._id));
      } catch (e) {}
    }
  }, [dispatch]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/';
  };

  function getCookie(name) {
    const val = `; ${document.cookie}`;
    const parts = val.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  const closeMenu = () => setMenuOpen(false);

  /* ── badge helper ── */
  const Badge = ({ count, color }) =>
    count > 0 ? (
      <span style={{
        position: 'absolute', top: '-8px', right: '-8px',
        background: color, color: '#fff', fontSize: '10px',
        width: '17px', height: '17px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontFamily: "'Jost', sans-serif"
      }}>{count}</span>
    ) : null;

  /* ── Search Handler ── */
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(`/api/products/search?q=${searchTerm}`);
      navigate('/shop', { 
        state: { 
          results: response.data, 
          query: searchTerm 
        } 
      });
      setShowSearch(false);
      setSearchTerm('');
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback in case of error: just navigate to shop
      navigate('/shop');
    }
  };

  return (
    <>
      {/* ════════════════════ MAIN NAV ════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 2000,
        backgroundColor: '#fff',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 0 rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease',
        fontFamily: "'Jost', sans-serif"
      }}>
        <div style={{
          height: window.innerWidth < 768 ? '70px' : '90px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: window.innerWidth < 768 ? '0 15px' : '0 50px',
          maxWidth: '1400px', margin: '0 auto',
          position: 'relative'
        }} className="header-inner">

          {/* ── LOGO ── */}
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: window.innerWidth < 768 ? '24px' : '32px', fontWeight: '800', color: '#000', letterSpacing: '-1px' }}>KUSHI</span>
            <span style={{ width: '4px', height: '4px', backgroundColor: '#e64e4e', borderRadius: '50%', marginLeft: '2px', marginTop: window.innerWidth < 768 ? '8px' : '12px' }} />
          </Link>

          {/* ── CENTER NAV (desktop) ── */}
          <ul className="header-nav-desktop" style={{
            display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '32px'
          }}>
            {navLinks.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#e64e4e' : '#000',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    paddingBottom: '4px',
                    borderBottom: isActive ? '2px solid #e64e4e' : '2px solid transparent',
                    transition: 'color 0.2s ease, border-color 0.2s ease'
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── RIGHT ICONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth < 768 ? '12px' : '20px', flexShrink: 0 }}>
            
            {/* Desktop-only Functional Icons */}
            <div className="header-functional-icons-desktop" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearch(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                aria-label="Search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>
                  {showSearch ? 'close' : 'search'}
                </span>
              </button>

              {/* Account dropdown */}
              <div className="dropdown">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} data-bs-toggle="dropdown" aria-label="Account">
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>person</span>
                </div>
                <ul className="dropdown-menu dropdown-menu-end" style={{ borderRadius: '4px', border: '1px solid #f0f0f0', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', minWidth: '180px', padding: '8px 0' }}>
                  <li className="px-3 py-2 border-bottom" style={{ fontSize: '11px', fontWeight: '700', color: '#aaa', letterSpacing: '1px' }}>
                    {userName ? `HELLO, ${userName.toUpperCase()}` : 'MY ACCOUNT'}
                  </li>
                  <li><NavLink className="dropdown-item py-2" to="/profile" style={({ isActive }) => ({ fontSize: '13px', color: isActive ? '#e64e4e' : '#000' })}>My Profile</NavLink></li>
                  <li><NavLink className="dropdown-item py-2" to="/wishlist" style={({ isActive }) => ({ fontSize: '13px', color: isActive ? '#e64e4e' : '#000' })}>Wishlist</NavLink></li>
                  <li><NavLink className="dropdown-item py-2" to="/faq" style={({ isActive }) => ({ fontSize: '13px', color: isActive ? '#e64e4e' : '#000' })}>FAQ & Help</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item py-2" onClick={handleLogout} style={{ fontSize: '13px', color: '#e64e4e' }}>Logout</button></li>
                </ul>
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Wishlist">
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>favorite</span>
                <Badge count={wishlist.length} color="#000" />
              </Link>

              {/* Cart */}
              <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Cart">
                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>shopping_bag</span>
                <Badge count={cartcount} color="#e64e4e" />
              </Link>
            </div>

            {/* ── HAMBURGER (mobile/tablet only) ── */}
            <button
              id="header-hamburger"
              className="header-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                display: 'none',
                background: 'none', border: '1.5px solid #000',
                borderRadius: '6px', cursor: 'pointer',
                width: '40px', height: '40px',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '5px',
                padding: '8px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <span style={{
                display: 'block', width: '20px', height: '2px',
                background: '#000', borderRadius: '2px',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                transition: 'transform 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '20px', height: '2px',
                background: '#000', borderRadius: '2px',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }} />
              <span style={{
                display: 'block', width: '20px', height: '2px',
                background: '#000', borderRadius: '2px',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                transition: 'transform 0.3s ease'
              }} />
            </button>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{
          overflow: 'hidden',
          maxHeight: showSearch ? '160px' : '0',
          transition: 'max-height 0.35s ease',
          borderTop: showSearch ? '1px solid #f0f0f0' : 'none'
        }}>
          <form 
            onSubmit={handleSearch}
            style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 480 ? 'column' : 'row',
              gap: '12px', 
              padding: window.innerWidth < 768 ? '15px 20px' : '15px 50px', 
              background: '#fff' 
            }}
          >
            <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '12px 40px 12px 16px', border: '1px solid #e8e8e8',
                  outline: 'none', fontSize: '14px', fontFamily: "'Jost', sans-serif",
                  borderRadius: '4px'
                }}
                autoFocus={showSearch}
              />
              <button 
                type="button" 
                onClick={() => setShowSearch(false)}
                style={{
                  position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#888', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px'
                }}
                aria-label="Close search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>
            <button
               type="submit"
               style={{
                padding: window.innerWidth < 480 ? '12px' : '0 28px', background: '#000', color: '#fff',
                border: 'none', fontWeight: '700', fontSize: '12px',
                letterSpacing: '1px', cursor: 'pointer', borderRadius: '4px',
                fontFamily: "'Jost', sans-serif"
              }}
            >SEARCH</button>
          </form>
        </div>

        {/* ── MOBILE DRAWER ── */}
        <div
          id="header-mobile-drawer"
          style={{
            overflow: 'hidden',
            maxHeight: menuOpen ? '600px' : '0',
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            boxShadow: menuOpen ? '0 12px 30px rgba(0,0,0,0.08)' : 'none'
          }}
        >
          <div style={{ 
             display: 'flex', 
             justifyContent: 'space-around', 
             padding: '20px 0', 
             borderBottom: '1px solid #f8f8f8',
             background: '#fafafa'
          }}>
            {/* Search */}
            <div onClick={() => { setShowSearch(true); closeMenu(); }} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>search</span>
              <div style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px', letterSpacing: '1px' }}>SEARCH</div>
            </div>
            {/* Wishlist */}
            <Link to="/wishlist" onClick={closeMenu} style={{ textDecoration: 'none', textAlign: 'center', position: 'relative', color: '#000' }}>
               <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>favorite</span>
               <Badge count={wishlist.length} color="#000" />
               <div style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px', letterSpacing: '1px' }}>WISHLIST</div>
            </Link>
            {/* Cart */}
            <Link to="/cart" onClick={closeMenu} style={{ textDecoration: 'none', textAlign: 'center', position: 'relative', color: '#000' }}>
               <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_bag</span>
               <Badge count={cartcount} color="#e64e4e" />
               <div style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px', letterSpacing: '1px' }}>CART</div>
            </Link>
            {/* Profile */}
            <Link to="/profile" onClick={closeMenu} style={{ textDecoration: 'none', textAlign: 'center', color: '#000' }}>
               <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
               <div style={{ fontSize: '9px', fontWeight: '800', marginTop: '4px', letterSpacing: '1px' }}>PROFILE</div>
            </Link>
          </div>

          <ul style={{ listStyle: 'none', margin: 0, padding: '10px 0 20px' }}>
            {navLinks.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  onClick={closeMenu}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 30px',
                    textDecoration: 'none',
                    color: isActive ? '#e64e4e' : '#111',
                    fontSize: '13px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    fontFamily: "'Jost', sans-serif",
                    borderLeft: isActive ? '3px solid #e64e4e' : '3px solid transparent',
                    background: isActive ? 'rgba(230,78,78,0.04)' : 'transparent',
                    transition: 'all 0.2s ease'
                  })}
                >
                  {item.label}
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'inherit' }}>chevron_right</span>
                </NavLink>
              </li>
            ))}

            {/* Divider + shop CTA */}
            <li style={{ borderTop: '1px solid #f4f4f4', margin: '10px 30px 0' }} />
            <li style={{ padding: '14px 30px' }}>
              <Link
                to="/shop"
                onClick={closeMenu}
                style={{
                  display: 'block', textAlign: 'center',
                  background: '#000', color: '#fff',
                  padding: '14px', borderRadius: '4px',
                  textDecoration: 'none', fontSize: '12px',
                  fontWeight: '700', letterSpacing: '2px',
                  fontFamily: "'Jost', sans-serif"
                }}
              >
                SHOP NOW
              </Link>
            </li>
          </ul>
        </div>

        {/* ── Responsive CSS ── */}
        <style>{`
          @media (max-width: 991px) {
            .header-inner { padding: 0 24px !important; }
            .header-nav-desktop { display: none !important; }
            .header-functional-icons-desktop { display: none !important; }
            #header-hamburger, .header-hamburger { display: flex !important; }
          }
          @media (min-width: 992px) {
            #header-mobile-drawer { display: none !important; }
          }
          .dropdown-item:active, .dropdown-item.active {
            background-color: #e64e4e !important;
            color: #fff !important;
          }
          .dropdown-item:hover {
            background-color: #f8f9fa !important;
            color: #e64e4e !important;
          }
        `}</style>
      </nav>

      {/* ── OVERLAY backdrop for mobile menu ── */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed', inset: 0, zIndex: 1999,
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(2px)',
            animation: 'fadeIn 0.25s ease'
          }}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  );
}

export default Header;
