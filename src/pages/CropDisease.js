import React, { useState, useRef } from 'react';

const CropDisease = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setSelectedImage(imageDataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // Simulate API call to your ML model
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction result
      const mockPredictions = [
        {
          disease: 'Healthy',
          confidence: 0.95,
          description: 'Your crop appears to be healthy.',
          treatment: 'Continue with regular care and monitoring.'
        },
        {
          disease: 'Powdery Mildew',
          confidence: 0.85,
          description: 'White powdery spots on leaves and stems.',
          treatment: 'Apply sulfur-based fungicide and improve air circulation.'
        },
        {
          disease: 'Bacterial Blight',
          confidence: 0.78,
          description: 'Water-soaked lesions on leaves.',
          treatment: 'Remove affected plants and apply copper-based bactericide.'
        }
      ];

      const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
      setPrediction(randomPrediction);
    } catch (error) {
      console.error('Error predicting disease:', error);
      alert('Error predicting disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Crop Disease Prediction</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upload or Capture Image</h2>
          
          <div className="space-y-4">
            {!showCamera && !selectedImage && (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                <button
                  onClick={() => {
                    setShowCamera(true);
                    startCamera();
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Take Photo
                </button>
              </div>
            )}

            {showCamera && (
              <div className="space-y-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 object-cover rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={captureImage}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="space-y-2">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setPrediction(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Predicting...' : 'Predict Disease'}
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
          
          {prediction ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">{prediction.disease}</h3>
                <p className="text-sm text-gray-600">Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Description</h4>
                <p className="text-gray-600">{prediction.description}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Recommended Treatment</h4>
                <p className="text-gray-600">{prediction.treatment}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <p>Upload or capture an image to get started</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropDisease; 