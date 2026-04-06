import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../Styles/style.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 4) errs.password = 'Password too short';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/users/login', {
        email,
        password: btoa(password),
      });

      console.log('Login Response:', res.data);

      // Improved Role Check (Trimmed and Case-Insensitive)
      const userRole = res.data.user.role?.toLowerCase().trim();
      
      if (userRole !== 'admin') {
        toast.error('Access Denied: You are not an admin');
        setLoading(false);
        return;
      }

      const tokenData = btoa(JSON.stringify(res.data.user));
      document.cookie = `token=${tokenData}; path=/; max-age=3600`;

      toast.success('Welcome back, Admin!');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="admin-login-page">
        {/* Animated background elements */}
        <div className="admin-login-bg">
          <div className="admin-login-bg-shape admin-login-bg-shape-1"></div>
          <div className="admin-login-bg-shape admin-login-bg-shape-2"></div>
          <div className="admin-login-bg-shape admin-login-bg-shape-3"></div>
        </div>

        {/* Grid overlay for premium feel */}
        <div className="admin-login-grid-overlay"></div>

        <div className="admin-login-card">
          {/* Top accent bar */}
          <div className="admin-login-accent-bar"></div>

          {/* Logo & Branding */}
          <div className="admin-login-header">
            <div className="admin-login-logo">
              <div className="admin-login-logo-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h1>KUSHI<span>.</span></h1>
              <div className="admin-login-divider"></div>
              
            </div>
          </div>

          {/* Welcome text */}
          <div className="admin-login-welcome">
            <h2>Welcome Back</h2>
            <p>Sign in to access the admin dashboard and manage your store.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label htmlFor="admin-email">
                <i className="bi bi-envelope me-2"></i>
                EMAIL ADDRESS
              </label>
              <div className="admin-login-input-wrap">
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@kushi.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})); }}
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              {errors.email && <span className="admin-login-error">{errors.email}</span>}
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">
                <i className="bi bi-key me-2"></i>
                PASSWORD
              </label>
              <div className="admin-login-input-wrap">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})); }}
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password && <span className="admin-login-error">{errors.password}</span>}
            </div>

            <div className="admin-login-options">
              <label className="admin-login-remember">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-login-spinner"></span>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  ACCESS DASHBOARD
                </>
              )}
            </button>
          </form>

         
        </div>

      </div>
    </>
  );
}

export default Login;
