import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PaymentGateway from '../components/PaymentGateway';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePaymentSuccess = (paymentDetails) => {
    // Create order details
    const order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: totalAmount,
      payment: paymentDetails,
      date: new Date().toISOString(),
      status: 'processing'
    };

    setOrderDetails(order);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order has been confirmed and will be shipped soon.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">Order ID: {orderDetails.id}</p>
            <p className="text-sm text-gray-600">Total Amount: ₹{orderDetails.total}</p>
            <p className="text-sm text-gray-600">Payment Method: {orderDetails.payment.method}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-lg text-gray-800">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <div>
          <PaymentGateway
            totalAmount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout; 