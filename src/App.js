import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import DiseasePredictor from './components/DiseasePredictor';
import CropDisease from './pages/CropDisease';
import FarmerDashboard from './components/FarmerDashboard';

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
function Header({ products }) {
  const location = useLocation();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortOption, setSortOption] = useState('relevance');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const categories = [
    'Vegetable Seeds',
    'Fertilizers',
    'Tools',
    'Pesticides',
    'Accessories',
    'Organic Products',
    'Hydroponics',
    'Greenhouse Supplies',
    'Irrigation',
    'Soil Amendments'
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Add to search history if not already present
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 10));
    }

    let results = products.filter(product => {
      const searchTerms = query.toLowerCase().split(' ');
      const matchesSearch = searchTerms.every(term => 
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );

      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);

      const price = parseInt(product.price.replace(/[^0-9]/g, ''));
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Apply sorting
    results = sortResults(results, sortOption);

    setSearchResults(results);
    setShowResults(true);
  };

  const sortResults = (results, option) => {
    switch (option) {
      case 'price-low':
        return [...results].sort((a, b) => 
          parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
        );
      case 'price-high':
        return [...results].sort((a, b) => 
          parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
        );
      case 'name-asc':
        return [...results].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...results].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return results;
    }
  };

  const handleResultClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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

          {/* Search Bar - Only for buyers */}
          {user && user.role === 'buyer' && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for vegetables, seeds, fertilizers..."
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-2 p-2 bg-green-700 rounded-lg hover:bg-green-800"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                </div>

                {/* Search Filters */}
                {showFilters && (
                  <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-lg p-4 text-gray-900">
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedCategories.includes(category)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Price Range</h3>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value)})}
                          className="w-24 px-2 py-1 border rounded"
                          placeholder="Min"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                          className="w-24 px-2 py-1 border rounded"
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Sort By</h3>
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {showResults && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    {/* Search History */}
                    {searchQuery === '' && searchHistory.length > 0 && (
                      <div className="p-3 border-b">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
                        {searchHistory.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(term);
                              handleSearch(term);
                            }}
                            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search Results */}
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <p className="text-sm text-green-600">{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-8">
              {user.role === 'buyer' ? (
                <>
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
                </>
              ) : (
                <Link
                  to="/farmer-dashboard"
                  className={`px-3 py-2 text-sm font-medium ${
                    location.pathname === '/farmer-dashboard' ? 'text-white' : 'hover:text-green-200'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          )}

          {/* Cart & Account */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'buyer' && (
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
                )}
                <div className="relative group">
                  <button className="hover:text-green-200 flex items-center">
                    <span className="mr-2 text-sm">{user.name}</span>
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-green-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {isMobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-green-600 p-4 space-y-2">
                {user?.role === 'buyer' ? (
                  <>
                    <Link to="/" className="block text-white hover:text-green-200">Home</Link>
                    <Link to="/products" className="block text-white hover:text-green-200">Products</Link>
                    <Link to="/about" className="block text-white hover:text-green-200">About</Link>
                    <Link to="/contact" className="block text-white hover:text-green-200">Contact</Link>
                  </>
                ) : (
                  <Link to="/farmer-dashboard" className="block text-white hover:text-green-200">Dashboard</Link>
                )}
              </div>
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
      name: "Tomato Seeds",
      price: "₹299",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Vegetable Seeds",
      description: "High-yield tomato seeds perfect for home gardens. Produces juicy, flavorful tomatoes.",
      stock: 50,
      rating: 4.5
    },
    {
      id: 2,
      name: "Carrot Seeds",
      price: "₹249",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Vegetable Seeds",
      description: "Premium carrot seeds for growing sweet, crunchy carrots. Suitable for all seasons.",
      stock: 45,
      rating: 4.3
    },
    {
      id: 3,
      name: "Spinach Seeds",
      price: "₹199",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Vegetable Seeds",
      description: "Organic spinach seeds for growing nutrient-rich greens. Fast-growing and disease-resistant.",
      stock: 60,
      rating: 4.7
    },
    {
      id: 4,
      name: "Bell Pepper Seeds",
      price: "₹349",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Vegetable Seeds",
      description: "Colorful bell pepper seeds for growing sweet and crisp peppers. Available in multiple colors.",
      stock: 40,
      rating: 4.4
    },
    {
      id: 5,
      name: "Cucumber Seeds",
      price: "₹279",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Vegetable Seeds",
      description: "High-yield cucumber seeds for growing fresh, crunchy cucumbers. Perfect for salads and pickling.",
      stock: 55,
      rating: 4.6
    },
    {
      id: 6,
      name: "Vegetable Fertilizer",
      price: "₹599",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Fertilizers",
      description: "Specialized fertilizer for vegetables, promoting healthy growth and high yields.",
      stock: 30,
      rating: 4.8
    },
    {
      id: 7,
      name: "Organic Compost",
      price: "₹449",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Fertilizers",
      description: "Rich organic compost perfect for vegetable gardens. Improves soil structure and fertility.",
      stock: 35,
      rating: 4.9
    },
    {
      id: 8,
      name: "Garden Tools Set",
      price: "₹1,299",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Tools",
      description: "Complete set of tools for vegetable gardening, including trowel, fork, and pruners.",
      stock: 25,
      rating: 4.7
    },
    {
      id: 9,
      name: "Vegetable Pesticide",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Pesticides",
      description: "Safe and effective pesticide for vegetable gardens. Controls common pests without harming plants.",
      stock: 40,
      rating: 4.5
    },
    {
      id: 10,
      name: "Grow Bags",
      price: "₹199",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Accessories",
      description: "Durable grow bags for container vegetable gardening. Perfect for limited space.",
      stock: 50,
      rating: 4.6
    },
    {
      id: 11,
      name: "Seed Starter Kit",
      price: "₹349",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Accessories",
      description: "Complete kit for starting vegetable seeds indoors. Includes trays, soil, and dome.",
      stock: 30,
      rating: 4.8
    },
    {
      id: 12,
      name: "Drip Irrigation Kit",
      price: "₹899",
      image: "https://images.unsplash.com/photo-1594282486557-6d0a1c4a1b1c?w=500&h=500&fit=crop",
      category: "Accessories",
      description: "Efficient drip irrigation system for vegetable gardens. Saves water and time.",
      stock: 20,
      rating: 4.9
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
            <Header products={products} />
            <main className="flex-grow">
              {error && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                  <p className="font-medium">Warning</p>
                  <p>{error}</p>
                </div>
              )}
              <Routes>
                <Route path="/" element={<Home products={products} />} />
                <Route path="/products" element={<Products products={products} />} />
                <Route path="/product/:id" element={<ProductDetail products={products} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
                <Route path="/disease-predictor" element={<DiseasePredictor />} />
                <Route path="/crop-disease" element={<CropDisease />} />
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
