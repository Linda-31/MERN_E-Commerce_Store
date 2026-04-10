import React from 'react';
import "../Styles/style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { motion } from "framer-motion";

function Signup() {
  const { register, handleSubmit, formState: { errors }, watch, } = useForm();
  const password = watch('password');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/users/signup', {
        fullName: data.fullName,
        email: data.email,
        password: btoa(data.password),
      });
      toast.success(`Account created successfully for ${res.data.user.fullName}`);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
      console.error(error);
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
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000'
      }}>
        {/* Immersive Blurred Background Image */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.5)', 
          transform: 'scale(1.1)', 
          zIndex: 0
        }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            width: '100%', 
            maxWidth: '520px', 
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '24px', 
            padding: '50px 45px', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
               <h2 style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '4px', color: '#000', textTransform: 'uppercase', marginBottom: '8px' }}>
                 KUSHI<span style={{ color: '#e64e4e' }}>.</span>
               </h2>
               <div style={{ width: '25px', height: '2px', background: '#e64e4e', margin: '0 auto' }}></div>
            </motion.div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
             <h3 style={{ fontWeight: '800', fontSize: '26px', color: '#000', marginBottom: '8px' }}>Create Account</h3>
             <p style={{ color: '#888', fontSize: '14px' }}>Join our exclusive community of fashion enthusiasts.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Full Name</label>
              <input
                type="text"
                style={{
                  width: '100%', height: '50px', background: '#f8f9fa', border: '1px solid #eee',
                  borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="centered-input"
                placeholder="John Doe"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.fullName.message}</span>
              )}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Email Address</label>
              <input
                type="email"
                style={{
                  width: '100%', height: '50px', background: '#f8f9fa', border: '1px solid #eee',
                  borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                className="centered-input"
                placeholder="email@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.email.message}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 576 ? '1fr' : '1fr 1fr', gap: '18px', marginBottom: '30px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Password</label>
                <input
                  type="password"
                  style={{
                    width: '100%', height: '50px', background: '#f8f9fa', border: '1px solid #eee',
                    borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="centered-input"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 chars' },
                  })}
                />
                {errors.password && (
                  <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.password.message}</span>
                )}
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>Confirm</label>
                <input
                  type="password"
                  style={{
                    width: '100%', height: '50px', background: '#f8f9fa', border: '1px solid #eee',
                    borderRadius: '12px', padding: '0 20px', fontSize: '14px', color: '#000', outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  className="centered-input"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Confirm password',
                    validate: (value) => value === password || 'No match',
                  })}
                />
                {errors.confirmPassword && (
                  <span style={{ fontSize: '11px', color: '#e64e4e', marginTop: '6px', display: 'block', fontWeight: 'bold' }}>{errors.confirmPassword.message}</span>
                )}
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
              Create Account
            </motion.button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
            Already a member?{' '}
            <Link to="/" style={{ color: '#000', fontWeight: '800', textDecoration: 'none', borderBottom: '2px solid #e64e4e' }}>Sign In</Link>
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

export default Signup;

