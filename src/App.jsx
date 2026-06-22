import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

function StoreLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-gray-700">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
              <Route path="/products" element={<StoreLayout><Products /></StoreLayout>} />
              <Route path="/product/:id" element={<StoreLayout><ProductDetails /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
              <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
              <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
              <Route path="/signup" element={<StoreLayout><Signup /></StoreLayout>} />
              <Route path="/profile" element={<StoreLayout><Profile /></StoreLayout>} />
              <Route path="/wishlist" element={<StoreLayout><Wishlist /></StoreLayout>} />
              <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
              <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
              <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
            </Routes>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
