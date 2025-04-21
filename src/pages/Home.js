import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ products }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-green-50 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FarmMart</h1>
        <p className="text-xl text-gray-600">Your one-stop shop for all farming needs</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['Seeds', 'Fertilizers', 'Tools', 'Pesticides'].map((category) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-green-600 mb-2">
              <svg className="h-8 w-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">{category}</h3>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative pb-48">
              <img
                className="absolute h-full w-full object-cover"
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-medium text-green-600">{product.price}</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 