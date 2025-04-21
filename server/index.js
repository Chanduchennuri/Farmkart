const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI('AIzaSyCkQnqPqQjf5bRBrUaVnTcICuv08siWjxY');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 