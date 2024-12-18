/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data.books);
        setFilteredBooks(data.books);
      } catch (err) {
        setError('Failed to load books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search term
  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  if (isLoading) {
    return <div className="text-center py-8">Loading books...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Library Catalog</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or author..."
          className="w-full max-w-md px-4 py-2 rounded border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img
                src={book.coverimage}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600?text=No+Cover+Available';
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{book.title}</h2>
              <p className="text-gray-600 mb-4">by {book.author}</p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/books/${book.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
                <span className={`px-2 py-1 rounded text-sm ${
                  book.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.available ? 'Available' : 'Checked Out'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;