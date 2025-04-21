import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Products = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const categories = ['All', 'Seeds', 'Fertilizers', 'Tools', 'Pesticides'];
  const isMobile = window.innerWidth <= 767;

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className={`${isMobile ? 'mt-[120px]' : ''} min-h-screen bg-gray-100`}>
      {/* Categories filter */}
      <div className="bg-white sticky top-[120px] z-10 shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto whitespace-nowrap py-3 px-4 gap-4 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2874f0] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="container mx-auto">
        <div className="product-grid">
          {filteredProducts.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-lg overflow-hidden"
            >
              <div className="relative pb-[100%]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="product-title">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="product-price">₹{product.price}</span>
                  <span className="product-discount">20% off</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{product.category}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="text-[#2874f0] text-sm font-medium"
                  >
                    ADD
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products; 