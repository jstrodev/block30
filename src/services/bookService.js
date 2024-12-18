import AuthService from './authService';

const API_URL = 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api';

class BookService {
  // Helper method to handle API responses consistently
  static async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  }

  // Fetch all books from the library
  static async getAllBooks() {
    try {
      const response = await fetch(`${API_URL}/books`, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await this.handleResponse(response);
      return data.books; // API returns { books: [...] }
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Fetch a single book by ID
  static async getBookById(bookId) {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  // Check out a book (update availability)
  static async checkoutBook(bookId) {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify({ available: false })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error checking out book:', error);
      throw error;
    }
  }

  // Get user's reservations (checked out books)
  static async getReservations() {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        headers: AuthService.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  // Return a checked out book
  static async returnBook(reservationId) {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: AuthService.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  }

  // Search books by title or author
  static async searchBooks(searchTerm) {
    try {
      const books = await this.getAllBooks();
      
      // Filter books based on search term
      return books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }

  // Get available books
  static async getAvailableBooks() {
    try {
      const books = await this.getAllBooks();
      return books.filter(book => book.available);
    } catch (error) {
      console.error('Error fetching available books:', error);
      throw error;
    }
  }
}

export default BookService;