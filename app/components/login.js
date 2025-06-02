'use client'; // ✅ Added for client-side interactivity in Next.js
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';

import React, { useState } from 'react';
import Link from 'next/link'; // ✅ Replaced react-router-dom's Link with next/link
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import '../../styles/login.css'
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
  
    

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/auth/login', formData);

    if (res.status === 200) {
      toast.success('Login successful!');
      // After successful login
      localStorage.setItem('token', res.data.token);
       router.push('/dashboard');
 // redirect on success, token is in cookie now
    } else {
      toast.error('Login failed.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Login failed. Please try again.');
  }
};


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left side - Image */}
        <div className="login-image-section">
          <img 
            src="/assets/lp.jpg"
            alt="Cozy reading corner with books"
            className="login-bg-image"
          />
          <div className="login-image-overlay">
            <div className="login-image-content">
              <h2 className="login-image-title">Welcome Back to BookClub</h2>
              <p className="login-image-text">
                Continue your literary journey and reconnect with your reading community.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            {/* Header */}
            <div className="login-header">
              <Link href="/" className="login-logo">
                {/* ✅ No change here since BookOpen is a React component */}
                <BookOpen className="login-logo-icon" />
                <span className="login-logo-text">BookClub</span>
              </Link>
            </div>

            {/* Form */}
            <div className="login-form-wrapper">
              <h1 className="login-title">Sign in to your account</h1>
              <p className="login-subtitle">
                Don't have an account?{' '}
                <Link href="/register" className="login-link">
                  Sign up here
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="login-form">
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? (
                        <EyeOff className="toggle-icon" />
                      ) : (
                        <Eye className="toggle-icon" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="login-options">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" className="checkbox-input" />
                    <span className="checkbox-label">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-button">
                  Sign in
                </button>

                {/* Guest Access */}
                <div className="guest-section">
                  <div className="divider">
                    <span className="divider-text">or</span>
                  </div>
                  <Link href="/guestdashboard" className="guest-button">
                    Continue as Guest
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
