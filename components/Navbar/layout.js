'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Book, LogOut, User, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useState,useEffect } from 'react';
const Navbar = ({ isAuthenticated = false }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        console.log('User data from API:', data);
        setUser(data.user);
      } else {
        console.log('Fetch user failed:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  if (isAuthenticated) {
    fetchUser();
  }
}, [isAuthenticated]);


  const handleLogout = () => {
    // Optional: call API to clear cookie
    router.push('/');
  };


  return (
    <nav className="bg-white border-b border-gray-200 bookclub-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-bookclub-navy">BookClub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-bookclub-gray hover:text-bookclub-orange transition-colors">
                  Dashboard
                </Link>
                <Link href="/clubs" className="text-bookclub-gray hover:text-bookclub-orange transition-colors">
                  Clubs
                </Link>
                <Link href="/books" className="text-bookclub-gray hover:text-bookclub-orange transition-colors">
                  Books
                </Link>
                <Link href="/profile" className="text-bookclub-gray hover:text-bookclub-orange transition-colors">
                  Profile
                </Link>
              </>
            ) : (
              <Link href="/browse" className="text-bookclub-gray hover:text-bookclub-orange transition-colors">
                Browse as Guest
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-bookclub-gray" />
                  <span className="text-sm text-bookclub-navy">{user?.name || 'User'}</span>
                </div>
                <Button    onClick={handleLogout}
     variant="outline" size="sm" className="border-bookclub-orange text-bookclub-orange hover:bg-bookclub-orange hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-bookclub-gray hover:text-bookclub-orange">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bookclub-gradient text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5 text-bookclub-gray" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
