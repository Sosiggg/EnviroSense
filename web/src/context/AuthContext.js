import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  isAuthenticated,
  getCurrentUser
} from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await loginService(username, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);

      // Set appropriate error message
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Failed to login. Please try again.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerService(username, email, password);
      return result;
    } catch (error) {
      console.error('Registration error:', error);

      // Set appropriate error message
      if (error.response && error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Failed to register. Please try again.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // This would call an API endpoint in a real application
      // const updatedUser = await updateProfileService(userData);

      // For now, we'll just update the local state
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Store in localStorage to persist between sessions
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
