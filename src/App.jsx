import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Books from './components/Books';
import SingleBook from './components/SingleBook';
import Account from './components/Account';
import Login from './components/Login';
import Register from './components/Register';
import Navigations from './components/Navigations';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigations />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Books />} />
              <Route path="/books/:id" element={<SingleBook />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;