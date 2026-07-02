import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set default authorization header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load user profile and statistics when token is present
  const loadProfile = async (currentToken) => {
    try {
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      const response = await axios.get('/api/auth/profile');
      if (response.data.success) {
        setUser(response.data.user);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to load profile context:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        const receivedToken = response.data.token;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      if (response.data.success) {
        const receivedToken = response.data.token;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setStats(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Refresh statistics dynamically (e.g. after uploading or deleting)
  const refreshStats = async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/auth/profile');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error refreshing statistics:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        token,
        loading,
        login,
        register,
        logout,
        refreshStats,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
