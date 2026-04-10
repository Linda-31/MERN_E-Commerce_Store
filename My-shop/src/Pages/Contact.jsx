import React from 'react';
import "../Styles/style.css";
import { useForm } from 'react-hook-form';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm();
  const onSubmit = async (data) => {
    try {
      await axios.post('/api/contacts/save', data);
      toast.success("Inquiry delivered to our curators");
      reset();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error("Failed to deliver inquiry");
    }
  };
  
  const headingRef = useRef(null);
  
  useEffect(() => {
    const letters = headingRef.current.querySelectorAll("span");
    gsap.fromTo(
      letters,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const text = "CONTACT US";

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: "'Jost', sans-serif" }}>
      <Toaster richColors position="bottom-right" />
      {/* ===== HERO BANNER (REDUCED HEIGHT, MATCHING ABOUT STYLE) ===== */}
      <div style={{ 
        height: window.innerWidth < 768 ? '220px' : '350px', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Fixed Background Image Implementation */}
        <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            opacity: 0.2, 
            filter: 'grayscale(1)' 
        }}></div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 20px' }}>
          <h1 style={{ color: '#fff', fontSize: window.innerWidth < 768 ? '32px' : '64px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', margin: 0, marginTop: window.innerWidth < 992 ? '70px' : '0' }}>GET IN TOUCH</h1>
          <div className="mt-3 d-flex justify-content-center gap-3">
             <Link to="/home" style={{ color: '#888', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>•</span>
             <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>CONTACT</span>
          </div>
        </motion.div>
      </div>

      <div className="container py-5 my-5">
        <div className="row g-5">
            {/* INFO SECTION */}
            <div className="col-lg-4 text-center text-lg-start mb-5 mb-lg-0">
                <div ref={headingRef}>
                    <h2 style={{ fontSize: window.innerWidth < 768 ? '28px' : '42px', fontWeight: '900', color: '#000', marginBottom: '40px', letterSpacing: '-1px', lineHeight: '1.1' }}>
                        {text.split("").map((char, i) => (
                            <span key={i} style={{ display: "inline-block" }}>{char === " " ? "\u00A0" : char}</span>
                        ))}
                    </h2>
                </div>

                <div className="d-flex flex-column gap-5">
                    <div className="contact-info-block">
                        <span style={{ color: '#e64e4e', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>ATELIER</span>
                        <p style={{ fontSize: '16px', color: '#666', marginTop: '10px', lineHeight: '1.6' }}>
                            379 Hudson St, 8th Floor<br />
                            New York, NY 10018
                        </p>
                    </div>

                    <div className="contact-info-block">
                        <span style={{ color: '#e64e4e', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>EMAIL US</span>
                        <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
                            concierge@kushi.com<br />
                            support@kushi.com
                        </p>
                    </div>

                    <div className="contact-info-block">
                        <span style={{ color: '#e64e4e', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase' }}>PHONE</span>
                        <p style={{ fontSize: '16px', color: '#666', marginTop: '10px' }}>
                            (+1) 800 123 6879
                        </p>
                    </div>
                </div>
            </div>

            {/* FORM SECTION */}
            <div className="col-lg-8">
                <div style={{ background: '#f9f9f9', padding: window.innerWidth < 768 ? '30px' : '60px', borderRadius: '0', boxShadow: window.innerWidth < 768 ? '10px 10px 0 #000' : '20px 20px 0 #000' }}>
                    <h3 className="text-center text-lg-start" style={{ fontSize: window.innerWidth < 768 ? '20px' : '24px', fontWeight: '900', marginBottom: '40px', letterSpacing: '1px' }}>SEND A MESSAGE</h3>
                    
                    {isSubmitSuccessful && (
                        <div className="alert alert-dark rounded-0 border-0 mb-5 py-3">
                            Message received. Our curators will connect shortly.
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row g-4">
                            <div className="col-md-6 mb-4">
                                <label style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', color: '#000', marginBottom: '10px', display: 'block' }}>FULL NAME</label>
                                <input type="text" className={`form-control rounded-0 border-bottom border-0 border-dark bg-transparent ps-0 ${errors.name ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '12px 0' }} {...register('name', { required: true })} />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', color: '#000', marginBottom: '10px', display: 'block' }}>EMAIL ADDRESS</label>
                                <input type="email" className={`form-control rounded-0 border-bottom border-0 border-dark bg-transparent ps-0 ${errors.email ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '12px 0' }} {...register('email', { required: true })} />
                            </div>
                        </div>
                        <div className="mb-4 pt-3">
                            <label style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', color: '#000', marginBottom: '10px', display: 'block' }}>SUBJECT</label>
                            <input type="text" className={`form-control rounded-0 border-bottom border-0 border-dark bg-transparent ps-0 ${errors.subject ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '12px 0' }} {...register('subject', { required: true })} />
                        </div>
                        <div className="mb-5 pt-3">
                            <label style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', color: '#000', marginBottom: '10px', display: 'block' }}>MESSAGE</label>
                            <textarea rows="4" className={`form-control rounded-0 border-bottom border-0 border-dark bg-transparent ps-0 ${errors.message ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '12px 0' }} {...register('message', { required: true })} />
                        </div>
                        
                        <button type="submit" style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '20px', fontWeight: 'bold', letterSpacing: '4px', fontSize: '12px', textTransform: 'uppercase', transition: '0.3s' }}>
                            Deliver Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>

      {/* MAP SECTION (FULL WIDTH GRayscale) */}
      <div className="mt-5 pt-4">
        <div style={{ height: '450px', filter: 'grayscale(1) contrast(1.2)' }}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9698121165246!2d-74.00601508459258!3d40.73061027932879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af1801ba4d%3A0xa6aebf3d7f2c9635!2s379%20Hudson%20St%2C%20New%20York%2C%20NY%2010014%2C%20USA!5e0!3m2!1sen!2sus!4v1614288464072!5m2!1sen!2sus"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;



