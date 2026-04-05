import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "The Art of Minimalist Living",
    subtitle: "Discover our seasonal collection of premium wardrobe essentials designed for the modern individual.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1920&auto=format&fit=crop",
    button: "VIEW COLLECTION"
  },
  {
    title: "Curated Luxury, Timeless Style",
    subtitle: "Elegance redefined through conscious design and impeccable craftsmanship for every occasion.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop",
    button: "EXPLORE NOW"
  },
  {
    title: "Modern Elegance, Redefined",
    subtitle: "Experience the perfect blend of contemporary aesthetics and unparalleled comfort in our latest arrivals.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
    button: "SHOP NEW ARRIVALS"
  }
];

function Slide() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div style={{ 
      position: "relative", 
      minHeight: "100vh", 
      width: "100%", 
      overflow: "hidden", 
      backgroundColor: "#fcfcfc", // Slightly off-white for a more premium feel
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Background Decorative Element */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '40%',
        height: '80%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 100%)',
        borderRadius: '100% 0 0 100%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-100 h-100"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="container h-100">
            <div className="row align-items-center h-100 min-vh-100 pt-5">
              
              {/* IMAGE COLUMN — 3-image collage */}
              <div className="col-12 col-md-6 order-1 order-md-2 mb-4 mb-md-0">
                <div style={{ display: 'flex', gap: '12px', height: '62vh', minHeight: '420px' }}>
                  
                  {/* Main active image — large */}
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{
                      flex: 2,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={slides[current].image}
                      alt={slides[current].title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        display: 'block'
                      }}
                    />
                    {/* Active label overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      background: 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(8px)',
                      padding: '6px 14px',
                      borderRadius: '2px',
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '2px',
                      color: '#111',
                      textTransform: 'uppercase'
                    }}>
                      Featured
                    </div>
                  </motion.div>

                  {/* Side thumbnails — the other 2 slides */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {slides.map((slide, idx) => {
                      if (idx === current) return null;
                      return (
                        <motion.div
                          key={idx}
                          onClick={() => setCurrent(idx)}
                          whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                          style={{
                            flex: 1,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                            position: 'relative',
                            transition: 'box-shadow 0.3s ease'
                          }}
                        >
                          <img
                            src={slide.image}
                            alt={slide.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center top',
                              display: 'block',
                              filter: 'brightness(0.88)'
                            }}
                          />
                          {/* Hover overlay */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)',
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '10px',
                            fontSize: '9px',
                            fontWeight: '700',
                            letterSpacing: '1.5px',
                            color: '#fff',
                            textTransform: 'uppercase'
                          }}>
                            {slide.button}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* TEXT CONTENT COLUMN */}
              <div className="col-12 col-md-6 order-2 order-md-1 text-center text-md-start">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '4px',
                      color: '#999',
                      display: 'block',
                      marginBottom: '20px',
                      textTransform: 'uppercase'
                    }}
                  >
                    New Collection 2026
                  </motion.span>
                  
                  <h1 className="hero-title" style={{ 
                    color: "#111", 
                    lineHeight: "1.1", 
                    marginBottom: "25px",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: "700",
                    letterSpacing: "-1.5px"
                  }}>
                    {slides[current].title}
                  </h1>
                  
                  <p className="hero-subtitle" style={{ 
                    color: "#555", 
                    maxWidth: "500px", 
                    lineHeight: "1.7", 
                    marginBottom: "40px",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "18px",
                    fontWeight: '300',
                    marginInline: 'auto',
                    marginLeft: '0'
                  }}>
                    {slides[current].subtitle}
                  </p>
                  
                  <style>
                    {`
                      .hero-title { font-size: 72px; }
                      .hero-subtitle { margin-inline: 0; }
                      @media (max-width: 1200px) { .hero-title { font-size: 56px; } }
                      @media (max-width: 768px) { 
                        .hero-title { font-size: 42px; } 
                        .hero-subtitle { margin-inline: auto !important; fontSize: 16px; }
                      }
                    `}
                  </style>

                  <div className="d-flex flex-column flex-sm-row align-items-center gap-4 justify-content-center justify-content-md-start">
                    <motion.button
                      onClick={() => navigate("/Shop")}
                      style={{
                        background: "#000",
                        color: "#fff",
                        border: "none",
                        padding: "20px 45px",
                        fontSize: "12px",
                        fontWeight: "600",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: '0', // Square buttons often look more high-end/standard fashion
                        transition: 'all 0.3s ease'
                      }}
                      whileHover={{ backgroundColor: "#222", scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {slides[current].button}
                    </motion.button>

                    <div className="d-none d-md-flex align-items-center gap-3">
                      <span style={{ height: '1px', width: '40px', background: '#ddd' }}></span>
                      <span style={{ fontSize: '11px', color: '#999', letterSpacing: '1px' }}>EXPLORE DETAILS</span>
                    </div>
                  </div>
                </motion.div>

                {/* NAVIGATION & INDICATOR */}
                <div style={{ marginTop: '80px', display: 'flex', alignItems: 'center', gap: '30px' }} className="justify-content-center justify-content-md-start">
                  <div className="d-flex gap-2">
                    {slides.map((_, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        style={{
                          width: current === idx ? '40px' : '10px',
                          height: '2px',
                          background: current === idx ? '#000' : '#ddd',
                          cursor: 'pointer',
                          transition: 'all 0.4s ease'
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="d-flex gap-4 align-items-center">
                    <motion.button 
                      onClick={prevSlide}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      whileHover={{ opacity: 0.6 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>arrow_back_ios</span>
                    </motion.button>


                    <motion.button 
                      onClick={nextSlide}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      whileHover={{ opacity: 0.6 }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#000' }}>arrow_forward_ios</span>
                    </motion.button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Slide;
