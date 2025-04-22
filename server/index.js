const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('YOUR_API_KEY');

// System prompt to make the AI more focused on farming
const systemPrompt = `You are an expert farming assistant. Your role is to provide accurate, helpful, and practical advice about farming, agriculture, and related topics. 
Focus on:
- Crop management and best practices
- Soil health and fertilization
- Pest control and disease prevention
- Weather impact on farming
- Sustainable farming methods
- Modern farming techniques
- Equipment and tools
- Market trends and crop selection

Always provide practical, actionable advice and explain your reasoning. If you're not sure about something, say so.`;

// Disease prediction system prompt
const diseasePrompt = `You are an expert in plant pathology and crop disease diagnosis. Analyze the provided image and:
1. Identify the disease or pest affecting the crop
2. Provide a confidence score (0-100%)
3. List symptoms visible in the image
4. Suggest immediate treatment options
5. Recommend preventive measures
6. Mention any potential impact on yield

If the image is unclear or doesn't show a plant disease, please indicate that.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Combine system prompt with user message
    const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
    
    // Generate response with safety settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// New endpoint for disease prediction
app.post('/api/predict-disease', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Read the image file
    const imageData = fs.readFileSync(imagePath);
    
    // Convert image to base64
    const base64Image = imageData.toString('base64');
    
    // Generate response with the image
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: diseasePrompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      }
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Clean up: delete the uploaded image
    fs.unlinkSync(imagePath);
    
    res.json({ 
      prediction: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 
