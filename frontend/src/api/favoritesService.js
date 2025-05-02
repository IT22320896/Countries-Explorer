import axiosInstance from './axiosConfig';

// Get user favorites
export const getFavorites = async () => {
  try {
    return await axiosInstance.get('/api/favorites');
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Add country to favorites
export const addFavorite = async (countryCode) => {
  try {
    return await axiosInstance.post('/api/favorites', { countryCode });
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

// Remove country from favorites
export const removeFavorite = async (countryCode) => {
  try {
    return await axiosInstance.delete(`/api/favorites/${countryCode}`);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}; 