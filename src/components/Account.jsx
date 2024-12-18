/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookService from '../services/bookService';

const Account = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReservations = async () => {
      try {
        const data = await BookService.getUserReservations(token);
        setReservations(data);
      } catch (err) {
        setError('Failed to load your books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [user, token, navigate]);

  const handleReturnBook = async (reservationId) => {
    try {
      await BookService.returnBook(reservationId, token);
      setReservations(prev => prev.filter(book => book.id !== reservationId));
    } catch (err) {
      setError('Failed to return book. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your books...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstname}!</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Checked Out Books</h2>
        
        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map(book => (
              <div key={book.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-gray-600">by {book.author}</p>
                </div>
                <button
                  onClick={() => handleReturnBook(book.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't checked out any books yet.</p>
        )}
      </div>
    </div>
  );
};

export default Account;