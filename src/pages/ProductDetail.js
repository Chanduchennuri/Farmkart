import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const product = products.find(p => p.id === parseInt(id));
  const relatedProducts = products.filter(p => 
    p.category === product?.category && p.id !== parseInt(id)
  ).slice(0, 4);
  const isMobile = window.innerWidth <= 767;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 text-[#2874f0]"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${isMobile ? 'mt-[56px]' : ''}`}>
      <div className="product-detail">
        {/* Product Image */}
        <div className="bg-white">
          <div className="relative pb-[100%]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          {isMobile && (
            <div className="flex p-4 border-t">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 mr-2 bg-[#ff9f00] text-white py-3 px-4 rounded font-medium"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
                className="flex-1 ml-2 bg-[#fb641b] text-white py-3 px-4 rounded font-medium"
              >
                BUY NOW
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white p-4">
          <h1 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Category: {product.category}</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-medium">₹{product.price}</span>
            <span className="text-sm text-green-600">20% off</span>
          </div>

          {!isMobile && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-md"
                >
                  -
                </button>
                <span className="text-xl font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-md"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-base font-medium mb-2">Description</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            {product.features && (
              <div>
                <h2 className="text-base font-medium mb-2">Features</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white mt-2 p-4">
          <h2 className="text-lg font-medium mb-4">Similar Products</h2>
          <div className="product-grid">
            {relatedProducts.map(relatedProduct => (
              <div
                key={relatedProduct.id}
                className="bg-white border rounded-lg overflow-hidden"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="relative pb-[100%]">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="product-title">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="product-price">₹{relatedProduct.price}</span>
                    <span className="product-discount">20% off</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 