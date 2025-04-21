import React, { useState } from 'react';

const PaymentGateway = ({ totalAmount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate card details
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        throw new Error('Please fill in all card details');
      }

      // Simulate successful payment
      onPaymentSuccess({
        transactionId: Math.random().toString(36).substr(2, 9),
        amount: totalAmount,
        method: paymentMethod,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Total Amount</h3>
        <p className="text-3xl font-bold text-green-600">₹{totalAmount}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Payment Method</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-lg border-2 ${
              paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm">Card</span>
          </button>
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`p-3 rounded-lg border-2 ${
              paymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">UPI</span>
          </button>
          <button
            onClick={() => setPaymentMethod('netbanking')}
            className={`p-3 rounded-lg border-2 ${
              paymentMethod === 'netbanking' ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}
          >
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm">Net Banking</span>
          </button>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              name="number"
              value={cardDetails.number}
              onChange={handleCardInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={cardDetails.name}
              onChange={handleCardInputChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardInputChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardInputChange}
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </form>
      )}

      {paymentMethod === 'upi' && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Scan the QR code with your UPI app</p>
          <div className="bg-white p-4 rounded-lg inline-block">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=FarmMart&am=${totalAmount}&cu=INR"
              alt="UPI QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">Or enter UPI ID: merchant@upi</p>
        </div>
      )}

      {paymentMethod === 'netbanking' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
            </select>
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway; 