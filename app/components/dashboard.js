'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import Navbar from '../../components/Navbar/layout';
import {
  Book,
  Users,
  MessageCircle,
  Plus,
  Clock,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const router = useRouter();
  const [myClubs, setMyClubs] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's clubs
  const fetchMyClubs = async () => {
  try {
    const response = await fetch('/api/club/my', {
      method: 'POST', // <-- Changed to POST
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clubs');
    }

    const data = await response.json();
    setMyClubs(data);
  } catch (error) {
    console.error('Error fetching clubs:', error);
  }
};


  // Fetch currently reading books
  const fetchRecentlyReadingBooks = async () => {
    try {
      const response = await fetch('/api/books/mybooks', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch currently reading books');
      }

      const data = await response.json();

      // Data returned as { recentBooks: [...] }
      setRecentBooks(data.recentBooks || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    // Fetch both clubs and books in parallel
    Promise.all([fetchMyClubs(), fetchRecentlyReadingBooks()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;


  return (
    <div className="min-h-screen bg-bookclub-cream1">
      <Navbar
        isAuthenticated={true}
        user={{ name: "John Doe", email: "john@example.com" }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bookclub-navy mb-2">
            Welcome back, John!
          </h1>
          <p className="text-bookclub-gray">
            Here's what's happening in your reading community
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
          {/* Stat Cards */}
          {[
            {
              title: "Books Reading",
              value: 3,
              icon: <Book className="h-8 w-8 text-bookclub-orange" />,
            },
            {
              title: "Active Clubs",
              value: 3,
              icon: <Users className="h-8 w-8 text-bookclub-orange" />,
            },
            {
              title: "Discussions",
              value: 10,
              icon: <MessageCircle className="h-8 w-8 text-bookclub-orange" />,
            },
            {
              title: "Reading Streak",
              value: "7 days",
              icon: <TrendingUp className="h-8 w-8 text-bookclub-orange" />,
            },
          ].map((stat, i) => (
            <Card key={i} className="bg-bookclub-cream">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-bookclub-gray">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-bookclub-navy">
                      {stat.value}
                    </p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Currently Reading */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Currently Reading</CardTitle>
                  <CardDescription>Your active reading list</CardDescription>
                </div>
                <Link href="/books">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Book
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBooks.length === 0 ? (
                  <p className="text-bookclub-gray text-sm">
                    No books currently reading.
                  </p>
                ) : (
                  recentBooks.map((book) => (
                    <div
                      key={book._id} // MongoDB _id field
                      className="flex items-center space-x-4 p-3 rounded-lg border"
                    >
                      <div className="w-12 h-16 bg-bookclub-orange bg-opacity-20 rounded flex items-center justify-center overflow-hidden">
                        {/* Show thumbnail if available else default icon */}
                        {book.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            className="object-cover w-full h-full rounded"
                          />
                        ) : (
                          <Book className="h-6 w-6 text-bookclub-orange" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-bookclub-navy">
                          {book.title}
                        </h4>
                        <p className="text-sm text-bookclub-gray">
                          {book.author || "Unknown Author"}
                        </p>
                        {/* Assuming 'club' is the name of the book club; if not in schema, you can remove */}
                        {/* <p className="text-xs text-bookclub-orange">{book.club}</p> */}

                        {/* Progress - you may want to add progress to your schema or compute it */}
                        {/* For now showing status */}
                        <p className="text-xs text-bookclub-orange mt-1 capitalize">
                          Status: {book.status.replace(/([A-Z])/g, " $1")}
                        </p>

                        {/* Optional: show averageRating if available */}
                        {book.averageRating && (
                          <p className="text-xs text-bookclub-gray mt-1">
                            Rating: {book.averageRating} ⭐ (
                            {book.totalRatings || 0} ratings)
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Clubs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Book Clubs</CardTitle>
                  <CardDescription>Your active communities</CardDescription>
                </div>
                <Link href="/clubs">
                  <Button size="sm" variant="outline" as="a">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myClubs.map((club) => (
                  <div key={club._id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-bookclub-navy">
                        {club.name}
                      </h4>
                      <span className="text-sm text-bookclub-gray">
                        {club.membersCount} members
                      </span>
                    </div>
                    <p className="text-sm text-bookclub-gray mb-2">
                      {club.description}
                    </p>
                    <div className="space-y-2 text-sm text-bookclub-gray">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Admin: {club.admin.name}
                      </div>
                      <div className="flex items-center">
                        <Book className="h-4 w-4 mr-2" />
                        {club.booksCount} books
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Created At:{" "}
                        {new Date(club.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Recent Discussions */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>
                  Start a conversation in your clubs
                </CardDescription>
              </div>
              <Link href="/discussions">
                <Button size="sm" variant="outline" as="a">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myClubs.map((club) => (
                <div key={club._id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-bookclub-navy">
                      {club.name}
                    </h4>
                    <span className="text-sm text-bookclub-gray">
                      {club.membersCount} members
                    </span>
                  </div>
                  <p className="text-sm text-bookclub-gray mb-2">
                    {club.description}
                  </p>
                  <div className="space-y-2 text-sm text-bookclub-gray">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Admin: {club.admin.name}
                    </div>
                    <div className="flex items-center">
                      <Book className="h-4 w-4 mr-2" />
                      {club.booksCount} books
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Created At:{" "}
                      {new Date(club.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Start Discussion Button */}
                  <div className="mt-4 text-right">
                    <Link href={`/chatRoom/${club._id}`}>
                      <Button size="sm" variant="default">
                        <Plus className="h-4 w-4 mr-1" />
                        Start Discussion
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
