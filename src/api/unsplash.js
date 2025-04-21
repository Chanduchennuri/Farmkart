const UNSPLASH_ACCESS_KEY = 'GJ5vPCisJByyAP1IqjSyfVjCvbj36o3QsRsPBww0Clc'; // Replace with your actual Unsplash API key

// Fallback images for each category
const fallbackImages = {
  Seeds: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop',
  Fertilizers: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop',
  Tools: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop',
  Pesticides: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&h=500&fit=crop'
};

export const getFarmingImage = async (query) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching image:', error);
    return fallbackImages[query.split(' ')[0]] || fallbackImages.Seeds;
  }
};

export const getProductImages = async (products) => {
  try {
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        let query = '';
        switch (product.category) {
          case 'Seeds':
            query = 'wheat seeds farming';
            break;
          case 'Fertilizers':
            query = 'organic fertilizer farming';
            break;
          case 'Tools':
            query = 'farming tools equipment';
            break;
          case 'Pesticides':
            query = 'organic farming pesticide';
            break;
          default:
            query = 'farming agriculture';
        }
        
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
      image: fallbackImages[product.category] || fallbackImages.Seeds
    }));
  }
}; 