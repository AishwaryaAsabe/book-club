
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Book } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../ui/command';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

interface BookResult {
  id: number;
  title: string;
  author: string;
  cover: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock book data - replace with actual API call
  const mockBooks: BookResult[] = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop" },
    { id: 3, title: "1984", author: "George Orwell", cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=100&h=150&fit=crop" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=150&fit=crop" },
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=150&fit=crop" },
  ];

  const filteredBooks = mockBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    
    setMessage(value);
    setCursorPosition(position);

    // Check if user typed "@@"
    const beforeCursor = value.substring(0, position);
    const atMatch = beforeCursor.match(/@@([^@\s]*)$/);
    
    if (atMatch) {
      setShowBookSearch(true);
      setSearchQuery(atMatch[1]);
    } else {
      setShowBookSearch(false);
      setSearchQuery('');
    }
  };

  const handleBookSelect = (book: BookResult) => {
    const beforeCursor = message.substring(0, cursorPosition);
    const afterCursor = message.substring(cursorPosition);
    
    // Find the @@ pattern and replace it with the book
    const atMatch = beforeCursor.match(/@@([^@\s]*)$/);
    if (atMatch) {
      const beforeAt = beforeCursor.substring(0, beforeCursor.length - atMatch[0].length);
      const bookMention = `📚 "${book.title}" by ${book.author}`;
      const newMessage = beforeAt + bookMention + afterCursor;
      
      setMessage(newMessage);
      setShowBookSearch(false);
      setSearchQuery('');
      
      // Focus back to input
      setTimeout(() => {
        inputRef.current?.focus();
        const newCursorPos = beforeAt.length + bookMention.length;
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setShowBookSearch(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowBookSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showBookSearch && event.target instanceof Element && !event.target.closest('.book-search-dropdown')) {
        setShowBookSearch(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBookSearch]);

  return (
    <div className="chat-input-container">
      {showBookSearch && (
        <div className="book-search-dropdown">
          <Command className="book-search-command">
            <div className="book-search-header">
              <Book className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">Search Books</span>
            </div>
            <CommandList className="book-search-results">
              {filteredBooks.length > 0 ? (
                <CommandGroup>
                  {filteredBooks.map((book) => (
                    <CommandItem
                      key={book.id}
                      onSelect={() => handleBookSelect(book)}
                      className="book-search-item"
                    >
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="book-search-cover"
                      />
                      <div className="book-search-info">
                        <div className="book-search-title">{book.title}</div>
                        <div className="book-search-author">{book.author}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="book-search-empty">
                  No books found for "{searchQuery}"
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <button type="button" className="input-action-btn">
          <Paperclip className="input-icon" />
        </button>
        
        <div className="message-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Use @@ to search books)"
            className="message-input"
          />
          <button type="button" className="input-action-btn emoji-btn">
            <Smile className="input-icon" />
          </button>
        </div>
        
        <button 
          type="submit" 
          className={`send-button ${message.trim() ? 'active' : ''}`}
          disabled={!message.trim()}
        >
          <Send className="send-icon" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
