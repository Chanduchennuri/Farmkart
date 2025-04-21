import React, { useState } from 'react';
import axios from 'axios';

const DiseasePredictor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert the image URL to a File object
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'crop-image.jpg', { type: 'image/jpeg' });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('image', file);

      // Make the API request
      const result = await axios.post('http://localhost:5000/api/predict-disease', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.data && result.data.prediction) {
        setPrediction(result.data.prediction);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Crop Disease Predictor</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Crop Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="max-h-48 max-w-full rounded-lg"
                  />
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !selectedImage}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading || !selectedImage
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#2874f0] hover:bg-[#1a5dc9]'
          }`}
        >
          {loading ? 'Analyzing...' : 'Predict Disease'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {prediction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePredictor; 