import React from 'react';

function About() {
  return (
    <div className="flex-grow bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 bg-green-600">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative h-full flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">About FarmMart</h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                FarmMart was founded in 2020 with a simple mission: to provide high-quality farming supplies
                to farmers across India. We understand the challenges that farmers face and are committed
                to making their work easier and more productive.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                To empower farmers with the best quality seeds, fertilizers, tools, and pesticides while
                ensuring sustainable farming practices. We believe in supporting local agriculture and
                contributing to India's food security.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Quality Products</h3>
                  <p className="text-gray-600">We source only the highest quality farming supplies from trusted manufacturers.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Expert Support</h3>
                  <p className="text-gray-600">Our team of agricultural experts is always ready to help you.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">Quick and reliable delivery to your doorstep.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Fair Prices</h3>
                  <p className="text-gray-600">Competitive prices that work for both farmers and suppliers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 