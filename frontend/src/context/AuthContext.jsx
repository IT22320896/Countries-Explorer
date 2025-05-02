import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await getMe();
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ email, password });
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 