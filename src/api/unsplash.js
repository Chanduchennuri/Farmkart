const UNSPLASH_ACCESS_KEY = 'GJ5vPCisJByyAP1IqjSyfVjCvbj36o3QsRsPBww0Clc'; // Replace with your actual Unsplash API key

// Fallback images for each category
const fallbackImages = {
  'Vegetable Seeds': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop',
  'Fertilizers': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&h=500&fit=crop',
  'Tools': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop',
  'Pesticides': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop',
  'Accessories': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop',
  'default': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop'
};

// Category-specific search queries
const categoryQueries = {
  'Vegetable Seeds': 'vegetable seeds gardening',
  'Fertilizers': 'organic fertilizer farming',
  'Tools': 'gardening tools equipment',
  'Pesticides': 'organic farming pesticide',
  'Accessories': 'gardening accessories'
};

export const getFarmingImage = async (query) => {
  try {
    // If query is a category, use the predefined search query
    const searchQuery = categoryQueries[query] || query;
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching image:', error);
    // Try to match the first word of the query to a category
    const category = Object.keys(fallbackImages).find(cat => 
      query.toLowerCase().includes(cat.toLowerCase())
    );
    return fallbackImages[category] || fallbackImages.default;
  }
};

export const getProductImages = async (products) => {
  try {
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const query = `${product.name} ${product.category}`;
        const imageUrl = await getFarmingImage(query);
        return { ...product, image: imageUrl };
      })
    );
    
    return updatedProducts;
  } catch (error) {
    console.error('Error updating product images:', error);
    // Return products with fallback images if there's an error
    return products.map(product => ({
      ...product,
      image: fallbackImages[product.category] || fallbackImages.default
    }));
  }
}; 