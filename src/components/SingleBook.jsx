/* TODO - add your code to create a functional React component that renders details for a single book. Fetch the book data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api';

const SingleBook = () => {
  // Get the book ID from URL parameters and necessary hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // State management for book data and UI states
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutStatus, setCheckoutStatus] = useState('');

  // Fetch book details when component mounts or ID changes
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_URL}/books/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError('Failed to load book details. Please try again later.');
        console.error('Error fetching book:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle book checkout process
  const handleCheckout = async () => {
    // Redirect to login if user is not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setCheckoutStatus('processing');
      
      // Make API call to update book availability
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ available: false })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to checkout book');
      }

      const updatedBook = await response.json();
      setBook(updatedBook);
      setCheckoutStatus('success');

      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/account');
      }, 2000);
    } catch (err) {
      setCheckoutStatus('error');
      setError(err.message || 'Failed to checkout book. Please try again.');
      console.error('Error checking out book:', err);
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading book details...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Not found state UI
  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-700">Book not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-500 hover:text-blue-700"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  // Main book details UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book cover image section */}
          <div className="md:flex-shrink-0">
            <img
              src={book.coverimage}
              alt={`Cover of ${book.title}`}
              className="h-96 w-full object-cover md:w-64"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600?text=No+Cover+Available';
              }}
            />
          </div>

          {/* Book details section */}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{book.description}</p>
            </div>

            {/* Checkout button and status section */}
            <div className="mt-6">
              {book.available ? (
                <button
                  onClick={handleCheckout}
                  disabled={!user || checkoutStatus === 'processing'}
                  className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                    ${checkoutStatus === 'processing' ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {!user 
                    ? 'Login to Check Out' 
                    : checkoutStatus === 'processing'
                      ? 'Processing...'
                      : 'Check Out Book'
                  }
                </button>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded">
                  Currently Unavailable
                </span>
              )}

              {/* Success message */}
              {checkoutStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                  Book successfully checked out! Redirecting to your account...
                </div>
              )}

              {/* Error message */}
              {checkoutStatus === 'error' && error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;