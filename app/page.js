'use client'; // ✅ Required for client-side interactions like Link

import React from 'react';
import Link from 'next/link'; // ✅ Updated: from react-router-dom → next/link
import { BookOpen, Users, MessageCircle, Video, Star, ArrowRight } from 'lucide-react';
import '../styles/landing.css'; // ✅ Your existing CSS is preserved

const HomePage = () => {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-section">
            <BookOpen className="logo-icon" />
            <span className="logo-text">BookClub</span>
          </div>
          <nav className="nav-links">
            <Link href="/login" className="nav-link">Login</Link> {/* ✅ Updated */}
            <Link href="/register" className="nav-link-primary">Get Started</Link> {/* ✅ Updated */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover, Discuss, and Dive Deep into
              <span className="hero-accent"> Amazing Books</span>
            </h1>
            <p className="hero-description">
              Join passionate readers, create meaningful discussions, and explore new worlds 
              through literature. Connect with like-minded book lovers and turn reading 
              into a shared adventure.
            </p>
            <div className="hero-buttons">
              <Link href="/register" className="btn-primary">
                Start Your Journey <ArrowRight className="btn-icon" />
              </Link> {/* ✅ Updated */}
              <Link href="/login" className="btn-secondary">
                Browse as Guest
              </Link> {/* ✅ Updated */}
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Stack of books with warm lighting"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose Our Book Club?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users className="feature-icon" />
              </div>
              <h3 className="feature-title">Connect with Readers</h3>
              <p className="feature-description">
                Join vibrant communities of book enthusiasts and make meaningful connections 
                through shared literary experiences.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MessageCircle className="feature-icon" />
              </div>
              <h3 className="feature-title">Rich Discussions</h3>
              <p className="feature-description">
                Engage in thoughtful conversations, share insights, and discover new 
                perspectives on your favorite books.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Video className="feature-icon" />
              </div>
              <h3 className="feature-title">Virtual Meetups</h3>
              <p className="feature-description">
                Participate in live video discussions, author talks, and interactive 
                book club sessions from anywhere.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Star className="feature-icon" />
              </div>
              <h3 className="feature-title">Curated Recommendations</h3>
              <p className="feature-description">
                Discover your next great read through personalized recommendations 
                and community-driven book selections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Readers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Book Clubs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Books Discussed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Start Your Reading Journey?</h2>
          <p className="cta-description">
            Join thousands of book lovers and transform the way you experience literature.
          </p>
          <Link href="/register" className="cta-button">
            Join BookClub Today
          </Link> {/* ✅ Updated */}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <BookOpen className="footer-logo-icon" />
            <span className="footer-logo-text">BookClub</span>
          </div>
          <div className="footer-text">
            © 2024 BookClub. All rights reserved. Made with ❤️ for book lovers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
