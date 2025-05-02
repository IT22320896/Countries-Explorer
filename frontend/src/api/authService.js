import axiosInstance from './axiosConfig';

// Register new user
export const registerUser = async (userData) => {
  try {
    return await axiosInstance.post('/api/auth/register', userData);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    return await axiosInstance.post('/api/auth/login', credentials);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user
export const getMe = async () => {
  try {
    return await axiosInstance.get('/api/auth/me');
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    return await axiosInstance.get('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 