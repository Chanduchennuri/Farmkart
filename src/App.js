import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Chat from './components/Chat';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import { getProductImages } from './api/unsplash';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/responsive.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Header component
function Header() {
  const location = useLocation();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <svg className="h-8 w-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h1 className="text-2xl font-bold">FarmMart</h1>
          </Link>

          {/* Search Bar */}
          {user && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for seeds, fertilizers, tools..."
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === '/' ? 'text-white' : 'hover:text-green-200'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === '/products' ? 'text-white' : 'hover:text-green-200'
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === '/about' ? 'text-white' : 'hover:text-green-200'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 text-sm font-medium ${
                  location.pathname === '/contact' ? 'text-white' : 'hover:text-green-200'
                }`}
              >
                Contact
              </Link>
            </nav>
          )}

          {/* Cart & Account */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" className="relative hover:text-green-200">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="hover:text-green-200 flex items-center">
                    <span className="mr-2 text-sm">{user.email}</span>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium hover:text-green-200"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About FarmMart</h3>
            <p className="text-gray-400 text-sm">
              Your trusted partner in farming supplies and equipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Seeds</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Fertilizers</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Tools</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white text-sm">Pesticides</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>123 Farm Street</li>
              <li>Rural Area, State 12345</li>
              <li>Phone: (123) 456-7890</li>
              <li>Email: support@farmmart.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get farming tips and updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-l-md text-gray-900 text-sm focus:outline-none"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-green-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; 2024 FarmMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // Sample product data with descriptions
  const initialProducts = [
    {
      id: 1,
      name: "Organic Wheat Seeds",
      price: "₹499",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Seeds",
      description: "Premium organic wheat seeds specially selected for optimal yield and disease resistance. Perfect for organic farming practices."
    },
    {
      id: 2,
      name: "Premium Fertilizer",
      price: "₹799",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Fertilizers",
      description: "A high-quality fertilizer designed to promote healthy plant growth and increase crop yield."
    },
    {
      id: 3,
      name: "Farm Tools Set",
      price: "₹1,499",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Tools",
      description: "A complete set of tools for all your farming needs, including a shovel, hoe, and trowel."
    },
    {
      id: 4,
      name: "Organic Pesticides",
      price: "₹699",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Pesticides",
      description: "Organic pesticides made from natural ingredients to protect crops from pests and diseases."
    },
    {
      id: 5,
      name: "Rice Seeds Premium",
      price: "₹899",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Seeds",
      description: "Premium rice seeds for high-quality rice production. Ideal for both wet and dry planting methods."
    },
    {
      id: 6,
      name: "Natural Compost",
      price: "₹599",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Fertilizers",
      description: "A rich compost made from organic materials to improve soil fertility and plant growth."
    },
    {
      id: 7,
      name: "Garden Shovel Set",
      price: "₹1,299",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Tools",
      description: "A set of durable garden shovels for various farming tasks, including soil preparation and planting."
    },
    {
      id: 8,
      name: "Bio Pesticides",
      price: "₹799",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Pesticides",
      description: "Bio pesticides made from natural ingredients to control pests and diseases in crops."
    },
    {
      id: 9,
      name: "Corn Seeds Hybrid",
      price: "₹699",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Seeds",
      description: "Hybrid corn seeds for high yield and disease resistance. Suitable for various planting methods."
    },
    {
      id: 10,
      name: "NPK Fertilizer",
      price: "₹899",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Fertilizers",
      description: "A balanced NPK fertilizer for promoting healthy plant growth and yield."
    },
    {
      id: 11,
      name: "Pruning Tools Kit",
      price: "₹1,199",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Tools",
      description: "A complete pruning tools kit for maintaining and shaping your plants."
    },
    {
      id: 12,
      name: "Neem Pesticides",
      price: "₹499",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop",
      category: "Pesticides",
      description: "Neem pesticides made from the neem tree for controlling pests and diseases in crops."
    }
  ];

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsWithImages = await getProductImages(initialProducts);
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Error fetching product images:', error);
        setError('Failed to load product images. Using default images.');
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProductImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                  <p className="font-medium">Warning</p>
                  <p>{error}</p>
                </div>
              )}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home products={products} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Products products={products} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetail products={products} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <ProtectedRoute>
                      <Contact />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            {showChat && <Chat />}
            <button
              onClick={() => setShowChat(!showChat)}
              className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
            >
              {showChat ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              )}
            </button>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
