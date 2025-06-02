'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import '../../styles/register.css'

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain uppercase, lowercase, digit, and special character.");
      return;
    }

    const formData = { name, email, password };

    try {
      const result = await axios.post("/api/auth/register", formData);
      if (result.status === 201) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-form-section">
          <div className="register-form-container">
            <div className="register-header">
              <Link href="/" className="register-logo">
                <BookOpen className="register-logo-icon" />
                <span className="register-logo-text">BookClub</span>
              </Link>
            </div>

            <div className="register-form-wrapper">
              <h1 className="register-title">Create your account</h1>
              <p className="register-subtitle">
                Already have an account?{' '}
                <Link href="/login" className="register-link">
                  Sign in here
                </Link>
              </p>

              {error && <p className="text-red-500 mt-2">{error}</p>}
              {showSuccessMessage && <p className="text-green-500 mt-2">Registration successful! Redirecting...</p>}

              <form onSubmit={handleSubmit} className="register-form">
                {/* Name Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="Enter your email"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input pr-12"
                      placeholder="Create a password"
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input pr-12"
                      placeholder="Confirm your password"
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="terms-group">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="checkbox-input"
                      required
                      suppressHydrationWarning
                    />
                    <span className="checkbox-label">
                      I agree to the{' '}
                      <Link href="/terms" className="terms-link">Terms of Service</Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="terms-link">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="register-button"
                  disabled={!agreeToTerms}
                >
                  Create Account
                </button>

                {/* Guest Access */}
                <div className="guest-section">
                  <div className="divider">
                    <span className="divider-text">or</span>
                  </div>
                  <Link href="/pages/guestdashboard" className="guest-button">Continue as Guest</Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="register-image-section">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1974&q=80"
            alt="Beautiful library with warm lighting"
            className="register-bg-image"
          />
          <div className="register-image-overlay">
            <div className="register-image-content">
              <h2 className="register-image-title">Join Our Reading Community</h2>
              <p className="register-image-text">
                Connect with fellow book lovers, discover new stories, and share your passion for literature.
              </p>
              <div className="register-benefits">
                <div className="benefit-item">✨ Access to exclusive book clubs</div>
                <div className="benefit-item">📚 Personalized reading recommendations</div>
                <div className="benefit-item">💬 Engaging discussions with readers</div>
                <div className="benefit-item">🎥 Virtual book club meetings</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;