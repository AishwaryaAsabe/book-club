"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../components/ui/card"
import {
  Book,
  Users,
  MessageCircle,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Heart
} from "lucide-react";
import Navbar from "../../components/Navbar/layout";
import "../../styles/guestdashboard.css"

export default function GuestDashboard() {
  const [bookClubs, setBookClubs] = useState([])
  const [books, setBooks] = useState([])


  useEffect(() => {
    async function fetchData() {
      try {
        const booksRes = await fetch('/api/books/fordashboard')
        const booksData = await booksRes.json()
        const clubsRes = await fetch('/api/club/fordashboard')
        const clubsdata = await clubsRes.json()

        setBooks(booksData.slice(0, 6)) // Show only 6 books
        setBookClubs(clubsdata.slice(0, 6)) // Show only 6 clubs
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bookclub-cream via-white to-primary-50">
      <Navbar />

      {/* Hero Section */}
      <section className="guest-hero-section">
        <div className="guest-hero-background">
          <div className="library-texture"></div>
        </div>
        <div className="guest-hero-content">
          <div className="guest-hero-text">
            <div className="guest-hero-icon">
              <Book className="h-10 w-10 text-white" />
            </div>
            <h1 className="guest-hero-title">
              Welcome to{" "}
              <span className="bookclub-gradient bg-clip-text text-transparent">
                BookClub
              </span>
            </h1>
            <p className="guest-hero-subtitle">
              Join thousands of passionate readers in the ultimate literary
              community. Discover amazing books, engage in thoughtful
              discussions, and make lifelong reading friends.
            </p>
            <div className="guest-hero-buttons">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bookclub-gradient guest-hero-primary-btn"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join the Adventure
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="guest-hero-secondary-btn"
                >
                  Already a Member?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="guest-stats-section">
        <div className="guest-stats-container">
          <div className="guest-stats-grid">
            {[
              {
                number: "800+",
                label: "Active Readers",
                icon: Users,
                color: "text-blue-600",
              },
              {
                number: "100+",
                label: "Book Clubs",
                icon: Book,
                color: "text-bookclub-orange",
              },
              {
                number: "10k+",
                label: "Discussions",
                icon: MessageCircle,
                color: "text-green-600",
              },
            ].map((stat, index) => (
              <div key={index} className="guest-stat-item group">
                <div className="guest-stat-icon">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="guest-stat-number">{stat.number}</div>
                <div className="guest-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="guest-clubs-section">
        <div className="guest-stats-container">
          <div className="guest-section-header">
            <h2 className="guest-section-title">Featured Book Clubs</h2>
            <p className="guest-section-subtitle">
              Join vibrant communities of readers who share your passion
            </p>
          </div>
          <div className="guest-clubs-grid">
            {bookClubs.map((club) => (
              <Card key={club._id} className="guest-club-card group">
                <CardHeader>
                  <div className="guest-club-header">
                    <div className="guest-club-emoji">{club.image}</div>
                    <div className="guest-club-info">
                      <CardTitle className="guest-club-name">
                        {club.name}
                      </CardTitle>
                      <div className="guest-club-members">
                        <Users className="h-4 w-4 mr-1" />
                        {club.membersCount} members
                      </div>
                    </div>
                  </div>
                  <CardDescription className="guest-club-description">
                    {club.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="guest-club-current-book">
                    <div className="guest-club-book-title">Currently Reading</div>
                    <div className="guest-club-book-name">{club.currentBook}</div>
                  </div> */}
                  <Button className="bookclub-gradient guest-club-join-btn">
                    <Heart className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="guest-books-section">
        <div className="guest-stats-container">
          <div className="guest-section-header">
            <h2 className="guest-section-title">Popular Books</h2>
            <p className="guest-section-subtitle">
              Discover trending books that our community loves
            </p>
          </div>
          <div className="guest-books-grid">
            {books.slice(0, 6).map((book, index) => (
              <Card key={index} className="guest-book-card group">
                <CardHeader>
                  <div className="guest-book-image-container">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="guest-book-image"
                      />
                    ) : (
                      <Book className="h-12 w-12 text-bookclub-orange" />
                    )}
                  </div>
                  <CardTitle className="guest-book-title">
                    {book.title || "Unknown Title"}
                  </CardTitle>
                  <CardDescription className="guest-book-author">
                    {book.author || "Unknown Author"}

                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="guest-book-meta">
                    {book.categories && (
                      <span className="guest-book-category">
                        {book.categories[0]}
                      </span>
                    )}
                    {book.averageRating && (
                      <div className="guest-book-rating">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="guest-book-rating-text">
                          {book.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="guest-book-details-btn">
                    <Book className="h-4 w-4 mr-2" />
                    See Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bookclub-gradient guest-cta-section">
        <div className="guest-cta-decorations">
          <div className="guest-cta-decoration-1"></div>
          <div className="guest-cta-decoration-2"></div>
          <div className="guest-cta-decoration-3"></div>
        </div>
        <div className="guest-cta-content">
          <h2 className="guest-cta-title">
            Ready to Begin Your Literary Journey?
          </h2>
          <p className="guest-cta-subtitle">
            Join our amazing community of book lovers today. Share your
            thoughts, discover new favorites, and connect with readers who share
            your passion for great stories.
          </p>
          <div className="guest-cta-buttons">
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="guest-cta-primary-btn"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Reading Together
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
