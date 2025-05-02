import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
          
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`input ${formErrors.username ? 'border-red-500' : ''}`}
                placeholder="Choose a username"
              />
              {formErrors.username && (
                <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${formErrors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input ${formErrors.password ? 'border-red-500' : ''}`}
                placeholder="Create a password"
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 