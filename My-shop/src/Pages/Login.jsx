import React from 'react';
import "../Styles/style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('token');
    if (userId) {
      navigate('/home');
    }
  }, [navigate]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', {
        email: data.email,
        password: btoa(data.password),
      });

      const token = btoa(JSON.stringify(res.data.user));
      document.cookie = `token=${token}; path=/; max-age=3600`;

      toast.success("Login successful!");
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials!";
      toast.error(message);
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontFamily: "'Jost', sans-serif",
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000' // Dark fallback
      }}>
        {/* Immersive Blurred Background Image */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.5)', 
          transform: 'scale(1.1)', 
          zIndex: 0
        }}></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ 
            width: '100%', 
            maxWidth: '480px', 
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '24px', 
            padding: '50px 40px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
               <h2 style={{ fontWeight: '900', fontSize: '22px', letterSpacing: '4px', color: '#000', textTransform: 'uppercase', marginBottom: '8px' }}>
                 KUSHI<span style={{ color: '#e64e4e' }}>.</span>
               </h2>
               <div style={{ width: '30px', height: '2px', background: '#e64e4e', margin: '0 auto' }}></div>
            </motion.div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
             <h3 style={{ fontWeight: '800', fontSize: '28px', color: '#000', marginBottom: '8px' }}>Welcome Back</h3>
             <p style={{ color: '#888', fontSize: '14px', letterSpacing: '0.5px' }}>Enter your details to access your boutique portal.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Email Address</label>
              <input
                type="email"
                style={{
                  width: '100%', height: '52px', background: '#f8f9fa', border: '1px solid #eee',
                  borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                className="centered-input"
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.email.message}</span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', margin: 0 }}>Password</label>
                 <Link to="#" style={{ fontSize: '11px', color: '#e64e4e', textDecoration: 'none', fontWeight: 'bold' }}>Forgot?</Link>
              </div>
              <input
                type="password"
                style={{
                  width: '100%', height: '52px', background: '#f8f9fa', border: '1px solid #eee',
                  borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                className="centered-input"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.password.message}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="rem" style={{ accentColor: '#e64e4e' }} {...register('rememberMe')} />
                  <label htmlFor="rem" style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>Remember me</label>
               </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#000' }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              style={{ 
                width: '100%', height: '55px', background: '#e64e4e', color: '#fff', 
                border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', 
                letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(230,78,78,0.15)', transition: 'all 0.3s ease'
              }}
            >
              Access Account
            </motion.button>
          </form>

          <div style={{ marginTop: '35px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
            New to Kushi?{' '}
            <Link to="/Signup" style={{ color: '#000', fontWeight: '800', textDecoration: 'none', borderBottom: '2px solid #e64e4e' }}>Create Account</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .centered-input:focus {
          border-color: #e64e4e !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(230,78,78,0.05);
        }
      `}</style>
    </>
  );
}

export default Login;



