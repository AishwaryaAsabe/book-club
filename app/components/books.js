'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button'; 
import { Input } from '../../components/ui/input';
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
  Search,
  Star,
  Plus,
  Users,
  MessageCircle
} from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'Mystery', 'Self Help', 'Fiction', 'Science Fiction', 'Romance', 'History'];

 const fetchBooks = async () => {
  setLoading(true);
  try {
    const query = new URLSearchParams();

    if (searchTerm) query.append('search', searchTerm);
    if (selectedCategory !== 'all') query.append('genre', selectedCategory);

    const res = await fetch(`/api/book-search?${query.toString()}`);
    const data = await res.json();
    setBooks(data.books || []);
  } catch (err) {
    console.error('Failed to fetch books:', err);
  } finally {
    setLoading(false);
  }
};

const addToReadingList = async (book) => {
  try {
    const res = await fetch('/api/books/mybooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        thumbnail: book.thumbnail,
        link: book.link,
        genre: book.categories?.[0] || 'General',
        averageRating: book.averageRating || 0,
        totalRatings: book.totalRatings || 0,
      }),
      credentials: 'include', // if you use cookie-based auth
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Failed to add book');
    } else {
      alert('Added to your reading list!');
    }
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Something went wrong.');
  }
};

  
  
useEffect(() => {
  if (searchTerm || selectedCategory) {
    fetchBooks();
  }
}, [searchTerm, selectedCategory]);


  return (
    <div className="min-h-screen bg-bookclub-cream">
      <Navbar
        isAuthenticated={true}
        user={{ name: "John Doe", email: "john@example.com" }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-bookclub-navy mb-2">
                Book Library
              </h1>
              <p className="text-bookclub-gray">
                Discover and discuss amazing books with fellow readers
              </p>
            </div>
            <Button className="bookclub-gradient text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-bookclub-gray" />
              <Input
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    if (category === "all") {
                      setSearchTerm("");
                    }
                  }}
                  className={
                    selectedCategory === category
                      ? "bookclub-gradient text-white"
                      : ""
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-bookclub-gray">Loading...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-bookclub-gray mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-bookclub-navy mb-2">
              No books found
            </h3>
            <p className="text-bookclub-gray">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card
                key={book.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={book.thumbnail || "/fallback-book.png"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-bookclub-navy line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-bookclub-gray">
                      {book.author}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-bookclub-orange bg-opacity-10 text-bookclub-orange text-xs rounded">
                        {selectedCategory === "all"
                          ? book.categories?.join(", ") || "General"
                          : selectedCategory.charAt(0).toUpperCase() +
                            selectedCategory.slice(1)}
                      </span>

                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-bookclub-gray ml-1">
                          {book.averageRating} ({book.totalRatings})
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-bookclub-gray line-clamp-3">
                      {book.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-bookclub-gray">
                        <Users className="h-4 w-4 mr-1" />
                        {book.clubs?.length || 0} clubs reading
                      </div>
                      <div className="flex items-center text-sm text-bookclub-gray">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {book.discussions || 0} discussions
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <Link href={`/books/${book.id}`} className="flex-1">
                        <Button size="sm" className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bookclub-gradient text-white"
                        onClick={() => addToReadingList(book)}
                      >
                        Add to Reading List
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
